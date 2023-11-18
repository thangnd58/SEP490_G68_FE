import useThemePage from "../../hooks/useThemePage";
import {
    Typography,
    Box,
    Divider,
    FormControlLabel,
    RadioGroup,
    Paper,
    Grid,
} from "@mui/material";
import usei18next from "../../hooks/usei18next";
import MyCustomButton from "../../components/common/MyButton";
import MotorbikeCartInfo from "./components/MotorbikeCartInfo";
import { useAppDispatch, useAppSelector } from "../../hooks/useAction";
import { useContext, useEffect, useState } from "react";
import { getCartInfo } from "../../redux/reducers/cartReducer";
import { Motorbike, MotorbikeCart, ShoppingCart } from "../../utils/type";
import theme from "../../utils/theme";
import dayjs from "dayjs";
import { DatePicker } from "antd";
import { CalendarTodayOutlined, KeyboardArrowDown, KeyboardArrowUp, LocationOnOutlined } from "@mui/icons-material";
import ToastComponent from "../../components/toast/ToastComponent";
import MyIcon from "../../components/common/MyIcon";
import MotorbikeInforCard from "../HomePage/components/MotorbikeInforCard";
import styled from "@emotion/styled";
import { ConfirmMotorbikeBookingModal } from "../MotorbikePage/components/ConfirmMotorbikeBookingModal";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../utils/Constant";
import { ModalContext } from "../../contexts/ModalContext";
import { BookingInfoMultipleMotorbikeModal } from "../BookMotorbike/BookingInfoMultipleMotorbikeModal";

