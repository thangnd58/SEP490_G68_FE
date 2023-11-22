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
import dayjs from 'dayjs';
import { useNavigate } from "react-router-dom";


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
            onClose={() => setModalPromotionOpen(false)}
            open={isModalPromotionOpen}
            aria-labelledby="map-modal-title"
            aria-describedby="map-modal-description"
            sx={{
                display: 'flex',
                alignItems: 'start',
                justifyContent: 'center',
                overflowY: 'auto',
                margin: "64px 0px",
                borderRadius: '8px',
            }}
        >
            <Box width={isMobile ? "75%" : "40%"} height={"auto"} sx={{
                backgroundColor: 'white',
                borderRadius: '8px',
            }}>
                <Box
                    position={'sticky'}
                    top={0}
                    sx={{ backgroundColor: '#fff' }}
                    height={"10%"}
                    display={"flex"}
                    flexDirection={"row"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                    padding={"16px 32px"}
                    borderRadius={"8px 8px 0px 0px"}
                    zIndex={1}
                >
                    <Typography variant='h2' color={theme.palette.text.primary} fontSize={isMobile ? "16px" : "20px"} fontWeight={700} textAlign={"start"}>
                        {t("promotion.yourPromo")}
                    </Typography>
                    <Box height={"10%"} display={"flex"} flexDirection={"row"} justifyContent={"flex-end"} alignItems={"center"}>
                        <MyIcon icon={<CloseOutlined />} hasTooltip tooltipText={t("postMotorbike.registedForm.badge-close")} onClick={() => setModalPromotionOpen(false)} position='bottom' />
                    </Box>
                </Box>
                <Divider
                    sx={{ margin: "0px 16px" }} variant="middle" />
                <Box padding={"16px 32px"}
                    height={"80%"} display={"flex"} flexDirection={"column"} gap={'8px'} justifyContent={"start"} alignItems={"center"}>
                    {
                        promotions.length > 0 &&
                        promotions.map((promo) => {
                            return (
                                <PromotionItem key={`${promo.id}_${promo.code}`} promotion={promo} promoApply={counponCode} setPromoApply={setFieldValue} setModalPromotionOpen={setModalPromotionOpen} />
                            )
                        })
                    }
                </Box>
            </Box>
        </Modal>
    )
}

function PromotionItem({ promotion, promoApply, setPromoApply, setModalPromotionOpen }: { promotion: Promotion, promoApply: string, setPromoApply: any,setModalPromotionOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
    const { t } = usei18next();
    const { isMobile } = useThemePage();
    const [isShow, setShow] = useState<boolean>(false);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', }} border={'1px solid #e0e0e0'} borderRadius={'8px'} padding={'8px'} margin={'8px 0px'}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <Box width="80%" sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <img src={PromotionImage} width={48} height={48} alt='promo' />
                    <Box sx={{ cursor: 'pointer' }} onClick={() => setShow((prev) => !prev)}>
                        <Typography fontWeight={700} color={theme.palette.text.primary} fontSize={isMobile ? '14px' : '16px'} textTransform={'uppercase'}>{promotion.code}</Typography>
                        <Typography fontWeight={400} color={theme.palette.text.primary} fontSize={isMobile ? '12px' : '14px'} sx={{}}>
                            {promotion.title.substring(0, 50) + '...'}
                        </Typography>
                        <Typography fontSize={isMobile ? '10px' : '12px'} >{getCountdownTime(promotion.endDate, t)}</Typography>
                    </Box>
                </Box>
                <MyCustomButton width="20%" disabled={promotion.code === promoApply} fontColor={promotion.code === promoApply ? "white" : ""} height='40px' fontSize={isMobile ? 12 : 14} onClick={() => {
                    setPromoApply("couponCode", promotion.code);
                    // đóng modal
                    setModalPromotionOpen(false);
            }} content={promotion.code === promoApply ? t("booking.buttonApplyPromotionOk") : t("booking.buttonApplyPromotion")} />
            </Box >
            {
                isShow &&
                <Box sx={{ p: '8px', border: '3px solid', borderRadius: '8px', margin: "8px 0px 4px 0px" }} display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
                    <img src={PromotionImage} width={48} height={48} alt='promo' />
                    <Typography fontWeight={700} color={theme.palette.text.primary} fontSize={isMobile ? '14px' : '16px'} textTransform={'uppercase'}>{promotion.code}</Typography>
                    {/* Thời gian áp dụng từ ngày ... - ... */}
                    <Typography fontWeight={400} color={theme.palette.text.primary} fontSize={isMobile ? '12px' : '14px'} sx={{}}>{t("promotion.applyTime")}: {dayjs(promotion.startDate).format("DD/MM/YYYY")} - {dayjs(promotion.endDate).format("DD/MM/YYYY")}</Typography>
                    {/* title */}
                    <Typography fontWeight={500} textAlign={"center"} color={theme.palette.text.primary} fontSize={isMobile ? '12px' : '14px'} sx={{}}>{promotion.title}</Typography>
                    {/* description */}
                    <Typography
                        style={{ margin: '0px auto' }}
                        color={theme.palette.text.primary}
                        fontSize={'12px'}>
                        <div
                            dangerouslySetInnerHTML={{ __html: promotion.description }}></div>
                    </Typography>
                    {/* <Typography color={theme.palette.text.primary} fontSize={isMobile ? '12px' : '14px'}>{promotion.description}</Typography> */}
                </Box>
            }
        </Box>
    )
}