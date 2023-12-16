import { Box, Dialog, DialogContent, DialogTitle, Typography } from "@mui/material"
import React, { useContext, useState, useEffect } from 'react'
import { ModalContext } from "../../contexts/ModalContext";
import { Transition } from "../../pages/WalletPage/common/Transition";
import { NotificationService } from "../../services/NotificationService";
import { Booking, Notification } from "../../utils/type";
import { useAppDispatch } from "../../hooks/useAction";
import { getUserNotificationInfo } from "../../redux/reducers/notificationReducer";
import MyIcon from "../../components/common/MyIcon";
import { CloseOutlined } from "@mui/icons-material";
import usei18next from "../../hooks/usei18next";
import { LogoHeader, NewBooking } from "../../assets/images";
import { formatMoneyNew, getPreviousTimeRelative } from "../../utils/helper";
import useThemePage from "../../hooks/useThemePage";
import { Link } from "react-router-dom";
import MyCustomButton from "../../components/common/MyButton";
import { Avatar } from "antd";
import { BookingService } from "../../services/BookingService";
import dayjs from "dayjs";

export const DetailNotification = ({ id }: { id: number }) => {
    const { closeModal } = useContext(ModalContext);
    const { isMobile } = useThemePage()
    const [notify, setNotify] = useState<Notification>();
    const [booking, setBooking] = useState<Booking>();
    const dispatch = useAppDispatch();
    const { t } = usei18next();
    useEffect(() => {
        NotificationService.getNotification(id).then((data) => {
            //@ts-ignore
            setNotify(data.data)
            dispatch(getUserNotificationInfo())
        })
    }, [id])

    useEffect(() => {
        if (notify?.title === "Có đơn đặt xe mới") {
            // split url to get booking id
            const url = notify?.referenceURL;
            const bookingId = url?.split("/")[url?.split("/").length - 1];
            BookingService.getRentalBookingDetail(bookingId).then((data) => {
                //@ts-ignore
                setBooking(data)
            })
        }
    }, [notify])

    // tính thời gian thuê xe( làm tròn đến nửa ngày)
    const caculateTime = (start: string, end: string) => {
        const startTime = dayjs(start);
        const endTime = dayjs(end);
        const timeInDays = endTime.diff(startTime, 'day', true);
        const roundedTime = Math.round(timeInDays * 2) / 2;
        return roundedTime;
    }

    return (
        <>
            {
                notify?.title === "Có đơn đặt xe mới" ? (
                    <Dialog
                        open={true}
                        onClose={closeModal}
                        TransitionComponent={Transition}
                        fullWidth
                        PaperProps={{ sx: { borderRadius: "16px", padding: '1rem 1.5rem' } }}
                    >
                        <Box height={"10%"} display={"flex"} flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"}>
                            <img style={{ cursor: 'pointer', }} alt="logo" src={LogoHeader} width={"150px"} />
                            <MyIcon icon={<CloseOutlined />} hasTooltip tooltipText={t("postMotorbike.registedForm.badge-close")} onClick={closeModal} position='bottom' />
                        </Box>
                        <DialogTitle
                            sx={{
                                padding: '16px',
                            }}
                        >
                            <Box width={"100%"} sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                                <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                                    <img style={{ cursor: 'pointer', }} alt="logo" src={NewBooking} width={"50px"} />
                                    <Typography variant="h6" fontWeight={'600'} fontSize={"20px"}>{t("booking.haveNewBooking")}</Typography>
                                </Box>
                                <Typography variant="body1" fontStyle={'italic'} fontSize={'12px'} fontWeight={'400'}>{notify?.createDatetime ? getPreviousTimeRelative(notify?.createDatetime, t) : ""}</Typography>
                            </Box>
                        </DialogTitle>
                        <DialogContent sx={{
                            margin: '0px 16px',
                            padding: '16px 0px !important',
                            display: 'flex',
                            flexDirection: 'row',
                            gap: '2rem',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '16px',
                            border: '1px solid #E0E0E0',
                        }}
                        >
                            {/* Thông tin user */}
                            <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} gap={'8px'}>
                                <Avatar size={100} src={booking?.user.avatarUrl} />
                                <Box display={'flex'} flexDirection={'column'} alignItems={'start'} justifyContent={'center'}>
                                    <Typography variant="h6" fontWeight={'700'} fontSize={"16px"}>{booking?.user.name}</Typography>
                                </Box>
                            </Box>
                            {/* Thông tin đơn hàng */}
                            <Box display={'flex'} flexDirection={'column'} alignItems={'start'} justifyContent={'center'} gap={'8px'}>
                                <Typography variant="h6" fontWeight={'400'} fontSize={"14px"}>{t("booking.startDate")}: <span style={{ fontSize: "16px", fontWeight: "600" }}>{dayjs(booking?.startDatetime).format("DD/MM/YYYY HH:mm")}</span></Typography>
                                <Typography variant="h6" fontWeight={'400'} fontSize={"14px"}>{t("booking.endDate")}: <span style={{ fontSize: "16px", fontWeight: "600" }}>{dayjs(booking?.endDatetime).format("DD/MM/YYYY HH:mm")}</span></Typography>
                                <Typography variant="h6" fontWeight={'400'} fontSize={"14px"}>{t("booking.timeRent")}: <span style={{ fontSize: "16px", fontWeight: "600" }}>
                                    {caculateTime(booking?.startDatetime!, booking?.endDatetime!)}
                                </span></Typography>
                                <Typography variant="h6" fontWeight={'400'} fontSize={"14px"}>{t("booking.numberMotorbike")}: <span style={{ fontSize: "16px", fontWeight: "600" }}>
                                    {booking?.motorbikes.length}
                                </span></Typography>
                                <Typography variant="h6" fontWeight={'400'} fontSize={"14px"}>{t("booking.totalPrice")}: <span style={{ fontSize: "16px", fontWeight: "600" }}>
                                    {formatMoneyNew(booking?.totalAmount!)}
                                </span></Typography>
                            </Box>
                        </DialogContent>
                        <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} alignItems={'center'} gap={'8px'} sx={{ padding: '16px' }}>
                            {
                                notify?.referenceURL !== "" &&
                                <a href={notify?.referenceURL}><MyCustomButton content={t("favourite.item.view")} /></a>
                            }
                        </Box>
                    </Dialog>
                ) : (
                    <Dialog
                        open={true}
                        onClose={closeModal}
                        TransitionComponent={Transition}
                        fullWidth
                        PaperProps={{ sx: { borderRadius: "16px", padding: '1rem 1.5rem' } }}
                    >
                        <Box height={"10%"} display={"flex"} flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"}>
                            <img style={{ cursor: 'pointer', }} alt="logo" src={LogoHeader} width={"150px"} />
                            <MyIcon icon={<CloseOutlined />} hasTooltip tooltipText={t("postMotorbike.registedForm.badge-close")} onClick={closeModal} position='bottom' />
                        </Box>
                        <DialogTitle
                            sx={{
                                padding: '16px',
                            }}
                        >
                            <Box width={"100%"} sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'center' : 'start', justifyContent: 'space-between', gap: '8px' }}>
                                <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <img style={{ cursor: 'pointer', }} alt="logo" src={notify?.category.image} width={"50px"} />
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: isMobile ? 'center' : 'start', justifyContent: 'center', gap: '8px' }}>
                                        <Typography variant="h6" fontWeight={'700'}>{notify?.category.categoryName}</Typography>
                                        <Typography fontWeight={'700'}>{notify?.title}</Typography>
                                    </Box>
                                </Box>
                                <Typography variant="body1" fontSize={
                                    '14px'
                                } fontWeight={'400'}>{notify?.createDatetime ? getPreviousTimeRelative(notify?.createDatetime, t) : ""}</Typography>
                            </Box>
                        </DialogTitle>
                        <DialogContent sx={{
                            margin: '0px 16px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            alignItems: 'center',
                            borderRadius: '16px',
                            border: '1px solid #E0E0E0',
                        }}
                        >
                            <Typography variant="body1" fontWeight={'400'}
                                sx={{ textAlign: 'justify', pt: '1rem' }}>{notify?.detail}</Typography>
                            {
                                notify?.referenceURL !== "" &&
                                <a href={notify?.referenceURL}><MyCustomButton content={t("favourite.item.view")} /></a>
                            }
                        </DialogContent>
                    </Dialog>
                )
            }
        </>
    )
}