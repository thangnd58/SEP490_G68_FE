import React, { useContext, useEffect, useState } from 'react';
import { Avatar, Box, Chip, FormControl, Paper, Select, Typography, Button, Tooltip } from '@mui/material';
import usei18next from '../../hooks/usei18next';
import theme from '../../utils/theme'
import useThemePage from '../../hooks/useThemePage';
import PlaceIcon from '@mui/icons-material/Place';
import IconButton from '@mui/material/IconButton';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { useAppDispatch, useAppSelector, } from '../../hooks/useAction';
import { getUserFavouriteInfo } from '../../redux/reducers/userFavouriteReducer';
import MotorbikeInforCard from '../HomePage/components/MotorbikeInforCard';
import { Motorbike, UserFavourite } from '../../utils/type';
import MotorbikeFavouriteInforCard from './components/MotorbikeFavouriteInforCard';
import UserService from '../../services/UserService';
import ToastComponent from '../../components/toast/ToastComponent';

const FavouritePage = () => {
    const { t } = usei18next();
    const { isMobile } = useThemePage();
    const { userFavourite } = useAppSelector((state) => state.userFavouriteInfo);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getUserFavouriteInfo());
    }, [])

    const deleteFavourite = async (id: number) => {
        try {
            const response = await UserService.deleteFavourite(id);
            if (response.status === 200) {
                dispatch(getUserFavouriteInfo());
                ToastComponent(t("toast.favourite.delete.success"), "success");
            } else {
                ToastComponent(t("toast.favourite.delete.warning"), "warning");
            }
        } catch (error) {
            ToastComponent(t("toast.favourite.delete.error"), "error");
        }
    }
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
                        {userFavourite.map((item: UserFavourite) => (
                            <MotorbikeFavouriteInforCard motorbike={item.motorbike!}/>
                        ))}
                    </Box>
                </Box>
            </Paper>

        </Box>
    );
};

export default FavouritePage;