import React, { useContext, useEffect, useState } from 'react';
import { Box, Chip, FormControl, Paper, Select, Typography, Button, Tooltip, CircularProgress, LinearProgress } from '@mui/material';
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
    const [isLoad, setIsLoad] = useState<boolean>(true);

    useEffect(() => {
        setIsLoad(true);
        // wait 1s to show loading
        setTimeout(() => {
            setIsLoad(false);
        }, 200);
    }, []);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    return (
        <Box display={'flex'} flexDirection={'row'} margin={'32px auto'} borderRadius={'8px'} justifyContent={'center'}>
            <Paper elevation={2} sx={{ width: isMobile ? '90%' : '90%' }}>

                <Box
                    alignContent={'center'}
                    display={"flex"}
                    padding={isMobile ? "8px 0px" : "32px"}
                    flexDirection={"column"}>
                    {/* Title */}
                    <Typography
                        variant='h1'
                        color={theme.palette.text.primary}
                        fontSize={isMobile ? "24px" : "32px"}
                        lineHeight={isMobile ? "48px" : "60px"}
                        fontWeight={"600"}
                        sx={{ textAlign: 'center' }}>
                        {t("favourite.title")}
                    </Typography>

                    {/* Item List*/}
                    <Box display={'flex'} flexDirection={"row"} flexWrap={'wrap'} justifyContent={'space-evenly'} >
                        {
                            isDeleting &&
                            <LinearProgress sx={{ marginTop: isMobile ? "16px" : "32px", width: isMobile ? '100%' : '70%' }} />
                        }
                        {/* check rỗng */}
                        {isLoad ? (
                            <Box width={"100%"} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '8px' }}>
                                <CircularProgress />
                            </Box>
                        ) : (

                            userFavourite.length === 0 ? (
                                <Box width={"100%"} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '8px' }}>
                                    <img src={NoDataImage} alt={"no-data"} width={isMobile ? "200px" : "400px"} height={isMobile ? "200px" : "400px"} />
                                </Box>
                            ) : (
                                userFavourite.map((item: UserFavourite) => (
                                    <MotorbikeFavouriteInforCard setIsDeleting={setIsDeleting} motorbike={item.motorbike!} />
                                ))))}
                    </Box>
                </Box>
            </Paper>

        </Box>
    );
};

export default FavouritePage;