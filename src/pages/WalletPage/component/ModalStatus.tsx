import { Box, Button, Paper, Typography, styled, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import React, { useContext } from "react";
import MyCustomButton from "../../../components/common/MyButton";
import usei18next from "../../../hooks/usei18next";
import useThemePage from "../../../hooks/useThemePage";
import { Transition } from "../common/Transition";
import { ModalContext } from "../../../contexts/ModalContext";

interface MyDialogProps {
    title: string;
    content: string;
    icon: string;
    handleConfirm: () => void;
}

const ModalStatus = (props: MyDialogProps) => {
    const { t } = usei18next();
    const { closeModal } = useContext(ModalContext);
    const {isMobile} = useThemePage();
    return (
        <Dialog
            open={true}
            onClose={closeModal}
            TransitionComponent={Transition}
            fullWidth
            PaperProps={{ sx: { borderRadius: "16px", padding: '1rem', width: isMobile ? '100%' : '50%' } }}
        >
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant={isMobile ? "h6" : "h5"} fontWeight={700}>{props.title}</Typography>
            </DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem', alignItems: 'center' }}>
                <Box sx={{ textAlign: 'center', mt: '1.5rem' }}>
                    <img alt="success-icon" src={props.icon} style={{ marginBottom: '2rem' }} />
                </Box>
                <Typography sx={{ marginBottom: '2rem', textAlign: 'center', color: 'text.secondary' }}>
                    {props.content}
                </Typography>
            </DialogContent>
            <DialogActions sx={{ display: 'flex', justifyContent: 'center' }}>
                <MyCustomButton width="100%" onClick={() => {
                    props.handleConfirm();
                    closeModal();
                }} content={t("wallet.button_confirm")} />
            </DialogActions>
        </Dialog>
    )
}

export default ModalStatus