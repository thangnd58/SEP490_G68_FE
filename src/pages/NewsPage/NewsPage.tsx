import { Box, Typography } from "@mui/material"
import { useNavigate, useParams } from "react-router-dom"
import { News } from "../../utils/type";
import { useState, useEffect } from 'react'
import NewsManagementService from "../../services/NewsManagementService";
import { ROUTES } from "../../utils/Constant";
import useThemePage from "../../hooks/useThemePage";
import usei18next from "../../hooks/usei18next";

export const NewsPage = () => {
    const [listNews, setListNews] = useState<News[]>([])
    const { t } = usei18next();
    const { isMobile } = useThemePage();
    const navigate = useNavigate();
    useEffect(() => {
        NewsManagementService.getAllNews().then((data) => {
            //@ts-ignore
            setListNews(data)
        })
    }, [])

    return (
        <Box p={'48px'}>
            <h1 style={{ textAlign: 'center' }}>{t("homepage.news")}</h1>
            <Box display={'flex'} flexDirection={'column'} gap={'16px'}>
                {
                    listNews && listNews.length > 0 &&
                    listNews.map((news) => {
                        return (
                            <Box display={'flex'} gap={'16px'} color={'text.primary'} alignItems={'flex-start'}>
                                <img src={news.imageUrl} width={'20%'} alt={news.image}
                                    style={{
                                        cursor: 'pointer',
                                        borderRadius: '8px',
                                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                                    }}
                                    onClick={() => navigate(`${ROUTES.newspage}/${news.newsId}`)}
                                />
                                <Box display={'flex'} flexDirection={'column'} gap={'32px'}>
                                    <Typography variant="h5" fontWeight={'700'} fontSize={isMobile ? 16 : 24} color={'primary'} sx={{cursor: 'pointer'}} onClick={() => navigate(`${ROUTES.newspage}/${news.newsId}`)}>{news.title}</Typography>
                                    {
                                        !isMobile && <Typography><div dangerouslySetInnerHTML={{ __html: news.detail.substring(0, 200).concat('...') }}></div></Typography>
                                    }
                                </Box>
                            </Box>
                        )
                    })
                }
            </Box>
        </Box>
    )
}