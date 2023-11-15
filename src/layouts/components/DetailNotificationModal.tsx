import { Box, Dialog, DialogContent, DialogTitle, Typography } from "@mui/material"
import React, { useContext, useState, useEffect } from 'react'
import { ModalContext } from "../../contexts/ModalContext";
import { Transition } from "../../pages/WalletPage/common/Transition";
import { NotificationService } from "../../services/NotificationService";
import { Notification } from "../../utils/type";
import { useAppDispatch } from "../../hooks/useAction";
import { getUserNotificationInfo } from "../../redux/reducers/notificationReducer";

export const DetailNotification = ({ id }: { id: number }) => {
    const { closeModal } = useContext(ModalContext);
    const [notify, setNotify] = useState<Notification>();
    const dispatch = useAppDispatch();
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
            <DialogTitle >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Typography variant="h6" fontWeight={'700'}>{notify?.category.categoryName}</Typography>
                    <Typography fontWeight={'700'}>{notify?.title}</Typography>
                </Box>
            </DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {notify?.detail}
            </DialogContent>
        </Dialog>
    )
}