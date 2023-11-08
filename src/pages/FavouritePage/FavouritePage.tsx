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
    // const motorbike: Motorbike = {
    //     id: 1,
    //     address: "Hà Nội",
    //     description: "Xe đẹp",
    //     fuelConsumption: 1,
    //     imageUrl: ["https://i.ytimg.com/vi/6JiWnYmVjWU/maxresdefault.jpg"],
    //     model: {
    //         brand: {
    //             brandName: "Honda",
    //             id: 1,
    //             brandImage: ''
    //         },
    //         id: 1,
    //         modelName: "Air Blade",
    //         modelImage: ''
    //     },
    //     priceRent: 100,
    //     user: {
    //         avatarUrl: "https://i.ytimg.com/vi/6JiWnYmVjWU/maxresdefault.jpg",
    //         name: "Nguyễn Văn A",
    //         userId: 0,
    //         email: '',
    //         phone: '',
    //         gender: '',
    //         dob: '',
    //         address: '',
    //         avatar: '',
    //         phoneVerified: false,
    //         balance: 0,
    //         googleIdentity: '',
    //         role: {
    //             roleId: 0,
    //             roleName: '',
    //             deleted: false,
    //             createDatetime: '',
    //             updateDatetime: '',
    //             createUserId: 0,
    //             updateUserId: 0
    //         }
    //     },
    //     licensePlate: '',
    //     releaseYear: 0,
    //     type: '',
    //     equipments: '',
    //     provinceId: 0,
    //     districtId: 0,
    //     wardId: 0,
    //     image: '',
    //     location: '',
    //     status: '',
    //     statusComment: '',
    //     createDatetime: '',
    //     miscellaneous: '',
    //     distance: 0,
    //     isFavourite: false
    // }

    useEffect(() => {
        dispatch(getUserFavouriteInfo());
        // if (userFavourite) {
        //     userFavourite.map((item: any) => console.log(item));
        //     console.log('du lieu');
        //   } else {
        //     console.log('Dữ liệu không tồn tại');
        //   }
    }, [])


    


    return (
        <Box display={'flex'} flexDirection={'row'} margin={'32px auto'} borderRadius={'8px'} justifyContent={'center'}>
            <Paper elevation={2} sx={{ width: isMobile ? '98%' : '90%' }}>

                <Box
                    alignContent={'center'}
                    display={"flex"}
                    padding={isMobile ? "16px" : "32px"}
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

                    {/* Select sort*/}
                    <Box display={"flex"} flexDirection={"row"} justifyContent={"end"} alignContent={"center"} marginBottom={"8px"}>
                        <Typography fontSize={"18px"} fontWeight={"400"}
                            margin={"auto 8px"}>{t("favourite.sort.title")}</Typography>
                        <FormControl sx={{ minWidth: 120 }} size="small">
                            <Select
                                labelId="demo-select-small-label"
                                id="demo-select-small"
                                value={'Ngày'}
                                native
                                displayEmpty
                            // onChange={handleChangeStatus}
                            >
                                <option value={"date"}>
                                    <em>{t("favourite.sort.date")}</em>
                                </option>
                                <option value={"price"}>
                                    <em>{t("favourite.sort.price")}</em>
                                </option>
                                <option value={"brand"}>
                                    <em>{t("favourite.sort.brand")}</em>
                                </option>
                                {/* {setUniqueStatus.map((status) => (
                                <option value={status.key}>
                                    {status.value}
                                </option>
                                ))} */}
                            </Select>
                        </FormControl>
                    </Box>

                    {/* Item List*/}

                    <Box display={'flex'} flexDirection={"row"} flexWrap={'wrap'} justifyContent={'space-evenly'} >
                        {userFavourite.map((item: UserFavourite) => (
                            <MotorbikeFavouriteInforCard motorbike={item.motorbike!} isFavoritePage={true} />
                        ))}
                        {/* <Box marginTop={'30px'} height={'280px'} width={'43%'} border={'1px black solid'} borderRadius={'5px'}></Box>     
                        <Box marginTop={'30px'} height={'280px'} width={'43%'} border={'1px black solid'} borderRadius={'5px'}></Box>     
                        <Box marginTop={'30px'} height={'280px'} width={'43%'} border={'1px black solid'} borderRadius={'5px'}></Box>               */}
                    </Box>
                </Box>
            </Paper>

        </Box>
    );
};

export default FavouritePage;