import { Box, Grid, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { Motorbike } from '../../../utils/type';
import usei18next from '../../../hooks/usei18next';
import { useNavigate } from 'react-router-dom';
import useThemePage from '../../../hooks/useThemePage';
import MotorbikeInforCard from './MotorbikeInforCard';
import { HomePageService } from '../../../services/HomePageService';

export default function HotMotorbikesOfMonthComponent() {
    const { isMobile } = useThemePage();
    const navigate = useNavigate();
    const { t } = usei18next();
    const [hotMotorbikes, setHotMotorbikes] = React.useState<Motorbike[]>([]);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            const dataMotorbike = await HomePageService.getListPopularMotorbike();
            if (dataMotorbike) {
                setHotMotorbikes(dataMotorbike);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'} width={'100%'}
            sx={{
                backgroundColor: '#f1f1f1',
            }}>
            <Box
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
                justifyContent={'start'}
                gap={'8px'}
                width={'100%'}
                padding={isMobile ? "16px 0px" : "32px 64px"}
            >
                <Typography sx={{
                    fontSize: isMobile ? '24px' : '32px',
                    fontWeight: 'bold',
                    color: 'common.black',
                }}>{t("editional.hotmotorbikes")}</Typography>
                {/* list motorbikes */}
                {
                    <Box sx={{
                        minHeight: '65vh',
                        width: '100%',
                        display: 'flex',
                    }} alignItems={'center'} justifyContent={'center'}
                    >
                        <Grid
                            width={"100%"}
                            container
                            columnSpacing={{ xs: 1, sm: 1, md: 1 }}
                            rowSpacing={{ xs: 1, sm: 2, md: 3 }}
                        >
                            {hotMotorbikes.map((item: Motorbike, index: number) => (
                                <Grid key={index} item xs={12} sm={6} md={4} lg={3} xl={3} sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <MotorbikeInforCard canClickDetailPage motorbike={item} isFavoritePage={false} isIntroduced={true} />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                }
            </Box>
        </Box>
    )
}
