import { Avatar, Box, Chip, Divider, Tooltip, Typography } from '@mui/material';
import React, { useContext } from 'react';
import usei18next from '../../../hooks/usei18next';
import PlaceIcon from '@mui/icons-material/Place';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Motorbike } from '../../../utils/type';
import theme from '../../../utils/theme';
import { ImageSearchBox } from '../../../assets/images';
import { BusinessCenterOutlined, FavoriteBorder, FavoriteOutlined, ShoppingCartCheckout, StarPurple500Outlined } from '@mui/icons-material';
import { ModalContext } from '../../../contexts/ModalContext';
import MotorbikeDetailModal from './MotorbikeDetailModal';
import MyIcon from '../../../components/common/MyIcon';
import UserService from '../../../services/UserService';
import { useAppDispatch } from '../../../hooks/useAction';
import ToastComponent from '../../../components/toast/ToastComponent';
import { getUserFavouriteInfo } from '../../../redux/reducers/userFavouriteReducer';

export default function MotorbikeInforCard(props: { motorbike: Motorbike, isFavoritePage: boolean, startDate?: string, endDate?: string }) {
    const { t } = usei18next();
    const { setContentModal, setShowModal } = useContext(ModalContext);
    const dispatch = useAppDispatch();

    const showMotorbikeDetailModal = () => {
        setContentModal(
            <MotorbikeDetailModal motorbikeId={props.motorbike.id} startDate={props.startDate} endDate={props.endDate} />
        )
        setShowModal(true)
    }

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

    const addFavourite = async (id: number) => {
        try {
            const response = await UserService.addFavourite(id);
            if (response.status === 200) { 
              dispatch(getUserFavouriteInfo());
              ToastComponent(t("toast.favourite.add.success"), "success");
            } else {
              ToastComponent(t("toast.favourite.add.warning"), "warning");
            }
          } catch (error) {
            ToastComponent(t("toast.favourite.add.error"), "error");
          }
    }
    return (
        <Box
            sx={{
                backgroundColor: '#fff',
            }}
            width={props.isFavoritePage ? '575px' : '270px'}
            border={'1px solid #e0e0e0'}
            borderRadius={'8px'}
            display={'flex'}
            padding={'16px'}
            flexDirection={props.isFavoritePage ? 'row' : 'column'}
            justifyContent={'space-between'}
            alignItems={'start'}
            gap={'16px'}
        >
            {/* Image */}
            <Box
                width={props.isFavoritePage ? '40%' : '100%'}
                sx={{ cursor: 'pointer', position: 'relative' }}
            >
                <Avatar
                    src={props.motorbike.imageUrl[0]}
                    sx={props.isFavoritePage ? {
                        width: '100%',
                        height: '150px',
                        borderRadius: '8px',
                        border: '1px solid #e0e0e0',
                    } : {
                        width: '100%',
                        height: '190px',
                        borderRadius: '8px',
                        border: '1px solid #e0e0e0',
                    }} alt="image"
                    onClick={showMotorbikeDetailModal}
                />
                {/* User Avatar */}
                <Tooltip title={props.motorbike.user.name} placement='right-end'>
                    <Avatar sx={{
                        position: 'absolute',
                        bottom: -20,
                        left: 12,
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                    }} src={props.motorbike.user.avatarUrl} />
                </Tooltip>
                {/* Favorite Icon */}
                {
                    props.motorbike.isFavourite ? (
                        <FavoriteOutlined
                            sx={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                fontSize: '24px',
                                color: '#c55f17',
                                padding: '4px',
                                margin: '4px',
                                backgroundColor: 'rgba(0, 0, 0, 0.25)',
                                borderRadius: '50%',
                            }}
                            onClick={() => deleteFavourite(props.motorbike.id!)}/>
                    ) : (
                        <FavoriteBorder
                            sx={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                fontSize: '24px',
                                color: '#fff',
                                padding: '4px',
                                margin: '4px',
                                backgroundColor: 'rgba(0, 0, 0, 0.25)',
                                borderRadius: '50%',
                            }}
                            onClick={() => addFavourite(props.motorbike.id!)}
                        />
                    )
                }
            </Box>
            <Divider orientation="vertical" flexItem />
            {/* Content */}
            <Box
                width={props.isFavoritePage ? '60%' : '100%'}
                display="flex"
                flexDirection="column"
                gap="8px">
                {/* Fuel Consumption and Shipping */}
                <Box display="flex" gap="8px">
                    <Chip
                        sx={{ '& .MuiChip-label': { fontSize: "12px" }, height: '28px', fontWeight: '400' }}
                        color="success"
                        label={props.motorbike.fuelConsumption == 1 ? t("favourite.item.gasoline") : t("favourite.item.electric")} />
                    <Chip
                        sx={{ '& .MuiChip-label': { fontSize: "12px" }, height: '28px', fontWeight: '400' }}
                        color="warning"
                        label={t('favourite.item.ship')} />
                </Box>
                {/* Brand Name and Model */}
                <Box display="flex" flexDirection="column" gap="4px">
                    <Box>
                        <Tooltip placement='bottom' title={"HONDA WAVE ALPHA HONDA WAVE ALPHA"}>
                            <Typography
                                textOverflow="ellipsis"
                                whiteSpace="nowrap"
                                overflow="hidden"
                                fontWeight="bold"
                                fontSize="20px"
                                color={theme.palette.text.primary}
                            >
                                HONDA WAVE ALPHA HONDA WAVE ALPHA
                            </Typography>
                        </Tooltip>
                    </Box>
                    <Box display="flex" alignItems="center" gap="4px">
                        <PlaceIcon sx={{ color: "#777E90" }} fontSize="small" />
                        <Tooltip placement="bottom" title={props.motorbike.address}>
                            <Typography
                                textOverflow="ellipsis"
                                whiteSpace="nowrap"
                                overflow="hidden"
                                fontSize="12px"
                                fontStyle={"italic"}
                                color={theme.palette.text.secondary}
                            >
                                {props.motorbike.address}
                            </Typography>
                        </Tooltip>
                    </Box>
                </Box>
                {/* Star Rating and Booking Count */}
                <Box display="flex">
                    <Box width="100%" display="flex" alignItems="end" gap="4px">
                        <StarPurple500Outlined sx={{ color: "#FBC241" }} fontSize="small" />
                        <Typography color={theme.palette.text.secondary} fontSize="12px" align="center" textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden">
                            4.5
                        </Typography>
                        <BusinessCenterOutlined fontWeight={300} sx={{ color: "#8B4513" }} fontSize="small" />
                        <Typography color={theme.palette.text.secondary} fontSize="12px" align="center" textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden">
                            5 lượt đặt
                        </Typography>
                    </Box>
                </Box>
                {/* "Xem chi tiết" link and Price */}
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    borderTop="1px solid #e0e0e0"
                    paddingTop="8px"
                >
                    {props.isFavoritePage ? (
                        <Typography
                            sx={{
                                cursor: 'pointer',
                                '&:hover': {
                                    textDecoration: 'underline',
                                    color: theme.palette.primary.main,
                                },
                            }}
                            color={theme.palette.text.primary}
                            fontSize="14px"
                            fontWeight={700}
                            align="center"
                            textOverflow="ellipsis"
                            onClick={showMotorbikeDetailModal}
                        >
                            Xem chi tiết
                        </Typography>
                    ) : (
                        <MyIcon icon={<ShoppingCartCheckout />} hasTooltip position='right' tooltipText={t("favourite.item.addtocart")} />
                    )}
                    <Box display="flex" flexDirection="row" alignItems="flex-end" borderRadius="8px" padding="0px 8px" gap="4px" sx={{ backgroundColor: "rgba(139, 69, 19, 0.1)" }}>
                        <Typography fontWeight="bold" fontSize="20px" color={theme.palette.text.primary}
                        >
                            {Number(props.motorbike.priceRent) + "K"}<span style={{ fontWeight: '400', fontSize: '12px' }}>{" / " + "Ngày"}</span>
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
