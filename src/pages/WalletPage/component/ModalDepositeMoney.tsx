import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide, TextField, Typography } from "@mui/material"
import MyCustomTextField from "../../../components/common/MyTextField"
import { DepositeMoneyImage, VietNamFlag } from "../../../assets/images"
import React, { useContext } from "react";
import { TransitionProps } from "@mui/material/transitions";
import { ModalContext } from "../../../contexts/ModalContext";
import usei18next from "../../../hooks/usei18next";

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

const ModalDepositeMoney = (props: MyDialogProps) => {
    const { closeModal } = useContext(ModalContext);
    const { t } = usei18next();
    return (
        <Dialog open={true} onClose={closeModal} fullWidth>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
                <img width={36} height={36} src={DepositeMoneyImage} />
                <Typography variant="h5" mt={'10px'} fontWeight={700}>{t("wallet.title_dialog_deposite")}</Typography>
            </DialogTitle>

            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Box border={'1px solid'}></Box>
                <Typography fontWeight={700}>
                    Số tiền
                </Typography>
                <MyCustomTextField
                    placeholder="Nhập số tiền muốn nạp"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={closeModal}>Cancel</Button>
            </DialogActions>
        </Dialog>

    )
}

export default ModalDepositeMoney