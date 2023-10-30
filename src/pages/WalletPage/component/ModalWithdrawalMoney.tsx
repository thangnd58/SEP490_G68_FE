import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, InputAdornment, MenuItem, Select, Slide, TextField, Typography } from "@mui/material"
import { CancelImage, DepositeMoneyImage, VietNamFlag, WithdrawalMoneyImage } from "../../../assets/images"
import React, { useContext, useEffect, useState } from "react";
import { TransitionProps } from "@mui/material/transitions";
import { ModalContext } from "../../../contexts/ModalContext";
import usei18next from "../../../hooks/usei18next";
import MyCustomButton from "../../../components/common/MyButton";
import { Bank, RequestWithDrawal } from "../../../utils/type";
import ErrorMessage from "../../../components/common/ErrorMessage";
import * as Yup from "yup";
import { useFormik } from "formik";
import WalletService from "../../../services/WalletService";

interface MyDialogProps {
    title: string;
    setReload: React.Dispatch<React.SetStateAction<boolean>>
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
    const [banks, setBanks] = useState<Bank[]>([]);
    const [selectedBank, setSelectedBank] = useState<Bank>();

    const fetchBanks = async () => {
        try {
            const response = await fetch('https://api.vietqr.io/v2/banks');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setBanks(data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    useEffect(() => {
        fetchBanks();
    }, []);

    const formik = useFormik({
        initialValues: {
            amount: "",
            bankCode: "",
            nameInBank: "",
            bankNumber: ""
        },
        validationSchema: Yup.object({
            amount: Yup.number().required(t("form.required")),
        }),
        onSubmit: async (values) => {
            try {
                const req: RequestWithDrawal = {
                    amount: Number(values.amount),
                    bankCode: selectedBank!.bin,
                    bankNumber: values.bankNumber,
                    nameInBank: values.nameInBank
                }
                WalletService.requesWithdrawal(req).then((data) => {
                    closeModal();
                    props.setReload((prev) => !prev)
                })
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
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <img width={30} height={30} src={WithdrawalMoneyImage} />
                    <Typography variant="h5" mb={'8px'} ml={'2px'} fontWeight={700}>{props.title}</Typography>
                </Box>
                <img onClick={closeModal} style={{ cursor: 'pointer' }} width={24} height={24} src={CancelImage} />
            </DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Box border={'1px solid'}></Box>
                <Typography fontWeight={700}>
                    {t("wallet.title_amount")}
                </Typography>
                <TextField
                    placeholder={t("wallet.title_placeholder_money_want_withdrawal")}
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
                <Typography fontWeight={700}>
                    {t("wallet.title_bank_name")} <span style={{ color: '#DA251D' }}>*</span>
                </Typography>
                <Autocomplete
                    disablePortal
                    options={banks}
                    getOptionLabel={(bank) => `(${bank.shortName}) ${bank.name}`}
                    value={selectedBank}
                    onChange={(event, newValue) => {
                        setSelectedBank(newValue || undefined);
                    }}
                    id="combo-box-demo"
                    renderInput={(params: any) => <TextField {...params} label={t("wallet.placeholder_bank_name")} />}
                    ListboxProps={{
                        style: {
                            maxHeight: 250,
                        },
                    }}
                />
                <Typography fontWeight={700}>
                    {t("wallet.title_bank_number")} <span style={{ color: '#DA251D' }}>*</span>
                </Typography>
                <TextField
                    placeholder={t("wallet.placeholder_bank_number")}
                    type="number"
                    name="bankNumber"
                    value={values.bankNumber}
                    onChange={handleChange}
                    sx={{
                        "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                            display: "none",
                        },
                        "& input[type=number]": {
                            MozAppearance: "textfield",
                        },
                    }}
                />
                <Typography fontWeight={700}>
                    {t("wallet.title_name_owner_bank_account")} <span style={{ color: '#DA251D' }}>*</span>
                </Typography>
                <TextField
                    placeholder={t("wallet.placehoder_name_owner")}
                    type="text"
                    name="nameInBank"
                    value={values.nameInBank}
                    onChange={handleChange}
                />
                <ErrorMessage message={t("wallet.label_hint_cost")} />
            </DialogContent>
            <DialogActions sx={{ display: 'flex', justifyContent: 'center' }}>
                <MyCustomButton onClick={handleSubmit} content={t("wallet.title_button_send_request")} />
            </DialogActions>
        </Dialog>

    )
}

export default ModalWithdrawalMoney