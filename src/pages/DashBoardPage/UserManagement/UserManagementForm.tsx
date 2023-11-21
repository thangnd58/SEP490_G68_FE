import { useEffect, useState } from "react";
import { Brand, Model } from "../../../utils/type";
import { useNavigate, useParams } from "react-router-dom";
import { PostMotorbikeService } from "../../../services/PostMotorbikeService";
import useThemePage from "../../../hooks/useThemePage";
import usei18next from "../../../hooks/usei18next";
import MyIcon from "../../../components/common/MyIcon";
import { ArrowBack } from "@mui/icons-material";
import theme from "../../../utils/theme";
import ErrorMessage from "../../../components/common/ErrorMessage";
import MyCustomButton from "../../../components/common/MyButton";
import { useFormik } from "formik";
import * as Yup from 'yup';
import ToastComponent from "../../../components/toast/ToastComponent";
import ModelManagementService from "../../../services/ModelManagementService";
import { Box, TextField, Typography, Select, MenuItem } from "@mui/material";

const UserManagementForm = () => {
    const [model, setModel] = useState<Model>();
    const { id } = useParams();
    const { isMobile } = useThemePage();
    const { t } = usei18next()
    const navigate = useNavigate()
    const [isSave, setIsSave] = useState<boolean>(false);
    const [listBrand, setListBrand] = useState<Brand[]>([]);

    useEffect(() => {
        getModelById(Number(id));
        getAllBrand();
    }, [id])

    const getAllBrand = async () => {
        try {
            const response = await PostMotorbikeService.getAllBrand();
            if (response) {
                setListBrand(response);
            }
        } catch (error) {

        }
    }
    const formik = useFormik({
        initialValues: {
            modelName: "",
            brandId: ""

        },
        validationSchema: Yup.object({
            modelName: Yup.string().required(t('form.required')),
            brandId: Yup.string().required(t('form.required')),

        }),
        onSubmit: async (values) => {
            try {
                setIsSave(true)
                if (model && model.id) {
                    const responseUrl = await ModelManagementService.editModel(model.id, values.modelName, "null", Number(values.brandId));
                    if (responseUrl.status === 200) {
                        ToastComponent(t('toast.ModelManager.Edit.success'), 'success');
                    } else {
                        ToastComponent(t('toast.ModelManager.Edit.warning'), 'warning');
                        return;
                    }
                } else {
                    const responseUrl = await ModelManagementService.addModel(values.modelName, "null", Number(values.brandId));
                    if (responseUrl.status === 200) {
                        ToastComponent(t('toast.ModelManager.Add.success'), 'success');

                    } else {
                        ToastComponent(t('toast.ModelManager.Add.warning'), 'warning');
                        return;
                    }
                }
                setTimeout(() => {
                    navigate(-1)
                }, 2000);
            } catch (error) {
                ToastComponent(t('toast.ModelManager.Edit.warning'), 'warning');
            }
        }
    });

    const getModelById = async (id: number) => {
        try {
            const response = await ModelManagementService.getModelById(id);
            if (response) {
                setModel(response)
                setFieldValue("modelName", response.modelName)
                setFieldValue("brandId", response.brandId)
            }
        } catch (error) {

        }
    }
    const {
        values,
        handleChange,
        handleSubmit,
        setFieldValue,
        errors,
        touched
    } = formik;

    return (
        // <Box width={'100%'} display={'flex'} flexDirection={'column'} gap={"16px"}>
        //     <Box sx={{ backgroundColor: "#8B4513" }} width={'100%'} display={'flex'} flexDirection={'row'} alignItems={'center'} gap={1} >
        //         <MyIcon icon={<ArrowBack style={{ color: theme.palette.common.white }} />} hasTooltip tooltipText={t("postMotorbike.registedForm.badge-back")} onClick={() => navigate(-1)} position='bottom' />
        //         <Typography color={theme.palette.common.white} variant="h1" fontSize={24} fontWeight={700}>
        //             {t("dashBoardManager.Navigation.model")}
        //         </Typography>
        //     </Box>

        //     <Box sx={{
        //         border: "1px solid #E0E0E0",
        //         backgroundColor: "#fff",
        //         borderRadius: "8px",
        //         display: 'flex',
        //         flexDirection: isMobile ? 'column' : 'row',
        //         alignContent: 'center',
        //         padding: isMobile ? '2rem' : '3rem',
        //         gap: '3rem',
        //         justifyContent: 'space-between',
        //         alignItems: 'center'
        //     }}>

        //         <Box sx={{ display: 'flex', flexDirection: 'column', width: isMobile ? '90%' : '60%', justifyContent: 'center' }}>
        //             <Typography variant="h1" fontSize={24} fontWeight={700} marginTop={'-20px'} marginBottom={'15px'}>
        //                 {model ? t("dashBoardManager.model.TitleChange") : t("dashBoardManager.model.TitleAdd")}
        //             </Typography>
        //             <Select
        //                 sx={{
        //                     borderRadius: '8px',
        //                 }}
        //                 fullWidth
        //                 displayEmpty
        //                 name="brandId"
        //                 value={values.brandId}
        //                 onChange={handleChange}
        //             >
        //                 <MenuItem key={0} value="">
        //                     <em>{t("postMotorbike.registedForm.brandPlaceHolder")}</em>
        //                 </MenuItem>
        //                 {listBrand.map((brand) => (
        //                     <MenuItem key={brand.id} value={brand.id}>
        //                         {brand.brandName}
        //                     </MenuItem>
        //                 ))}
        //             </Select>
        //             {errors.brandId && touched.brandId && (
        //                 <ErrorMessage message={errors.brandId} />
        //             )}
        //             <TextField
        //                 sx={{
        //                     '& .MuiOutlinedInput-root': {
        //                         '& fieldset': {
        //                             border: '1px solid #E0E0E0',
        //                             borderRadius: '8px',
        //                         },
        //                         '&:hover fieldset': {
        //                             border: '1px solid #8B4513',
        //                         },
        //                         '&.Mui-focused fieldset': {
        //                             border: '1px solid #8B4513',
        //                         },
        //                     },
        //                 }}
        //                 name='modelName'
        //                 label={t('dashBoardManager.model.Title')}
        //                 placeholder={t('dashBoardManager.model.Title')}
        //                 variant='outlined'
        //                 margin='normal'
        //                 value={values.modelName}
        //                 onChange={handleChange}
        //             />
        //             {errors.modelName && touched.modelName && (
        //                 <ErrorMessage message={errors.modelName} />
        //             )}

        //             <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: "16px", mt: "16px" }}>
        //                 <MyCustomButton
        //                     type="submit"
        //                     borderRadius={8}
        //                     fontSize={16}
        //                     fontWeight={400}
        //                     disabled={isSave}
        //                     content={t("dashBoardManager.news.buttonSave")}
        //                     onClick={handleSubmit}
        //               z  />
        //             </Box>
        //         </Box>
        //     </Box>
        // </Box>
    null );
}
export default UserManagementForm;