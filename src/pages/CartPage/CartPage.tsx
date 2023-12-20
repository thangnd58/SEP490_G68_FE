import useThemePage from "../../hooks/useThemePage";
import {
    Typography,
    Box,
    Divider,
    FormControlLabel,
    RadioGroup,
    Paper,
    Grid,
    Avatar,
    CircularProgress,
    LinearProgress,
} from "@mui/material";
import usei18next from "../../hooks/usei18next";
import MyCustomButton from "../../components/common/MyButton";
import { useAppDispatch, useAppSelector } from "../../hooks/useAction";
import { useContext, useEffect, useRef, useState } from "react";
import { CartInforResponse, Motorbike } from "../../utils/type";
import theme from "../../utils/theme";
import { CalendarTodayOutlined, KeyboardArrowDown, KeyboardArrowUp, LocationOnOutlined } from "@mui/icons-material";
import ToastComponent from "../../components/toast/ToastComponent";
import MyIcon from "../../components/common/MyIcon";
import MotorbikeInforCard from "../HomePage/components/MotorbikeInforCard";
import styled from "@emotion/styled";
import { ModalContext } from "../../contexts/ModalContext";
import { BookingInfoMultipleMotorbikeModal } from "../BookMotorbike/BookingInfoMultipleMotorbikeModal";
import { BookingService } from "../../services/BookingService";
import { NoDataImage } from "../../assets/images";
import { getCartInfo } from "../../redux/reducers/cartReducer";
import { useNavigate } from "react-router-dom";

interface AnimatedBoxProps {
    isOpen: boolean;
}

const AnimatedBox = styled(Box) <AnimatedBoxProps>`
    transition: all 2s ease;
    overflow: hidden;
    height: ${(props) => (props.isOpen ? 'auto' : '0')};
    opacity: ${(props) => (props.isOpen ? '1' : '0')};
  `;

