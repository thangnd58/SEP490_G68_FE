import { Modal } from "@mui/material";
import { createContext, ReactNode, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const ModalContext = createContext<any>(null);

type Props = {
  children?: ReactNode;
  canCloseModal?: boolean;
};

const ModalProvider: React.FC<Props> = ({ children }) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [contentModal, setContentModal] = useState<JSX.Element>(<></>);
  let backdropRef = useRef();
  const closeModal = () => {
    setContentModal(<></>);
    setShowModal(false);
  };
  const valueContext = {
    showModal,
    setShowModal,
    contentModal,
    setContentModal,
    closeModal,
    backdropRef,
  }; 
  return (
    <ModalContext.Provider value={valueContext}>
        {children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
