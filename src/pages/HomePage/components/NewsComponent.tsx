import { Box, Grid, ListItem, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { News } from '../../../utils/type'
import usei18next from '../../../hooks/usei18next'
import NewsManagementService from '../../../services/NewsManagementService'
import useThemePage from '../../../hooks/useThemePage'
import { ClockIcon } from '../../../assets/icons'
import { getPreviousTimeRelative } from '../../../utils/helper'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../../utils/Constant'
import MyCustomButton from '../../../components/common/MyButton'
import { ArrowRight, ArrowRightAlt } from '@mui/icons-material'

export default function NewsComponent() {
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
        <Box display={'flex'} flexDirection={'column'} gap={'16px'} alignItems={'center'} justifyContent={'center'} width={'100%'} >
            <h1>{t("homepage.news")}</h1>
            {
                listNews && listNews.length > 0 &&
                <Box mx={isMobile ? '10px' : '50px'} display={'flex'} alignItems={'center'}>
                    <Grid container spacing={2}>
                        <Grid item xs={8} >
                            <Box position={'relative'}
                                onClick={() => navigate(`${ROUTES.newspage}/${listNews[0].newsId}`)}
                            >
                                <img src={listNews[0].imageUrl} width={'100%'} alt={listNews[0].image}
                                    style={{
                                        cursor: 'pointer',
                                        borderRadius: '8px',
                                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                                    }}
                                />
                                <Box
                                    position='absolute'
                                    bottom={'0px'}
                                    style={{
                                        background: 'linear-gradient(rgba(255, 255, 255, 0) 0%, #000000)',
                                        width: '100%',
                                        height: '50%',
                                    }}
                                    borderRadius={'8px'}
                                ></Box>
                                <Box
                                    position={'absolute'}
                                    bottom={'10px'}
                                    left={'10px'}
                                    color={'white'}

                                >
                                    {
                                        !isMobile &&
                                        <Typography variant='h6'>
                                            {listNews[0].title}
                                        </Typography>
                                    }
                                    <Box display={'flex'} gap={'8px'} alignItems={'center'}>
                                        <ClockIcon width={isMobile ? 16 : 24} height={isMobile ? 16 : 24} />
                                        <Typography fontSize={isMobile ? '12px' : '16px'}>{getPreviousTimeRelative(listNews[0].createDatetime, t)}</Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={4} >
                            <Grid container spacing={2} >
                                <Grid item xs={12}>
                                    <Box position={'relative'}
                                        onClick={() => navigate(`${ROUTES.newspage}/${listNews[1].newsId}`)}
                                    >
                                        <img src={listNews[1].imageUrl} width={isMobile ? '93%' : '95.3%'} alt={listNews[1].image}
                                            style={{
                                                cursor: 'pointer',
                                                borderRadius: '8px',
                                                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                                            }}
                                        />
                                        <Box
                                            position='absolute'
                                            bottom={'0px'}
                                            style={{
                                                background: 'linear-gradient(rgba(255, 255, 255, 0) 0%, #000000)',
                                                width: isMobile ? '93%' : '95.3%',
                                                height: '50%',
                                            }}
                                            borderRadius={'8px'}
                                        ></Box>
                                        <Box
                                            position={'absolute'}
                                            bottom={'10px'}
                                            left={'10px'}
                                            color={'white'}

                                        >
                                            {
                                                !isMobile &&
                                                <Typography variant='h6'>
                                                    {listNews[1].title}
                                                </Typography>
                                            }
                                            <Box display={'flex'} gap={'8px'} alignItems={'center'}>
                                                <ClockIcon width={isMobile ? 14 : 24} height={isMobile ? 14 : 24} />
                                                <Typography fontSize={isMobile ? '10px' : '16px'}>{getPreviousTimeRelative(listNews[1].createDatetime, t)}</Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box position={'relative'}
                                        onClick={() => navigate(`${ROUTES.newspage}/${listNews[2].newsId}`)}
                                    >
                                        <img src={listNews[2].imageUrl} width={isMobile ? '93%' : '95.3%'} alt={listNews[2].image}
                                            style={{
                                                cursor: 'pointer',
                                                borderRadius: '8px',
                                                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                                            }}
                                        />
                                        <Box
                                            position='absolute'
                                            bottom={'0px'}
                                            style={{
                                                background: 'linear-gradient(rgba(255, 255, 255, 0) 0%, #000000)',
                                                width: isMobile ? '93%' : '95.3%',
                                                height: '50%',
                                            }}
                                            borderRadius={'8px'}
                                        ></Box>
                                        <Box
                                            position={'absolute'}
                                            bottom={'10px'}
                                            left={'10px'}
                                            color={'white'}

                                        >
                                            {
                                                !isMobile &&
                                                <Typography variant='h6'>
                                                    {listNews[2].title}
                                                </Typography>
                                            }
                                            <Box display={'flex'} gap={'8px'} alignItems={'center'}>
                                                <ClockIcon width={isMobile ? 14 : 24} height={isMobile ? 14 : 24} />
                                                <Typography fontSize={isMobile ? '10px' : '16px'}>{getPreviousTimeRelative(listNews[2].createDatetime, t)}</Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            }
            <MyCustomButton content='Tìm hiểu thêm' icon={<ArrowRightAlt style={{color: '#FFFFFF'}} />} iconPosition='right' />
        </Box>
    )
}
