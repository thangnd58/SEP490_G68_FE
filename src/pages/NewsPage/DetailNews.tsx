import { Box, Typography } from "@mui/material"
import { useNavigate, useParams } from "react-router-dom"
import { News } from "../../utils/type";
import { useState, useEffect } from 'react'
import NewsManagementService from "../../services/NewsManagementService";
import { ROUTES } from "../../utils/Constant";
import useThemePage from "../../hooks/useThemePage";

export const DetailNews = () => {
    const { id } = useParams();
    const [news, setNews] = useState<News>();
    const navigate = useNavigate();
    const { isMobile } = useThemePage();
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
                <Box display={'flex'} flexDirection={'column'} gap={'8px'} p={'48px'} color={'text.primary'}>
                    <Box display={'flex'} gap={'8px'} alignItems={'center'}>
                        <Typography variant="h4" fontWeight={'700'}>{news.title}</Typography>
                        <Typography sx={{ backgroundColor: 'primary.main', color: 'common.white', p: '8px', borderRadius: '32px' }}>{news.category}</Typography>
                    </Box>
                    <Box display={'flex'} justifyContent={'center'} height={isMobile ? "" : "70vh"} marginBottom={'24px'}>
                        <img src={news.imageUrl} width={'100%'} height={'100%'} alt={news.image}
                            style={{
                                cursor: 'pointer',
                                borderRadius: '8px',
                                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                                margin: '24px 0px',
                                objectFit: 'cover'
                            }}
                        />
                    </Box>
                    <Typography>
                        <div dangerouslySetInnerHTML={{ __html: news.detail || "" }}></div>
                    </Typography>
                </Box>
            }
        </>
    )
}