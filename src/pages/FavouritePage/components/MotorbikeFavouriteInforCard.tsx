import { Avatar, Box, Chip, Divider, Tooltip, Typography } from "@mui/material";
import React, { useContext } from "react";
import usei18next from "../../../hooks/usei18next";
import PlaceIcon from "@mui/icons-material/Place";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {
    Motorbike,
    MotorbikeFavourite,
    UserFavourite,
} from "../../../utils/type";
import theme from "../../../utils/theme";
import { ImageSearchBox, LicencePlateImage } from "../../../assets/images";
import {
    BusinessCenterOutlined,
    ChangeCircleOutlined,
    CheckCircleOutline,
    Edit,
    ErrorOutline,
    FavoriteBorder,
    FavoriteOutlined,
    ManageHistory,
    ShoppingCartCheckout,
    StarPurple500Outlined,
    StopCircleOutlined,
    VpnKey,
    WarningAmber,
} from "@mui/icons-material";
import { ModalContext } from "../../../contexts/ModalContext";
import MyIcon from "../../../components/common/MyIcon";
import MotorbikeDetailModal from "../../HomePage/components/MotorbikeDetailModal";
import MotorbikeManagementService from "../../../services/MotorbikeManagementService";
import { useEffect, useState } from "react";
import UserService from "../../../services/UserService";
import { useAppDispatch } from "../../../hooks/useAction";
import { getUserFavouriteInfo } from "../../../redux/reducers/userFavouriteReducer";
import ToastComponent from "../../../components/toast/ToastComponent";
import useThemePage from "../../../hooks/useThemePage";
import UserInforModal from "../../UserProfilePage/UserInforModal";
import dayjs from 'dayjs';
import MyCustomButton from "../../../components/common/MyButton";
import { UpdateStatusFormModal } from "../../PostMotorbike/components/ListMotorbike/UpdateStatusFormModal";

