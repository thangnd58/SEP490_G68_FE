import React, { useContext, useEffect, useState } from "react";
import usei18next from "../../../../hooks/usei18next";
import { ReportCategory, ReportRequest } from "../../../../utils/type";
import { ModalContext } from "../../../../contexts/ModalContext";
import { ReportService } from "../../../../services/ReportService";
import { useFormik } from "formik";
import * as Yup from "yup";
import ToastComponent from "../../../../components/toast/ToastComponent";
import { Autocomplete, Box, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import { Transition } from "../../../WalletPage/common/Transition";
import { CloseOutlined } from "@mui/icons-material";
import MyIcon from "../../../../components/common/MyIcon";
import { LogoHeader } from "../../../../assets/images";
import ErrorMessage from "../../../../components/common/ErrorMessage";
import MyCustomButton from "../../../../components/common/MyButton";
import { PostMotorbikeService } from "../../../../services/PostMotorbikeService";


export const UpdateStatusFormModal = (props: {
    motorbikeId: number, motorbikeStatus: string, setStatusChange: React.Dispatch<React.SetStateAction<string>>
}) => {
    const { t } = usei18next();
    const { closeModal } = useContext(ModalContext);
    const [defaultStatus, setDefaultStatus] = useState<string>(props.motorbikeStatus)

    const StatusDeactiveCategories = [
        {
            categoryId: "OnHiatus",
            categoryName: "Xe tạm ngưng hoạt động"
        },
    ]
    const StatusActiveCategories = [
        {
            categoryId: "Approved",
            categoryName: "Xe hoạt động bình thường"
        },
    ]
    const [selectedCategory, setSelectedCategory] = useState<any>();

    const formik = useFormik({
        initialValues: {
            detail: "",
            categoryId: ""
        },
        onSubmit: async (values) => {
            try {
                const res = {
                    id: props.motorbikeId.toString(),
                    status: values.categoryId,
                    statusComment: values.detail
                }
                await PostMotorbikeService.updateStatusMotorbike(res.id, res.status, res.statusComment)
                setDefaultStatus(values.categoryId)
                ToastComponent(t("postMotorbike.listform.updateStatusSuccess"), "success")
                closeModal()
                props.setStatusChange(values.categoryId)
            } catch (error) {
                console.log(error)
                ToastComponent(t("postMotorbike.listform.updateStatusError"), "error")
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
        <>
            <Dialog
                open={true}
                onClose={closeModal}
                TransitionComponent={Transition}
                fullWidth
                PaperProps={{ sx: { borderRadius: "16px", padding: '1rem 1.5rem' } }}
            >
                <Box height={"10%"} display={"flex"} flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"}>
                    <img style={{ cursor: 'pointer', }} alt="logo" src={LogoHeader} width={"150px"} />
                    <MyIcon icon={<CloseOutlined />} hasTooltip tooltipText={t("postMotorbike.registedForm.badge-close")} onClick={closeModal} position='bottom' />
                </Box>
                <DialogTitle
                    sx={{
                        padding: '16px',
                    }}
                >
                    <Box width={"100%"} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <Typography fontWeight={'700'} fontSize={'24px'}>{"Cập nhật trạng thái xe"}</Typography>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{
                    margin: '0px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    mb: '16px'
                }}
                >
                    <Autocomplete
                        sx={{
                            width: '100%',
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    border: '1px solid #E0E0E0',
                                    borderRadius: '8px',
                                },
                                '&:hover fieldset': {
                                    border: '1px solid #8B4513',
                                },
                                '&.Mui-focused fieldset': {
                                    border: '2px solid #8B4513',
                                },
                            },
                        }}
                        disablePortal
                        options={defaultStatus === "Approved" ? StatusDeactiveCategories : StatusActiveCategories}
                        getOptionLabel={(rp) => `${rp.categoryName}`}
                        value={selectedCategory}
                        onChange={(event, newValue) => {
                            setSelectedCategory(newValue || undefined);
                            setFieldValue("categoryId", newValue?.categoryId)
                        }}
                        renderInput={(params: any) => <TextField  {...params} label={"Trạng thái xe"} sx={{ mt: '8px' }} />}
                        ListboxProps={{
                            style: {
                                maxHeight: 250,
                            },
                        }}
                    />
                    <TextField sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                border: '1px solid #E0E0E0',
                                borderRadius: '8px',
                            },
                            '&:hover fieldset': {
                                border: '1px solid #8B4513',
                            },
                            '&.Mui-focused fieldset': {
                                border: '2px solid #8B4513',
                            },
                        },
                    }} onChange={handleChange} multiline={true} minRows={5} name="detail" value={values.detail} placeholder={t("report.detailReport")} />
                </DialogContent>
                <DialogActions sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                    <MyCustomButton width="40%" variant="outlined" content={t("licenseInfo.BtnCancel")} onClick={() => closeModal()} />
                    <MyCustomButton width="40%" content={t("VerifyPhone.BtnConfirm")} onClick={() => handleSubmit()} />
                </DialogActions>
            </Dialog>

        </>
    )
}
