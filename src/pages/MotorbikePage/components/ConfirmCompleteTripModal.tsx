import { Box, Divider, Modal, TextField, Typography } from "@mui/material"
import theme from "../../../utils/theme"
import MyIcon from "../../../components/common/MyIcon";
import { CloseOutlined, Loyalty } from "@mui/icons-material";
import { CalendarImage } from "../../../assets/images";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { Booking, BookingResponse, Motorbike } from "../../../utils/type";
import { MotorbikeBookingCard } from "./MotorbikeBookingCard";
import { formatMoneyNew } from "../../../utils/helper";
import MyCustomButton from "../../../components/common/MyButton";
import { RequireWhenRent } from "./RequireWhenRent";
import usei18next from "../../../hooks/usei18next";
import { useContext, useEffect, useState } from "react";
import { ModalContext } from "../../../contexts/ModalContext";
import { BookingService } from "../../../services/BookingService";
import dayjs from 'dayjs';

interface BookingValue {
    address: string | undefined;
    lat: number;
    lng: number;
    startDate: string | undefined;
    endDate: string | undefined;
    paymentType: string;
    deliveryMode: string;
    couponCode: string;
}
interface Location {
    lat: number,
    lng: number,
  }
  
export const ConfirmCompleteTripModal = (props: { booking: Booking, isMobile: boolean, setReloadBooking: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const { isMobile, booking, setReloadBooking } = props
    const { t } = usei18next()
    const { closeModal } = useContext(ModalContext)
    const [location, setLocation] = useState<Location>({ lat: 21.028511, lng: 105.804817 });

    const changeStatusBookingDetail = async (status: string) => {
        try {
            const motorbikeIdString = booking?.motorbikes?.map((motorbike) => motorbike.id).join(",");
            await BookingService.updateStatusBookingDetail(booking!.bookingId, motorbikeIdString, status);
            setReloadBooking((prev) => !prev);
            closeModal();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        BookingService.getLatLngByAddress(booking.address || "Hà nội").then((data) => {
          const location = data.split(',');
          const result: Location = {
            lat: Number(location[0]),
            lng: Number(location[1])
          }
          setLocation(result)
        })
      }, [booking.address])

    return (
        <Modal
            open={closeModal}
            aria-labelledby="map-modal-title"
            aria-describedby="map-modal-description"
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9998
            }}
        >
            <Box
                width={isMobile ? "80%" : "50%"}
                height={"90vh"}
                sx={{
                    padding: "16px 32px",
                    backgroundColor: 'white',
                    overflowY: 'auto',
                    borderRadius: '8px',
                }}

            >
                <Box width={"100%"} display={"flex"} flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"}>
                    <Typography variant='h2' color={theme.palette.text.primary} fontSize={isMobile ? 20 : 24} fontWeight={700} textAlign={"start"}>
                        { booking.status === "Finished" ? t("booking.detailBooking") : t("booking.confirmCompleteTrip")}
                    </Typography>
                    <Box display={"flex"} flexDirection={"row"} justifyContent={"flex-end"} alignItems={"center"}>
                        <MyIcon icon={<CloseOutlined />} hasTooltip tooltipText={t("postMotorbike.registedForm.badge-close")} onClick={closeModal} position='bottom' />
                    </Box>
                </Box>
                <Divider sx={{ width: "100%", margin: "16px 0px" }} variant="middle" />
                <Box className="hiddenSroll" width={"100%"} sx={{ overflowY: 'auto', overflowX: 'hidden' }} height={"80%"} display={"flex"} flexDirection={"column"} gap={'16px'} justifyContent={"start"}>
                    <Typography fontSize={isMobile ? 16 : 20} fontWeight={'700'} color={'common.black'}>Thời gian thuê xe</Typography>
                    <Box display={'flex'} gap={isMobile ? '16px' : '32px'} justifyContent={isMobile ? 'space-between' : 'start'} flexDirection={isMobile ? 'column' : 'row'}>
                        <Box display={'flex'} gap={'16px'}>
                            <img src={CalendarImage} alt="calendar" width={isMobile ? 20 : 24} height={isMobile ? 20 : 24} />
                            <Box display={'flex'} flexDirection={'column'} gap={'4px'} justifyContent={"start"}>
                                <Typography fontSize={isMobile ? 14 : 16} color={theme.palette.text.secondary}>{t("booking.startDate")}</Typography>
                                <Typography fontSize={isMobile ? 14 : 16} color={theme.palette.text.primary}>
                                    {
                                    dayjs(booking.startDatetime).format("DD/MM/YYYY HH:mm")   
                                    }
                                    </Typography>
                            </Box>
                        </Box>
                        <Box display={'flex'} gap={'16px'}>
                            <img src={CalendarImage} alt="calendar" width={isMobile ? 20 : 24} height={isMobile ? 20 : 24} />
                            <Box display={'flex'} flexDirection={'column'} gap={'4px'} justifyContent={"start"} >
                                <Typography fontSize={isMobile ? 14 : 16} color={theme.palette.text.secondary}>{t("booking.endDate")}</Typography>
                                <Typography fontSize={isMobile ? 14 : 16} color={theme.palette.text.primary}>{dayjs(booking.endDatetime).format("DD/MM/YYYY HH:mm")}</Typography>
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
                        value={booking.address}
                        inputProps={{
                            readOnly: true,
                        }} />

                    <Box
                        borderRadius={"10px"}
                        border={"2px solid"}
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
                                (
                                    <>
                                        <Marker position={{ lat: location.lat, lng: location.lng }} />
                                    </>
                                )
                            }
                        </GoogleMap>
                    </Box>
                    {
                        booking && booking.motorbikes.length > 0 &&
                        booking.motorbikes.map((motor, index) => {
                            return (
                                <MotorbikeBookingCard key={`${index}_motor`} motorbike={motor} isMobile={isMobile} canFeedback={true} onlyView={booking.status==="Finished"} bookingId={booking.bookingId} setReload={setReloadBooking} />
                            )
                        })
                    }
                    <Divider sx={{ width: "100%" }} variant="fullWidth" />
                    <RequireWhenRent />
                    <Divider sx={{ width: "100%" }} variant="fullWidth" />
                    <Typography fontSize={isMobile ? 16 : 20} fontWeight={'700'} color={'common.black'}>{t("booking.totalPriceRent")}</Typography>
                    {/* Đơn giá */}
                    <Box width={"100%"} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '4px' }}>
                        {/* Đơn giá thuê */}
                        {
                            booking && booking.motorbikes.length > 0 &&
                            <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }}>
                                <Typography color={theme.palette.text.primary} sx={{ fontSize: isMobile ? '14px' : '16px', fontWeight: "400", }}>
                                    {t("booking.pricePerday")}
                                </Typography>
                                <Typography color={theme.palette.text.primary} sx={{ fontSize: isMobile ? '14px' : '16px', fontWeight: "600", }}>
                                    {`${formatMoneyNew(booking.motorbikes.reduce((total, mt) => {
                                        if (mt && mt.priceRent !== undefined) {
                                            return total + mt.priceRent;
                                        } else {
                                            return total;
                                        }
                                    }, 0) || 0)}/${t("booking.perDay")}`} x  {booking.motorbikes.length} {t("booking.perMotorbike")}
                                </Typography>
                            </Box>
                        }
                    </Box>
                    {/* Line */}
                    <Divider sx={{ width: "100%" }} variant="fullWidth" />

                    {/* Tổng tiền và app mã khuyến mãi */}
                    <Box width={"100%"} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '8px' }}>
                        {/* Tổng tiền */}
                        <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }}>
                            <Typography color={theme.palette.text.primary} sx={{ fontSize: isMobile ? '14px' : '16px', fontWeight: "400", }}>
                                {t("booking.totalPriceRent")}
                            </Typography>
                            <Typography color={theme.palette.text.primary} sx={{ fontSize: isMobile ? '14px' : '16px', fontWeight: "600", }}>
                                {formatMoneyNew(booking?.totalAmountTemp)} x {booking?.rentalDays} {t("booking.perDay")}
                            </Typography>
                        </Box>
                        {/* Phí dịch vụ */}
                        <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }}>
                            <Typography color={theme.palette.text.primary} sx={{ fontSize: isMobile ? '14px' : '16px', fontWeight: "400", }}>
                                {t("booking.totalPriceService")}
                            </Typography>
                            <Typography color={theme.palette.text.primary} sx={{ fontSize: isMobile ? '14px' : '16px', fontWeight: "600", }}>
                                {formatMoneyNew(booking?.feeOfService)}
                            </Typography>
                        </Box>
                        {/* Mã khuyến mãi */}
                        {
                            booking?.promotion !== null &&
                            <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }}>
                                <Typography color={theme.palette.text.primary} sx={{ fontSize: isMobile ? '14px' : '16px', fontWeight: "400", }}>
                                    {t("booking.promotionCode")}: <span style={{ textTransform: 'uppercase', fontWeight: '700' }}>{booking?.promotion?.code}</span>
                                </Typography>
                                <Typography color={theme.palette.text.primary} sx={{ fontSize: isMobile ? '14px' : '16px', fontWeight: "600", }}>
                                    {formatMoneyNew(booking?.reducedAmount)}
                                </Typography>
                            </Box>
                        }
                        {/* <MyCustomButton iconPosition='left' icon={<Loyalty sx={{ color: "#8B4513" }} />} width='100%' onClick={() => setModalPromotionOpen(true)} content={t("booking.promotionCode")} variant='outlined' /> */}

                    </Box>
                    {/* Line */}
                    <Divider sx={{ width: "100%" }} variant="fullWidth" />

                    {/* Tổng tiền */}
                    <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }}>
                        <Typography color={theme.palette.text.primary} sx={{ fontSize: '16px', fontWeight: "700", }}>
                            {t("booking.totalPrice")}
                        </Typography>
                        <Typography color={theme.palette.text.primary} sx={{ fontSize: '16px', fontWeight: "600", }}>
                            {formatMoneyNew(booking?.totalAmount)}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: '16px', marginTop: '16px' }}>

                        {
                            booking.status === "Finished" ? null :
                                <MyCustomButton
                                    width='50%' onClick={() => {
                                        changeStatusBookingDetail("Finished")
                                    }} content={t("booking.confirmCompleteTrip")} variant='contained' />
                        }
                    </Box>
                </Box>
            </Box>
        </Modal>
    )
}