import { useEffect, useState } from "react";
import { Brand } from "../../../utils/type";
import { useNavigate, useParams } from "react-router-dom";
import { PostMotorbikeService } from "../../../services/PostMotorbikeService";
import useThemePage from "../../../hooks/useThemePage";
import usei18next from "../../../hooks/usei18next";
import { Box, TextField, Typography } from "@mui/material";
import MyIcon from "../../../components/common/MyIcon";
import { ArrowBack  } from "@mui/icons-material";
import theme from "../../../utils/theme";
import ErrorMessage from "../../../components/common/ErrorMessage";
import MyCustomButton from "../../../components/common/MyButton";
import { useFormik } from "formik";
import * as Yup from 'yup';
import ToastComponent from "../../../components/toast/ToastComponent";

const BrandManagementForm = () => {
    const [brand, setbrand] = useState<Brand>();
    const { id } = useParams();
    const { isMobile } = useThemePage();
    const { t } = usei18next()
    const navigate = useNavigate()
    const [isSave, setIsSave] = useState<boolean>(false);

    useEffect(() => {
        getBrandById(Number(id));
    }, [id])  
    
    const formik = useFormik({
        initialValues: {
            brandName: "",
            
        },
        validationSchema: Yup.object({
            brandName: Yup.string().required(t('form.required')),
            
        }),
        onSubmit: async (values) => {
            try {
                setIsSave(true)
                if (brand && brand.id) {
                    const responseUrl = await PostMotorbikeService.updateBrand(brand.id, values.brandName , "null");
                    if (responseUrl.status === 200) {
                        ToastComponent(t('toast.BrandManager.Edit.success'), 'success');
                    }else{
                        ToastComponent(t('toast.BrandManager.Edit.warning'), 'warning');
                        return;
                    }
                } else {
                    const responseUrl = await PostMotorbikeService.postBrand(values.brandName , "null");
                    if (responseUrl.status === 200) {
                        ToastComponent(t('toast.BrandManager.Add.success'), 'success');
                        
                    }else{
                        ToastComponent(t('toast.BrandManager.Add.warning'), 'warning');
                        return;
                    }
                }
                setTimeout(() => {
                    navigate(-1)
                }, 2000);
            } catch (error) {
                ToastComponent(t('toast.BrandManager.Edit.warning'), 'warning');
            }
        }
    });

    const getBrandById= async (id: number) => {
        try {
            const response = await PostMotorbikeService.getBrandId(id.toString());
            if (response) {
                setbrand(response)
                setFieldValue("brandName", response.brandName)
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
        <Box width={'100%'} display={'flex'} flexDirection={'column'} gap={"16px"}>
            <Box sx={{ backgroundColor: "#8B4513" }} width={'100%'} display={'flex'} flexDirection={'row'} alignItems={'center'} gap={1} >
                <MyIcon icon={<ArrowBack style={{ color: theme.palette.common.white }} />} hasTooltip tooltipText={t("postMotorbike.registedForm.badge-back")} onClick={() => navigate(-1)} position='bottom' />
                <Typography color={theme.palette.common.white} variant="h1" fontSize={24} fontWeight={700}>
                    {t("dashBoardManager.Navigation.brand")}
                </Typography>
            </Box>
            
            <Box sx={{
                border: "1px solid #E0E0E0",
                backgroundColor: "#fff",
                borderRadius: "8px",
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignContent: 'center',
                padding: isMobile ? '2rem' : '3rem',
                gap: '3rem',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', width: isMobile ? '90%' : '60%', justifyContent: 'center' }}>
                    <Typography  variant="h1" fontSize={24} fontWeight={700} marginTop={'-20px'} marginBottom={'15px'}>
                    {brand ? t("dashBoardManager.brand.TitleChange") : t("dashBoardManager.brand.TitleAdd")}
                    </Typography>
                    <TextField
                        name='brandName'
                        label={t('dashBoardManager.brand.Title')}
                        placeholder={t('dashBoardManager.brand.Title')}
                        variant='outlined'
                        margin='normal'
                        value={values.brandName}
                        onChange={handleChange}
                    />
                    {errors.brandName && touched.brandName && (
                        <ErrorMessage message={errors.brandName} />
                    )}

                    
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: "16px", mt: "16px" }}>
                        <MyCustomButton
                            type="submit"
                            borderRadius={8}
                            fontSize={16}
                            fontWeight={400}
                            disabled={isSave}
                            content={t("dashBoardManager.news.buttonSave")}
                            onClick={handleSubmit} 
                            />
                    </Box>
                </Box>
            </Box>
        </Box>

    );
}
export default BrandManagementForm;