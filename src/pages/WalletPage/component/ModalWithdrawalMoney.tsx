import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide, TextField, Typography } from "@mui/material"
import MyCustomTextField from "../../../components/common/MyTextField"
import { DepositeMoneyImage, VietNamFlag } from "../../../assets/images"
import React, { useContext } from "react";
import { TransitionProps } from "@mui/material/transitions";
import { ModalContext } from "../../../contexts/ModalContext";
import usei18next from "../../../hooks/usei18next";
import MyCustomButton from "../../../components/common/MyButton";

interface MyDialogProps {
    title: string;
    content: string;
    onClickAgree: () => void;
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ModalWithdrawalMoney = (props: MyDialogProps) => {
    const { closeModal } = useContext(ModalContext);
    const { t } = usei18next();
    return (
        <Dialog
            open={true}
            onClose={closeModal}
            TransitionComponent={Transition}
            fullWidth
            PaperProps={{ sx: { borderRadius: "16px", padding: '1rem 1.5rem' } }}
        >
            <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
                <img width={36} height={36} src={DepositeMoneyImage} />
                <Typography variant="h5" mt={'1rem'} fontWeight={700}>{t("wallet.title_dialog_deposite")}</Typography>
            </DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Box border={'1px solid'}></Box>
                <Typography fontWeight={700}>
                    {t("wallet.title_amount")}
                </Typography>
                <MyCustomTextField
                    placeholder={t("wallet.placeholder_amount_want")}
                    type="number"
                />
            </DialogContent>
            <DialogActions sx={{ display: 'flex', justifyContent: 'center' }}>
                <MyCustomButton onClick={() => { }} content={t("wallet.title_button_send_request")} />
            </DialogActions>
        </Dialog>

    )
}

export default ModalWithdrawalMoney