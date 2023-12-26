import { Avatar, Box, Chip, CircularProgress, Divider, Tooltip, Typography } from '@mui/material';
import React, { useContext, useState } from 'react';
import usei18next from '../../../hooks/usei18next';
import PlaceIcon from '@mui/icons-material/Place';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Motorbike } from '../../../utils/type';
import theme from '../../../utils/theme';
import { ImageSearchBox } from '../../../assets/images';
import { AddShoppingCart, BusinessCenterOutlined, Delete, FavoriteBorder, FavoriteOutlined, ShoppingCartCheckout, StarPurple500Outlined, Straighten } from '@mui/icons-material';
import { ModalContext } from '../../../contexts/ModalContext';
import MotorbikeDetailModal from './MotorbikeDetailModal';
import MyIcon from '../../../components/common/MyIcon';
import UserService from '../../../services/UserService';
import { useAppDispatch, useAppSelector } from '../../../hooks/useAction';
import ToastComponent from '../../../components/toast/ToastComponent';
import { getUserFavouriteInfo } from '../../../redux/reducers/userFavouriteReducer';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/Constant';
import { BookingService } from '../../../services/BookingService';
import useThemePage from '../../../hooks/useThemePage';
import MyCustomButton from '../../../components/common/MyButton';
import { LoginModal } from '../../AccountPage/LoginModal';
import { useAuth } from '../../../contexts/AuthContext';
import { getCartInfo } from '../../../redux/reducers/cartReducer';
import UserInforModal from '../../UserProfilePage/UserInforModal';
import { green } from '@mui/material/colors';
import { number } from 'yup';

