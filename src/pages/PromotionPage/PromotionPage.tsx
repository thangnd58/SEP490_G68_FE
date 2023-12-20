import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { News, Promotion } from "../../utils/type";
import useThemePage from "../../hooks/useThemePage";
import usei18next from "../../hooks/usei18next";
import MyCustomButton from '../../components/common/MyButton';
import MyIcon from '../../components/common/MyIcon';
import {ArrowBack } from '@mui/icons-material';
import theme from '../../utils/theme';
import { PromotionService } from '../../services/PromotionService';
import { ModalContext } from '../../contexts/ModalContext';
import { DetailPromotion } from './DetailPromotion';

export const PromotionPage = () => {
    const [listPromotion, setListPromotion] = useState<Promotion[]>([]);
    const [visiblePromotion, setVisiblePromotion] = useState<Promotion[]>([]);
    const [itemsPerPage, setItemsPerPage] = useState(5); // Adjust as needed
    const [showMore, setShowMore] = useState(true);
    const { t } = usei18next();
    const { isMobile } = useThemePage();
    const navigate = useNavigate();
    const {openModal} = useContext(ModalContext);

    useEffect(() => {
        PromotionService.getAllPromotionValid().then((data) => {
            //@ts-ignore
            setListPromotion(data);
        });
    }, []);

    useEffect(() => {
        setVisiblePromotion(listPromotion.slice(0, itemsPerPage));
    }, [listPromotion, itemsPerPage]);

    const handleViewMore = () => {
        const nextVisibleNews = listPromotion.slice(0, visiblePromotion.length + itemsPerPage);
        setVisiblePromotion(nextVisibleNews);

        if (nextVisibleNews.length >= listPromotion.length) {
            setShowMore(false);
        }
    };

    const renderNewsList = () => {
        return visiblePromotion.map((promotion) => (
            <Box key={promotion.id} display="flex" gap={2} color="text.primary" alignItems={'center'} width={'100%'} style={{ cursor: 'pointer' }}>
                {/* image */}
                <img
                    src={promotion.imageUrl}
                    width={'20%'}
                    alt={promotion.image}
                    style={{
                        cursor: 'pointer',
                        borderRadius: '8px',
                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                        height: '100%', // Đặt chiều cao của hình ảnh là 100%
                    }}
                onClick={() => openModal(<DetailPromotion id={promotion.id.toString()}/>)}
                />
                {/* news */}
                <Box display={'flex'} flexDirection={'column'} gap={'8px'} width={'80%'} justifyContent={'space-between'} height={'100%'} alignSelf={'stretch'} alignItems={'flex-start'}>
                    {/* information */}
                    <Box display={'flex'} flexDirection={'column'} alignItems={'start'} width={'100%'} justifyContent={'space-between'}>
                        <Typography noWrap={true} maxWidth={isMobile ? '250px' : '100%'} variant="h5" fontWeight={'700'} fontSize={isMobile ? 14 : 24} color={'common.black'} sx={{ cursor: 'pointer' }}
                        onClick={() => openModal(<DetailPromotion id={promotion.id.toString()}/>)}
                        >
                            {promotion.title}
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
                                    dangerouslySetInnerHTML={{ __html: promotion.description.substring(0, 200).concat('...') }}></div>
                            </Typography>
                        }
                    </Box>
                    {/* time */}
                    {/* <Box display={'flex'} alignItems={'center'} gap={'4px'} width={'100%'}>
                        <AccessTime sx={{ color: theme.palette.text.primary, width: isMobile ? '16px' : '20px', height: isMobile ? '16px' : '20px' }} />
                        <Typography fontStyle={'italic'} fontSize={isMobile ? 10 : 14}>{getPreviousTimeRelative(promotion.dateCreated, t)}</Typography>
                    </Box> */}
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
                        {t("homepage.promotion")}
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
