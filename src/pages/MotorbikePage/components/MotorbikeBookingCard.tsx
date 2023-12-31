import { Avatar, Box, Chip, Collapse, Divider, Tooltip, Typography, Rating, TextField, InputAdornment, IconButton, Autocomplete } from "@mui/material"
import { Feedback, FeedbackRequest, Motorbike } from "../../../utils/type"
import usei18next from "../../../hooks/usei18next"
import theme from "../../../utils/theme";
import { ArrowDownward, ArrowUpward, BusinessCenterOutlined, Info, ModeEdit, SendOutlined, SendRounded, StarPurple500Outlined } from "@mui/icons-material";
import { LicencePlateImage, LocationImage, PriceImage } from "../../../assets/images";
import { formatMoneyNew } from "../../../utils/helper";
import { useState, useContext, useEffect, Dispatch, SetStateAction } from "react";
import MyCustomButton from "../../../components/common/MyButton";
import { useFormik } from 'formik';
import * as Yup from "yup";
import ErrorMessage from "../../../components/common/ErrorMessage";
import { FeedbackService } from "../../../services/FeedbackService";
import ToastComponent from "../../../components/toast/ToastComponent";
import { ModalContext } from "../../../contexts/ModalContext";
import { ReportFormModal } from "../../ReportComponent/ReportFormModal";
import UserInforModal from "../../UserProfilePage/UserInforModal";
import { ReportType } from "../../../utils/Constant";


