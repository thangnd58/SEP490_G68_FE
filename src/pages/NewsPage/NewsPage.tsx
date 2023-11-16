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
import MyIcon from '../../components/common/MyIcon';
import { AccessTime, ArrowBack } from '@mui/icons-material';
import theme from '../../utils/theme';

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
            <Box key={news.newsId} display="flex" gap={2} color="text.primary" alignItems={'center'} width={'100%'} style={{ cursor: 'pointer' }}>
                {/* image */}
                <img
                    src={news.imageUrl}
                    width={'20%'}
                    alt={news.image}
                    style={{
                        cursor: 'pointer',
                        borderRadius: '8px',
                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                        height: '100%', // Đặt chiều cao của hình ảnh là 100%
                    }}
                    onClick={() => navigate(`${ROUTES.newspage}/${news.newsId}`)}
                />
                {/* news */}
                <Box display={'flex'} flexDirection={'column'} gap={'8px'} width={'80%'} justifyContent={'space-between'} height={'100%'} alignSelf={'stretch'} alignItems={'flex-start'}>
                    {/* information */}
                    <Box display={'flex'} flexDirection={'column'} alignItems={'start'} width={'100%'} justifyContent={'space-between'}>
                        <Typography noWrap={true} maxWidth={isMobile ? '250px' : '100%'} variant="h5" fontWeight={'700'} fontSize={isMobile ? 14 : 24} color={'common.black'} sx={{ cursor: 'pointer' }} onClick={() => navigate(`${ROUTES.newspage}/${news.newsId}`)}>
                            {news.title}
                        </Typography>
                        {
                            !isMobile && <Typography
                                style={{ margin: '0px 0px' }}
                                color={theme.palette.text.secondary}
                                fontSize={'14px'}>
                                <div
                                    style={{
                                        textAlign: 'justify',
                                        textOverflow: 'ellipsis',
                                        overflow: 'hidden',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                    }}
                                    dangerouslySetInnerHTML={{ __html: news.detail.substring(0, 200).concat('...') }}></div>
                            </Typography>
                        }
                    </Box>
                    {/* time */}
                    <Box display={'flex'} alignItems={'center'} gap={'4px'} width={'100%'}>
                        <AccessTime sx={{ color: theme.palette.text.primary, width: isMobile ? '16px' : '20px', height: isMobile ? '16px' : '20px' }} />
                        <Typography fontStyle={'italic'} fontSize={isMobile ? 10 : 14}>{getPreviousTimeRelative(news.createDatetime, t)}</Typography>
                    </Box>
                </Box>
            </Box>
        ));
    };

    return (
        <Box p={isMobile ? '16px' : '32px 128px'}>

            <Box width={"100%"} display={'flex'} flexDirection={'column'} gap={isMobile ? '16px' : '32px'}>
                <Box display={'flex'} justifyContent={'start'} alignItems={'center'} width={"100%"}>
                    <MyIcon icon={<ArrowBack style={{ color: theme.palette.common.black }} />} hasTooltip tooltipText={t("postMotorbike.registedForm.badge-back")} onClick={() => navigate(-1)} position='bottom' />
                    <Typography sx={{ color: "#000", fontSize: isMobile ? '24px' : '32px', fontWeight: '700', textAlign: 'center', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                        {t("homepage.news")}
                    </Typography>
                </Box>
                <Box display={'flex'} flexDirection={'column'} gap={'16px'} width={"100%"}>
                    {renderNewsList()}
                    {showMore && (
                        <MyCustomButton height='32px' onClick={handleViewMore} content={"..."} width={isMobile ? "100%" : "20%"} />
                    )}
                </Box>
            </Box>
        </Box>
    );
};
