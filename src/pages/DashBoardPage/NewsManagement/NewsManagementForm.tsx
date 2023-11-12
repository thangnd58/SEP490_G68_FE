
import { Box, Button, Typography, TextareaAutosize, TextField } from "@mui/material";
import usei18next from "../../../hooks/usei18next";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import MotorbikeManagementService from "../../../services/MotorbikeManagementService";
import { ImageUpload, News, NewsRequest } from "../../../utils/type";
import MyCustomButton from "../../../components/common/MyButton";
import ToastComponent from "../../../components/toast/ToastComponent";
import { useFormik } from "formik";
import MyIcon from "../../../components/common/MyIcon";
import { ArrowBack } from "@mui/icons-material";
import theme from "../../../utils/theme";
import useThemePage from "../../../hooks/useThemePage";
import NewsManagementService from "../../../services/NewsManagementService";
import UploadImageService from "../../../services/UploadImageService";
import Editor from "../../../components/common/Editor";
import * as Yup from 'yup';
import ErrorMessage from "../../../components/common/ErrorMessage";

const NewsManagementForm = () => {
    const { t } = usei18next()
    const { id } = useParams();
    const [statusChange, setStatusChange] = useState<string>();
    const navigate = useNavigate()
    const [news, setNews] = useState<News>();
    const { isMobile } = useThemePage();
    const inputRef = useRef<HTMLInputElement>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");
    const [fileImage, setFileImage] = useState<File>()
    const [isSave, setIsSave] = useState<boolean>(false);
    useEffect(() => {
        getMotobikeById(Number(id))
    }, [id])

    const formik = useFormik({
        initialValues: {
            title: "",
            detail: "",
            category: "",
            image: ""
        },
        validationSchema: Yup.object({
            title: Yup.string().required(t('form.required')),
            detail: Yup.string().required(t('form.required')),
            category: Yup.string().required(t('form.required')),
            image: Yup.string().required(t('form.required')),
        }),
        onSubmit: async (values) => {
            try {
                setIsSave(true)
                const newsRequest: NewsRequest = {
                    title: values.title,
                    detail: values.detail,
                    category: values.category,
                    image: values.image
                }
                if (news && news.newsId) {
                    if(fileImage) {
                        const params: ImageUpload = {
                            tableName: 'news',
                            columnName: 'image',
                            code: news.newsId.toString(),
                            fileName: fileImage.name,
                        };
        
                        const responseUrl = await UploadImageService.generateUrlUpload(params);
                        if (responseUrl.status !== 200) {
                            ToastComponent(t('toast.uploadImage.error'), 'error');
                            return;
                        }
        
                        const urlUpload = responseUrl.data.uploadUrl;
                        const responseUpload = await UploadImageService.uploadImage(urlUpload, fileImage);
        
                        if (responseUpload.status !== 200) {
                            ToastComponent(t('toast.uploadImage.error'), 'error');
                            return;
                        }
                    }
                    await NewsManagementService.editNews(news.newsId.toString(), newsRequest)
                    ToastComponent(t('dashBoardManager.news.statusEditNewsSuccess'), 'success');
                } else {
                    const newRes = await NewsManagementService.addNews(newsRequest)
                    if(fileImage) {
                        const params: ImageUpload = {
                            tableName: 'news',
                            columnName: 'image',
                            code: newRes.data,
                            fileName: fileImage.name,
                        };
        
                        const responseUrl = await UploadImageService.generateUrlUpload(params);
                        if (responseUrl.status !== 200) {
                            ToastComponent(t('toast.uploadImage.error'), 'error');
                            return;
                        }
        
                        const urlUpload = responseUrl.data.uploadUrl;
                        const responseUpload = await UploadImageService.uploadImage(urlUpload, fileImage);
        
                        if (responseUpload.status !== 200) {
                            ToastComponent(t('toast.uploadImage.error'), 'error');
                            return;
                        }
                    }
                    ToastComponent(t('dashBoardManager.news.statusAddNewsSuccess'), 'success');
                }
                setTimeout(() => {
                    navigate(-1)
                }, 2000);
            } catch (error) {
                ToastComponent(t('dashBoardManager.news.statusEditNewsError'), 'error');
            }
        }
    });

    const {
        values,
        handleChange,
        handleSubmit,
        setFieldValue,
        errors,
        touched
    } = formik;

    const handleUploadImageBanner = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = event.target.files && event.target.files[0];
            if (inputRef.current) {
                if (!file) {
                    inputRef.current.value = '';
                    return;
                }
                setFileImage(file)
                const newPreview = URL.createObjectURL(file);
                setFieldValue('image', file.name);
                setImagePreviewUrl(newPreview);
            }
        } catch (error) {
        } finally {
            if (inputRef.current) {
                inputRef.current.value = '';
            }
        }
    };

    const onClickRef = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    const getMotobikeById = async (id: number) => {
        try {
            const response = await NewsManagementService.getNewsById(id.toString());
            if (response) {
                setNews(response)
                setImagePreviewUrl(response.imageUrl)
                setFieldValue("title", response.title)
                setFieldValue("detail", response.detail)
                setFieldValue("category", response.category)
                setFieldValue("image", response.image)
            }
        } catch (error) {

        }
    }

    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };



    return (
        <Box width={'100%'} display={'flex'} flexDirection={'column'} gap={"16px"}>
            <Box sx={{ backgroundColor: "#8B4513" }} width={'100%'} display={'flex'} flexDirection={'row'} alignItems={'center'} gap={1} >
                <MyIcon icon={<ArrowBack style={{ color: theme.palette.common.white }} />} hasTooltip tooltipText={t("postMotorbike.registedForm.badge-back")} onClick={() => navigate(-1)} position='bottom' />
                <Typography color={theme.palette.common.white} variant="h1" fontSize={24} fontWeight={700}>
                    {t("dashBoardManager.Navigation.news")}
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
                <Box sx={{ display: 'flex', flexDirection: 'column', width: isMobile ? '90%' : '40%', justifyContent: 'center' }}>
                    <div
                        style={{
                            position: 'relative',
                            width: '90%',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            border: '3px solid #8B4513',
                            padding: '1rem',
                        }}
                        onClick={onClickRef}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        {
                            imagePreviewUrl !== "" &&
                            <img
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transition: 'opacity 0.5s ease',
                                    opacity: isHovered ? 0.7 : 1,
                                }}
                                src={imagePreviewUrl}
                                alt={'news'}
                            />
                        }

                        {isHovered && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    opacity: 1,
                                    transition: 'opacity 0.5s ease',
                                    color: '#8B4513',
                                    cursor: 'pointer'
                                }}
                            >
                                {t("dashBoardManager.news.columnAction")}
                            </div>
                        )}
                    </div>
                    {errors.image && touched.image && (
                        <ErrorMessage message={errors.image} />
                    )}
                    <input
                        aria-label='upload avatar'
                        ref={inputRef}
                        type="file"
                        style={{ display: 'none' }}
                        multiple={false}
                        accept="image/jpeg, image/png"
                        onChange={handleUploadImageBanner}
                    />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: isMobile ? '90%' : '60%', justifyContent: 'center' }}>
                    <TextField
                        name='title'
                        label={t('dashBoardManager.news.newsTitle')}
                        placeholder={t('dashBoardManager.news.newsTitle')}
                        variant='outlined'
                        margin='normal'
                        value={values.title}
                        onChange={handleChange}
                    />
                    {errors.title && touched.title && (
                        <ErrorMessage message={errors.title} />
                    )}
                    <TextField
                        name='category'
                        label={t('dashBoardManager.news.newsCategory')}
                        placeholder={t('dashBoardManager.news.newsCategory')}
                        variant='outlined'
                        margin='normal'
                        value={values.category}
                        onChange={handleChange}
                    />
                    {errors.category && touched.category && (
                        <ErrorMessage message={errors.category} />
                    )}

                    <Editor onChangeData={(data) => {
                        setFieldValue("detail", data);
                    }}
                        content={values.detail}
                    />
                    {errors.detail && touched.detail && (
                        <ErrorMessage message={errors.detail} />
                    )}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: "16px", mt: "16px" }}>
                        <MyCustomButton
                            type="submit"
                            borderRadius={8}
                            fontSize={16}
                            fontWeight={400}
                            disabled={isSave}
                            content={t("dashBoardManager.news.buttonSave")}
                            onClick={handleSubmit} />
                    </Box>
                </Box>
            </Box>
        </Box>

    );
}

export default NewsManagementForm;