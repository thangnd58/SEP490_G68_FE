import { Avatar, Typography, Divider, Box, Tooltip, Chip } from "@mui/material";
import useThemePage from "../../../hooks/useThemePage";
import usei18next from "../../../hooks/usei18next";
import DeleteIcon from "@mui/icons-material/Delete";
import MyIcon from "../../../components/common/MyIcon";
import PlaceIcon from "@mui/icons-material/Place";
import theme from "../../../utils/theme";
import {
    BusinessCenterOutlined,
    StarPurple500Outlined,
} from "@mui/icons-material";
import { MotorbikeCart } from "../../../utils/type";
import BadgeIcon from "@mui/icons-material/Badge";
import PaidIcon from "@mui/icons-material/Paid";

export default function MotorbikeCartInfo(props: { motorbike: MotorbikeCart }) {
    const { isMobile } = useThemePage();
    const { t } = usei18next();
    return (
        <Box>
            <Box
                display={"flex"}
                flexDirection={isMobile ? "column" : "row"}
                justifyContent={isMobile ? "center" : "space-between"}
                alignItems={"center"}
                color={"common.white"}
                padding={"0px 16px"}
                marginTop={"10px"}
                sx={{
                    backgroundColor: "primary.main",
                    borderTopLeftRadius: "8px",
                    borderTopRightRadius: "8px",
                }}
            >
                <Typography variant="h6">{props.motorbike.model}</Typography>
                <MyIcon
                    icon={<DeleteIcon color="warning" />}
                    position="right"
                    hasTooltip
                    tooltipText={t("dashBoardManager.brand.delete")}
                />
            </Box>
            <Box
                sx={{
                    backgroundColor: "#fff",
                    borderBottomLeftRadius: "8px",
                    borderBottomRightRadius: "8px",
                }}
                borderBottom={"1px solid #e0e0e0"}
                display={"flex"}
                padding={"16px"}
                flexDirection={"row"}
                justifyContent={"space-between"}
                alignItems={"start"}
                gap={"16px"}
            >
                {/* Image */}
                <Box
                    width={"40%"}
                    sx={{ cursor: "pointer", position: "relative" }}
                >
                    <Avatar
                        src={props.motorbike.imageUrl[0]}
                        sx={{
                            width: "100%",
                            height: "200px",
                            borderRadius: "8px",
                            border: "1px solid #e0e0e0",
                        }}
                        alt="image"
                        // onClick={() => showMotorbikeDetailModal(props.motorbike.id)}
                    />
                </Box>
                <Divider orientation="vertical" flexItem />
                {/* Content */}
                <Box
                    width={"60%"}
                    display="flex"
                    flexDirection="column"
                    gap="8px"
                >
                    {/* Fuel Consumption and Shipping */}
                    <Box display="flex" gap="8px">
                        <Chip
                            sx={{
                                "& .MuiChip-label": {
                                    fontSize: "12px",
                                },
                                height: "28px",
                                fontWeight: "400",
                            }}
                            color="success"
                            label={
                                props.motorbike.type === 'Xăng'
                                    ? t("favourite.item.gasoline")
                                    : t("favourite.item.electric")
                            }
                        />
                        <Chip
                            sx={{
                                "& .MuiChip-label": {
                                    fontSize: "12px",
                                },
                                height: "28px",
                                fontWeight: "400",
                            }}
                            color="warning"
                            label={t("favourite.item.ship")}
                        />
                    </Box>
                    {/* Brand Name and Model */}
                    <Box display="flex" flexDirection="column" gap="4px">
                        <Box display="flex" alignItems="center" gap="4px">
                            <BadgeIcon
                                sx={{ color: "#777E90" }}
                                fontSize="small"
                            />

                            <Typography
                                textOverflow="ellipsis"
                                whiteSpace="nowrap"
                                overflow="hidden"
                                fontSize="12px"
                                fontStyle={"italic"}
                                marginTop={"6px"}
                                color={theme.palette.text.secondary}
                            >
                                {props.motorbike.licensePlate}
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap="4px">
                            <PlaceIcon
                                sx={{ color: "#777E90" }}
                                fontSize="small"
                            />

                            <Typography
                                textOverflow="ellipsis"
                                whiteSpace="nowrap"
                                overflow="hidden"
                                fontSize="12px"
                                fontStyle={"italic"}
                                marginTop={"3px"}
                                color={theme.palette.text.secondary}
                            >
                                {props.motorbike.address}
                            </Typography>
                        </Box>
                    </Box>
                    {/* Star Rating and Booking Count */}
                    <Box display="flex">
                        <Box
                            width="100%"
                            display="flex"
                            alignItems="end"
                            gap="4px"
                        >
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
                                4.5
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
                                5 lượt đặt
                            </Typography>
                        </Box>
                    </Box>
                    <Box display="flex" gap="4px">
                        <PaidIcon sx={{ color: "black" }} fontSize="large" />
                        <Typography
                            fontWeight="bold"
                            fontSize="25px"
                            color={theme.palette.text.primary}
                        >
                            {Number(props.motorbike.priceRent) + "K"}
                            <span
                                style={{
                                    fontWeight: "400",
                                    fontSize: "12px",
                                }}
                            >
                                {" / " + "Ngày"}
                            </span>
                        </Typography>
                    </Box>
                    {/* "Xem chi tiết" link and Price */}
                    <Box
                        display="flex"
                        alignItems="center"
                        borderTop="1px solid #e0e0e0"
                        paddingTop="8px"
                    >
                        <Box
                            display="flex"
                            flexDirection="row"
                            alignItems="center"
                            borderRadius="8px"
                            padding="0px 8px"
                            gap="4px"
                        >
                            <Avatar
                                sx={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "50%",
                                }}
                                src={props.motorbike.user.avatarUrl}
                            />
                            <Box>
                                <Typography fontSize="13px" marginLeft={"7px"}>
                                    Chủ Xe
                                </Typography>
                                <Typography
                                    textOverflow="ellipsis"
                                    whiteSpace="nowrap"
                                    overflow="hidden"
                                    fontWeight="bold"
                                    fontSize="18px"
                                    marginTop={"-5px"}
                                    marginLeft={"7px"}
                                    color={theme.palette.text.primary}
                                >
                                    {props.motorbike.user.name}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
