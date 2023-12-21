import { Modal } from "@mui/material";
import { createContext, ReactNode, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const ModalContext = createContext<any>(null);

type Props = {
  children?: ReactNode;
  canCloseModal?: boolean;
};

const ModalProvider: React.FC<Props> = ({ children, canCloseModal }) => {
  const [contentModal, setContentModal] = useState<JSX.Element[]>([]);
  let backdropRef = useRef();
  const closeModal = () => {
    setContentModal((prevModals) => prevModals.slice(0, prevModals.length - 1));
  };
  const clearModals = () => {
    setContentModal([]);
  };
  const openModal = (content: JSX.Element) => {
    setContentModal((prevModals) => [...prevModals, content]);
  };
  const valueContext = {
    contentModal,
    closeModal,
    backdropRef,
    clearModals,
    openModal,
  };
  return (
    <ModalContext.Provider value={valueContext}>
      {/* {contentModal.map((modal, index) => (
        <Modal key={index} open onClose={closeModal}>
          {modal}
        </Modal>
      ))} */}
      {children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
