import { Box, Dialog, DialogContent, DialogTitle, Typography } from "@mui/material"
import React, { useContext, useState, useEffect } from 'react'
import { ModalContext } from "../../contexts/ModalContext";
import { Transition } from "../../pages/WalletPage/common/Transition";
import { NotificationService } from "../../services/NotificationService";
import { Notification } from "../../utils/type";
import { useAppDispatch } from "../../hooks/useAction";
import { getUserNotificationInfo } from "../../redux/reducers/notificationReducer";
import MyIcon from "../../components/common/MyIcon";
import { CloseOutlined } from "@mui/icons-material";
import usei18next from "../../hooks/usei18next";
import { LogoHeader } from "../../assets/images";
import { getPreviousTimeRelative } from "../../utils/helper";

export const DetailNotification = ({ id }: { id: number }) => {
    const { closeModal } = useContext(ModalContext);
    const [notify, setNotify] = useState<Notification>();
    const dispatch = useAppDispatch();
    const { t } = usei18next();
    useEffect(() => {
        NotificationService.getNotification(id).then((data) => {
            //@ts-ignore
            setNotify(data.data)
            dispatch(getUserNotificationInfo())
        })
    }, [id])

    return (
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
                <Box width={"100%"} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'start', justifyContent: 'space-between', gap: '8px' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <img style={{ cursor: 'pointer', }} alt="logo" src={notify?.category.image} width={"50px"} />
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'center', gap: '8px' }}>
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
                    sx={{ textAlign: 'center', pt: '1rem' }}
                >{notify?.detail}</Typography>
            </DialogContent>
        </Dialog>
    )
}