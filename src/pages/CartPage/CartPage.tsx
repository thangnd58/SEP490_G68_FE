import {
    BusinessCenterOutlined,
    StarPurple500Outlined,
} from "@mui/icons-material";
import useThemePage from "../../hooks/useThemePage";
import {
    Avatar,
    Typography,
    Divider,
    Box,
    Tooltip,
    Chip,
    Checkbox,
} from "@mui/material";
import theme from "../../utils/theme";
import PlaceIcon from "@mui/icons-material/Place";
import usei18next from "../../hooks/usei18next";
import DeleteIcon from "@mui/icons-material/Delete";
import MyIcon from "../../components/common/MyIcon";
import MyCustomButton from "../../components/common/MyButton";

function CartPage() {
    const { isMobile } = useThemePage();
    const { t } = usei18next();

    return (
        <Box
            display={"flex"}
            flexDirection={"column"}
            width={isMobile ? "90%" : "65%"}
            margin={"auto"}
        >
            <Box width={"100%"}>
                <Typography variant="h4" fontWeight={"bold"}>
                    Giỏ hàng của bạn
                </Typography>
            </Box>
            <Box display={"flex"} width={"100%"} marginBottom={"100px"}>
                <Box width={"70%"}>
                    <Box>
                        <Box
                            display={"flex"}
                            flexDirection={isMobile ? "column" : "row"}
                            justifyContent={
                                isMobile ? "center" : "space-between"
                            }
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
                            <Typography variant="h6">Honda Airblade</Typography>
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
                                    src="https://sep490g68.s3.ap-southeast-1.amazonaws.com/news/image/5/bike.jpg?X-Amz-Expires=300&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAXUMT2MLG3P6VDD57%2F20231113%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20231113T161333Z&X-Amz-SignedHeaders=host&X-Amz-Signature=f8b448eaa0861f57e713afb74034ca2b9a916de6be25d66cd873b1b146c1cfb8"
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
                                        label="Nhien Lieu"
                                        //   {
                                        //     props.motorbike.fuelConsumption === 1
                                        //       ? t("favourite.item.gasoline")
                                        //       : t("favourite.item.electric")
                                        //   }
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
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    gap="4px"
                                >
                                    <Box display={"flex"} alignItems={"center"}>
                                        <Avatar
                                            sx={{
                                                width: "40px",
                                                height: "40px",
                                                borderRadius: "50%",
                                            }}
                                            src="https://sep490g68.s3.ap-southeast-1.amazonaws.com/news/image/5/bike.jpg?X-Amz-Expires=300&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAXUMT2MLG3P6VDD57%2F20231113%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20231113T161333Z&X-Amz-SignedHeaders=host&X-Amz-Signature=f8b448eaa0861f57e713afb74034ca2b9a916de6be25d66cd873b1b146c1cfb8"
                                        />
                                        <Typography
                                            textOverflow="ellipsis"
                                            whiteSpace="nowrap"
                                            overflow="hidden"
                                            fontWeight="bold"
                                            fontSize="20px"
                                            marginLeft={"7px"}
                                            color={theme.palette.text.primary}
                                        >
                                            Nguyễn xuân Trường
                                        </Typography>
                                    </Box>
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        gap="4px"
                                    >
                                        <PlaceIcon
                                            sx={{ color: "#777E90" }}
                                            fontSize="small"
                                        />
                                        <Tooltip
                                            placement="bottom"
                                            title="Hung Yen"
                                        >
                                            <Typography
                                                textOverflow="ellipsis"
                                                whiteSpace="nowrap"
                                                overflow="hidden"
                                                fontSize="12px"
                                                fontStyle={"italic"}
                                                color={
                                                    theme.palette.text.secondary
                                                }
                                            >
                                                323B Thi tran Yen My - Hung Yen
                                            </Typography>
                                        </Tooltip>
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
                                {/* "Xem chi tiết" link and Price */}
                                <Box
                                    display="flex"
                                    justifyContent="flex-end"
                                    alignItems="center"
                                    borderTop="1px solid #e0e0e0"
                                    paddingTop="8px"
                                >
                                    <Box
                                        display="flex"
                                        flexDirection="row"
                                        alignItems="flex-end"
                                        borderRadius="8px"
                                        padding="0px 8px"
                                        gap="4px"
                                        sx={{
                                            backgroundColor:
                                                "rgba(139, 69, 19, 0.1)",
                                        }}
                                    >
                                        <Typography
                                            fontWeight="bold"
                                            fontSize="20px"
                                            color={theme.palette.text.primary}
                                        >
                                            {Number("500000") + "K"}
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
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                <Box
                    width={"30%"}
                    display={"flex"}
                    justifyContent={"flex-end"}
                    alignItems={"center"}
                    flexDirection="column"
                    marginBottom={"20px"}
                >
                    <Box
                        width={"95%"}
                        border={"1px #e0e0e0 solid"}
                        marginBottom={"20px"}
                        borderRadius={"10px"}
                    >
                        <Typography
                            variant="h5"
                            fontWeight={"bold"}
                            marginLeft={"8px"}
                            marginBottom={"10px"}
                            marginTop={"15px"}
                        >
                            Chi Phí Ước Tính
                        </Typography>
                        <Box
                            display={"flex"}
                            justifyContent={"space-between"}
                            marginLeft={"8px"}
                            marginRight={"8px"}
                            borderBottom={"1px #e0e0e0 solid"}
                        >
                            <Typography marginBottom={"10px"}>
                                Phí thuê xe
                            </Typography>
                            <Typography marginBottom={"10px"}>
                                1000000k
                            </Typography>
                        </Box>
                        <Box
                            display={"flex"}
                            justifyContent={"space-between"}
                            marginLeft={"8px"}
                            marginRight={"8px"}
                            marginTop={"10px"}
                            marginBottom={"10px"}
                        >
                            <Typography fontWeight={"blod"}>
                                Phí thuê xe cho 1 ngày
                            </Typography>
                            <Typography fontWeight={"900px"}>
                                1000000k
                            </Typography>
                        </Box>
                    </Box>
                    <MyCustomButton
                        content="Thanh Toán"
                        width="60%"
                        height="auto"
                    ></MyCustomButton>
                </Box>
            </Box>
        </Box>
    );
}

export default CartPage;
