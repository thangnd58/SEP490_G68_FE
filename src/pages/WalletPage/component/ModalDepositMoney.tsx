import { Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, InputAdornment, Slide, TextField, Typography, styled } from "@mui/material"
import { CancelImage, DepositeMoneyImage, VietNamFlag } from "../../../assets/images"
import React, { useContext } from "react";

import { ModalContext } from "../../../contexts/ModalContext";
import usei18next from "../../../hooks/usei18next";
import MyCustomButton from "../../../components/common/MyButton";
import * as Yup from "yup";
import { useFormik } from "formik";
import ErrorMessage from "../../../components/common/ErrorMessage";
import WalletService from "../../../services/WalletService";
import { Transition } from "../common/Transition";
import { formatMoney } from "../../../utils/helper";
import useThemePage from "../../../hooks/useThemePage";

interface MyDialogProps {
    title: string;
}

const ModalDepositMoney = (props: MyDialogProps) => {
    const { closeModal } = useContext(ModalContext);
    const { t } = usei18next();
    const { isMobile } = useThemePage();

    const formik = useFormik({
        initialValues: {
            amount: "",
        },
        validationSchema: Yup.object({
            amount: Yup.number().min(10000, t("wallet.minimum_money_deposit", { min: formatMoney(10000) })).required(t("form.required")),
        }),
        onSubmit: async (values) => {
            try {
                const res: any = await WalletService.depositeMoney(values.amount);
                if (res) {
                    window.location.replace(res.data);
                }
            } catch (error) {

            }
        }
    });

    const {
        values,
        errors,
        touched,
        handleChange,
        handleSubmit,
        setFieldValue
    } = formik;
    return (
        <Dialog
            open={true}
            onClose={closeModal}
            TransitionComponent={Transition}
            fullWidth
            PaperProps={{ sx: { borderRadius: "16px", padding: '1rem 1.5rem' } }}
        >
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap:'8px' }}>
                    <img width={isMobile ? 26 : 36} height={isMobile ? 26 : 36} src={DepositeMoneyImage} />
                    <Typography variant="h5" fontSize={isMobile ? 16 : 24} mt={'0.7rem'} fontWeight={700}>{props.title}</Typography>
                </Box>
                <img onClick={closeModal} style={{ marginTop: '1rem', cursor: 'pointer' }} width={isMobile ? 16 : 24} height={isMobile ? 16 : 24} src={CancelImage} />
            </DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Box border={'1px solid'}></Box>
                <Typography fontWeight={700}>
                    {t("wallet.title_amount")}
                </Typography>
                <TextField
                    placeholder={t("wallet.placeholder_amount_want")}
                    type="number"
                    name="amount"
                    onChange={handleChange}
                    value={values.amount}
                    sx={{
                        "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                            display: "none",
                        },
                        "& input[type=number]": {
                            MozAppearance: "textfield",
                        },
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position='end'>
                                <Typography>VNĐ</Typography>
                            </InputAdornment>
                        ),
                    }}
                />
                {errors.amount && touched.amount && (
                    <ErrorMessage message={errors.amount} />
                )}
            </DialogContent>
            <DialogActions sx={{ display: 'flex', justifyContent: 'center' }}>
                <MyCustomButton onClick={handleSubmit} content={t("wallet.title_button_send_request")} />
            </DialogActions>
        </Dialog>
    )
}

export default ModalDepositMoney