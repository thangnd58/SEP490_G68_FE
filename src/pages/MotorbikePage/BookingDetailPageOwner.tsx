import { useEffect, useState, useContext } from "react"
import { Booking, BookingResponse } from "../../utils/type"
import { useNavigate, useParams } from "react-router-dom";
import { BookingService } from "../../services/BookingService";
import { Box, CircularProgress, Divider, FormControlLabel, IconButton, Radio, RadioGroup, Step, StepLabel, Stepper, styled, TextField, Tooltip, Typography } from "@mui/material";
import { ArrowRightIcon } from "@mui/x-date-pickers";
import useThemePage from "../../hooks/useThemePage";
import { CalendarImage, ClockImage, MotorbikeImage, MyWallet, VNPay } from "../../assets/images";
import usei18next from "../../hooks/usei18next";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { MotorbikeBookingCard } from "./components/MotorbikeBookingCard";
import { RequireWhenRent } from "./components/RequireWhenRent";
import theme from "../../utils/theme";
import { countdownTime, formatMoney, formatMoneyNew } from "../../utils/helper";
import dayjs from 'dayjs';
import { BookingPaymentType, BookingStatus, ROUTES } from "../../utils/Constant";
import MyCustomButton from "../../components/common/MyButton";
import { ModalContext } from "../../contexts/ModalContext";
import MyDialog from "../../components/common/MyDialog";
import { PaymentService } from "../../services/PaymentService";
import { useAppDispatch, useAppSelector } from "../../hooks/useAction";
import ToastComponent from "../../components/toast/ToastComponent";
import { getUserInfo } from "../../redux/reducers/authReducer";
import MyIcon from "../../components/common/MyIcon";
import { ArrowBack, CheckCircle, CloseOutlined, Verified } from "@mui/icons-material";
import { ConfirmCompleteTripModal } from "./components/ConfirmCompleteTripModal";
interface Location {
    lat: number,
    lng: number,
  }
