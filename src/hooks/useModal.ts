import { ReactNode, useContext } from "react";
import { ModalContext } from "../contexts/ModalContext";

export const useShowModal = () => {
    const { setShowModal, setContentModal } = useContext(ModalContext);
    const showModal = (children?: ReactNode) => {
        setContentModal(children);
        setShowModal(true);
    };
    return {
        showModal
    };
};
