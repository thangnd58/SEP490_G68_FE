
import { Box, Button, Typography, TextareaAutosize, TextField, RadioGroup, FormControlLabel, Radio, InputAdornment } from "@mui/material";
import usei18next from "../../../hooks/usei18next";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import MotorbikeManagementService from "../../../services/MotorbikeManagementService";
import { ImageUpload, News, NewsRequest, Promotion, PromotionRequest } from "../../../utils/type";
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
import { PromotionService } from "../../../services/PromotionService";
import dayjs from 'dayjs';
import { DatePicker } from "antd";
import MyCustomTextField from "../../../components/common/MyTextField";

const PromotionManagementForm = () => {
    const { t } = usei18next()
    const { id } = useParams();
    const [statusChange, setStatusChange] = useState<string>();
    const navigate = useNavigate()
    const [promotion, setPromotion] = useState<Promotion>();
    const { isMobile } = useThemePage();
    const inputRef = useRef<HTMLInputElement>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");
    const [fileImage, setFileImage] = useState<File>()
    const [isSave, setIsSave] = useState<boolean>(false);
    const { RangePicker } = DatePicker;

    useEffect(() => {
        getPromotionById(Number(id))
    }, [id])

    const formik = useFormik({
        initialValues: {
            code: "",
            title: "",
            description: "",
            image: "",
            startDate: dayjs("2023-08-09T13:26:26.765").format("MM-DD-YYYY HH:mm"),
            endDate: dayjs("2023-09-09T13:26:26.765").format("MM-DD-YYYY HH:mm"),
            type: "0",
            maxValue: 0,
            minValue: 0,
            value: 0,
            numberLeft: 0,
        },
        validationSchema: Yup.object({
            code: Yup.string().required(t('form.required')).matches(
                /^([A-Za-z0-9\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
                t('form.invalidPromoCode')
            ),
            title: Yup.string().required(t('form.required')),
            description: Yup.string().required(t('form.required')),
            image: Yup.string().required(t('form.required')),
            startDate: Yup.string().required(t('form.required')),
            endDate: Yup.string().required(t('form.required')),
            type: Yup.string().required(t('form.required')),
            maxValue: Yup.number().required(t('form.required')),
            minValue: Yup.number().required(t('form.required')),
            value: Yup.number().required(t('form.required')),
            numberLeft: Yup.number().required(t('form.required')),
        }),
        onSubmit: async (values) => {
            try {
                setIsSave(true)
                const promotionRequest: PromotionRequest = {
                    code: values.code,
                    title: values.title,
                    description: values.description,
                    image: values.image,
                    startDate: dayjs(values.startDate).format("MM-DD-YYYY HH:mm"),
                    endDate: dayjs(values.endDate).format("MM-DD-YYYY HH:mm"),
                    type: values.type,
                    maxValue: values.maxValue / 1000,
                    minValue: values.minValue / 1000,
                    value: values.type === "0" ? values.value / 1000 : values.value / 100,
                    numberLeft: values.numberLeft,
                }
                if (promotion && promotion.id) {
                    if (fileImage) {
                        const params: ImageUpload = {
                            tableName: 'promotion',
                            columnName: 'image',
                            code: promotion.id.toString(),
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
                    await PromotionService.putPromotion(promotion.id.toString(), promotionRequest)
                    ToastComponent(t('dashBoardManager.news.statusEditNewsSuccess'), 'success');
                } else {
                    const newRes = await PromotionService.postPromotion(promotionRequest)
                    if (fileImage) {
                        const params: ImageUpload = {
                            tableName: 'promotion',
                            columnName: 'image',
                            code: newRes,
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

    const getPromotionById = async (id: number) => {
        try {
            const response = await PromotionService.getPromotionById(id.toString());
            if (response) {
                setPromotion(response)
                setImagePreviewUrl(response.imageUrl)
                setFieldValue("code", response.code)
                setFieldValue("title", response.title)
                setFieldValue("description", response.description)
                setFieldValue("startDate", dayjs(response.startDate).format("MM-DD-YYYY HH:mm"))
                setFieldValue("endDate", dayjs(response.endDate).format("MM-DD-YYYY HH:mm"))
                setFieldValue("type", response.type)
                setFieldValue("maxValue", response.maxValue * 1000)
                setFieldValue("minValue", response.minValue  * 1000)
                setFieldValue("value", response.value  * 1000)
                setFieldValue("numberLeft", response.numberLeft)
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

    const handleChangeValue = (event: any) => {
        let inputValue = parseInt(event.target.value);
        if (!isNaN(inputValue) && values.type === "1" && inputValue >= 0 && inputValue <= 100) {
            setFieldValue("value", inputValue);
        } else if (values.type === "0") {
            setFieldValue("value", inputValue);
        } else {
            setFieldValue("value", 0);
        }
    };

    return (
        <Box width={'100%'} display={'flex'} flexDirection={'column'} gap={"16px"}>
            <Box sx={{ backgroundColor: "#8B4513" }} width={'100%'} display={'flex'} flexDirection={'row'} alignItems={'center'} gap={1} >
                <MyIcon icon={<ArrowBack style={{ color: theme.palette.common.white }} />} hasTooltip tooltipText={t("postMotorbike.registedForm.badge-back")} onClick={() => navigate(-1)} position='bottom' />
                <Typography color={theme.palette.common.white} variant="h1" fontSize={24} fontWeight={700}>
                    {t("dashBoardManager.Navigation.promotions")}
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
                        label={t('dashBoardManager.promotions.promotionTitle')}
                        placeholder={t('dashBoardManager.promotions.promotionTitle')}
                        variant='outlined'
                        margin='normal'
                        value={values.title}
                        onChange={handleChange}
                    />
                    {errors.title && touched.title && (
                        <ErrorMessage message={errors.title} />
                    )}
                    <TextField
                        name='code'
                        label={t('dashBoardManager.promotions.promotionCode')}
                        placeholder={t('dashBoardManager.promotions.promotionCode')}
                        variant='outlined'
                        margin='normal'
                        value={values.code}
                        onChange={handleChange}
                    />
                    {errors.title && touched.title && (
                        <ErrorMessage message={errors.title} />
                    )}
                    <Typography style={{
                        fontFamily: 'Inter',
                        fontStyle: 'normal',
                        fontSize: '16px',
                        color: '#000000',
                        fontWeight: '600'
                    }}>{t("dashBoardManager.promotions.titleTimeStart")}</Typography>
                    <RangePicker
                        className="custom-range-picker"
                        style={{
                            fontFamily: 'Inter',
                            fontStyle: 'normal',
                            fontSize: '20px',
                            height: '48px',
                        }}
                        size='large'
                        showTime={{ format: 'HH:mm' }}
                        format="MM-DD-YYYY HH:mm"
                        value={[
                            dayjs(values.startDate, "MM-DD-YYYY HH:mm"),
                            dayjs(values.endDate, "MM-DD-YYYY HH:mm"),
                        ]}
                        onChange={(dates, dateStrings) => {
                            console.log(dateStrings)
                            setFieldValue('startDate', dateStrings[0]);
                            setFieldValue('endDate', dateStrings[1]);
                        }}
                        allowClear={false}
                    />
                    {errors.startDate && touched.startDate && (
                        <ErrorMessage message={errors.startDate} />
                    )}
                    {errors.endDate && touched.endDate && (
                        <ErrorMessage message={errors.endDate} />
                    )}
                    <Typography style={{
                        fontFamily: 'Inter',
                        fontStyle: 'normal',
                        fontSize: '16px',
                        color: '#000000',
                        marginTop: '8px',
                        fontWeight: '600'
                    }}>{t("dashBoardManager.promotions.typePromo")}</Typography>
                    <RadioGroup
                        value={values.type}
                        onChange={(event) => {
                            setFieldValue("type", event.target.value)
                        }}
                        sx={{ display: 'flex', flexDirection: 'row', gap: '8px' }}
                    >
                        <FormControlLabel
                            checked={values.type === "0"}
                            value={"0"}
                            control={<Radio />}
                            label={t("dashBoardManager.promotions.byMoney")}
                            sx={{
                                '& .MuiFormControlLabel-label': {
                                    fontSize: '16px',
                                    fontWeight: '400',
                                    color: theme.palette.text.primary,
                                },
                                borderRadius: "10px",
                                padding: '4px'
                            }}
                        />
                        <FormControlLabel
                            checked={values.type === "1"}
                            value={"1"}
                            control={<Radio />}
                            label={t("dashBoardManager.promotions.byPercent")}
                            sx={{
                                '& .MuiFormControlLabel-label': {
                                    fontSize: '16px',
                                    fontWeight: '400',
                                    color: theme.palette.text.primary,
                                },
                                borderRadius: "10px",
                                padding: '4px'
                            }} />
                    </RadioGroup>
                    {errors.type && touched.type && (
                        <ErrorMessage message={errors.type} />
                    )}

                    <TextField
                        InputProps={{
                            startAdornment: <InputAdornment position="start">{values.type === "0" ? "VND" : "%"}</InputAdornment>,
                            inputProps: {
                                max: values.type === "1" && 100,
                                min: 0
                            }
                        }}
                        type="number"
                        label={t('dashBoardManager.promotions.valuePromo')}
                        placeholder={t('dashBoardManager.promotions.valuePromo')}
                        variant='outlined'
                        margin='normal'
                        name="value"
                        value={values.value}
                        onChange={handleChangeValue} />
                    {errors.value && touched.value && (
                        <ErrorMessage message={errors.value} />
                    )}
                    <TextField
                        sx={{ marginTop: '8px' }}
                        label={t('dashBoardManager.promotions.minValuePromo')}
                        placeholder={t('dashBoardManager.promotions.minValuePromo')}
                        variant='outlined'
                        margin='normal'
                        InputProps={{
                            startAdornment: <InputAdornment position="start">VND</InputAdornment>,
                        }}
                        type="number"
                        name="minValue"
                        value={values.minValue}
                        onChange={handleChange} />
                    {errors.minValue && touched.minValue && (
                        <ErrorMessage message={errors.minValue} />
                    )}
                    <TextField
                        sx={{ marginTop: '8px' }}
                        label={t('dashBoardManager.promotions.maxValuePromo')}
                        placeholder={t('dashBoardManager.promotions.maxValuePromo')}
                        variant='outlined'
                        margin='normal'
                        type="number"
                        InputProps={{
                            startAdornment: <InputAdornment position="start">VND</InputAdornment>,
                        }}
                        name="maxValue"
                        value={values.maxValue}
                        onChange={handleChange} />
                    {errors.maxValue && touched.maxValue && (
                        <ErrorMessage message={errors.maxValue} />
                    )}
                    <TextField
                        sx={{ marginTop: '8px' }}
                        label={t('dashBoardManager.promotions.numberLeft')}
                        placeholder={t('dashBoardManager.promotions.numberLeft')}
                        variant='outlined'
                        margin='normal'
                        type="number"
                        name="numberLeft"
                        value={values.numberLeft}
                        onChange={handleChange} />
                    {errors.numberLeft && touched.numberLeft && (
                        <ErrorMessage message={errors.numberLeft} />
                    )}
                    <Box my={'8px'}>
                        <Editor onChangeData={(data) => {
                            setFieldValue("description", data);
                        }}
                            content={values.description}
                        />
                        {errors.description && touched.description && (
                            <ErrorMessage message={errors.description} />
                        )}
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: "16px", mt: "16px" }}>
                        <MyCustomButton
                            type="submit"
                            borderRadius={8}
                            fontSize={16}
                            fontWeight={400}
                            // disabled={isSave}
                            content={t("dashBoardManager.news.buttonSave")}
                            onClick={handleSubmit} />
                    </Box>
                </Box>
            </Box>
        </Box>

    );
}

export default PromotionManagementForm;