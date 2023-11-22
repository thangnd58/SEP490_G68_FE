import { Box, Skeleton, Typography } from "@mui/material"
import useThemePage from "../../hooks/useThemePage";
import MyIcon from "../../components/common/MyIcon";
import { ArrowBack } from "@mui/icons-material";
import theme from "../../utils/theme";
import usei18next from "../../hooks/usei18next";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from 'react'
import { News } from "../../utils/type";
import NewsManagementService from "../../services/NewsManagementService";
import { CategoryNews } from "../../utils/Constant";
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { PolicyImage } from "../../assets/images";

export const PolicyPage = () => {
    const { id } = useParams();
    const [listNews, setListNews] = useState<News[]>([]);
    const { isMobile } = useThemePage();
    const { t } = usei18next();
    const navigate = useNavigate();
    const [selectedNews, setSelectedNews] = useState<News>();

    useEffect(() => {
        NewsManagementService.getAllNews().then((data) => {
            //@ts-ignore
            setListNews(data.filter((n) => n.category === CategoryNews.policy));
        });
    }, []);


    useEffect(() => {
        NewsManagementService.getNewsById(id!).then((data) => {
            //@ts-ignore
            setSelectedNews(data);
        });
    }, [id]);
    const [imageLoaded, setImageLoaded] = useState(false);

    const handleImageLoad = () => {
        setImageLoaded(true);
    };


    return (
        <Box display={'flex'} flexDirection={'column'} gap={'8px'} p={isMobile ? '32px 16px' : '32px 128px'} color={'text.primary'}>
            <Box display={'flex'} flexDirection={'row'} gap={'4px'} alignItems={'center'}>
                <MyIcon icon={<ArrowBack style={{ color: theme.palette.common.black }} />} hasTooltip tooltipText={t("postMotorbike.registedForm.badge-back")} onClick={() => navigate(-1)} position='bottom' />
                <Typography variant="h4" fontSize={isMobile ? '20px' : '32px'} fontWeight={'700'} textAlign={'center'}>{selectedNews?.title}</Typography>
            </Box>
            <Box sx={{
                    position: 'relative', margin: '24px 0px', }} height={isMobile ? "" : "70vh"} >
                <img src={PolicyImage} width={'100%'} height={'100%'} alt={"banner"}
                    style={{
                        borderRadius: '8px',
                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                        objectFit: 'cover',
                    }}
                    onLoad={handleImageLoad}
                />
                {!imageLoaded && (
                    <Skeleton
                        variant="rounded"
                        width={'100%'}
                        height={'100%'}
                        animation="wave"
                    />
                )}
                <Typography
                    variant="h5"
                    align="center"
                    fontWeight="bold"
                    fontSize={"48px"}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: 'white', // Thêm màu chữ tùy ý
                        zIndex: 1, // Đảm bảo tiêu đề hiển thị trên lớp mờ
                    }}
                >
                    Policy
                </Typography>
            </Box>
            <Box>
                <BottomNavigation
                    sx={{
                        '& .MuiBottomNavigationAction-root': {
                            minWidth: 'unset',
                            maxWidth: 'unset',
                            padding: '0px',
                            margin: '0px',
                            height: isMobile ? 'auto' : 'unset',
                        },
                        display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row',
                    }}
                    showLabels
                    value={selectedNews?.newsId}
                    onChange={(event, newValue) => {
                        setSelectedNews(listNews.find((n) => n.newsId === newValue));
                    }}
                >
                    {
                        listNews && listNews.length > 0 &&
                        listNews.map((n, index) => {
                            return (
                                <BottomNavigationAction sx={{
                                    borderRadius: '8px',
                                    backgroundColor: selectedNews?.newsId === n.newsId ? "rgb(139,69,13,0.1)" : theme.palette.common.white,
                                    minHeight: isMobile ? '48px' : 'unset',
                                    '& .MuiBottomNavigationAction-label': {
                                        fontSize: '16px',
                                        fontWeight: selectedNews?.newsId === n.newsId ? 'bold' : 'normal',
                                        color: selectedNews?.newsId === n.newsId ? theme.palette.primary.main : theme.palette.text.primary,
                                        whiteSpace: 'nowrap',
                                        '&:hover': {
                                            transition: 'all 0.3s ease',
                                            color: theme.palette.primary.main,
                                            fontWeight: 'bold',
                                            transform: 'scale(1.1)'
                                        }
                                    },
                                }} key={index} label={n.title} value={n.newsId} />
                            )
                        })
                    }
                </BottomNavigation>
            </Box>
            <Typography>
                <div style={{ textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: selectedNews?.detail || "" }}></div>
            </Typography>
        </Box>
    )
}