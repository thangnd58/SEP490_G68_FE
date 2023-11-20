import { Box, Dialog, DialogContent, DialogTitle, Typography } from "@mui/material"
import React, { useContext, useState, useEffect } from 'react'
import { ModalContext } from "../../contexts/ModalContext";
import { Transition } from "../../pages/WalletPage/common/Transition";
import { NotificationService } from "../../services/NotificationService";
import { Notification } from "../../utils/type";
import { useAppDispatch } from "../../hooks/useAction";
import { getUserNotificationInfo } from "../../redux/reducers/notificationReducer";
import MyIcon from "../../components/common/MyIcon";
import { CloseOutlined } from "@mui/icons-material";
import usei18next from "../../hooks/usei18next";
import { LogoHeader } from "../../assets/images";
import { getPreviousTimeRelative } from "../../utils/helper";
import LoginForm from "./components/LoginForm";

export const LoginModal = (props: { isOpenLoginModal: boolean, setIsOpenLoginModal: React.Dispatch<React.SetStateAction<boolean>>, isMobile: boolean }) => {
    const { isOpenLoginModal, setIsOpenLoginModal, isMobile } = props;
    const { closeModal } = useContext(ModalContext);
    const { t } = usei18next();

    return (
        <Dialog
            open={isOpenLoginModal}
            onClose={() => setIsOpenLoginModal(false)}
            TransitionComponent={Transition}
            sx={{
                width :'100%'
            }}
            PaperProps={{ sx: { borderRadius: "16px", padding: '1rem 1.5rem' } }}
        >
            <Box height={"10%"} display={"flex"} flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"}>
                <img style={{ cursor: 'pointer', }} alt="logo" src={LogoHeader} width={"150px"} />
                <MyIcon icon={<CloseOutlined />} hasTooltip tooltipText={t("postMotorbike.registedForm.badge-close")} onClick={() => setIsOpenLoginModal(false)} position='bottom' />
            </Box>
            <DialogTitle
            >
                <LoginForm isModal={true} isMobileModal={isMobile} setIsOpenLoginModal={setIsOpenLoginModal} />
            </DialogTitle>
        </Dialog>
    )
}