import styled from "@emotion/styled";
import {
    Typography,
    Box,
    Divider,
    FormControlLabel,
    RadioGroup,
    Paper,
    Grid,
    Avatar,
    CircularProgress,
    Chip,
} from "@mui/material";
import useThemePage from "../../../hooks/useThemePage";
import usei18next from "../../../hooks/usei18next";
import { useAppDispatch, useAppSelector } from "../../../hooks/useAction";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { ModalContext } from "../../../contexts/ModalContext";
import { Booking, CartInforResponse, Motorbike } from "../../../utils/type";
import { BookingInfoMultipleMotorbikeModal } from "../BookingInfoMultipleMotorbikeModal";
import { BookingService } from "../../../services/BookingService";
import ToastComponent from "../../../components/toast/ToastComponent";
import dayjs from 'dayjs';
import theme from "../../../utils/theme";
import { NoDataImage } from "../../../assets/images";
import MyCustomButton from "../../../components/common/MyButton";
import { CalendarTodayOutlined, CheckCircleOutline, ErrorOutline, KeyboardArrowDown, KeyboardArrowUp, LocationOnOutlined, PriceCheckOutlined, ReadMore, WarningAmber } from "@mui/icons-material";
import MyIcon from "../../../components/common/MyIcon";
import MotorbikeInforCard from "../../HomePage/components/MotorbikeInforCard";
import { BookingStatus, ROUTES } from "../../../utils/Constant";
import { formatMoneyNew } from "../../../utils/helper";

interface AnimatedBoxProps {
    isOpen: boolean;
}

const AnimatedBox = styled(Box) <AnimatedBoxProps>`
    transition: all 2s ease;
    overflow: hidden;
    height: ${(props) => (props.isOpen ? 'auto' : '0')};
    opacity: ${(props) => (props.isOpen ? '1' : '0')};
  `;

interface MyBookingItemProps {
    index: number;
    bookings: Booking[];
    isOwner?: boolean;
    isLoad?: boolean;
}