function CartPage() {
    const { isMobile, isIpad } = useThemePage();
    const { t } = usei18next();
    const { shoppingCart } = useAppSelector((state) => state.shoppingCartInfo);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const { setContentModal, setShowModal } = useContext(ModalContext);

    const showModalBookingInfoMultipleMotorbike = () => {
        setContentModal(
            <BookingInfoMultipleMotorbikeModal
                motorbikes={motorbikes}
                address="Số nhà 21, hẻm 97/24/1 Văn Cao Số nhà 21, hẻm 97/24/1 Văn CaoSố nhà 21, hẻm 97/24/1 Văn CaoSố nhà 21, hẻm 97/24/1 Văn Cao"
                startDate="12-11-2021 12:00"
                endDate="14-11-2021 12:00"
            />
        )
        setShowModal(true)
    }

    useEffect(() => {
        dispatch(getCartInfo());
    }, []);

    interface AnimatedBoxProps {
        isOpen: boolean;
    }

    const AnimatedBox = styled(Box) <AnimatedBoxProps>`
        transition: all 2s ease;
        overflow: hidden;
        height: ${(props) => (props.isOpen ? 'auto' : '0')};
        opacity: ${(props) => (props.isOpen ? '1' : '0')};
      `;

    const formatMoney = (money: number | undefined) => {
        if (money) {
            return (money * 1000).toLocaleString("it-IT", {
                style: "currency",
                currency: "VND",
            });
        }
        return 0;
    };

    // list 3 records demo data has type Motorbike
    const motorbikes: Motorbike[] = [
        {
            id: 8,
            licensePlate: "ABC123",
            releaseYear: 2020,
            type: "Điện",
            priceRent: 50,
            equipments: "Helmet, RainCoat",
            fuelConsumption: 3.5,
            maxDeliveryDistance: 50,
            freeDeliveryRange: 10,
            feeOfDeliveryPerKm: 5,
            provinceId: 1,
            districtId: 101,
            wardId: 1001,
            image: "motorbike1.jpg",
            imageUrl: ["https://i1-vnexpress.vnecdn.net/2023/07/11/F0-copy-2_1689051381.jpg?w=900&h=0&q=100&dpr=1&fit=crop&s=GAq8O4fzdRx6nj7lME8Mow", "https://i1-vnexpress.vnecdn.net/2023/07/11/F1-copy-2_1689051381.jpg?w=900&h=0&q=100&dpr=1&fit=crop&s=Q2gFGknD1qXH4l8PJEsXrg"],
            address: "123 Main Street",
            location: "20.12345, 30.67890",
            status: "Available",
            statusComment: "Good condition",
            user: {
                userId: 101,
                name: "John Doe",
                email: "john@example.com",
                phone: "1234567890",
                gender: "Male",
                dob: "1990-01-01",
                address: "456 Second Street",
                avatar: "avatar1.jpg",
                password: "hashedPassword",
                avatarUrl: "https://yt3.googleusercontent.com/-CFTJHU7fEWb7BYEb6Jh9gm1EpetvVGQqtof0Rbh-VQRIznYYKJxCaqv_9HeBcmJmIsp2vOO9JU=s900-c-k-c0x00ffffff-no-rj",
                role: {
                    roleId: 1,
                    roleName: "User",
                    deleted: false,
                    createDatetime: "",
                    updateDatetime: "",
                    createUserId: 0,
                    updateUserId: 0
                },
                phoneVerified: true,
                balance: 100,
                googleIdentity: "google123",
            },
            createDatetime: "2022-01-01T12:00:00Z",
            model: {
                id: 1,
                modelName: "Sporty Model",
                modelImage: "model1.jpg",
                brand: {
                    id: 1,
                    brandName: "Awesome Brand",
                    brandImage: "brand1.jpg",
                },
            },
            miscellaneous: "Miscellaneous information",
            description: "A cool sporty motorbike",
            distance: 20,
            isFavourite: false,
        },
        {
            id: 9,
            licensePlate: "XYZ789",
            releaseYear: 2021,
            type: "Xăng",
            priceRent: 60,
            equipments: "Helmet, RainCoat",
            fuelConsumption: 4.0,
            maxDeliveryDistance: 40,
            freeDeliveryRange: 8,
            feeOfDeliveryPerKm: 4,
            provinceId: 2,
            districtId: 102,
            wardId: 1002,
            image: "motorbike2.jpg",
            imageUrl: ["https://i1-vnexpress.vnecdn.net/2023/07/11/F6-copy-2_1689051395.jpg?w=900&h=0&q=100&dpr=1&fit=crop&s=nIpgc_mbLgP3q_2ezlYwIA", "https://i1-vnexpress.vnecdn.net/2023/07/11/F6-copy-2_1689051400.jpg?w=900&h=0&q=100&dpr=1&fit=crop&s=7iXGYnQxmsGlOysSAwMm1A"],
            address: "456 Third Street",
            location: "25.54321, 35.98765",
            status: "Available",
            statusComment: "Excellent condition",
            user: {
                userId: 102,
                name: "Jane Doe",
                email: "jane@example.com",
                phone: "9876543210",
                gender: "Female",
                dob: "1995-05-05",
                address: "789 Third Street",
                avatar: "avatar2.jpg",
                password: "hashedPassword",
                avatarUrl: "https://yt3.googleusercontent.com/-CFTJHU7fEWb7BYEb6Jh9gm1EpetvVGQqtof0Rbh-VQRIznYYKJxCaqv_9HeBcmJmIsp2vOO9JU=s900-c-k-c0x00ffffff-no-rj",
                role: {
                    roleId: 1,
                    roleName: "User",
                    deleted: false,
                    createDatetime: "",
                    updateDatetime: "",
                    createUserId: 0,
                    updateUserId: 0
                },
                phoneVerified: true,
                balance: 150,
                googleIdentity: "google456",
            },
            createDatetime: "2022-02-01T14:30:00Z",
            model: {
                id: 2,
                modelName: "Cruiser Deluxe",
                modelImage: "model2.jpg",
                brand: {
                    id: 2,
                    brandName: "Fantastic Brand",
                    brandImage: "brand2.jpg",
                },
            },
            miscellaneous: "More information here",
            description: "A stylish cruiser motorbike",
            distance: 15,
            isFavourite: true,
        },
        {
            id: 10,
            licensePlate: "PQR456",
            releaseYear: 2019,
            type: "Điện",
            priceRent: 70,
            equipments: "Helmet, RainCoat",
            fuelConsumption: 5.0,
            maxDeliveryDistance: 60,
            freeDeliveryRange: 12,
            feeOfDeliveryPerKm: 6,
            provinceId: 3,
            districtId: 103,
            wardId: 1003,
            image: "motorbike3.jpg",
            imageUrl: ["https://i1-vnexpress.vnecdn.net/2023/07/11/Man-Hinh-copy.jpg?w=900&h=0&q=100&dpr=1&fit=crop&s=chbiqcGcGQGaC_9goF2V7Q", "https://i1-vnexpress.vnecdn.net/2023/07/11/Tem-Xe-copy.jpg?w=900&h=0&q=100&dpr=1&fit=crop&s=vmniuiy7FLMC1sah6e1vsw"],
            address: "789 Fourth Street",
            location: "30.98765, 40.12345",
            status: "Unavailable",
            statusComment: "Under maintenance",
            user: {
                userId: 103,
                name: "Bob Smith",
                email: "bob@example.com",
                phone: "5556667777",
                gender: "Male",
                dob: "1985-08-15",
                address: "101 Main Street",
                avatar: "avatar3.jpg",
                password: "hashedPassword",
                avatarUrl: "https://yt3.googleusercontent.com/-CFTJHU7fEWb7BYEb6Jh9gm1EpetvVGQqtof0Rbh-VQRIznYYKJxCaqv_9HeBcmJmIsp2vOO9JU=s900-c-k-c0x00ffffff-no-rj",
                role: {
                    roleId: 2,
                    roleName: "Admin",
                    deleted: false,
                    createDatetime: "",
                    updateDatetime: "",
                    createUserId: 0,
                    updateUserId: 0
                },
                phoneVerified: true,
                balance: 200,
                googleIdentity: "google789",
            },
            createDatetime: "2022-03-01T10:15:00Z",
            model: {
                id: 3,
                modelName: "Touring Explorer",
                modelImage: "model3.jpg",
                brand: {
                    id: 3,
                    brandName: "Amazing Brand",
                    brandImage: "brand3.jpg",
                },
            },
            miscellaneous: "Additional details",
            description: "A comfortable touring motorbike",
            distance: 25,
            isFavourite: false,
        },
    ];

    return (
        <Box
            sx={{ width: '100%' }}
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '32px 0px',
                gap: '32px'
            }}
        >
            <Typography
                variant='h1'
                color={theme.palette.text.primary}
                fontSize={"32px"}
                lineHeight={"60px"}
                fontWeight={"600"}
                sx={{ textAlign: 'center' }}>
                Giỏ hàng của bạn
            </Typography>

            {/* Các đơn hàng */}
            <Paper elevation={2} sx={{ width: '80%', bgcolor: 'background.paper' }}>
                <Box display={"flex"} flexDirection={"column"} gap={"16px"} p={3}>
                    <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"}>
                        <Typography
                            variant='h2'
                            color={theme.palette.text.primary}
                            fontSize={"24px"}
                            lineHeight={"36px"}
                            fontWeight={"600"}
                            sx={{ textAlign: 'center' }}>
                            Thông tin đơn hàng
                        </Typography>
                        <MyCustomButton
                            content={"Đặt xe"}
                            onClick={ showModalBookingInfoMultipleMotorbike }
                            width="auto"
                            height="36px"
                            fontSize={16}
                            fontWeight={400}
                            borderRadius={8}
                        />
                    </Box>
                    <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"}>
                        <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '32px' }}>
                            {/* location */}
                            <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '4px' }}>
                                <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'start'} sx={{ gap: '8px' }}>
                                    <Typography color={theme.palette.text.primary} sx={{ fontSize: '12px', fontWeight: "600", fontStyle: "italic" }}>
                                        Địa điểm giao xe:
                                    </Typography>
                                </Box>
                                <Box
                                    className="custom-search-box"
                                    display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'} sx={{ cursor: 'pointer', gap: '4px' }} padding={"4px 0px"}
                                >
                                    <LocationOnOutlined sx={{ color: theme.palette.action.disabled }} />
                                    <Typography
                                        color={theme.palette.text.primary}
                                        sx={{ fontSize: '16px', fontWeight: "400", minWidth: '100px', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                    >
                                        Số nhà 21, hẻm 97/24/1 Văn Cao Số nhà 21, hẻm 97/24/1 Văn CaoSố nhà 21, hẻm 97/24/1 Văn CaoSố nhà 21, hẻm 97/24/1 Văn Cao
                                    </Typography>
                                </Box>
                            </Box>
                            {/* time */}
                            <Box width={"100%"} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '4px' }}>
                                <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '16px' }}>
                                    {/* start date */}
                                    <Typography width={"50%"} color={theme.palette.text.primary} sx={{ fontSize: '12px', fontWeight: "600", fontStyle: "italic" }}>
                                        Ngày nhận xe:
                                    </Typography>
                                    {/* end date */}
                                    <Typography width={"50%"} color={theme.palette.text.primary} sx={{ fontSize: '12px', fontWeight: "600", fontStyle: "italic" }}>
                                        Ngày trả xe:
                                    </Typography>
                                </Box>
                                <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '16px' }}>
                                    {/* start date */}
                                    <Box width={"50%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '4px' }}>
                                        {/* icon calendar */}
                                        <CalendarTodayOutlined sx={{ color: theme.palette.action.disabled }} />
                                        {/* box typography */}
                                        <Typography
                                            color={theme.palette.text.primary}
                                            sx={{ fontSize: '16px', fontWeight: "400" }}
                                            noWrap
                                        >
                                            12-11-2021 12:00
                                        </Typography>
                                    </Box>
                                    {/* start date */}
                                    <Box width={"50%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '4px' }}
                                        padding={"4px 0px"}>
                                        {/* icon calendar */}
                                        <CalendarTodayOutlined sx={{ color: theme.palette.action.disabled }} />
                                        {/* box typography */}
                                        <Typography
                                            color={theme.palette.text.primary}
                                            sx={{ fontSize: '16px', fontWeight: "400" }}
                                            noWrap
                                        >
                                            14-11-2021 12:00
                                        </Typography>
                                    </Box>

                                </Box>
                            </Box>
                        </Box>
                        <MyIcon
                            icon={
                                open ? <KeyboardArrowUp /> :
                                    <KeyboardArrowDown />
                            }
                            position='bottom'
                            hasTooltip
                            tooltipText={t("postMotorbike.registedForm.moreInfor")}
                            onClick={() => {
                                setOpen(!open);
                            }}
                        />
                    </Box>
                    <Divider />
                    <AnimatedBox sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'space-evenly',
                    }}
                        alignItems={'center'}
                        justifyContent={'center'}
                        isOpen={open}
                    >

                        {motorbikes.map((item: Motorbike, index: number) => (
                            <MotorbikeInforCard motorbike={item} isFavoritePage={false} />
                        ))}
                    </AnimatedBox>
                </Box>
            </Paper>
            {/* Các đơn hàng */}
            <Paper elevation={2} sx={{ width: '80%', bgcolor: 'background.paper' }}>
                <Box display={"flex"} flexDirection={"column"} gap={"16px"} p={3}>
                    <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"}>
                        <Typography
                            variant='h2'
                            color={theme.palette.text.primary}
                            fontSize={"24px"}
                            lineHeight={"36px"}
                            fontWeight={"600"}
                            sx={{ textAlign: 'center' }}>
                            Thông tin đơn hàng
                        </Typography>
                        <MyCustomButton
                            content={"Đặt xe"}
                            onClick={() => { }}
                            width="auto"
                            height="36px"
                            fontSize={16}
                            fontWeight={400}
                            borderRadius={8}
                        />
                    </Box>
                    <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"}>
                        <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '32px' }}>
                            {/* location */}
                            <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '4px' }}>
                                <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'start'} sx={{ gap: '8px' }}>
                                    <Typography color={theme.palette.text.primary} sx={{ fontSize: '12px', fontWeight: "600", fontStyle: "italic" }}>
                                        Địa điểm giao xe:
                                    </Typography>
                                </Box>
                                <Box
                                    className="custom-search-box"
                                    display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'} sx={{ cursor: 'pointer', gap: '4px' }} padding={"4px 0px"}
                                >
                                    <LocationOnOutlined sx={{ color: theme.palette.action.disabled }} />
                                    <Typography
                                        color={theme.palette.text.primary}
                                        sx={{ fontSize: '16px', fontWeight: "400", minWidth: '100px', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                    >
                                        Số nhà 21, hẻm 97/24/1 Văn Cao Số nhà 21, hẻm 97/24/1 Văn CaoSố nhà 21, hẻm 97/24/1 Văn CaoSố nhà 21, hẻm 97/24/1 Văn Cao
                                    </Typography>
                                </Box>
                            </Box>
                            {/* time */}
                            <Box width={"100%"} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '4px' }}>
                                <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '16px' }}>
                                    {/* start date */}
                                    <Typography width={"50%"} color={theme.palette.text.primary} sx={{ fontSize: '12px', fontWeight: "600", fontStyle: "italic" }}>
                                        Ngày nhận xe:
                                    </Typography>
                                    {/* end date */}
                                    <Typography width={"50%"} color={theme.palette.text.primary} sx={{ fontSize: '12px', fontWeight: "600", fontStyle: "italic" }}>
                                        Ngày trả xe:
                                    </Typography>
                                </Box>
                                <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '16px' }}>
                                    {/* start date */}
                                    <Box width={"50%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '4px' }}>
                                        {/* icon calendar */}
                                        <CalendarTodayOutlined sx={{ color: theme.palette.action.disabled }} />
                                        {/* box typography */}
                                        <Typography
                                            color={theme.palette.text.primary}
                                            sx={{ fontSize: '16px', fontWeight: "400" }}
                                            noWrap
                                        >
                                            12-11-2021 12:00
                                        </Typography>
                                    </Box>
                                    {/* start date */}
                                    <Box width={"50%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '4px' }}
                                        padding={"4px 0px"}>
                                        {/* icon calendar */}
                                        <CalendarTodayOutlined sx={{ color: theme.palette.action.disabled }} />
                                        {/* box typography */}
                                        <Typography
                                            color={theme.palette.text.primary}
                                            sx={{ fontSize: '16px', fontWeight: "400" }}
                                            noWrap
                                        >
                                            14-11-2021 12:00
                                        </Typography>
                                    </Box>

                                </Box>
                            </Box>
                        </Box>
                        <MyIcon
                            icon={
                                open ? <KeyboardArrowUp /> :
                                    <KeyboardArrowDown />
                            }
                            position='bottom'
                            hasTooltip
                            tooltipText={t("postMotorbike.registedForm.moreInfor")}
                            onClick={() => {
                                setOpen(!open);
                            }}
                        />
                    </Box>
                    <Divider />
                    <AnimatedBox sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'space-evenly',
                    }}
                        alignItems={'center'}
                        justifyContent={'center'}
                        isOpen={open}
                    >

                        {motorbikes.map((item: Motorbike, index: number) => (
                            <MotorbikeInforCard motorbike={item} isFavoritePage={false} />
                        ))}
                    </AnimatedBox>
                </Box>
            </Paper>
        </Box>
    );
}

export default CartPage;
