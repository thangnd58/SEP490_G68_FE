import useThemePage from "../../hooks/useThemePage";
import {
    Typography,
    Box,
    Divider,
    FormControlLabel,
    RadioGroup,
} from "@mui/material";
import usei18next from "../../hooks/usei18next";
import MyCustomButton from "../../components/common/MyButton";
import MotorbikeCartInfo from "./components/MotorbikeCartInfo";
import { useAppDispatch, useAppSelector } from "../../hooks/useAction";
import { useEffect, useState } from "react";
import { getCartInfo } from "../../redux/reducers/cartReducer";
import { MotorbikeCart, ShoppingCart } from "../../utils/type";
import theme from "../../utils/theme";
import dayjs from "dayjs";
import { DatePicker } from "antd";
import { LocationOnOutlined } from "@mui/icons-material";
import ToastComponent from "../../components/toast/ToastComponent";

function CartPage() {
    const { isMobile, isIpad } = useThemePage();
    const { t } = usei18next();
    const { shoppingCart } = useAppSelector((state) => state.shoppingCartInfo);
    const dispatch = useAppDispatch();
    const { RangePicker } = DatePicker;
    const [isMapModalOpen, setMapModalOpen] = useState(false);
    const [isProcessingBooking, setIsProcessingBooking] = useState(false);

    useEffect(() => {
        dispatch(getCartInfo());
    }, []);

    

    const formatMoney = (money: number | undefined) => {
        if (money) {
            return (money * 1000).toLocaleString("it-IT", {
                style: "currency",
                currency: "VND",
            });
        }
        return 0;
    };

    // ADDRESS MODAL CONTROLLER
    const openMapModal = () => {
        setMapModalOpen(true);
    };

    const closeMapModal = () => {
        setMapModalOpen(false);
    };

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
                    {shoppingCart
                        ? shoppingCart.motorbikes.map((item: MotorbikeCart) => (
                              <MotorbikeCartInfo motorbike={item} />
                          ))
                        : null}
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
                        sx={{
                            backgroundColor: "rgba(139, 69, 19, 0.05)",
                            borderRadius: "8px",
                            minHeight: "300px",
                        }}
                        margin={
                            isIpad || isMobile
                                ? "16px 0px"
                                : "0px 0px 0px 10px"
                        }
                        display="flex"
                        flexDirection="column"
                        alignItems="start"
                        padding="16px"
                    >
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="start"
                            width={"100%"}
                            justifyContent={"space-between"}
                        >
                            {/* Line */}
                            <Divider
                                sx={{ margin: "16px 0px", width: "100%" }}
                                variant="fullWidth"
                            />
                            {/* Chọn ngày giờ */}
                            <Box
                                display={"flex"}
                                flexDirection={"column"}
                                alignItems={"center"}
                                justifyContent={"center"}
                                sx={{ gap: "4px" }}
                            >
                                <Box
                                    width={"100%"}
                                    display={"flex"}
                                    flexDirection={"row"}
                                    alignItems={"center"}
                                    justifyContent={"center"}
                                >
                                    {/* start date */}
                                    <Typography
                                        width={"50%"}
                                        color={theme.palette.text.primary}
                                        sx={{
                                            fontSize: "12px",
                                            fontWeight: "600",
                                            fontStyle: "italic",
                                        }}
                                    >
                                        Ngày bắt đầu:
                                    </Typography>
                                    {/* end date */}
                                    <Typography
                                        width={"50%"}
                                        color={theme.palette.text.primary}
                                        sx={{
                                            fontSize: "12px",
                                            fontWeight: "600",
                                            fontStyle: "italic",
                                        }}
                                    >
                                        Ngày kết thúc:
                                    </Typography>
                                </Box>
                                <RangePicker
                                    className="custom-range-picker"
                                    style={{
                                        fontFamily: "Inter",
                                        fontStyle: "normal",
                                        fontSize: "20px",
                                        height: "48px",
                                    }}
                                    size="large"
                                    showTime={{ format: "HH:mm" }}
                                    format="DD-MM-YYYY HH:mm"
                                    placeholder={[
                                        "Ngày bắt đầu",
                                        "Ngày kết thúc",
                                    ]}
                                    // value={[
                                    //     dayjs(
                                    //         values.startDate,
                                    //         "DD-MM-YYYY HH:mm"
                                    //     ),
                                    //     dayjs(
                                    //         values.endDate,
                                    //         "DD-MM-YYYY HH:mm"
                                    //     ),
                                    // ]}
                                    // onChange={(dates, dateStrings) => {
                                    //     setFieldValue(
                                    //         "startDate",
                                    //         dateStrings[0]
                                    //     );
                                    //     setFieldValue(
                                    //         "endDate",
                                    //         dateStrings[1]
                                    //     );
                                    // }}
                                    // allowClear={false}
                                />
                            </Box>
                            {/* Chọn vị trí trả xe */}
                            <Box
                                width={"100%"}
                                display={"flex"}
                                flexDirection={"column"}
                                alignItems={"center"}
                                justifyContent={"center"}
                                sx={{ gap: "4px" }}
                                marginTop={"8px"}
                            >
                                <Box
                                    width={"100%"}
                                    display={"flex"}
                                    flexDirection={"row"}
                                    alignItems={"center"}
                                    justifyContent={"start"}
                                    sx={{ gap: "8px" }}
                                >
                                    <Typography
                                        color={theme.palette.text.primary}
                                        sx={{
                                            fontSize: "12px",
                                            fontWeight: "600",
                                            fontStyle: "italic",
                                        }}
                                    >
                                        Địa điểm giao xe
                                    </Typography>
                                </Box>
                                <Box
                                    className="custom-search-box-1"
                                    width={"100%"}
                                    display={"flex"}
                                    flexDirection={"row"}
                                    alignItems={"center"}
                                    justifyContent={"start"}
                                    sx={{ cursor: "pointer", gap: "8px" }}
                                    onClick={openMapModal}
                                >
                                    <LocationOnOutlined
                                        sx={{
                                            color: theme.palette.action
                                                .disabled,
                                            marginLeft: "8px",
                                        }}
                                    />
                                    <Typography
                                        color={theme.palette.text.primary}
                                        sx={{
                                            fontSize: "16px",
                                            fontWeight: "400",
                                            minWidth: "100px",
                                            width: "100%",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}
                                        padding={"11px 0px"}
                                        // onChange={handleChange}
                                    >
                                        hưng yên
                                        {/* {values.address} */}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Line */}
                            <Divider
                                sx={{ margin: "16px 0px", width: "100%" }}
                                variant="fullWidth"
                            />
                            {/* Đơn giá */}
                            <Box
                                width={"100%"}
                                display={"flex"}
                                flexDirection={"column"}
                                alignItems={"center"}
                                justifyContent={"center"}
                                sx={{ gap: "4px" }}
                            >
                                {/* Đơn giá thuê */}
                                <Box
                                    width={"100%"}
                                    display={"flex"}
                                    flexDirection={"row"}
                                    alignItems={"center"}
                                    justifyContent={"space-between"}
                                    sx={{ gap: "8px" }}
                                >
                                    <Typography
                                        color={theme.palette.text.primary}
                                        sx={{
                                            fontSize: "16px",
                                            fontWeight: "400",
                                        }}
                                    >
                                        Đơn giá thuê
                                    </Typography>
                                    <Typography
                                        color={theme.palette.text.primary}
                                        sx={{
                                            fontSize: "16px",
                                            fontWeight: "600",
                                        }}
                                    >
                                        {formatMoney(
                                            1000
                                            // motorbike?.priceRent
                                        )}
                                        /ngày
                                    </Typography>
                                </Box>
                            </Box>
                            {/* Line */}
                            <Divider
                                sx={{ margin: "16px 0px", width: "100%" }}
                                variant="fullWidth"
                            />

                            {/* Tổng tiền và app mã khuyến mãi */}
                            <Box
                                width={"100%"}
                                display={"flex"}
                                flexDirection={"column"}
                                alignItems={"center"}
                                justifyContent={"center"}
                                sx={{ gap: "8px" }}
                            >
                                {/* Tổng tiền */}
                                <Box
                                    width={"100%"}
                                    display={"flex"}
                                    flexDirection={"row"}
                                    alignItems={"center"}
                                    justifyContent={"space-between"}
                                    sx={{ gap: "8px" }}
                                >
                                    <Typography
                                        color={theme.palette.text.primary}
                                        sx={{
                                            fontSize: "16px",
                                            fontWeight: "400",
                                        }}
                                    >
                                        Tổng phí thuê xe
                                    </Typography>
                                    <Typography
                                        color={theme.palette.text.primary}
                                        sx={{
                                            fontSize: "16px",
                                            fontWeight: "600",
                                        }}
                                    >
                                        {formatMoney(
                                            1000
                                            // previewBookingData?.totalAmountTemp
                                        )}{" "}
                                        {/* x 
                                        {previewBookingData?.rentalDays}  */}
                                        ngày
                                    </Typography>
                                </Box>
                                {/* Phí dịch vụ */}
                                <Box
                                    width={"100%"}
                                    display={"flex"}
                                    flexDirection={"row"}
                                    alignItems={"center"}
                                    justifyContent={"space-between"}
                                    sx={{ gap: "8px" }}
                                >
                                    <Typography
                                        color={theme.palette.text.primary}
                                        sx={{
                                            fontSize: "16px",
                                            fontWeight: "400",
                                        }}
                                    >
                                        Tổng phí dịch vụ
                                    </Typography>
                                    <Typography
                                        color={theme.palette.text.primary}
                                        sx={{
                                            fontSize: "16px",
                                            fontWeight: "600",
                                        }}
                                    >
                                        {formatMoney(
                                            1000
                                            // previewBookingData?.feeOfService
                                        )}
                                    </Typography>
                                </Box>
                            </Box>
                            {/* Line */}
                            <Divider
                                sx={{ margin: "16px 0px", width: "100%" }}
                                variant="fullWidth"
                            />

                            {/* Tổng tiền */}
                            <Box
                                width={"100%"}
                                display={"flex"}
                                flexDirection={"row"}
                                alignItems={"center"}
                                justifyContent={"space-between"}
                                sx={{ gap: "8px" }}
                            >
                                <Typography
                                    color={theme.palette.text.primary}
                                    sx={{ fontSize: "16px", fontWeight: "600" }}
                                >
                                    Tổng tiền
                                </Typography>
                                <Typography
                                    color={theme.palette.text.primary}
                                    sx={{ fontSize: "16px", fontWeight: "600" }}
                                >
                                    {formatMoney(
                                        1000
                                        // previewBookingData?.totalAmount
                                    )}
                                </Typography>
                            </Box>
                            {/* Line */}
                            <Divider
                                sx={{ margin: "16px 0px", width: "100%" }}
                                variant="fullWidth"
                            />

                            {/* Button */}
                            <MyCustomButton
                                // disabled={isProcessingBooking}
                                width="100%"
                                // onClick={handleSubmit}
                                content={"Đặt xe"}
                                variant="contained"
                            />
                        </Box>
                    </Box>
                    {/* <Box
                        width={"95%"}
                        marginBottom={"20px"}
                        border={"1px #e0e0e0 solid"}
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
                    ></MyCustomButton> */}
                </Box>
            </Box>
        </Box>
    );
}

export default CartPage;