export const BookingDetailPageOwner = () => {
    const { bookingId } = useParams();
    const [booking, setBooking] = useState<Booking>();
    const [activeStep, setActiveStep] = useState<number>(0)
    const { isMobile } = useThemePage();
    const { t } = usei18next();
    const { setContentModal, setShowModal } = useContext(ModalContext)
    const steps = [
        t("booking.paymentCol"),
        t("booking.startUsingService"),
        t("booking.endUsingService"),
    ];
    const [paymentType, setPaymentType] = useState<string>(BookingPaymentType.Card)
    const { user } = useAppSelector((state) => state.userInfo);
    const { reloadStatus } = useAppSelector((state) => state.bookingInfo);
    const dispatch = useAppDispatch();
    const [reloadBooking, setReloadBooking] = useState<boolean>(false)
    const [endDate, setEndDate] = useState<string>("");
    const [countdown, setCountdown] = useState<string>("");
    const [location, setLocation] = useState<Location>({ lat: 21.028511, lng: 105.804817 });

    useEffect(() => {
        try {
            BookingService.getRentalBookingDetail(bookingId || "").then((data) => {
                if (data) {
                    if (data.status === BookingStatus.Cancelled) {
                        navigate(ROUTES.other.pagenotfound)
                    } else if (data.status === BookingStatus.PendingPayment) {
                        setActiveStep(0)
                    } else if (data.status === BookingStatus.Paid || data.status === BookingStatus.PendingDelivery) {
                        setActiveStep(1)
                    } else if (data.status === BookingStatus.Delivered) {
                        setActiveStep(2)
                    } else if (data.status === BookingStatus.Finished || data.status === BookingStatus.PendingReview) {
                        setActiveStep(3)
                    } else {
                        navigate(ROUTES.other.pagenotfound)
                    }
                    setBooking(data)
                    setPaymentType(data.paymentType)
                    BookingService.getLatLngByAddress(data.address || "Hà nội").then((d) => {
                        const location = d.split(',');
                        const result: Location = {
                          lat: Number(location[0]),
                          lng: Number(location[1])
                        }
                        setLocation(result)
                      })
                }
            })
        } catch (error) {
            navigate(ROUTES.other.pagenotfound)
        }
    }, [bookingId, reloadBooking, reloadStatus])

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isMovingMotorbike, setIsMovingMotorbike] = useState<boolean>(booking?.status === "Delivered");

    useEffect(() => {
        setIsMovingMotorbike(booking?.status === "Delivered");
    }, [booking?.status]);

    const changeStatusBookingDetail = async (status: string) => {
        try {
            if (status === "Delivered") {
                setIsMovingMotorbike(true);
            }
            if (status === "PendingReview") {
                setIsMovingMotorbike(false);
            }

            const startTime = new Date().getTime();
            setIsLoading(true);

            const motorbikeIdString = booking?.motorbikes?.map((motorbike) => motorbike.id).join(",");

            await BookingService.updateStatusBookingDetail(booking!.bookingId, motorbikeIdString, status);

            const endTime = new Date().getTime();
            const elapsedTime = endTime - startTime;

            const minimumWaitTime = 1000;
            const remainingWaitTime = minimumWaitTime - elapsedTime;

            if (remainingWaitTime > 0) {
                setTimeout(() => {
                    setIsLoading(false);
                    setReloadBooking(!reloadBooking);
                }, remainingWaitTime);
            } else {
                setIsLoading(false);
                setReloadBooking(!reloadBooking);
            }


        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    };

    const [position, setPosition] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (booking?.createDatetime) {
            const endDateMilliseconds = new Date(booking.createDatetime).getTime() + 6 * 60 * 60 * 1000;
            setEndDate(new Date(endDateMilliseconds).toString());
        }
    }, [booking]);

    useEffect(() => {
        if (activeStep === 0) {
            const intervalId = setInterval(() => {
                setCountdown(countdownTime(endDate, t));
            }, 1000);

            return () => clearInterval(intervalId);
        }
    }, [endDate]);

    useEffect(() => {
        if (booking?.status === "Delivered") {
            const moveMotorcycle = () => {
                setPosition((prevPosition) => prevPosition + 5);
            };

            const startAnimation = () => {
                const animationInterval = setInterval(moveMotorcycle, 100);

                setTimeout(() => {
                    clearInterval(animationInterval);
                    setPosition(0);
                }, 2000);
            };

            startAnimation();

            const loopInterval = setInterval(() => {
                startAnimation();
            }, 2000);

            return () => clearInterval(loopInterval);
        }
    }, [activeStep]);

    const handleCancelBooking = async (id: number) => {
        try {
            await BookingService.cancelBooking(id)
            ToastComponent(t("booking.toast.cancelBookSuccess"), "success")
            setTimeout(() => {
                navigate(ROUTES.homepage)
            }, 1000);
        } catch (error) {

        }

    }

    const showModalCancelBooking = (id: number) => {
        setContentModal(
            <MyDialog
                style={{
                    zIndex: 10000
                }}
                title={t("booking.confirmCancelBook")}
                content={t("booking.contentConfirmCancelBook")}
                hasAgreeButton
                hasCancelButton
                onClickAgree={() => handleCancelBooking(id)}
            />
        )
        setShowModal(true)
    }

    // MAP CONTROLLER
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string,
        libraries: ["places"],
    });


    return (
        <>
            {
                booking &&
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px',
                        margin: '32px 0px',
                        width: '100%',
                    }}>
                    <Box display={'flex'} justifyContent={'start'} alignItems={'center'} width={isMobile ? "100%" : "70%"} position={'relative'} mb={'16px'}>
                        <MyIcon icon={<ArrowBack style={{ color: theme.palette.common.black }} />} hasTooltip tooltipText={t("postMotorbike.registedForm.badge-back")} onClick={() => navigate(ROUTES.user.listmotorbike)} position='bottom' />
                        <Typography sx={{ color: "#000", fontSize: isMobile ? '24px' : '32px', fontWeight: '600', textAlign: 'center', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                            {t("booking.detailTitle")}
                        </Typography>
                    </Box>
                    <Stepper sx={{ width: isMobile ? "100%" : "70%" }} activeStep={activeStep} alternativeLabel>
                        {steps.map((label) => (
                            <Step
                                sx={{
                                    alignContent: 'center',
                                    justifyContent: 'center',
                                    '& .MuiStepLabel-label': {
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        color: theme.palette.text.primary,
                                    },
                                    '& .MuiStepIcon-root': {
                                        fontSize: '48px',
                                        zIndex: 1,
                                    },
                                    '& .MuiStepConnector-root': {
                                        flex: 1,
                                    },
                                    '& .MuiStepConnector-line': {
                                        marginTop: '12px',
                                        borderColor: '#e0e0e0',
                                        width: '98%',
                                    },
                                    '& .MuiStepConnector-alternativeLabel': {
                                        top: '12px',
                                    },
                                }}

                                key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    <Box className="hiddenSroll" width={isMobile ? "90%" : "65%"} sx={{ overflowY: 'auto', overflowX: 'hidden' }} height={"80%"} display={"flex"} flexDirection={"column"} gap={'32px'} justifyContent={"start"} padding={"0px 8px"}>
                        <Box display={'flex'} gap={'32px'} flexDirection={isMobile ? 'column' : 'row'} marginTop={'16px'}>
                            <Box display={"flex"} flexDirection={"column"} gap={'8px'} width={isMobile ? '100%' : '50%'}>
                                <Box sx={{ background: 'rgba(139, 69, 19, 0.10)', borderRadius: '8px', padding: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Typography fontWeight={600} fontSize={"16px"} color={'common.black'}>{activeStep === 0 ? t("booking.timeRemainingPay") : booking.status === "PendingDelivery" ? t("booking.startUsingService") : booking.status === "Delivered" ? t("booking.startedUsingService") : ""}</Typography>
                                    <Box
                                        display={'flex'}
                                        gap={'8px'}
                                        alignItems={'center'}
                                        // className="motorcycle-container"
                                        mb={'8px'}
                                    >
                                        {activeStep === 0 ? (
                                            <Box display={'flex'} gap={'8px'} alignItems={'center'}>
                                                {!isMobile && <img src={ClockImage} width={36} height={36} />}
                                                <Typography color={'common.black'}>{countdown}</Typography>
                                            </Box>
                                        ) : (
                                            <Box display={'flex'} flexDirection={'column'} alignItems={'center'} gap={'8px'}>
                                                {
                                                    (booking.status === "PendingDelivery" || booking.status === "Delivered") &&
                                                    <img src={MotorbikeImage} width={128} height={128} className="motorcycle-image"
                                                        style={{
                                                            transform: isMovingMotorbike ? `translateX(-50%) translateX(${position}px)` : '',
                                                            transition: isMovingMotorbike ? 'transform 0.2s ease-in-out' : '',
                                                        }}
                                                    />
                                                }
                                                {
                                                    (booking.status === "PendingReview" || booking.status === "Finished") &&
                                                    <Box display={'flex'} flexDirection={'row'} alignItems={'center'} gap={'8px'}>
                                                        <CheckCircle sx={{ color: theme.palette.primary.main, width: "56px", height: "56px" }} />
                                                        <Typography color={'common.black'}>Chuyến đi đã kết thúc</Typography>
                                                    </Box>
                                                }
                                                <>
                                                    {
                                                        !isLoading &&
                                                        booking.status === "PendingDelivery" &&
                                                        <MyCustomButton
                                                            width='100%' onClick={
                                                                () =>
                                                                    changeStatusBookingDetail("Delivered")
                                                            }
                                                            content={t("booking.confirmDeliveryMotorbike")}
                                                            variant='contained'
                                                        />
                                                    }
                                                </>
                                            </Box>
                                        )}

                                    </Box>
                                    {
                                        isLoading ? (
                                            <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                                <CircularProgress />
                                            </Box>
                                        ) : (
                                            activeStep === 2 &&
                                            <MyCustomButton
                                                width='100%' onClick={() => changeStatusBookingDetail("PendingReview")} content={t("booking.returnMotorbikeAndEndTrip")} variant='contained' />
                                        )
                                    }
                                </Box>
                                <Typography mt={'8px'} fontSize={isMobile ? 16 : 20} fontWeight={'700'} color={'common.black'}>{t("booking.timeRent")}</Typography>
                                <Box display={'flex'} gap={isMobile ? '16px' : '32px'} justifyContent={isMobile ? 'space-between' : 'start'} flexDirection={isMobile ? 'column' : 'row'} mb={'16px'}>
                                    <Box display={'flex'} gap={'16px'} >
                                        <img src={CalendarImage} alt="calendar" width={isMobile ? 20 : 24} height={isMobile ? 20 : 24} />
                                        <Box display={'flex'} flexDirection={'column'} gap={'4px'} justifyContent={"start"}>
                                            <Typography fontSize={isMobile ? 14 : 16} color={theme.palette.text.secondary}>{t("booking.startDate")}</Typography>
                                            <Typography fontSize={isMobile ? 14 : 16} color={theme.palette.text.primary}>{dayjs(booking?.startDatetime).format("DD-MM-YYYY HH:mm")}</Typography>
                                        </Box>
                                    </Box>
                                    <Box display={'flex'} gap={'16px'}>
                                        <img src={CalendarImage} alt="calendar" width={isMobile ? 20 : 24} height={isMobile ? 20 : 24} />
                                        <Box display={'flex'} flexDirection={'column'} gap={'4px'} justifyContent={"start"} >
                                            <Typography fontSize={isMobile ? 14 : 16} color={theme.palette.text.secondary}>{t("booking.endDate")}</Typography>
                                            <Typography fontSize={isMobile ? 14 : 16} color={theme.palette.text.primary}>{dayjs(booking?.endDatetime).format("DD-MM-YYYY HH:mm")}</Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                <Typography fontSize={isMobile ? 16 : 20} fontWeight={'700'} color={'common.black'}>{t("booking.addressGetMotorbike")}</Typography>
                                <TextField
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderRadius: "8px",
                                                border: "1px solid #e0e0e0",
                                            },
                                            '&:hover fieldset': {
                                                border: "1px solid #8b4513"
                                            },
                                            '&.Mui-focused fieldset': {
                                                border: "1px solid #8b4513"
                                            },
                                        },
                                    }}
                                    value={booking?.address}
                                    inputProps={{
                                        readOnly: true,
                                    }} />
                                <Box
                                    borderRadius={"10px"}
                                    border={"3px solid"}
                                    margin={"0px auto"}
                                    width={isMobile ? "98%" : "99%"}
                                    justifyContent={"center"}
                                    alignItems={"center"}
                                    flexDirection={"column"}
                                >
                                    <GoogleMap
                                        zoom={18}
                                        center={{ lat: location.lat, lng: location.lng }}
                                        mapContainerStyle={{
                                            width: "100%",
                                            height: "40vh",
                                            borderRadius: "8px",
                                        }}

                                    >
                                        {booking &&
                                            <Marker position={{ lat: location.lat, lng: location.lng }} />
                                        }
                                    </GoogleMap>
                                </Box>
                            </Box>
                            <Box width={isMobile ? '100%' : '45%'} sx={{ background: isMobile ? 'none' : 'rgba(139, 69, 19, 0.10)', borderRadius: '8px', padding: isMobile ? '4px' : '32px' }}>
                                <Typography fontSize={isMobile ? 16 : 20} fontWeight={'700'} color={'common.black'} mb={"16px"}>{t("booking.totalPriceRent")}</Typography>
                                {/* Đơn giá */}
                                <Box width={"100%"} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '4px' }}>
                                    {/* Đơn giá thuê */}
                                    <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }}>
                                        <Typography color={theme.palette.text.primary} sx={{ fontSize: '16px', fontWeight: "400", }}>
                                            {t("booking.pricePerday")}
                                        </Typography>
                                        <Typography color={theme.palette.text.primary} sx={{ fontSize: '16px', fontWeight: "600", }}>
                                            {`${booking && booking.motorbikes && formatMoneyNew(booking.motorbikes.reduce((total, mt) => total + mt.priceRent, 0) || 0)}/${t("booking.perDay")}`} x  {booking && booking.motorbikes && booking.motorbikes.length} {t("booking.perMotorbike")}
                                        </Typography>
                                    </Box>
                                </Box>
                                {/* Line */}
                                <Divider sx={{ margin: "16px 0px", width: "100%" }} variant="fullWidth" />

                                {/* Tổng tiền và app mã khuyến mãi */}
                                <Box width={"100%"} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '8px' }}>
                                    {/* Tổng tiền */}
                                    <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }}>
                                        <Typography color={theme.palette.text.primary} sx={{ fontSize: '16px', fontWeight: "400", }}>
                                            {t("booking.totalPriceRent")}
                                        </Typography>
                                        <Typography color={theme.palette.text.primary} sx={{ fontSize: '16px', fontWeight: "600", }}>
                                            {formatMoneyNew(booking?.totalAmountTemp)} x {booking?.rentalDays} {t("booking.perDay")}
                                        </Typography>
                                    </Box>
                                    {/* Mã khuyến mãi */}
                                    {
                                        booking?.promotion &&
                                        <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }}>
                                            <Typography color={theme.palette.text.primary} sx={{ fontSize: '16px', fontWeight: "400", }}>
                                                {t("booking.promotionCode")}: <span style={{ textTransform: 'uppercase', fontWeight: '700' }}>{booking?.promotion?.code}</span>
                                            </Typography>
                                            <Typography color={theme.palette.text.primary} sx={{ fontSize: '16px', fontWeight: "600", }}>
                                                {/* {formatMoneyNew(booking?.couponPrice)} */}
                                                {formatMoneyNew(booking.reducedAmount)}
                                            </Typography>
                                        </Box>
                                    }
                                </Box>
                                {/* Line */}
                                <Divider sx={{ margin: "16px 0px", width: "100%" }} variant="fullWidth" />
                                {/* Tổng tiền */}
                                <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }}>
                                    <Typography color={theme.palette.text.primary} sx={{ fontSize: '16px', fontWeight: "600", }}>
                                        {t("booking.totalPrice")}
                                    </Typography>
                                    <Typography color={theme.palette.text.primary} sx={{ fontSize: '16px', fontWeight: "600", }}>
                                        {formatMoneyNew(booking?.totalAmount)}
                                    </Typography>
                                </Box>

                                {/* Tiền cọc */}
                                <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }}>
                                    <Box display={'flex'} flexDirection={'row'} alignItems={'center'} gap={'2px'}>
                                        <Typography color={theme.palette.text.primary} sx={{
                                            fontSize: '16px',
                                            fontWeight: "600",
                                        }}
                                        >
                                            {t("booking.depositMoney")}
                                        </Typography>
                                        {booking.status !== BookingStatus.PendingPayment && <Tooltip title={t("booking.toolTipPaid")}><Verified sx={{ cursor: 'pointer', width: '16px', height: '16px' }} /></Tooltip>}
                                    </Box>
                                    <Typography color={theme.palette.text.primary} sx={{
                                        fontSize: '16px', fontWeight: "600", textDecoration: booking.status !== BookingStatus.PendingPayment ? 'line-through' : 'none',
                                    }}>
                                        {formatMoneyNew(booking?.deposit)}
                                    </Typography>
                                </Box>

                                {/* Thanh toán khi nhận xe */}
                                <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }}>
                                    <Box display={'flex'} flexDirection={'row'} alignItems={'center'} gap={'2px'}>
                                        <Typography color={theme.palette.text.primary} sx={{ fontSize: '16px', fontWeight: "600", }}>
                                            {t("booking.remainingAmount")}
                                        </Typography>
                                        {booking.status !== BookingStatus.PendingPayment && booking.status !== BookingStatus.PendingDelivery && <Tooltip title={t("booking.toolTipPaid")}><Verified sx={{ cursor: 'pointer', width: '16px', height: '16px' }} /></Tooltip>}
                                    </Box>

                                    <Typography color={theme.palette.text.primary} sx={{ fontSize: '16px', fontWeight: "600", textDecoration: booking.status !== BookingStatus.PendingPayment && booking.status !== BookingStatus.PendingDelivery ? 'line-through' : 'none', }}>
                                        {formatMoneyNew(booking?.totalAmount - booking?.deposit)}
                                    </Typography>
                                </Box>

                                <Divider sx={{ margin: "16px 0px", width: "100%" }} variant="fullWidth" />
                                {
                                    activeStep === 0 &&
                                    <Box sx={{ backgroundColor: isMobile ? 'none' : '#FFFFFF', borderRadius: '8px', padding: '8px 16px' }}>
                                        <Typography fontSize={isMobile ? 14 : 16} fontWeight={'700'} color={'common.black'} marginBottom={'8px'}>{t("booking.paymentType")}</Typography>
                                        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'space-around', gap: '16px', my: '8px' }}>
                                            {/* note, khách thuê chưa tiến hành thanh toán */}
                                            <Typography fontSize={isMobile ? 12 : 14} fontWeight={'400'}
                                                color={"#FF0000"}
                                                fontStyle={'italic'}
                                                textAlign={'start'}
                                            >
                                                *Khách thuê chưa tiến hành thanh toán
                                            </Typography>
                                        </Box>
                                    </Box>
                                }
                                {activeStep !== 0 &&
                                    <Box sx={{ backgroundColor: isMobile ? 'none' : '#FFFFFF', borderRadius: '8px', padding: '8px 16px' }}>
                                        <Typography fontSize={isMobile ? 14 : 16} fontWeight={'700'} color={'common.black'} marginBottom={'8px'}>{t("booking.paymentType")}</Typography>
                                        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around', gap: '16px', my: '8px' }}>
                                            {booking?.paymentType === BookingPaymentType.Card ?
                                                (
                                                    <Box width={'90%'}
                                                        display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '8px' }} border={'2px solid #8b4513'} borderRadius={'8px'} padding={'8px'}>
                                                        <img alt="my-wallet" src={VNPay} height={24} />
                                                        {
                                                            t("booking.payVnPay")
                                                        }
                                                    </Box>
                                                ) : (
                                                    <Box width={'90%'} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '8px' }} border={'2px solid #8b4513'} borderRadius={'8px'} padding={'8px'}>
                                                        <img alt="my-wallet" src={MyWallet} width={24} height={24} />
                                                        {
                                                            `${t("booking.payWallet")}`
                                                        }
                                                    </Box>
                                                )
                                            }
                                        </Box>
                                    </Box>
                                }
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around', gap: '16px', my: '16px' }}>
                                    {
                                        activeStep !== 2 && activeStep !== 3 &&
                                        <MyCustomButton
                                            width='100%' onClick={() => showModalCancelBooking(booking?.bookingId || 0)} content={t("booking.cancelBook")} variant='outlined' />
                                    }
                                </Box>
                            </Box>
                        </Box>
                        {
                            booking && booking.motorbikes && booking.motorbikes.length > 0 &&
                            booking.motorbikes.
                                filter((motor) => motor.user.userId === user?.userId).

                                map((motor, index) => {
                                    return (
                                        <MotorbikeBookingCard key={`${index}_motor`} motorbike={motor} isMobile={isMobile} />
                                    )
                                })
                        }
                        <Box mb={'8px'}>
                            <RequireWhenRent />
                        </Box>
                    </Box>
                </Box>
            }
        </>

    )
}