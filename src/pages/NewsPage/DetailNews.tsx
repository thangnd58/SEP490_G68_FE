import { Box, Typography } from "@mui/material"
import { useNavigate, useParams } from "react-router-dom"
import { News } from "../../utils/type";
import { useState, useEffect } from 'react'
import NewsManagementService from "../../services/NewsManagementService";
import { ROUTES } from "../../utils/Constant";
import useThemePage from "../../hooks/useThemePage";
import MyIcon from "../../components/common/MyIcon";
import { ArrowBack } from "@mui/icons-material";
import theme from "../../utils/theme";
import usei18next from "../../hooks/usei18next";

export const DetailNews = () => {
    const { id } = useParams();
    const [news, setNews] = useState<News>();
    const navigate = useNavigate();
    const { isMobile } = useThemePage();
    const { t } = usei18next();
    useEffect(() => {
        try {
            NewsManagementService.getNewsById(id || "").then((data) => {
                setNews(data)
            })
        } catch (error) {
            navigate(ROUTES.other.pagenotfound)
        }
    }, [id])

    return (
        <>
            {
                news &&
                <Box display={'flex'} flexDirection={'column'} gap={'8px'} p={isMobile ? '32px 16px' : '32px 128px'} color={'text.primary'}>
                    <Box display={'flex'} flexDirection={'row'} gap={'4px'} alignItems={isMobile ? 'start' : 'center'}>
                        <MyIcon icon={<ArrowBack style={{ color: theme.palette.common.black }} />} hasTooltip tooltipText={t("postMotorbike.registedForm.badge-back")} onClick={() => navigate(-1)} position='bottom' />
                        <Typography variant="h4" fontSize={isMobile ? '20px' : '32px'} fontWeight={'700'} textAlign={'center'}>{news.title}</Typography>
                        {/* <Typography sx={{ backgroundColor: 'primary.main', color: 'common.white', p: '8px', borderRadius: '32px' }}>{news.category}</Typography> */}
                    </Box>
                    <Box display={'flex'} justifyContent={'center'} height={isMobile ? "" : "70vh"} marginBottom={'24px'}>
                        <img src={news.imageUrl} width={'100%'} height={'100%'} alt={news.image}
                            style={{
                                borderRadius: '8px',
                                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                                margin: '24px 0px',
                                objectFit: 'cover'
                            }}
                        />
                    </Box>
                    <Typography>
                        <div style={{ textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: news.detail || "" }}></div>
                    </Typography>
                </Box>
            }
        </>
    )
}
