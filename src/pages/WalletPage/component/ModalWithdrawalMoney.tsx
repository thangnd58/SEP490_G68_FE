import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, InputAdornment, MenuItem, Select, Slide, TextField, Typography } from "@mui/material"
import { CancelImage, DepositeMoneyImage, SettingIcon, SuccessIconNew, VietNamFlag, WithdrawalMoneyImage } from "../../../assets/images"
import React, { useContext, useEffect, useState } from "react";
import { ModalContext } from "../../../contexts/ModalContext";
import usei18next from "../../../hooks/usei18next";
import MyCustomButton from "../../../components/common/MyButton";
import { Bank, RequestWithDrawal } from "../../../utils/type";
import ErrorMessage from "../../../components/common/ErrorMessage";
import * as Yup from "yup";
import { useFormik } from "formik";
import WalletService from "../../../services/WalletService";
import { Transition } from "../common/Transition";
import ModalStatus from "./ModalStatus";
import { formatMoney } from "../../../utils/helper";
import { useDispatch } from "react-redux";
import { getUserInfo } from "../../../redux/reducers/authReducer";
import { useAppSelector } from "../../../hooks/useAction";
import useThemePage from "../../../hooks/useThemePage";
import { SettingsOutlined } from "@mui/icons-material";

interface MyDialogProps {
    title: string;
    setReload: React.Dispatch<React.SetStateAction<boolean>>
}

const ModalWithdrawalMoney = (props: MyDialogProps) => {
    const { closeModal, setContentModal, setShowModal } = useContext(ModalContext);
    const { t } = usei18next();
    const [banks, setBanks] = useState<Bank[]>([]);
    const [selectedBank, setSelectedBank] = useState<Bank>();
    const dispatch = useDispatch();
    const { user } = useAppSelector((state) => state.userInfo);
    const { isMobile } = useThemePage();
    const [valueConvert, setValueConvert] = React.useState("");

    const formatCurrency = (value: string) => {
        if (value === '0') {
            return '';
        }
        const formattedValue = value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return formattedValue === '' ? '' : `${formattedValue}`;
    };

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

    const showModalStatus = () => {
        setContentModal(<ModalStatus icon={SuccessIconNew} title={t("wallet.title_create_request_withdrawal")} content={t("wallet.content_create_request_withdrawal")} handleConfirm={() => {
            dispatch(getUserInfo());
            closeModal();
        }} />)
        setShowModal(true)
    }

    const formik = useFormik({
        initialValues: {
            amount: "",
            bankCode: "",
            nameInBank: "",
            bankNumber: ""
        },
        validationSchema: Yup.object({
            amount: Yup.number().min(50000, t("wallet.minimum_money_deposit", { min: formatMoney(50000) })).max(user?.balance || 0, t("wallet.maximum_money_deposit", { max: formatMoney(user?.balance || 0) })).required(t("form.required")),
            bankCode: Yup.string().required(t("form.required")),
            nameInBank: Yup.string().required(t("form.required")),
            bankNumber: Yup.string().required(t("form.required")),
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
                    showModalStatus();
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img width={isMobile ? 20 : 30} height={isMobile ? 20 : 30} src={WithdrawalMoneyImage} />
                    <Typography variant="h5" fontSize={isMobile ? 16 : 24} mb={'8px'} ml={'2px'} fontWeight={700}>{props.title}</Typography>
                </Box>
                <img onClick={closeModal} style={{ cursor: 'pointer' }} width={isMobile ? 16 : 24} height={isMobile ? 16 : 24} src={CancelImage} />
            </DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Box border={'1px solid'}></Box>
                <Typography fontWeight={700}>
                    {t("wallet.title_amount")}
                </Typography>
                <TextField
                    placeholder={t("wallet.title_placeholder_money_want_withdrawal")}
                    type="text"
                    name="amount"
                    onChange={(e) => {
                        handleChange(e);
                        const formattedValue = formatCurrency(e.target.value);
                        setFieldValue("amount", e.target.value.replace(/\D/g, ""));
                        setValueConvert(formattedValue === '' ? "" : formattedValue);
                    }}
                    value={valueConvert}
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
                        setFieldValue("bankCode", newValue?.bin)
                    }}
                    id="combo-box-demo"
                    renderOption={(props, option) => (
                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                            <img loading="lazy" height={24} src={option.logo} alt={option.name} />
                            <Box sx={{ typography: 'body2',fontSize:"16px", fontWeight: 400 }}>{option.name}</Box>
                        </Box>
                    
                    )}
                    renderInput={(params: any) => <TextField {...params} label={t("wallet.placeholder_bank_name")} />}
                    ListboxProps={{
                        style: {
                            maxHeight: 250,
                        },
                    }}
                />
                {errors.bankCode && touched.bankCode && (
                    <ErrorMessage message={errors.bankCode} />
                )}
                <Typography fontWeight={700}>
                    {t("wallet.title_bank_number")} <span style={{ color: '#DA251D' }}>*</span>
                </Typography>
                <TextField
                    placeholder={t("wallet.placeholder_bank_number")}
                    type="text"
                    name="bankNumber"
                    value={values.bankNumber}
                    onChange={(e) => {
                        handleChange(e);
                        setFieldValue("bankNumber", e.target.value.replace(/\D/g, ""));
                    }}
                    sx={{
                        "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                            display: "none",
                        },
                        "& input[type=number]": {
                            MozAppearance: "textfield",
                        },
                    }}
                />
                {errors.bankNumber && touched.bankNumber && (
                    <ErrorMessage message={errors.bankNumber} />
                )}
                <Typography fontWeight={700}>
                    {t("wallet.title_name_owner_bank_account")} <span style={{ color: '#DA251D' }}>*</span>
                </Typography>
                <TextField
                    placeholder={t("wallet.placehoder_name_owner")}
                    type="text"
                    name="nameInBank"
                    value={values.nameInBank}
                    onChange={handleChange}
                    inputProps={{
                        style: { textTransform: 'uppercase' },
                    }}
                />
                {errors.nameInBank && touched.nameInBank && (
                    <ErrorMessage message={errors.nameInBank} />
                )}
                <ErrorMessage message={t("wallet.label_hint_cost")} />
            </DialogContent>
            <DialogActions sx={{ display: 'flex', justifyContent: 'center' }}>
                <MyCustomButton onClick={handleSubmit} content={t("wallet.title_button_send_request")} />
            </DialogActions>
        </Dialog>

    )
}

export default ModalWithdrawalMoney