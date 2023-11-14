import { Box, Divider, Modal, Typography } from "@mui/material"
import theme from "../../../utils/theme"
import useThemePage from "../../../hooks/useThemePage"
import MyIcon from "../../../components/common/MyIcon";
import { CloseOutlined } from "@mui/icons-material";
import usei18next from "../../../hooks/usei18next";
import { useEffect, useState } from "react";
import { PromotionService } from "../../../services/PromotionService";
import { Promotion } from "../../../utils/type";
import { PromotionImage } from "../../../assets/images";
import MyCustomButton from "../../../components/common/MyButton";
import { getCountdownTime } from "../../../utils/helper";

export const PromotionModal = (props: { isModalPromotionOpen: boolean, setModalPromotionOpen: React.Dispatch<React.SetStateAction<boolean>>, counponCode: string, setFieldValue: any, isMobile: boolean }) => {
    const { isModalPromotionOpen, setModalPromotionOpen, counponCode, setFieldValue, isMobile } = props
    const { t } = usei18next()
    const [promotions, setPromotions] = useState<Promotion[]>([])
    useEffect(() => {
        try {
            PromotionService.getAllPromotionValid().then((data) => {
                if (data) {
                    setPromotions(data)
                }
            })
        } catch (error) {

        }
    }, [])
    return (
        <Modal
            open={isModalPromotionOpen}
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
            <Box width={isMobile ? "75%" : "30%"} height={"auto"} sx={{
                padding: "16px 32px",
                backgroundColor: 'white',
                borderRadius: '8px',
            }}>
                <Box width={"100%"} height={"10%"} display={"flex"} flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"}>
                    <Typography variant='h2' color={theme.palette.text.primary} fontSize={isMobile ? "16px" : "24px"} fontWeight={600} textAlign={"start"}>
                        {t("promotion.yourPromo")}
                    </Typography>
                    <Box height={"10%"} display={"flex"} flexDirection={"row"} justifyContent={"flex-end"} alignItems={"center"}>
                        <MyIcon icon={<CloseOutlined />} hasTooltip tooltipText={t("postMotorbike.registedForm.badge-close")} onClick={() => setModalPromotionOpen(false)} position='bottom' />
                    </Box>
                </Box>
                <Divider sx={{ width: "100%", margin: "16px 0px" }} variant="middle" />
                <Box width={"100%"} height={"80%"} display={"flex"} flexDirection={"column"} gap={'8px'} justifyContent={"start"} alignItems={"center"}>
                    {
                        promotions.length > 0 &&
                        promotions.map((promo) => {
                            return (
                                <PromotionItem key={`${promo.id}_${promo.code}`} promotion={promo} promoApply={counponCode} setPromoApply={setFieldValue} />
                            )
                        })
                    }
                </Box>
            </Box>
        </Modal>
    )
}

function PromotionItem({ promotion, promoApply, setPromoApply }: { promotion: Promotion, promoApply: string, setPromoApply: any }) {
    const { t } = usei18next();
    const { isMobile } = useThemePage();
    const [isShow, setShow] = useState<boolean>(false);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <img src={PromotionImage} width={48} height={48} alt='promo' />
                    <Box sx={{ cursor: 'pointer' }} onClick={() => setShow((prev) => !prev)}>
                        <Typography fontSize={isMobile ? '12px' : '16px'} textTransform={'uppercase'}>{promotion.code}</Typography>
                        <Typography fontSize={isMobile ? '10px' : '14px'} sx={{ textDecoration: 'underline' }}>{promotion.title}</Typography>
                        <Typography fontSize={isMobile ? '10px' : '12px'} >{getCountdownTime(promotion.endDate, t)}</Typography>
                    </Box>
                </Box>
                <MyCustomButton disabled={promotion.code === promoApply} fontColor={promotion.code === promoApply ? "white" : ""} height='40px' fontSize={isMobile ? 12 : 16} onClick={() => setPromoApply("couponCode", promotion.code)} content={promotion.code === promoApply ? t("booking.buttonApplyPromotionOk") : t("booking.buttonApplyPromotion")} variant='outlined' />
            </Box >
            {
                isShow &&
                <Box sx={{ p: '8px', border: '1px solid', borderRadius: '8px' }}>
                    <Typography fontSize={isMobile ? '10px' : '14px'}>{promotion.description}</Typography>
                </Box>
            }
        </Box>
    )
}