import { Box, Divider, Modal, TextField, Typography } from "@mui/material"
import theme from "../../../utils/theme"
import MyIcon from "../../../components/common/MyIcon";
import { CloseOutlined, HelpOutlineOutlined, Loyalty } from "@mui/icons-material";
import { CalendarImage } from "../../../assets/images";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { BookingResponse, Motorbike } from "../../../utils/type";
import { MotorbikeBookingCard } from "./MotorbikeBookingCard";
import { formatMoneyNew } from "../../../utils/helper";
import MyCustomButton from "../../../components/common/MyButton";
import { RequireWhenRent } from "./RequireWhenRent";
import usei18next from "../../../hooks/usei18next";

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

export const ConfirmMotorbikeBookingModal = (props: { isModalConfirmBookingOpen: boolean, setModalConfirmBookingOpen: React.Dispatch<React.SetStateAction<boolean>>, values: BookingValue, isMobile: boolean, motorbikes?: Motorbike[], previewBookingData?: BookingResponse, isProcessingBooking?: boolean, handleSubmit: any }) => {
    const { isModalConfirmBookingOpen, setModalConfirmBookingOpen, values, isMobile, motorbikes, previewBookingData, isProcessingBooking, handleSubmit } = props
    const { t } = usei18next()
    const formatMoney = (money: number | undefined) => {
        if (money) {
            return (money * 1000).toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
        }
        return '0 VND';
    }
    return (
        <Modal
            open={isModalConfirmBookingOpen}
            aria-labelledby="map-modal-title"
            aria-describedby="map-modal-description"
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflowY: 'auto',
                zIndex: 10000
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
                        {t("booking.confirmInforBook")}
                    </Typography>
                    <Box display={"flex"} flexDirection={"row"} justifyContent={"flex-end"} alignItems={"center"}>
                        <MyIcon icon={<CloseOutlined />} hasTooltip tooltipText={t("postMotorbike.registedForm.badge-close")} onClick={() => setModalConfirmBookingOpen(false)} position='bottom' />
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
                                <Typography fontSize={isMobile ? 14 : 16} color={theme.palette.text.primary}>{values.startDate}</Typography>
                            </Box>
                        </Box>
                        <Box display={'flex'} gap={'16px'}>
                            <img src={CalendarImage} alt="calendar" width={isMobile ? 20 : 24} height={isMobile ? 20 : 24} />
                            <Box display={'flex'} flexDirection={'column'} gap={'4px'} justifyContent={"start"} >
                                <Typography fontSize={isMobile ? 14 : 16} color={theme.palette.text.secondary}>{t("booking.endDate")}</Typography>
                                <Typography fontSize={isMobile ? 14 : 16} color={theme.palette.text.primary}>{values.endDate}</Typography>
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
                        value={values.address}
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
                            center={{ lat: values.lat, lng: values.lng }}
                            mapContainerStyle={{
                                width: "100%",
                                height: "40vh",
                                borderRadius: "8px",
                            }}

                        >
                            {values &&
                                (
                                    <>
                                        <Marker position={{ lat: values.lat, lng: values.lng }} />
                                    </>
                                )
                            }
                        </GoogleMap>
                    </Box>
                    {
                        motorbikes && motorbikes.length > 0 &&
                        motorbikes.map((motor, index) => {
                            return (
                                <MotorbikeBookingCard key={`${index}_motor`} motorbike={motor} isMobile={isMobile} />
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
                            motorbikes && motorbikes.length > 0 &&
                            <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }}>
                                <Typography color={theme.palette.text.primary} sx={{ fontSize: isMobile ? '14px' : '16px', fontWeight: "400", }}>
                                    {t("booking.pricePerday")}
                                </Typography>
                                <Typography color={theme.palette.text.primary} sx={{ fontSize: isMobile ? '14px' : '16px', fontWeight: "600", }}>
                                    {`${formatMoneyNew(motorbikes.reduce((total, mt) => {
                                        if (mt && mt.priceRent !== undefined) {
                                            return total + mt.priceRent;
                                        } else {
                                            return total;
                                        }
                                    }, 0) || 0)}/${t("booking.perDay")}`} x  {motorbikes.length} {t("booking.perMotorbike")}
                                </Typography>
                            </Box>
                        }
                    </Box>
                    {/* Phí vận chuyển */}
                    {
                        previewBookingData?.motorbikes[0].totalFeeOfDelivery! > 0 ? (
                            <>
                                {/* Line */}
                                <Divider sx={{ width: "100%" }} variant="fullWidth" />
                                <Box width={"100%"} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '8px' }}>
                                <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} >
                                    <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '4px' }}>
                                        <Typography color={theme.palette.text.primary} sx={{ fontSize: isMobile ? "14px" : '16px', fontWeight: "400", }}>
                                            {t("booking.distance")}
                                        </Typography>
                                        <MyIcon icon={
                                            <HelpOutlineOutlined sx={{
                                                color: theme.palette.text.primary,
                                                width: "12px",
                                                height: "12px",
                                                cursor: "pointer"
                                            }}
                                            />
                                        } hasTooltip tooltipText={
                                            t("booking.distance_hint")
                                        } onClick={() => {
                                        }} position='right-start' />

                                    </Box>
                                    <Typography color={theme.palette.text.primary} sx={{
                                        fontSize: isMobile ? "14px" : '16px', fontWeight: "600", whiteSpace: 'nowrap',
                                    }}>
                                        {previewBookingData?.motorbikes[0].distance.toFixed(1)} km
                                    </Typography>
                                </Box>
                                <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} >
                                    <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '4px' }}>
                                        <Typography color={theme.palette.text.primary} sx={{
                                            fontSize: isMobile ? "14px" : '16px',
                                            fontWeight: "400",
                                            flexWrap: 'wrap',

                                        }}>
                                            {t("booking.freeDeliveryDistance")}
                                        </Typography>
                                        <MyIcon icon={
                                            <HelpOutlineOutlined sx={{
                                                color: theme.palette.text.primary,
                                                width: "12px",
                                                height: "12px",
                                                cursor: "pointer"
                                            }}
                                            />
                                        } hasTooltip tooltipText={
                                            t("booking.freeDeliveryDistance_hint")
                                        } onClick={() => {
                                        }} position='right-start' />

                                    </Box>
                                    <Typography color={theme.palette.text.primary} sx={{
                                        fontSize: isMobile ? "14px" : '16px',
                                        fontWeight: "600",
                                        whiteSpace: 'nowrap',
                                    }}>
                                        {previewBookingData?.motorbikes[0].freeDeliveryRange.toFixed(1)} km
                                    </Typography>
                                </Box>

                                <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '4px' }}>
                                    <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '4px' }}>
                                        <Typography color={theme.palette.text.primary} sx={{ fontSize: isMobile ? "14px" : '16px', fontWeight: "400", }}>
                                            {t("booking.deliveryFee")}
                                        </Typography>
                                        <MyIcon icon={
                                            <HelpOutlineOutlined sx={{
                                                color: theme.palette.text.primary,
                                                width: "12px",
                                                height: "12px",
                                                cursor: "pointer"
                                            }}
                                            />
                                        } hasTooltip tooltipText={
                                            `${t("booking.deliveryFee_hint")} ${formatMoney(previewBookingData?.motorbikes[0].feeOfDeliveryPerKm)}`
                                        } onClick={() => {
                                        }} position='right-start' />

                                    </Box>
                                    <Typography color={theme.palette.text.primary} sx={{
                                        fontSize: isMobile ? "14px" : '16px', fontWeight: "600", whiteSpace: 'nowrap',
                                    }}>
                                        {formatMoney(previewBookingData?.motorbikes[0].totalFeeOfDelivery)} x {previewBookingData?.motorbikes[0].deliveryDistanceChargeable.toFixed(1)
                                        } km
                                    </Typography>
                                </Box>
                                </Box>
                            </>
                        ) : (
                            <>
                            </>
                        )
                    }
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
                                {formatMoneyNew(previewBookingData?.totalAmountTemp)} x {previewBookingData?.rentalDays} {t("booking.perDay")}
                            </Typography>
                        </Box>
                        {/* Phí dịch vụ */}
                        <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }}>
                            <Typography color={theme.palette.text.primary} sx={{ fontSize: isMobile ? '14px' : '16px', fontWeight: "400", }}>
                                {t("booking.totalPriceService")}
                            </Typography>
                            <Typography color={theme.palette.text.primary} sx={{ fontSize: isMobile ? '14px' : '16px', fontWeight: "600", }}>
                                {formatMoneyNew(previewBookingData?.feeOfService)}
                            </Typography>
                        </Box>
                        {/* Mã khuyến mãi */}
                        {
                            previewBookingData?.couponCode !== "" && previewBookingData?.couponCode !== null &&
                            <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }}>
                                <Typography color={theme.palette.text.primary} sx={{ fontSize: isMobile ? '14px' : '16px', fontWeight: "400", }}>
                                    {t("booking.promotionCode")}: <span style={{ textTransform: 'uppercase', fontWeight: '700' }}>{previewBookingData?.couponCode}</span>
                                </Typography>
                                <Typography color={theme.palette.text.primary} sx={{ fontSize: isMobile ? '14px' : '16px', fontWeight: "600", }}>
                                    {formatMoneyNew(previewBookingData?.promotion?.reducedAmount)}
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
                            {formatMoneyNew(previewBookingData?.totalAmount)}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: '16px', marginTop: '16px' }}>
                        <MyCustomButton
                            width='50%' onClick={() => setModalConfirmBookingOpen(false)} content={t("booking.cancelBook")} variant='outlined' />

                        <MyCustomButton disabled={isProcessingBooking}
                            width='50%' onClick={() => {
                                handleSubmit()
                                setModalConfirmBookingOpen(false)
                            }} content={t("booking.bookMotorbikeButton")} variant='contained' />
                    </Box>
                </Box>
            </Box>
        </Modal>
    )
}