export default function MotorbikeInforCard(props: { motorbike: Motorbike, isFavoritePage: boolean, startDate?: string, endDate?: string, searchedAddress?: string, isInCart?: boolean, isIntroduced?: boolean, deleteInCart?: () => void, isNotFavorite?: boolean, canClickDetailPage?: boolean, isInModal?: boolean, isLoadDelete?: boolean, isHorizontal?: boolean }) {
    const { t } = usei18next();
    const { user } = useAppSelector((state) => state.userInfo);
    const { openModal } = useContext(ModalContext);
    const [isOpenLoginModal, setIsOpenLoginModal] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const [isFavorite, setIsFavorite] = React.useState<boolean>(props.motorbike.isFavourite);
    const navigate = useNavigate();
    const { isMobile } = useThemePage();
    const showMotorbikeDetailModal = () => {
        openModal(
            <MotorbikeDetailModal motorbikeId={props.motorbike.id?.toString()} startDate={props.startDate} endDate={props.endDate} searchedAddress={props.searchedAddress} />
        )
    }

    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const deleteFavourite = async (id: number) => {
        try {
            if (isDeleting) {
                return;
            }
            setIsDeleting(true);
            // Check login
            if (!UserService.isLoggedIn()) {
                setIsOpenLoginModal(true);
                return;
            }
            const response = await UserService.deleteFavourite(id);
            if (response.status === 200) {
                dispatch(getUserFavouriteInfo());
                setIsFavorite(false);
                ToastComponent(t("toast.favourite.delete.success"), "success");
            } else {
                ToastComponent(t("toast.favourite.delete.warning"), "warning");
            }
        } catch (error) {
            ToastComponent(t("toast.favourite.delete.error"), "error");
        } finally {
            setIsDeleting(false);
        }
    }

    const [isAddingFavorite, setIsAddingFavorite] = useState<boolean>(false);
    const addFavourite = async (id: number) => {
        try {
            if (isAddingFavorite) {
                return;
            }
            setIsAddingFavorite(true);
            // Check login
            if (!UserService.isLoggedIn()) {
                setIsOpenLoginModal(true);
                return;
            }
            // check role
            if (user?.role.roleName === "Customer") {
                const response = await UserService.addFavourite(id);
                if (response.status === 200) {
                    dispatch(getUserFavouriteInfo());
                    setIsFavorite(true);
                    ToastComponent(t("toast.favourite.add.success"), "success");
                } else {
                    ToastComponent(t("toast.favourite.add.warning"), "warning");
                }
                return;
            }
            else {
                ToastComponent(t("toast.favourite.add.notHavePermission"), "warning");
                return;
            }
        } catch (error) {
            ToastComponent(t("toast.favourite.add.error"), "error");
        } finally {
            setIsAddingFavorite(false);
        }
    }

    const [isAddingCart, setIsAddingCart] = useState<boolean>(false);
    const addCart = async (motorbikeId: number, startDatetime: string, endDatetime: string, address: string) => {
        try {
            if (isAddingCart) {
                return;
            }
            setIsAddingCart(true);
            // Check login
            if (!UserService.isLoggedIn()) {
                setIsOpenLoginModal(true);
                return;
            }
            // check role
            if (user?.role.roleName === "Customer") {
                const response = await BookingService.addCart(motorbikeId, startDatetime, endDatetime, address);
                if (response.status === 200) {
                    ToastComponent(t("toast.ShoppingCart.add.success"), "success");
                    dispatch(getCartInfo());
                } else {
                    ToastComponent(t("toast.ShoppingCart.add.warning"), "warning");
                }
                return;
            }
            else {
                ToastComponent(t("toast.ShoppingCart.add.notHavePermission"), "warning");
                return;
            }
        } catch (error) {
            ToastComponent(t("toast.ShoppingCart.add.error"), "error");
        }
        finally {
            setIsAddingCart(false);
        }
    };

    const [loadingCard, setLoadingCard] = useState<string>();

    return (
        <Box
            sx={{
                backgroundColor: "#fff",
            }}
            width={props.isFavoritePage ? "575px" : (isMobile && props.isInModal) ? "89%" : (isMobile) ? "82%" : "270px"}
            border={"1px solid #e0e0e0"}
            borderRadius={"8px"}
            display={"flex"}
            padding={"16px"}
            flexDirection={props.isFavoritePage ? "row" : "column"}
            justifyContent={"space-between"}
            alignItems={"start"}
            gap={"16px"}
        >
            {/* Image */}
            <Box
                width={props.isFavoritePage ? "40%" : "100%"}
                sx={{ cursor: "pointer", position: "relative" }}
            >
                <Avatar
                    src={props.motorbike.imageUrl[0]}
                    sx={
                        props.isFavoritePage
                            ? {
                                width: "100%",
                                height: isMobile ? "200px" : "150px",
                                borderRadius: "8px",
                                border: "1px solid #8B4513",
                            }
                            : {
                                width: "100%",
                                minWidth: "100%",
                                height: isMobile ? "250px" : "190px",
                                borderRadius: "8px",
                                border: "1px solid #8B4513",
                            }
                    }
                    alt="image"
                    onClick={showMotorbikeDetailModal}
                />
                {/* User Avatar */}
                {props.motorbike.user &&
                    <Tooltip
                        title={props.motorbike.user.name}
                        placement="right-end"
                    >
                        <Avatar
                            sx={{
                                position: "absolute",
                                bottom: -20,
                                left: 12,
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                            }}
                            src={props.motorbike.user.avatarUrl}
                            onClick={() => openModal(<UserInforModal userId={props.motorbike.user.userId!} />)}
                        />
                    </Tooltip>
                }
                {/* Favorite Icon */}
                {!props.isNotFavorite &&
                    (isFavorite ? (
                        <FavoriteOutlined
                            sx={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                fontSize: "24px",
                                color: "#c55f17",
                                padding: "4px",
                                margin: "4px",
                                backgroundColor: "rgba(0, 0, 0, 0.25)",
                                borderRadius: "50%",
                                // hover
                                "&:hover": {
                                    transform: "scale(1.1)",
                                    transition: "all 0.3s ease-in-out",
                                },
                            }}
                            onClick={() => deleteFavourite(props.motorbike.id!)}
                        />
                    ) : (
                        <FavoriteBorder
                            sx={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                fontSize: "24px",
                                color: "#fff",
                                padding: "4px",
                                margin: "4px",
                                backgroundColor: "rgba(0, 0, 0, 0.25)",
                                borderRadius: "50%",
                                "&:hover": {
                                    transform: "scale(1.1)",
                                    transition: "all 0.3s ease-in-out",
                                },
                            }}
                            onClick={() => addFavourite(props.motorbike.id!)}
                        />
                    ))}
            </Box>
            <Divider orientation="vertical" flexItem />
            {/* Content */}
            <Box
                width={props.isFavoritePage ? "60%" : "100%"}
                display="flex"
                flexDirection="column"
                gap="8px"
            >
                {/* Fuel Consumption and Shipping */}
                <Box display="flex" gap="8px">
                    <Chip
                        sx={{
                            "& .MuiChip-label": { fontSize: "12px" },
                            height: "28px",
                            lineHeight: "28px",
                            fontWeight: "400",
                        }}
                        color="success"
                        label={
                            props.motorbike.type == "Xăng"
                                ? t("favourite.item.gasoline")
                                : t("favourite.item.electric")
                        }
                    />
                    <Chip
                        sx={{
                            "& .MuiChip-label": { fontSize: "12px" },
                            height: "28px",
                            lineHeight: "28px",
                            fontWeight: "400",
                        }}
                        color="warning"
                        label={t("favourite.item.ship")}
                    />
                </Box>
                {/* Brand Name and Model */}
                <Box display="flex" flexDirection="column" gap="4px">
                    <Box>
                        <Tooltip
                            placement="bottom"
                            title={props.motorbike.model ? props.motorbike.model.brand.brandName + " " + props.motorbike.model.modelName : props.motorbike.brandName + " " + props.motorbike.modelName}
                        >
                            <Typography
                                textOverflow="ellipsis"
                                whiteSpace="nowrap"
                                overflow="hidden"
                                fontWeight="bold"
                                fontSize="20px"
                                sx={{ cursor: "pointer" }}
                                color={theme.palette.text.primary}
                                onClick={() =>
                                    props.canClickDetailPage ?
                                        navigate(
                                            `${ROUTES.user.detailmotorbike}/${props.motorbike.id}`
                                        ) : showMotorbikeDetailModal()
                                }
                            >
                                {props.motorbike.model ? (
                                    props.motorbike.model.brand.brandName + " " + props.motorbike.model.modelName) : (
                                    props.motorbike.brandName + " " + props.motorbike.modelName
                                )}
                            </Typography>
                        </Tooltip>
                    </Box>
                    <Box display="flex" alignItems="center" gap="4px">
                        <PlaceIcon sx={{ color: "#777E90" }} fontSize="small" />
                        <Tooltip
                            placement="bottom"
                            title={props.motorbike.address}
                        >
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
                        <StarPurple500Outlined
                            sx={{ color: "#FBC241" }}
                            fontSize="small"
                        />
                        <Typography
                            color={theme.palette.text.secondary}
                            fontSize="12px"
                            align="center"
                            textOverflow="ellipsis"
                            whiteSpace="nowrap"
                            overflow="hidden"
                        >
                            {props.motorbike.ratingAverage.toFixed(1)}
                        </Typography>
                        <BusinessCenterOutlined
                            fontWeight={300}
                            sx={{ color: "#8B4513" }}
                            fontSize="small"
                        />
                        <Typography
                            color={theme.palette.text.secondary}
                            fontSize="12px"
                            align="center"
                            textOverflow="ellipsis"
                            whiteSpace="nowrap"
                            overflow="hidden"
                        >

                            {t("booking.completeBook", { count: props.motorbike.countCompletedBooking })}
                        </Typography>
                        {props.motorbike.distance && (
                            <>
                                <Straighten
                                    fontWeight={300}
                                    sx={{ color: "#777E90" }}
                                    fontSize="small"
                                />
                                <Typography
                                    color={theme.palette.text.secondary}
                                    fontSize="12px"
                                    align="center"
                                    textOverflow="ellipsis"
                                    whiteSpace="nowrap"
                                    overflow="hidden"
                                >
                                    {props.motorbike.distance} km
                                </Typography>
                            </>
                        )}
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
                    {
                        props.isInCart ? (
                            <MyCustomButton
                                icon={<Delete sx={{ color: 'main' }} />}
                                iconPosition='left'
                                content={t("editional.delete")}
                                onClick={props.deleteInCart!}
                                width="auto"
                                height='32px'
                                variant={'outlined'}
                                fontSize={16}
                                fontWeight={500}
                                borderRadius={8} />
                        ) : (
                            props.isIntroduced ? (
                                <Typography
                                    sx={{
                                        cursor: "pointer",
                                        "&:hover": {
                                            textDecoration: "underline",
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
                                    {t("favourite.item.view")}
                                </Typography>
                            ) : (
                                < MyIcon
                                    icon={<AddShoppingCart
                                        color='primary'
                                    />}
                                    hasTooltip
                                    position="right"
                                    tooltipText={t("favourite.item.addToCart")}
                                    onClick={() => addCart(props.motorbike.id!, props.startDate!, props.endDate!, props.searchedAddress!)}
                                />
                            )
                        )
                    }
                    <Box
                        display="flex"
                        flexDirection="row"
                        alignItems="flex-end"
                        borderRadius="8px"
                        padding="0px 8px"
                        gap="4px"
                        sx={{ backgroundColor: "rgba(139, 69, 19, 0.1)" }}
                    >
                        <Typography
                            fontWeight="bold"
                            fontSize="20px"
                            color={theme.palette.text.primary}
                        >
                            {Number(props.motorbike.priceRent) + "K"}
                            <span
                                style={{ fontWeight: "400", fontSize: "12px" }}
                            >
                                {t("editional.day")}
                            </span>
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <LoginModal isOpenLoginModal={isOpenLoginModal} setIsOpenLoginModal={setIsOpenLoginModal} isMobile={isMobile} />
        </Box>
    );
}