function CartPage() {
    const { isMobile, isIpad } = useThemePage();
    const { t } = usei18next();
    const { shoppingCart } = useAppSelector((state) => state.shoppingCartInfo);
    const dispatch = useAppDispatch();
    const { openModal } = useContext(ModalContext);
    const [open, setOpen] = useState(Array(shoppingCart?.length).fill(true));
    const [isDeleting, setIsDeleting] = useState(Array(shoppingCart?.length).fill(false));
    const [isLoad, setIsLoad] = useState(false);
    const navigate = useNavigate();

    const showModalBookingInfoMultipleMotorbike = (motorbikes: Motorbike[], address: string, startDate: string, endDate: string, bookingCartId: number) => {
        openModal(
            <BookingInfoMultipleMotorbikeModal
                motorbikes={motorbikes}
                address={address}
                startDate={startDate}
                endDate={endDate}
                bookingCartId={bookingCartId}
            />
        )
    }
    useEffect(() => {
        setIsLoad(true);
        // wait 1s to show loading
        setTimeout(() => {
            setIsLoad(false);
        }, 200);
    }, []);

    const linearProgressRef = useRef<HTMLElement>(null);

    const deleteMotorbikeInCart = async (index: number, motorbikeId: number, bookingCartId: number) => {
        try {
            // set is load of cart is deleting
            const newIsDeleting = [...isDeleting];
            newIsDeleting[index] = true;
            setIsDeleting(newIsDeleting);

            // if (linearProgressRef.current) {
            //     alert("scroll");
            //     linearProgressRef.current?.scrollIntoView({
            //         behavior: "smooth"
            //     });
            // }

            const response = await BookingService.deleteMotorbikeInCart(motorbikeId, bookingCartId);
            if (response) {
                dispatch(getCartInfo()).then(() => {
                    const newIsDeleting = [...isDeleting];
                    newIsDeleting[index] = false;
                    setIsDeleting(newIsDeleting);
                });
                ToastComponent(t("toast.ShoppingCart.delete.success"), "success");
            }
            else {
                ToastComponent(t("toast.ShoppingCart.delete.warning"), "warning");
            }
        } catch (error) {
            ToastComponent(t("toast.ShoppingCart.delete.error"), "error");
        }
    }

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
                {t("editional.cart")}
            </Typography>

            {/* Check giỏ hàng trống */}

            {isLoad ? (<Box width={"100%"} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '8px' }}>
                <CircularProgress />
            </Box>) : (
                shoppingCart.length === 0 ?
                    (
                        <Box width={"100%"} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '8px' }}>
                            <img src={NoDataImage} alt="image" style={{ width: '400px', height: '400px' }} />
                        </Box>
                    ) : (
                        shoppingCart.slice().reverse().map((item: CartInforResponse, index: number) => (
                            <Paper key={index} elevation={2} sx={{
                                width: '80%', bgcolor: 'background.paper',
                                animation: "fadeInDown 1s ease-out"
                            }}>
                                <Box display={"flex"} flexDirection={"column"} gap={"16px"} p={3}>
                                    <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"}>
                                        <Typography
                                            variant='h2'
                                            color={theme.palette.text.primary}
                                            fontSize={"24px"}
                                            lineHeight={"36px"}
                                            fontWeight={"600"}
                                            sx={{ textAlign: 'center' }}>
                                            {index + 1}. {t("editional.orderInfor")}
                                        </Typography>
                                        <MyCustomButton
                                            content={t("editional.book")}
                                            onClick={() => { showModalBookingInfoMultipleMotorbike(item.motorbikes, item.address, item.startDatetime, item.endDatetime, item.bookingCartId) }}
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
                                                    {t("editional.delivery")}
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
                                                        {item.address}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            {/* time */}
                                            <Box width={"100%"} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '4px' }}>
                                                <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '16px' }}>
                                                    {/* start date */}
                                                    <Typography width={"50%"} color={theme.palette.text.primary} sx={{ fontSize: '12px', fontWeight: "600", fontStyle: "italic" }}>
                                                        {t("editional.datePickUp")}
                                                    </Typography>
                                                    {/* end date */}
                                                    <Typography width={"50%"} color={theme.palette.text.primary} sx={{ fontSize: '12px', fontWeight: "600", fontStyle: "italic" }}>
                                                       {t("editional.dateDropOff")}
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
                                                            {item.startDatetime}
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
                                                            {item.endDatetime}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </Box>
                                        <MyIcon
                                            icon={
                                                open[index] ? <KeyboardArrowUp /> :
                                                    <KeyboardArrowDown />
                                            }
                                            position='bottom'
                                            hasTooltip
                                            tooltipText={t("dashBoardManager.news.viewsMore")}
                                            onClick={() => {
                                                const newOpenState = [...open];
                                                newOpenState[index] = !newOpenState[index];
                                                setOpen(newOpenState);
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
                                        gap: '16px',
                                    }}
                                        alignItems={'center'}
                                        justifyContent={'center'}
                                        isOpen={open[index]}
                                    >
                                        {item.motorbikes.map((motorbike: Motorbike, index1: number) => (
                                            <Box key={index1} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '16px' }}>
                                                <MotorbikeInforCard key={index1} motorbike={motorbike} isInCart={true} isFavoritePage={false} startDate={item.startDatetime} endDate={item.endDatetime} searchedAddress={item.address} deleteInCart={
                                                    () => {
                                                        deleteMotorbikeInCart(index, motorbike.id!, item.bookingCartId)
                                                    }}
                                                    isNotFavorite />
                                            </Box>
                                        ))}
                                        {
                                            isDeleting[index] &&
                                            <LinearProgress ref={linearProgressRef} sx={{ width: '100%' }} />
                                        }
                                    </AnimatedBox>
                                </Box>
                            </Paper>
                        ))))}
        </Box>
    );
}

export default CartPage;