function MyBookingItem(props: MyBookingItemProps) {
    const { isLoad, isOwner, bookings } = props;
    const { isMobile } = useThemePage();
    const { t } = usei18next();
    const navigate = useNavigate();
    const [open, setOpen] = useState(Array(bookings.length).fill(false));


    // choose chip for status
    const chooseChip = (status: string) => {
        switch (status) {
            case BookingStatus.PendingPayment:
                return (
                    <Chip
                        sx={{ '& .MuiChip-label': { fontSize: isMobile ? "14px" : "16px" } }}
                        color="warning"
                        icon={<WarningAmber />}
                        label={t('myBooking.bookingStatus.pendingPayment')}
                    />
                );
            case BookingStatus.Paid:
                return (
                    <Chip
                        sx={{ '& .MuiChip-label': { fontSize: isMobile ? "14px" : "16px" } }}
                        color="success"
                        icon={<CheckCircleOutline />}
                        label={t('myBooking.bookingStatus.paid')}
                    />
                );
            case BookingStatus.Cancelled:
                return (
                    <Chip
                        sx={{ '& .MuiChip-label': { fontSize: isMobile ? "14px" : "16px" } }}
                        color="error"
                        icon={<ErrorOutline />}
                        label={t('myBooking.bookingStatus.cancelled')}
                    />
                );
            case BookingStatus.PendingDelivery:
                return (
                    <Chip
                        sx={{ '& .MuiChip-label': { fontSize: isMobile ? "14px" : "16px" } }}
                        color="warning"
                        icon={<WarningAmber />}
                        label={
                            isOwner ? t('myBooking.bookingStatus.pendingDeliveryOwner') :
                                t('myBooking.bookingStatus.pendingDeliveryGuest')}
                    />
                );
            case BookingStatus.Delivered:
                return (
                    <Chip
                        sx={{ '& .MuiChip-label': { fontSize: isMobile ? "14px" : "16px" } }}
                        color="success"
                        icon={<CheckCircleOutline />}
                        label={
                            isOwner ? t('myBooking.bookingStatus.deliveredOwner') :
                                t('myBooking.bookingStatus.deliveredGuest')}
                    />
                );
            case BookingStatus.PendingReview:
                return (
                    <Chip
                        sx={{ '& .MuiChip-label': { fontSize: isMobile ? "14px" : "16px" } }}
                        color="warning"
                        icon={<WarningAmber />}
                        label={t('myBooking.bookingStatus.pendingReview')}
                    />
                );
            case BookingStatus.Finished:
                return (
                    <Chip
                        sx={{ '& .MuiChip-label': { fontSize: isMobile ? "14px" : "16px" } }}
                        color="success"
                        icon={<CheckCircleOutline />}
                        label={t('myBooking.bookingStatus.finished')}
                    />
                );
            default:
                return (
                    <Chip
                        sx={{ '& .MuiChip-label': { fontSize: isMobile ? "14px" : "16px" } }}
                        color="error"
                        icon={<ErrorOutline />}
                        label={t('myBooking.bookingStatus.cancelled')}
                    />
                );
        }
    }


    return (
        <Box display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"} width={"100%"} gap={2}>
            {/* check không có booking nào */}
            {isLoad ? (
                <Box display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"} width={"100%"} marginTop={2} gap={2}>
                    <CircularProgress />
                </Box>
            ) : (
                bookings.length === 0 ? (
                    <Box display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"} width={"100%"} marginTop={2} gap={2}>
                        <img src={NoDataImage} alt={"no-data"} width={"400px"} height={"400px"} />
                    </Box>
                ) : (
                    // map item
                    bookings.map((booking: Booking, index: number) => (
                        <Paper key={index} elevation={2} sx={{ width: '100%', bgcolor: 'background.paper' }}>
                            <Box display={"flex"} flexDirection={"column"} gap={"16px"} p={3}>
                                <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"}>
                                    <Typography
                                        variant='h2'
                                        color={theme.palette.text.primary}
                                        fontSize={"24px"}
                                        lineHeight={"36px"}
                                        fontWeight={"600"}
                                        sx={{ textAlign: 'center' }}>
                                        {index + 1}. Thông tin đơn hàng
                                    </Typography>
                                    {
                                        chooseChip(booking.status)
                                    }
                                </Box>
                                <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"}>
                                    <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '32px' }}>
                                        {/* location */}
                                        <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '4px' }}>
                                            <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'start'} sx={{ gap: '8px' }}>
                                                <Typography color={theme.palette.text.primary} sx={{ fontSize: '12px', fontWeight: "600", fontStyle: "italic" }}>
                                                    Địa điểm giao xe:
                                                </Typography>
                                            </Box>
                                            <Box
                                                display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'} sx={{ cursor: 'pointer', gap: '4px' }} padding={"4px 0px"}
                                            >
                                                <LocationOnOutlined sx={{ color: theme.palette.action.disabled }} />
                                                <Typography
                                                    color={theme.palette.text.primary}
                                                    sx={{ fontSize: '16px', fontWeight: "400", minWidth: '100px', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                                >
                                                    {booking.address}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        {/* time */}
                                        <Box width={"100%"} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '4px' }}>
                                            <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '16px' }}>
                                                {/* start date */}
                                                <Typography width={"50%"} color={theme.palette.text.primary} sx={{ fontSize: '12px', fontWeight: "600", fontStyle: "italic" }}>
                                                    Ngày nhận xe:
                                                </Typography>
                                                {/* end date */}
                                                <Typography width={"50%"} color={theme.palette.text.primary} sx={{ fontSize: '12px', fontWeight: "600", fontStyle: "italic" }}>
                                                    Ngày trả xe:
                                                </Typography>
                                            </Box>
                                            <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '16px' }}>
                                                {/* start date */}
                                                <Box width={"50%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '4px' }}>
                                                    {/* icon calendar */}
                                                    <CalendarTodayOutlined sx={{ color: theme.palette.action.disabled }} />
                                                    {/* box typography */}
                                                    <Typography
                                                        color={theme.palette.text.primary}
                                                        sx={{ fontSize: '16px', fontWeight: "400" }}
                                                        noWrap
                                                    >
                                                        {dayjs(booking.startDatetime).format("DD/MM/YYYY HH:mm")}
                                                    </Typography>
                                                </Box>
                                                {/* start date */}
                                                <Box width={"50%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '4px' }}
                                                    padding={"4px 0px"}>
                                                    {/* icon calendar */}
                                                    <CalendarTodayOutlined sx={{ color: theme.palette.action.disabled }} />
                                                    {/* box typography */}
                                                    <Typography
                                                        color={theme.palette.text.primary}
                                                        sx={{ fontSize: '16px', fontWeight: "400" }}
                                                        noWrap
                                                    >
                                                        {dayjs(booking.endDatetime).format("DD/MM/YYYY HH:mm")}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Box display={'flex'} flexDirection={'row'} alignItems={'start'} justifyContent={'center'} sx={{ gap: '4px' }}>
                                        <MyIcon
                                            icon={
                                                <ReadMore />
                                            }
                                            position='bottom'
                                            hasTooltip
                                            tooltipText={t("favourite.item.view")}
                                            onClick={() => {

                                                isOwner ?
                                                    navigate(`/${ROUTES.booking.detail_owner}/${booking.bookingId}`) :
                                                    navigate(`/${ROUTES.booking.detail}/${booking.bookingId}`)

                                            }}
                                        />
                                        <MyIcon
                                            icon={
                                                open[index] ? <KeyboardArrowUp /> : <KeyboardArrowDown />
                                            }
                                            position='bottom'
                                            hasTooltip
                                            tooltipText={t("dashBoardManager.news.viewsMore")}
                                            onClick={() => {
                                                const newOpen = [...open];
                                                newOpen[index] = !newOpen[index];
                                                setOpen(newOpen);
                                            }}
                                        />
                                    </Box>
                                </Box>
                                <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"}>
                                    <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '32px' }}>
                                        {/* khách thuê */}
                                        {
                                            <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '4px' }}>
                                                <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'start'} sx={{ gap: '8px' }}>
                                                    <Typography color={theme.palette.text.primary} sx={{ fontSize: '12px', fontWeight: "600", fontStyle: "italic" }}>
                                                        Người thuê:
                                                    </Typography>
                                                </Box>
                                                <Box
                                                    display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'} sx={{ cursor: 'pointer', gap: '4px' }} padding={"4px 0px"}
                                                >
                                                    <Avatar
                                                        sx={{
                                                            width: "40px",
                                                            height: "40px",
                                                            borderRadius: "50%",
                                                        }}
                                                        src={
                                                            isOwner ? booking.user.avatarUrl : booking.motorbikes[0].user.avatarUrl
                                                        }
                                                    />
                                                    <Typography
                                                        color={theme.palette.text.primary}
                                                        sx={{ fontSize: '16px', fontWeight: "400", minWidth: '100px', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                                    >
                                                        {isOwner ? booking.user.name : booking.motorbikes[0].user.name}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        }
                                        {/* tổng tiền */}
                                        <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '4px' }}>
                                            <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'start'} sx={{ gap: '8px' }}>
                                                <Typography color={theme.palette.text.primary} sx={{ fontSize: '12px', fontWeight: "600", fontStyle: "italic" }}>
                                                    Tổng tiền:
                                                </Typography>
                                            </Box>
                                            <Box
                                                display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'} sx={{ cursor: 'pointer', gap: '4px' }} padding={"4px 0px"}
                                            >
                                                <PriceCheckOutlined sx={{ color: theme.palette.primary.main }} />
                                                <Typography
                                                    color={theme.palette.text.primary}
                                                    sx={{ fontSize: '16px', fontWeight: "600", minWidth: '100px', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                                >
                                                    {formatMoneyNew(booking.totalAmount)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                                <Divider />
                                <AnimatedBox sx={{
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                    justifyContent: 'space-evenly',
                                }}
                                    alignItems={'center'}
                                    justifyContent={'center'}
                                    isOpen={open[index]}
                                >
                                    {booking.motorbikes.map((motorbike: Motorbike, index: number) => (
                                        <MotorbikeInforCard key={index} motorbike={motorbike} isIntroduced={true} isFavoritePage={false} startDate={dayjs(booking.startDatetime).format("DD/MM/YYYY HH:mm")} endDate={dayjs(booking.endDatetime).format("DD/MM/YYYY HH:mm")} searchedAddress={booking.address} isNotFavorite />
                                    ))}
                                </AnimatedBox>
                            </Box>
                        </Paper>))))}
        </Box>

    );
}

export default MyBookingItem;
