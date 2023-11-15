import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { News } from "../../utils/type";
import NewsManagementService from "../../services/NewsManagementService";
import { ROUTES } from "../../utils/Constant";
import useThemePage from "../../hooks/useThemePage";
import usei18next from "../../hooks/usei18next";
import MyCustomButton from '../../components/common/MyButton';
import { getPreviousTimeRelative } from '../../utils/helper';

export const NewsPage = () => {
    const [listNews, setListNews] = useState<News[]>([]);
    const [visibleNews, setVisibleNews] = useState<News[]>([]);
    const [itemsPerPage, setItemsPerPage] = useState(5); // Adjust as needed
    const [showMore, setShowMore] = useState(true);
    const { t } = usei18next();
    const { isMobile } = useThemePage();
    const navigate = useNavigate();

    useEffect(() => {
        NewsManagementService.getAllNews().then((data) => {
            //@ts-ignore
            setListNews(data);
        });
    }, []);

    useEffect(() => {
        setVisibleNews(listNews.slice(0, itemsPerPage));
    }, [listNews, itemsPerPage]);

    const handleViewMore = () => {
        const nextVisibleNews = listNews.slice(0, visibleNews.length + itemsPerPage);
        setVisibleNews(nextVisibleNews);

        if (nextVisibleNews.length >= listNews.length) {
            setShowMore(false);
        }
    };

    const renderNewsList = () => {
        return visibleNews.map((news) => (
            <Box position={'relative'} key={news.newsId} display="flex" gap={2} color="text.primary" alignItems="flex-start">
                <img src={news.imageUrl} width={'20%'} alt={news.image}
                    style={{
                        cursor: 'pointer',
                        borderRadius: '8px',
                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                    }}
                    onClick={() => navigate(`${ROUTES.newspage}/${news.newsId}`)}
                />
                <Box display={'flex'} flexDirection={'column'}>
                    <Typography noWrap={isMobile ? true : false} width={'60%'} position={'absolute'} top={'0'} variant="h5" fontWeight={'700'} fontSize={isMobile ? 14 : 24} color={'primary'} sx={{ cursor: 'pointer' }} onClick={() => navigate(`${ROUTES.newspage}/${news.newsId}`)}>{news.title}</Typography>
                    {
                        !isMobile && <Typography position={'absolute'} top={'10%'}><div dangerouslySetInnerHTML={{ __html: news.detail.substring(0, 200).concat('...') }}></div></Typography>
                    }
                    <Typography position={'absolute'} bottom={'0'} fontSize={isMobile ? 10 : 16}>{getPreviousTimeRelative(news.createDatetime, t)}</Typography>
                </Box>
            </Box>
        ));
    };

    return (
        <Box p={'48px'}>
            <h1 style={{ textAlign: 'center' }}>{t("homepage.news")}</h1>
            <Box display={'flex'} flexDirection={'column'} gap={'16px'}>
                {renderNewsList()}
                {showMore && (
                    <MyCustomButton variant="outlined" onClick={handleViewMore} content={t('dashBoardManager.news.viewsMore')} width={isMobile ? "90%" : "20%"} />
                )}
            </Box>
        </Box>
    );
};