export const MotorbikeBookingCard = (props: { motorbike: Motorbike, isMobile: boolean, canFeedback?: boolean, bookingId?: number, onlyView?: boolean, setReload?: Dispatch<SetStateAction<boolean>>, reload?: boolean }) => {
    const { t } = usei18next();
    const [expanded, setExpanded] = useState(true);
    const [value, setValue] = useState<number>(5);
    const [isEdit, setIsEdit] = useState<boolean>(props.onlyView ? false : true);
    const { openModal } = useContext(ModalContext)
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [listComment, setListComment] = useState<string[]>([
        "Xe chạy rất êm và tiết kiệm nhiên liệu",
        "Giao xe đúng hẹn",
        "Xe không đúng mô tả"
    ])

    useEffect(() => {
        if (props.motorbike && props.motorbike.feedbacks && props.bookingId) {
            const foundFeedback = props.motorbike.feedbacks.find((f) => f.bookingId === props.bookingId);
            // Update state with the found feedback, if any
            if (foundFeedback) {
                setFeedback(foundFeedback);
                setValue(foundFeedback.rating);
                setFieldValue("comment", foundFeedback.comment)
                const newListComment = [...listComment, foundFeedback.comment];
                setListComment(newListComment);
                setIsEdit(false)
            }
        }
    }, [props.motorbike, props.bookingId, props.motorbike?.feedbacks]);

    const formik = useFormik({
        initialValues: {
            comment: feedback?.comment || "Xe chạy rất êm và tiết kiệm nhiên liệu",
        },
        validationSchema: Yup.object({
            comment: Yup.string().required(t("form.required")),
        }),
        onSubmit: async (values) => {
            try {
                if (feedback) {
                    const feedbackReq: FeedbackRequest = {
                        rating: value,
                        comment: values.comment
                    }
                    const res = await FeedbackService.putFeedback(feedback.feedbackId.toString(), feedbackReq)
                    ToastComponent(t("feedback.editSuccess"), "success")
                } else {
                    const feedbackReq: FeedbackRequest = {
                        bookingId: props?.bookingId || 0,
                        motorbikeId: props.motorbike?.id || 0,
                        rating: value,
                        comment: values.comment
                    }
                    console.log(feedbackReq)
                    const res = await FeedbackService.postFeedback(feedbackReq)
                    ToastComponent(t("feedback.createSuccess"), "success")
                }
                if (props.setReload) {
                    props.setReload((prev) => !prev)
                }
            } catch (error) {
                ToastComponent(t("feedback.createError"), "error")
            }
        }
    }
    );

    const {
        values,
        errors,
        touched,
        handleChange,
        handleSubmit,
        setFieldValue
    } = formik;

    const [textFieldValue, setTextFieldValue] = useState('');

    return (
        <Box width={'100%'} display={'flex'} flexDirection={'column'}>
            <Box
                sx={{
                    backgroundColor: "rgba(139, 69, 19, 0.05)",
                }}
                display={'flex'}
                padding={'8px'}
                border={'1px solid #e0e0e0'}
                justifyContent={'space-between'}
                alignItems={'center'}
                gap={'16px'}
                borderRadius={'8px'}
            >
                <Typography
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    fontWeight="700"
                    fontSize={props.isMobile ? 16 : 20}
                    sx={{ cursor: 'pointer' }}
                    color={theme.palette.text.primary}
                >
                    {props.motorbike.model.modelName || props.motorbike.model}</Typography>
                {
                    expanded ? <ArrowUpward sx={{ cursor: 'pointer', color: '#000' }} onClick={() => setExpanded(!expanded)} /> : <ArrowDownward sx={{ cursor: 'pointer', color: '#000' }} onClick={() => setExpanded(!expanded)} />
                }
            </Box>
            {
                expanded &&
                <Box
                    display={'flex'}
                    flexDirection={'column'}
                    gap={'16px'}
                >
                    <Box
                        sx={{
                            backgroundColor: '#fff',
                        }}
                        display={'flex'}
                        flexDirection={props.isMobile ? 'column' : 'row'}
                        justifyContent={'space-between'}
                        alignItems={'start'}
                        gap={'16px'}
                        padding={'16px'}

                    >
                        {/* Image */}
                        <Box
                            width={'100%'}
                            sx={{ cursor: 'pointer', position: 'relative' }}
                        >
                            <Avatar
                                src={props.motorbike && props.motorbike.imageUrl ? props.motorbike.imageUrl[0] : ""}
                                sx={{
                                    width: '100%',
                                    height: '250px',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                    border: '1px solid #e0e0e0',
                                }} alt="image"
                            />
                            {/* User Avatar */}
                            <Tooltip title={props.motorbike.user.name} placement='right-end'>
                                <Avatar sx={{
                                    position: 'absolute',
                                    bottom: -20,
                                    left: 12,
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                }} src={props.motorbike.user.avatarUrl}
                                    onClick={() => openModal(<UserInforModal userId={props.motorbike.user.userId} />)}
                                />
                            </Tooltip>
                        </Box>
                        {/* Content */}
                        <Box
                            width={'100%'}
                            display="flex"
                            flexDirection="column"
                            gap="8px">
                            {/* Brand Name and Model */}
                            <Box display="flex" flexDirection="column" gap="8px">
                                <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                                    <Typography
                                        textOverflow="ellipsis"
                                        whiteSpace="nowrap"
                                        overflow="hidden"
                                        fontWeight="bold"
                                        fontSize="20px"
                                        color={theme.palette.text.primary}
                                    >
                                        {props.motorbike.model.modelName || props.motorbike.model}
                                    </Typography>
                                    <Tooltip title={t("booking.toolTipReport")}>
                                        <Info sx={{
                                            cursor: 'pointer',
                                            color: '#8B4513',
                                            '&:hover': {
                                                transform: "scale(1.1)",
                                                transition: "transform 0.1s ease-in-out",
                                            },
                                        }} onClick={() => openModal(<ReportFormModal type={ReportType.Booking} motorbike={props.motorbike} bookingId={props.bookingId || 0} />)} />
                                    </Tooltip>
                                </Box>
                                <Box display="flex" alignItems="center" gap="8px">
                                    <img src={LocationImage} alt="licence plate" width={24} height={24} />
                                    <Typography
                                        textOverflow="ellipsis"
                                        whiteSpace="nowrap"
                                        overflow="hidden"
                                        fontSize="12px"
                                        maxWidth={'300px'}
                                        fontStyle={"italic"}
                                        color={theme.palette.text.secondary}
                                    >
                                        {props.motorbike.address}
                                    </Typography>
                                </Box>
                                <Box display={'flex'} alignItems={'end'} gap={'8px'}>
                                    <img src={LicencePlateImage} alt="licence plate" width={24} height={24} />
                                    <Typography
                                        textOverflow="ellipsis"
                                        whiteSpace="nowrap"
                                        overflow="hidden"
                                        fontSize="14px"
                                        color={theme.palette.text.primary}
                                    >
                                        {props.motorbike.licensePlate}
                                    </Typography>
                                </Box>
                                <Box display="flex" alignItems="end" gap="8px">
                                    <img src={PriceImage} alt="licence plate" width={24} height={24} />
                                    <Typography
                                        textOverflow="ellipsis"
                                        whiteSpace="nowrap"
                                        overflow="hidden"
                                        fontSize="16px"
                                        fontWeight={'bold'}
                                        color={theme.palette.text.primary}
                                    >
                                        {`${formatMoneyNew(props.motorbike.priceRent)}/${t("booking.perDay")}`}
                                    </Typography>
                                </Box>

                            </Box>
                            {/* Star Rating and Booking Count */}
                            <Box display="flex">
                                <Box width="100%" display="flex" alignItems="end" gap="4px">
                                    <StarPurple500Outlined sx={{ color: "#FBC241" }} fontSize="small" />
                                    <Typography color={theme.palette.text.secondary} fontSize="12px" align="center" textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden">
                                        {props.motorbike.ratingAverage.toFixed(1)}
                                    </Typography>
                                    <BusinessCenterOutlined fontWeight={300} sx={{ color: "#8B4513" }} fontSize="small" />
                                    <Typography color={theme.palette.text.secondary} fontSize="12px" align="center" textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden">
                                        {t("booking.completeBook", { count: props.motorbike.countCompletedBooking })}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                    </Box>
                    {
                        props.canFeedback === true &&
                        <Box
                            border={'1px solid #e0e0e0'}
                            padding={'8px 16px'}
                            margin={'0px 16px'}
                            justifyContent={'space-between'}
                            borderRadius={'8px'}
                            display={'flex'}
                            flexDirection={'column'}
                            gap={'8px'}
                        >
                            <Box width={"100%"} display={'flex'} flexDirection={'row'} gap={'8px'} justifyContent={'space-between'}>
                                <Box display={'flex'} flexDirection={'row'} gap={'8px'} alignItems={'start'}>
                                    <Typography
                                        fontWeight="600"
                                        fontSize="20px"
                                        color={theme.palette.text.primary}
                                    >{t("booking.rating")}:</Typography>
                                    <Rating
                                        size="large"
                                        name="simple-controlled"
                                        value={value}
                                        disabled={!isEdit}
                                        onChange={(event, newValue) => {
                                            setValue(newValue!);
                                        }}
                                    />
                                </Box>
                            </Box>
                            <Box display={'flex'} flexDirection={'column'} gap={'8px'} alignItems={'start'}>
                                <Typography
                                    fontWeight="600"
                                    fontSize="20px"
                                    color={theme.palette.text.primary}
                                >{t("booking.comment")}:</Typography>
                                {/* Autocomplete Integration */}
                                {!props.onlyView && (
                                    <Box display={"flex"} width={"100%"} alignItems={"center"} justifyContent={"space-between"}>
                                        <Autocomplete
                                            sx={{
                                                width: '90%',
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        border: '1px solid #E0E0E0',
                                                        borderRadius: '8px',
                                                    },
                                                    '&:hover fieldset': {
                                                        border: '1px solid #8B4513',
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        border: '1px solid #8B4513',
                                                    },
                                                },
                                            }}
                                            disablePortal
                                            readOnly={!isEdit}
                                            options={listComment}
                                            value={values.comment}
                                            freeSolo
                                            onChange={(event, newValue) => setTextFieldValue(newValue || "")}
                                            includeInputInList
                                            renderInput={(params: any) => (
                                                <TextField
                                                    {...params}
                                                    fullWidth
                                                    name="comment"
                                                    value={values.comment}
                                                    onChange={(e) => setFieldValue("comment", e.target.value)}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            '& fieldset': {
                                                                borderRadius: '8px',
                                                                border: '1px solid #e0e0e0',
                                                            },
                                                            '&:hover fieldset': {
                                                                border: '1px solid #8b4513',
                                                            },
                                                            '&.Mui-focused fieldset': {
                                                                border: '1px solid #8b4513',
                                                            },
                                                        },
                                                    }}
                                                />
                                            )}
                                        />
                                        {
                                            isEdit ?
                                                <MyCustomButton
                                                    height='30px'
                                                    backgroundColor={"rgb(5, 69, 19, 0.5)"}
                                                    borderColor='rgb(5, 69, 19, 0.1)'
                                                    fontColor='#fff'
                                                    borderWeight={0.5}
                                                    fontSize={14}
                                                    onClick={() => {
                                                        setIsEdit(false);
                                                        handleSubmit();
                                                    }}
                                                    content={t("editional.send")}
                                                /> :
                                                <MyCustomButton
                                                    height='30px'
                                                    backgroundColor={"rgb(139, 69, 19,0.1)"}
                                                    borderColor='rgb(139, 69, 19,0.1)'
                                                    fontColor='primary.main'
                                                    borderWeight={0.5}
                                                    fontSize={14}
                                                    onClick={() =>
                                                        setIsEdit(true)
                                                    }
                                                    content={t("editional.edit")}
                                                />
                                        }
                                    </Box>
                                )}
                                {/* End of Autocomplete Integration */}
                                {props.onlyView && (
                                    <TextField
                                        fullWidth
                                        name="comment"
                                        value={values.comment}
                                        onChange={handleChange}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderRadius: '8px',
                                                    border: '1px solid #e0e0e0',
                                                },
                                                '&:hover fieldset': {
                                                    border: '1px solid #8b4513',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    border: '1px solid #8b4513',
                                                },
                                            },
                                        }}
                                        inputProps={{
                                            readOnly: !isEdit,
                                        }}
                                        InputProps={{
                                            endAdornment: (
                                                isEdit ? (
                                                    <IconButton onClick={() => {
                                                        setIsEdit(false);
                                                        handleSubmit();
                                                    }}>
                                                        <SendRounded sx={{ color: 'common.black', transform: 'rotate(-30deg)' }} />
                                                    </IconButton>
                                                ) : null
                                            ),
                                        }}
                                    />
                                )}
                                {errors.comment && touched.comment && (
                                    <ErrorMessage message={errors.comment} />
                                )}
                            </Box>
                        </Box>
                    }
                </Box>
            }
        </Box>
    )
}