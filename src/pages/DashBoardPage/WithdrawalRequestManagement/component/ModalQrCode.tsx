import { Box, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import usei18next from "../../../../hooks/usei18next";
import { ModalContext } from "../../../../contexts/ModalContext";
import { Transition } from "../../../WalletPage/common/Transition";
import { ResponseWithDrawal } from "../../../../utils/type";
import axios from "axios";
import MyCustomButton from "../../../../components/common/MyButton";
import WalletService from "../../../../services/WalletService";
import useThemePage from "../../../../hooks/useThemePage";

interface MyDialogProps {
    withdrawal: ResponseWithDrawal;
    setReload: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalQrCode = (props: MyDialogProps) => {
    const { closeModal } = useContext(ModalContext);
    const [qrUrl, setQrUrl] = useState<string>("");
    const { t } = usei18next()
    const { isMobile } = useThemePage();
    const [loadingQrCode, setLoadingQrCode] = useState(false);
    const getQrCode = async () => {
        try {
            const req = {
                accountNo: props.withdrawal.bankNumber,
                accountName: props.withdrawal.nameInBank,
                acqId: props.withdrawal.bankCode,
                amount: props.withdrawal.withdraw,
                template: 'compact2',
            };
            const response: any = await axios.post(
                'https://api.vietqr.io/v2/generate',
                req
            );
            if (response.data.code === "00") {
                setQrUrl(response.data.data.qrDataURL);
                setLoadingQrCode(true);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const changeStatusTransfer = async () => {
        try {
            await WalletService.changeStatusRequestWithdrawal(props.withdrawal.id);
            props.setReload((prev) => !prev)
            closeModal();

        } catch (error) {

        }
    }

    useEffect(() => {
        getQrCode();
    }, [props.withdrawal]);

    return (
        <Dialog
            open={true}
            fullWidth
            onClose={closeModal}
            TransitionComponent={Transition}
            PaperProps={{
                sx: {
                    borderRadius: "16px",
                    padding: '1rem',
                    alignItems: 'center',
                },
            }}
        >
            <Box minHeight={"100px"} textAlign={'center'}>
                {loadingQrCode == false ? (
                    <CircularProgress /> // Hiển thị CircularProgress khi đang tải.
                ) : (
                    <img src={qrUrl} alt="" width={'70%'} style={{ objectFit: 'cover' }} />
                )}
            </Box>
            <MyCustomButton
                fontWeight={600}
                width="70%"
                fontSize={isMobile ? 12 : 16}
                onClick={() => changeStatusTransfer()}
                content={t("dashBoardManager.withdrawalRequest.buttonConfirmProcess")}
            />
        </Dialog>
    );
};

export default ModalQrCode;
