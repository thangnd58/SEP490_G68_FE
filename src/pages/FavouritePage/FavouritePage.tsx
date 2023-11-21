import React, { useContext, useEffect, useState } from 'react';
import { Box, Chip, FormControl, Paper, Select, Typography, Button, Tooltip } from '@mui/material';
import usei18next from '../../hooks/usei18next';
import theme from '../../utils/theme'
import useThemePage from '../../hooks/useThemePage';
import { useAppDispatch, useAppSelector, } from '../../hooks/useAction';
import { getUserFavouriteInfo } from '../../redux/reducers/userFavouriteReducer';
import { UserFavourite } from '../../utils/type';
import MotorbikeFavouriteInforCard from './components/MotorbikeFavouriteInforCard';
import { NoDataImage } from '../../assets/images';

const FavouritePage = () => {
    const { t } = usei18next();
    const { isMobile } = useThemePage();
    const { userFavourite } = useAppSelector((state) => state.userFavouriteInfo);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getUserFavouriteInfo());
        console.log(userFavourite);
    }, [])

    return (
        <Box display={'flex'} flexDirection={'row'} margin={'32px auto'} borderRadius={'8px'} justifyContent={'center'}>
            <Paper elevation={2} sx={{ width: isMobile ? '90%' : '90%' }}>

                <Box
                    alignContent={'center'}
                    display={"flex"}
                    padding={isMobile ? "32px 0px" : "32px"}
                    flexDirection={"column"}>
                    {/* Title */}
                    <Typography
                        variant='h1'
                        color={theme.palette.text.primary}
                        fontSize={isMobile ? "24px" : "32px"}
                        lineHeight={"40px"}
                        fontWeight={"600"}
                        sx={{ textAlign: 'center' }}>
                        {t("favourite.title")}
                    </Typography>

                    {/* Item List*/}
                    <Box display={'flex'} flexDirection={"row"} flexWrap={'wrap'} justifyContent={'space-evenly'} >

                        {/* check rỗng */}
                        {userFavourite.length === 0 && (
                            <Box width={"100%"} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '8px' }}>
                                <img src={NoDataImage} alt="image" style={{ width: '400px', height: '400px' }} />
                            </Box>
                        )}
                        {userFavourite.map((item: UserFavourite) => (
                            <MotorbikeFavouriteInforCard motorbike={item.motorbike!} />
                        ))}
                    </Box>
                </Box>
            </Paper>

        </Box>
    );
};

export default FavouritePage;