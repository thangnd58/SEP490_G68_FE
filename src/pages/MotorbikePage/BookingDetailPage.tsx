import { useEffect, useState } from "react"
import { Booking, BookingResponse } from "../../utils/type"
import { useNavigate, useParams } from "react-router-dom";
import { BookingService } from "../../services/BookingService";
import { Box, Divider, FormControlLabel, Radio, RadioGroup, Step, StepLabel, Stepper, styled, TextField, Typography } from "@mui/material";
import { ArrowRightIcon } from "@mui/x-date-pickers";
import useThemePage from "../../hooks/useThemePage";
import { CalendarImage, ClockImage, MotorbikeImage } from "../../assets/images";
import usei18next from "../../hooks/usei18next";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { MotorbikeBookingCard } from "./components/MotorbikeBookingCard";
import { RequireWhenRent } from "./components/RequireWhenRent";
import theme from "../../utils/theme";
import { formatMoneyNew } from "../../utils/helper";
import dayjs from 'dayjs';
import { BookingPaymentType, BookingStatus, ROUTES } from "../../utils/Constant";
import MyCustomButton from "../../components/common/MyButton";



export const BookingDetailPage = () => {
    const { bookingId } = useParams();
    const [booking, setBooking] = useState<Booking>();
    const [activeStep, setActiveStep] = useState<number>(0)
    const { isMobile } = useThemePage();
    const { t } = usei18next();
    const steps = [
        t("booking.paymentCol"),
        t("booking.startUsingService"),
        t("booking.endUsingService"),
    ];
    useEffect(() => {
        try {
            BookingService.getBookingById(bookingId || "").then((data) => {
                if (data) {
                    setBooking(data)
                } else {
                    navigate(ROUTES.other.pagenotfound)
                }
            })
        } catch (error) {
            navigate(ROUTES.other.pagenotfound)
        }
    }, [bookingId])

    useEffect(() => {
        if (booking?.status === BookingStatus.Cancelled) {
            navigate(ROUTES.other.pagenotfound)
        }
    }, [booking])

    const [position, setPosition] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (activeStep === 1) {
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
    }, []);

    const handleCancelBooking = async (id: number) => {
        try {
            await BookingService.cancelBooking(id)
            navigate(ROUTES.homepage)
        } catch (error) {

        }

    }


    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                margin: '32px 0px',
                width: '100%',
                position: 'relative'
            }}>
            <Box display={'flex'} alignItems={'center'} >
                <ArrowRightIcon sx={{ position: 'absolute', left: '0', width: '36px', height: '36px', rotate: '180deg' }} />
                <Typography sx={{ fontSize: '40px', fontWeight: '700', textAlign: 'center' }}>Chi tiết đặt xe</Typography>
            </Box>
            <Stepper sx={{ width: '100%' }} activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <Box className="hiddenSroll" width={isMobile ? "100%" : "70%"} sx={{ overflowY: 'auto', overflowX: 'hidden' }} height={"80%"} display={"flex"} flexDirection={"column"} gap={'8px'} justifyContent={"start"}>
                <Box display={'flex'} gap={'16px'} flexDirection={isMobile ? 'column' : 'row'} marginTop={'16px'}>
                    <Box display={"flex"} flexDirection={"column"} gap={'8px'} width={isMobile ? '100%' : '50%'}>
                        <Box sx={{ background: 'rgba(139, 69, 19, 0.10)', borderRadius: '8px', padding: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography fontWeight={600} color={'common.black'}>{activeStep === 0 ? t("booking.timeRemainingPay") : activeStep === 1 ? t("booking.startUsingService") : activeStep === 2 ? t("booking.endUsingService") : ""}</Typography>
                            <Box display={'flex'} gap={'8px'} alignItems={'center'} className="motorcycle-container" style={{ left: position }} >
                                {
                                    activeStep === 0 ? <Box display={'flex'} gap={'8px'} alignItems={'center'} >
                                        {!isMobile && <img src={ClockImage} width={36} height={36} />}
                                        <Typography>5 giờ 59 phút 59 giây</Typography>
                                    </Box> : <img src={MotorbikeImage} width={128} height={128} className="motorcycle-image" />
                                }

                            </Box>
                        </Box>
                        <Typography fontSize={isMobile ? 16 : 24} fontWeight={'500'} color={'common.black'}>{t("booking.timeRent")}</Typography>
                        <Box display={'flex'} gap={'32px'} justifyContent={isMobile ? 'space-between' : 'start'}>
                            <Box display={'flex'} gap={'8px'}>
                                {!isMobile && <img src={CalendarImage} alt="calendar" width={36} height={36} />}
                                <Box>
                                    <Typography fontSize={isMobile ? 14 : 16}>{t("booking.startDate")}</Typography>
                                    <Typography fontSize={isMobile ? 14 : 16}>{dayjs(booking?.startDatetime).format("DD-MM-YYYY HH:mm")}</Typography>
                                </Box>
                            </Box>
                            <Box display={'flex'} gap={'8px'}>
                                {!isMobile && <img src={CalendarImage} alt="calendar" width={36} height={36} />}
                                <Box>
                                    <Typography fontSize={isMobile ? 14 : 16}>{t("booking.endDate")}</Typography>
                                    <Typography fontSize={isMobile ? 14 : 16}>{dayjs(booking?.endDatetime).format("DD-MM-YYYY HH:mm")}</Typography>
                                </Box>
                            </Box>
                        </Box>
                        <Typography fontSize={isMobile ? 16 : 24} fontWeight={'500'} color={'common.black'}>{t("booking.addressGetMotorbike")}</Typography>
                        <TextField value={booking?.address} disabled />

                        <Box
                            borderRadius={"10px"}
                            border={"3px solid"}
                            margin={"0px auto"}
                            width={isMobile ? "98%" : "99%"}
                            justifyContent={"center"}
                            alignItems={"center"}
                            flexDirection={"column"}
                        >
                            {/* <GoogleMap
                                zoom={18}
                                center={{ lat: 1, lng: 1 }}
                                mapContainerStyle={{
                                    width: "100%",
                                    height: "40vh",
                                    borderRadius: "8px",
                                }}

                            >
                                {booking &&
                                    (
                                        <>
                                            <Marker position={{ lat: 1, lng: 1 }} />
                                        </>
                                    )
                                }
                            </GoogleMap> */}
                        </Box>
                    </Box>
                    <Box width={isMobile ? '100%' : '45%'} sx={{ background: isMobile ? 'none' : 'rgba(139, 69, 19, 0.10)', borderRadius: '8px', padding: isMobile ? '0px' : '32px' }}>
                        <Typography fontSize={isMobile ? 16 : 24} fontWeight={'500'} color={'common.black'} marginTop={'8px'}>{t("booking.totalPriceRent")}</Typography>
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
                            {/* Phí dịch vụ */}
                            <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }}>
                                <Typography color={theme.palette.text.primary} sx={{ fontSize: '16px', fontWeight: "400", }}>
                                    {t("booking.totalPriceService")}
                                </Typography>
                                <Typography color={theme.palette.text.primary} sx={{ fontSize: '16px', fontWeight: "600", }}>
                                    {formatMoneyNew(booking?.feeOfService)}
                                </Typography>
                            </Box>
                            {/* Mã khuyến mãi */}
                            {
                                booking?.couponCode !== "" && booking?.couponCode !== null &&
                                <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }}>
                                    <Typography color={theme.palette.text.primary} sx={{ fontSize: '16px', fontWeight: "400", }}>
                                        {t("booking.promotionCode")}: <span style={{ textTransform: 'uppercase', fontWeight: '700' }}>{booking?.couponCode}</span>
                                    </Typography>
                                    <Typography color={theme.palette.text.primary} sx={{ fontSize: '16px', fontWeight: "600", }}>
                                        {/* {formatMoneyNew(booking?.couponPrice)} */}
                                        {formatMoneyNew(0)}
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

                        <Divider sx={{ margin: "16px 0px", width: "100%" }} variant="fullWidth" />
                        <Box sx={{ backgroundColor: isMobile ? 'none' : '#FFFFFF', borderRadius: '8px', padding: '8px 16px' }}>
                            <Typography fontSize={isMobile ? 16 : 24} fontWeight={'500'} color={'common.black'} marginTop={'8px'}>{t("booking.paymentType")}</Typography>
                            <Box>
                                <RadioGroup
                                    value={"Card"}
                                    onChange={(event) => {

                                    }}
                                    sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
                                >
                                    <FormControlLabel
                                        checked={"" === BookingPaymentType.UserBalance}
                                        value={BookingPaymentType.UserBalance}
                                        control={<Radio />}
                                        label={t("booking.payWallet")}

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
                                        checked={"Card" === BookingPaymentType.Card}
                                        value={BookingPaymentType.Card}
                                        control={<Radio />}
                                        label={t("booking.payVnPay")}
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
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around', gap: '16px', my: '16px' }}>
                            <MyCustomButton disabled={false}
                                width='100%' onClick={() => { }} content={t("booking.bookMotorbikeButton")} variant='contained' />

                            <MyCustomButton
                                width='100%' onClick={() => handleCancelBooking(booking?.bookingId || 0)} content={t("booking.cancelBook")} variant='outlined' />
                        </Box>
                    </Box>
                </Box>
                {
                    booking && booking.motorbikes && booking.motorbikes.length > 0 &&
                    booking.motorbikes.map((motor, index) => {
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
    )
}