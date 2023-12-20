import { Avatar, Box, Dialog, DialogContent, DialogTitle, Typography } from "@mui/material"
import { useNavigate, useParams } from "react-router-dom"
import { News, Promotion } from "../../utils/type";
import { useState, useEffect, useContext } from 'react'
import NewsManagementService from "../../services/NewsManagementService";
import { ROUTES } from "../../utils/Constant";
import useThemePage from "../../hooks/useThemePage";
import MyIcon from "../../components/common/MyIcon";
import { ArrowBack, CloseOutlined } from "@mui/icons-material";
import theme from "../../utils/theme";
import usei18next from "../../hooks/usei18next";
import { PromotionService } from "../../services/PromotionService";
import { Transition } from "../WalletPage/common/Transition";
import { ModalContext } from "../../contexts/ModalContext";
import { LogoHeader } from "../../assets/images";

export const DetailPromotion = (props: { id: string }) => {
    const [promotion, setPromotion] = useState<Promotion>();
    const { id } = props;
    const { isMobile } = useThemePage();
    const { t } = usei18next();
    const { closeModal } = useContext(ModalContext);
    useEffect(() => {
        try {
            PromotionService.getPromotionById(id).then((data) => {
                setPromotion(data)
            })
        } catch (error) {
        }
    }, [id])

    return (
        <>
            <Dialog
                open={true}
                onClose={closeModal}
                TransitionComponent={Transition}
                sx={{
                    margin: '0px',
                }}
                PaperProps={{
                    sx: {
                        borderRadius: "16px", padding: isMobile ? '0.5rem 0.5rem' : '1rem 1.5rem', margin: '0px 16px',
                    }
                }}
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
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '8px' }} width={'100%'}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }} width={'100%'}>
                                <Typography fontWeight={'700'}>{promotion?.title}</Typography>
                                <Avatar src={promotion?.imageUrl} sx={{ width: '200px', height: '200px' }} variant="rounded" />
                            </Box>
                        </Box>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{
                    margin: isMobile ? '0px 0px' : '0px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    borderRadius: '16px',
                    border: '1px solid #E0E0E0',
                }}
                >
                    <Typography>
                        <div style={{ textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: promotion?.description || "" }}></div>
                    </Typography>
                </DialogContent>
            </Dialog>

        </>
    )
}
