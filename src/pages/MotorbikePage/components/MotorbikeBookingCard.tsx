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


export const MotorbikeBookingCard = (props: { motorbike: Motorbike, isMobile: boolean, canFeedback?: boolean, bookingId?: number, onlyView?: boolean, setReload?: Dispatch<SetStateAction<boolean>>, reload?: boolean }) => {
    const { t } = usei18next();
    const [expanded, setExpanded] = useState(true);
    const [value, setValue] = useState<number>(5);
    const [isEdit, setIsEdit] = useState<boolean>(props.onlyView ? false : true);
    const { setContentModal } = useContext(ModalContext)
    const [feedback, setFeedback] = useState<Feedback | null>(null); // Initially set to null

    useEffect(() => {
        if (props.motorbike && props.motorbike.feedbacks && props.bookingId) {
            const foundFeedback = props.motorbike.feedbacks.find((f) => f.bookingId === props.bookingId);
            // Update state with the found feedback, if any
            if (foundFeedback) {
                setFeedback(foundFeedback);
                setValue(foundFeedback.rating);
                setFieldValue("comment", foundFeedback.comment)
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


    const topComments = [
        "Xe chạy rất êm và tiết kiệm nhiên liệu",
        "Giao xe đúng hẹn",
        "Xe không đúng mô tả"
    ];

    const top100Films = [
        { label: 'The Shawshank Redemption', year: 1994 },
        { label: 'The Godfather', year: 1972 },
        { label: 'The Godfather: Part II', year: 1974 },
        { label: 'The Dark Knight', year: 2008 },
        { label: '12 Angry Men', year: 1957 },
        { label: "Schindler's List", year: 1993 },
        { label: 'Pulp Fiction', year: 1994 },
        {
            label: 'The Lord of the Rings: The Return of the King',
            year: 2003,
        },
        { label: 'The Good, the Bad and the Ugly', year: 1966 },
        { label: 'Fight Club', year: 1999 },
        {
            label: 'The Lord of the Rings: The Fellowship of the Ring',
            year: 2001,
        },
        {
            label: 'Star Wars: Episode V - The Empire Strikes Back',
            year: 1980,
        },
        { label: 'Forrest Gump', year: 1994 },
        { label: 'Inception', year: 2010 },
        {
            label: 'The Lord of the Rings: The Two Towers',
            year: 2002,
        },
        { label: "One Flew Over the Cuckoo's Nest", year: 1975 },
        { label: 'Goodfellas', year: 1990 },
        { label: 'The Matrix', year: 1999 },
        { label: 'Seven Samurai', year: 1954 },
        {
            label: 'Star Wars: Episode IV - A New Hope',
            year: 1977,
        },
        { label: 'City of God', year: 2002 },
        { label: 'Se7en', year: 1995 },
        { label: 'The Silence of the Lambs', year: 1991 },
        { label: "It's a Wonderful Life", year: 1946 },
        { label: 'Life Is Beautiful', year: 1997 },
        { label: 'The Usual Suspects', year: 1995 },
        { label: 'Léon: The Professional', year: 1994 },
        { label: 'Spirited Away', year: 2001 },
        { label: 'Saving Private Ryan', year: 1998 },
        { label: 'Once Upon a Time in the West', year: 1968 },
        { label: 'American History X', year: 1998 },
        { label: 'Interstellar', year: 2014 },
        { label: 'Casablanca', year: 1942 },
        { label: 'City Lights', year: 1931 },
        { label: 'Psycho', year: 1960 },
        { label: 'The Green Mile', year: 1999 },
        { label: 'The Intouchables', year: 2011 },
        { label: 'Modern Times', year: 1936 },
        { label: 'Raiders of the Lost Ark', year: 1981 },
        { label: 'Rear Window', year: 1954 },
        { label: 'The Pianist', year: 2002 },
        { label: 'The Departed', year: 2006 },
        { label: 'Terminator 2: Judgment Day', year: 1991 },
        { label: 'Back to the Future', year: 1985 },
        { label: 'Whiplash', year: 2014 },
        { label: 'Gladiator', year: 2000 },
        { label: 'Memento', year: 2000 },
        { label: 'The Prestige', year: 2006 },
        { label: 'The Lion King', year: 1994 },
        { label: 'Apocalypse Now', year: 1979 },
        { label: 'Alien', year: 1979 },
        { label: 'Sunset Boulevard', year: 1950 },
        {
            label: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb',
            year: 1964,
        },
        { label: 'The Great Dictator', year: 1940 },
        { label: 'Cinema Paradiso', year: 1988 },
        { label: 'The Lives of Others', year: 2006 },
        { label: 'Grave of the Fireflies', year: 1988 },
        { label: 'Paths of Glory', year: 1957 },
        { label: 'Django Unchained', year: 2012 },
        { label: 'The Shining', year: 1980 },
        { label: 'WALL·E', year: 2008 },
        { label: 'American Beauty', year: 1999 },
        { label: 'The Dark Knight Rises', year: 2012 },
        { label: 'Princess Mononoke', year: 1997 },
        { label: 'Aliens', year: 1986 },
        { label: 'Oldboy', year: 2003 },
        { label: 'Once Upon a Time in America', year: 1984 },
        { label: 'Witness for the Prosecution', year: 1957 },
        { label: 'Das Boot', year: 1981 },
        { label: 'Citizen Kane', year: 1941 },
        { label: 'North by Northwest', year: 1959 },
        { label: 'Vertigo', year: 1958 },
        {
            label: 'Star Wars: Episode VI - Return of the Jedi',
            year: 1983,
        },
        { label: 'Reservoir Dogs', year: 1992 },
        { label: 'Braveheart', year: 1995 },
        { label: 'M', year: 1931 },
        { label: 'Requiem for a Dream', year: 2000 },
        { label: 'Amélie', year: 2001 },
        { label: 'A Clockwork Orange', year: 1971 },
        { label: 'Like Stars on Earth', year: 2007 },
        { label: 'Taxi Driver', year: 1976 },
        { label: 'Lawrence of Arabia', year: 1962 },
        { label: 'Double Indemnity', year: 1944 },
        {
            label: 'Eternal Sunshine of the Spotless Mind',
            year: 2004,
        },
        { label: 'Amadeus', year: 1984 },
        { label: 'To Kill a Mockingbird', year: 1962 },
        { label: 'Toy Story 3', year: 2010 },
        { label: 'Logan', year: 2017 },
        { label: 'Full Metal Jacket', year: 1987 },
        { label: 'Dangal', year: 2016 },
        { label: 'The Sting', year: 1973 },
        { label: '2001: A Space Odyssey', year: 1968 },
        { label: "Singin' in the Rain", year: 1952 },
        { label: 'Toy Story', year: 1995 },
        { label: 'Bicycle Thieves', year: 1948 },
        { label: 'The Kid', year: 1921 },
        { label: 'Inglourious Basterds', year: 2009 },
        { label: 'Snatch', year: 2000 },
        { label: '3 Idiots', year: 2009 },
        { label: 'Monty Python and the Holy Grail', year: 1975 },
    ];

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
                                    onClick={() => setContentModal(<UserInforModal userId={props.motorbike.user.userId} />)}
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
                                        }} onClick={() => setContentModal(<ReportFormModal />)} />
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
                                            options={topComments}
                                            value={values.comment}
                                            freeSolo
                                            onChange={(event, newValue) => setFieldValue('comment', newValue)}
                                            includeInputInList
                                            renderInput={(params: any) => (
                                                <TextField
                                                    {...params}
                                                    fullWidth
                                                    name="comment"
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
                                                    content={"Gửi"}
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
                                                    content={"Sửa"}
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