export default function MotorbikeFavouriteInforCard(props: {
    motorbike: Motorbike;
    isListForm?: boolean;
    openItemDetailModal?: () => void;
    openUpdateInforPage?: () => void;
    setIsDeleting?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const { t } = usei18next();
    const { isMobile } = useThemePage();
    const { openModal } = useContext(ModalContext);
    const dispatch = useAppDispatch();

    const showMotorbikeDetailModal = (id: number) => {
        openModal(<MotorbikeDetailModal motorbikeId={id.toString()} />);
    };
    const [statusChange, setStatusChange] = useState<string>("");

    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const deleteFavourite = async (id: number) => {
        try {
            if (isDeleting) {
                return;
            }
            setIsDeleting(true);
            props.setIsDeleting && props.setIsDeleting(true);
            const response = await UserService.deleteFavourite(id);
            if (response.status === 200) {
                dispatch(getUserFavouriteInfo()).then(() => props.setIsDeleting && props.setIsDeleting(false));
                ToastComponent(t("toast.favourite.delete.success"), "success");
            } else {
                ToastComponent(t("toast.favourite.delete.warning"), "warning");
            }
        } catch (error) {
            ToastComponent(t("toast.favourite.delete.error"), "error");
        } finally {
            setIsDeleting(false);
            props.setIsDeleting && props.setIsDeleting(false);
        }
    };

    const chooseChip = (status: string) => {
        switch (status) {
            case "Processing":
                return (
                    <Chip
                        sx={{
                            "& .MuiChip-label": { fontSize: "14px" },
                            height: "28px",
                            fontWeight: "400",
                        }}
                        color="warning"
                        icon={<WarningAmber />}
                        label={t('postMotorbike.listform.status-processing')} />
                )
            case "Approved":
                return (
                    <Chip
                        sx={{
                            "& .MuiChip-label": { fontSize: "14px" },
                            height: "28px",
                            fontWeight: "400",
                        }}
                        color="success"
                        icon={<CheckCircleOutline />}
                        label={t('postMotorbike.listform.status-approved')} />
                )
            case "Rejected":
                return (
                    <Chip
                        sx={{
                            "& .MuiChip-label": { fontSize: "14px" },
                            height: "28px",
                            fontWeight: "400",
                        }}
                        color="error"
                        icon={<ErrorOutline />}
                        label={t('postMotorbike.listform.status-rejected')} />
                )
            case "OnHiatus":
                return (
                    <Chip
                        sx={{
                            "& .MuiChip-label": { fontSize: "14px" },
                            height: "28px",
                            fontWeight: "400",
                        }}
                        color="warning"
                        icon={<StopCircleOutlined />}
                        label={t('postMotorbike.listform.status-onhiatus')} />
                )
            case "InOperation":
                return (
                    <Chip
                        sx={{
                            "& .MuiChip-label": { fontSize: "14px" },
                            height: "28px",
                            fontWeight: "400",
                        }}
                        color="success"
                        icon={<ChangeCircleOutlined />}
                        label={t('postMotorbike.listform.status-inoporation')} />
                )
            case "CurrentlyRenting":
                return (
                    <Chip
                        sx={{
                            "& .MuiChip-label": { fontSize: "14px" },
                            height: "28px",
                            fontWeight: "400",
                        }}
                        color="warning"
                        icon={<ChangeCircleOutlined />}
                        label={t('postMotorbike.listform.status-currentlyrenting')} />
                )
            default:
                break;
        }
    }

    return (
        <Box
            sx={{
                backgroundColor: "#fff",
            }}
            width={isMobile ? "300px" : "500px"}
            border={"1px solid #8B4513"}
            borderRadius={"8px"}
            display={"flex"}
            padding={"16px"}
            flexDirection={isMobile ? 'column' : "row"}
            justifyContent={"space-between"}
            alignItems={"start"}
            gap={"16px"}
            marginTop={isMobile ? '8px' :"16px"}
        >
            {/* Image */}
            <Box width={isMobile ? "100%" : "40%"} sx={{ cursor: "pointer", position: "relative" }}>
                <Avatar
                    src={props.motorbike.imageUrl[0]}
                    sx={{
                        width: "100%",
                        // height: "100%",
                        // width: isMobile ? "280px" : "180px",
                        height: isMobile ? "200px" : "150px",
                        borderRadius: "8px",
                        border: "1px solid #e0e0e0",
                    }}
                    alt="image"
                    onClick={() =>
                        props.openItemDetailModal ? props.openItemDetailModal() :
                            showMotorbikeDetailModal(props.motorbike.id!)
                    }
                />
                {/* User Avatar */}
                {
                    !props.isListForm &&
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
                            onClick={() => openModal(<UserInforModal userId={props.motorbike.user.userId} />)}
                        />
                    </Tooltip>
                }
                {/* Favorite Icon */}
                {
                    !props.isListForm &&
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
                            "&:hover": {
                                transform: "scale(1.1)",
                                transition: "all 0.3s ease-in-out",
                            },
                        }}
                        onClick={() => deleteFavourite(props.motorbike.id!)}
                    />}
            </Box>
            <Divider orientation="vertical" flexItem />
            {/* Content */}
            <Box width={isMobile ? "100%" : "60%"} display="flex" flexDirection="column" gap="8px">
                {/* Fuel Consumption and Shipping */}
                <Box width={"100%"} display="flex" gap="8px" justifyContent={'space-between'} alignItems="center">
                    {props.isListForm ? (
                        <>
                            {
                                statusChange !== "" ? chooseChip(statusChange) :
                                    chooseChip(props.motorbike.status)
                            }
                            {
                                <Box display={"flex"} gap="4px" justifyContent={'center'} alignItems="center">
                                    {
                                        props.motorbike.status !== "Rejected" && props.motorbike.status !== "Processing" &&
                                        <MyIcon
                                            icon={<ManageHistory sx={{ color: 'main' }} />}
                                            hasTooltip
                                            tooltipText={t("toast.favourite.item.rent")}
                                            position="bottom"
                                            onClick={
                                                () => openModal(<UpdateStatusFormModal
                                                    setStatusChange={setStatusChange}
                                                    motorbikeStatus={statusChange !== "" ? statusChange : props.motorbike.status}
                                                    motorbikeId={props.motorbike.id!}
                                                />)
                                            } />
                                    }
                                    <MyIcon
                                        icon={<Edit sx={{
                                            color: 'main',
                                            width: "20px",
                                            height: "20px",
                                        }} />}
                                        hasTooltip
                                        tooltipText={t("toast.favourite.item.rent")}
                                        position="bottom"
                                        onClick={
                                            () => props.openUpdateInforPage && props.openUpdateInforPage()
                                        } />
                                </Box>
                            }
                        </>
                    ) : (
                        <Box display="flex" gap="4px">
                            <Chip
                                sx={{
                                    "& .MuiChip-label": { fontSize: "12px" },
                                    height: "28px",
                                    lineHeight: "28px",
                                    fontWeight: "400",
                                }}
                                color="success"
                                label={
                                    props.motorbike.fuelConsumption === 1
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
                        </Box>)}
                </Box>
                {/* Brand Name and Model */}
                <Box display="flex" flexDirection="column" gap="4px">
                    <Box>
                        <Tooltip
                            placement="bottom"
                            title={props.motorbike.modelName}
                        >
                            <Typography
                                textOverflow="ellipsis"
                                whiteSpace="nowrap"
                                overflow="hidden"
                                fontWeight="bold"
                                fontSize="20px"
                                color={theme.palette.text.primary}
                            >
                                {props.isListForm ? props.motorbike.model.brand.brandName + " " + props.motorbike.model.modelName : props.motorbike.brandName + " " + props.motorbike.modelName}
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
                                maxWidth={isMobile ? "200px" : "250px"}
                                color={theme.palette.text.secondary}
                            >
                                {props.motorbike.address}
                            </Typography>
                        </Tooltip>
                    </Box>
                </Box>
                {/* Star Rating and Booking Count */}
                <Box display="flex">
                    {!props.isListForm ? (
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
                        </Box>)
                        : (
                            <Box width="100%" display="flex" justifyContent={'start'} alignItems="center" gap="16px">
                                <Box display={"flex"} gap="4px" justifyContent={'center'} alignItems="center">
                                    <img src={LicencePlateImage} alt="search"
                                        style={{
                                            width: "24px",
                                            height: "24px",
                                        }}
                                    />
                                    <Typography
                                        color={theme.palette.text.primary}
                                        fontSize="12px"
                                        align="center"
                                        textOverflow="ellipsis"
                                        whiteSpace="nowrap"
                                        overflow="hidden"
                                    >
                                        {props.motorbike.licensePlate}
                                    </Typography></Box>
                                <Box display={"flex"} gap="4px" justifyContent={'center'} alignItems="center">
                                    <VpnKey
                                        fontWeight={300}
                                        sx={{ color: "#8B4513" }}
                                        fontSize="small"
                                    />
                                    <Typography
                                        color={theme.palette.text.primary}
                                        fontSize="12px"
                                        align="center"
                                        textOverflow="ellipsis"
                                        whiteSpace="nowrap"
                                        overflow="hidden"
                                    >
                                        {dayjs(props.motorbike.createDatetime as string).format("DD/MM/YYYY HH:mm")}
                                    </Typography>
                                </Box>
                            </Box>
                        )
                    }
                </Box>
                {/* "Xem chi tiết" link and Price */}
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    borderTop="1px solid #e0e0e0"
                    paddingTop="8px"
                >
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
                        onClick={() =>
                            props.openItemDetailModal ? props.openItemDetailModal() :
                                showMotorbikeDetailModal(props.motorbike.id!)
                        }
                    >
                        {t("favourite.item.view")}
                    </Typography>

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
            {/* <UpdateStatusFormModal /> */}
        </Box>
    );
}
