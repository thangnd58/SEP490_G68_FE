import React, { useContext, useEffect, useMemo, useState } from 'react'
import { BookingRequest, BookingResponse, Motorbike } from '../../utils/type'
import { Box, CircularProgress, Divider, IconButton, MenuItem, Modal, Paper, TextField, Typography } from '@mui/material';
import theme from '../../utils/theme';
import useThemePage from '../../hooks/useThemePage';
import MyIcon from '../../components/common/MyIcon';
import { ArrowDownward, ArrowUpward, CloseOutlined, HelpOutlineOutlined, LocationOnOutlined, Loyalty, MyLocation, ReportProblemOutlined } from '@mui/icons-material';
import { ModalContext } from '../../contexts/ModalContext';
import usei18next from '../../hooks/usei18next';
import { MotorbikeBookingCard } from '../MotorbikePage/components/MotorbikeBookingCard';
import { RequireWhenRent } from '../MotorbikePage/components/RequireWhenRent';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import MyCustomButton from '../../components/common/MyButton';
import UserService from '../../services/UserService';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { BookingDeliveryMode, BookingPaymentType, ROUTES } from '../../utils/Constant';
import { BookingService } from '../../services/BookingService';
import ToastComponent from '../../components/toast/ToastComponent';
import { formatMoneyNew } from '../../utils/helper';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import RegisterMotorbikeItem from '../PostMotorbike/components/RegisterMotorbike/RegisterMotorbikeItem';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { PromotionModal } from '../MotorbikePage/components/PromotionModal';
import { ConfirmMotorbikeBookingModal } from '../MotorbikePage/components/ConfirmMotorbikeBookingModal';
import styled from '@emotion/styled';

interface Location {
  lat: number,
  lng: number,
}

interface AnimatedBoxProps {
  isOpen: boolean;
}

const AnimatedBox = styled(Box) <AnimatedBoxProps>`
  transition: all 2s ease;
  overflow: hidden;
  height: ${(props) => (props.isOpen ? 'auto' : '0')};
  opacity: ${(props) => (props.isOpen ? '1' : '0')};
`;


export const BookingInfoMultipleMotorbikeModal = (props: { motorbikes: Motorbike[]; address: string; startDate: string; endDate: string; bookingCartId: number }) => {
  const { isMobile, isIpad } = useThemePage();
  const { closeModal, setContentModal, setShowModal } = useContext(ModalContext);
  const { t, isVn } = usei18next();
  const { RangePicker } = DatePicker;
  const [isProcessingBooking, setIsProcessingBooking] = useState(false);
  const [previewBookingData, setPreviewBookingData] = useState<BookingResponse>();
  const [isMapModalOpen, setMapModalOpen] = useState(false);
  const [location, setLocation] = useState<Location>();
  const [isModalPromotionOpen, setModalPromotionOpen] = useState(false);
  const [isModalConfirmBookingOpen, setModalConfirmBookingOpen] = useState(false);
  const [openDetailDeliveryFee, setOpenDetailDeliveryFee] = useState(false);

  // format number * 1000 to type 1.000 VND/ngày
  const formatMoney = (money: number | undefined) => {
    if (money) {
      return (money * 1000).toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
    }
    return '0 VND';
  }

  useEffect(() => {
    BookingService.getLatLngByAddress(props?.address || "Hà nội").then((data) => {
      const location = data.split(',');
      const result: Location = {
        lat: Number(location[0]),
        lng: Number(location[1])
      }
      setSelected(result)
      setFieldValue("lat", result.lat);
      setFieldValue("lng", result.lng);
    })
  }, [props?.address])

  const formik = useFormik({
    initialValues: {
      address: props?.address,
      lat: 0,
      lng: 0,
      startDate: props?.startDate,
      endDate: props?.endDate,
      paymentType: BookingPaymentType.UserBalance,
      deliveryMode: BookingDeliveryMode.DeliveryService,
      couponCode: ""
    },
    validationSchema: Yup.object({
      address: Yup.string().required(t("postMotorbike.registedForm.addressRequired")),
      startDate: Yup.string().required(t("postMotorbike.registedForm.startDateRequired")),
      endDate: Yup.string().required(t("postMotorbike.registedForm.endDateRequired")),
    }),

    onSubmit: async (values) => {
      try {
        setIsProcessingBooking(true);
        const request = {
          motorbikeId: props?.motorbikes.map((mt) => mt.id).join(",") || "0",
          address: values.address || "",
          deliveryMode: values.deliveryMode,
          startDatetime: values.startDate || "",
          endDatetime: values.endDate || "",
          couponCode: values.couponCode || "",
          paymentType: BookingPaymentType.Card,
          bookingCartId: props.bookingCartId
        }
        const res = await BookingService.postBooking(request)
        ToastComponent(t("booking.toast.success"), "success")
        // wait 1s to reload page
        setTimeout(() => {
          window.location.href = `/${ROUTES.booking.detail}/${res}`;
          setIsProcessingBooking(false);
        }, 2000);
      } catch (error) {
        ToastComponent(t("booking.toast.error"), "error")
      }
    }
  }
  );

  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    setFieldValue
  } = formik;

  // MAP CONTROLLER
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string,
    libraries: ["places"],
  });

  // declare vaiables
  const defaultDeliveryLoction = useMemo(() => ({ lat: values.lat, lng: values.lng }), []);
  const [selected, setSelected] = useState<Location>(defaultDeliveryLoction);
  const [showMenu, setShowMenu] = useState(false);
  const defaultLoctionMotorbike = useMemo(() => ({ lat: location?.lat || 10.762622, lng: location?.lng || 106.660172 }), [location]);

  // ADDRESS MODAL CONTROLLER
  const openMapModal = () => {
    setMapModalOpen(true);
  };

  const closeMapModal = () => {
    setMapModalOpen(false);
  };



  useEffect(() => {
    const bookingPreview: BookingRequest = {
      motorbikeId: props?.motorbikes.map((mt) => mt.id).join(",") || "0",
      address: values.address || "",
      deliveryMode: values.deliveryMode,
      startDatetime: values.startDate || "",
      endDatetime: values.endDate || "",
      couponCode: values.couponCode || ""
    }
    BookingService.getPreviewBooking(bookingPreview).then((data) => {
      setPreviewBookingData(data)
      if (data.motorbikes.filter((m) => m.status === "NotAvailable").length > 0) {
        data.motorbikes.filter((m) => m.status === "NotAvailable").map((m1) => {
          ToastComponent(isVn ? m1.statusComment.vi : m1.statusComment.en, "warning")
        })
        setIsProcessingBooking(true)
      }
      if (data.promotion && data.promotion.status === "NotAvailable") {
        ToastComponent(isVn ? data.promotion.statusComment[0].vi : data.promotion.statusComment[0].en, "warning")
        setFieldValue("couponCode", "")
      }
    })
  }, [props?.motorbikes, values.address, values.startDate, values.endDate, values.couponCode])

  // handle change address
  const {
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  useEffect(() => {
    if (values.address)
      setValue(values.address);
    if (values.deliveryMode === BookingDeliveryMode.SelfPickup) {
      setFieldValue("deliveryMode", BookingDeliveryMode.DeliveryService)
    }
  }, [values.address]);

  // handle select address
  const handleSelect = async (address: any) => {
    setValue(address, false);
    clearSuggestions();
    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);
    setSelected({ lat, lng });
    setFieldValue("lat", lat);
    setFieldValue("lng", lng);
    setFieldValue("address", address);
    setShowMenu(false);
  };

  // handle get location click then set default location motorbike
  const handleGetLocationClick = () => {
    setFieldValue("deliveryMode", BookingDeliveryMode.SelfPickup)
    if (props.address) {
      setValue(props.address);
      setFieldValue("address", props.address);
      setFieldValue("lat", location?.lat);
      setFieldValue("lng", location?.lng);
      setShowMenu(false);
    }
  };

  // handle double click on map
  const handleDoubleClick = (e: any) => {
    setSelected({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    });

    getGeocode({
      location: {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      },
    }).then((results) => {
      setValue(results[0].formatted_address, false);
      setFieldValue("address", results[0].formatted_address);
      setFieldValue("lat", e.latLng.lat());
      setFieldValue("lng", e.latLng.lng());
      setShowMenu(false);
    });
  };

  return (
    <>
      <Modal
        open={true}
        aria-labelledby="map-modal-title"
        aria-describedby="map-modal-description"
        className='hiddenSroll'
        sx={{
          display: 'flex',
          alignItems: 'start',
          justifyContent: 'center',
          margin: '32px 0px',
          overflowY: 'auto',
        }}>
        <Box width={"95%"} height={"auto"}
          sx={{
            backgroundColor: '#fff',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
              backgroundColor: '#fff',
              borderBottom: '1px solid #E0E0E0',
            }}
            height={"10%"}
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            padding={"32px"}
            position={"sticky"}
            top={0}
            zIndex={1000}
          >
            <Typography variant='h2' color={theme.palette.text.primary} fontSize={isMobile ? "24px" : "32px"} fontWeight={600} textAlign={"start"}>
              Thông tin đặt xe
            </Typography>
            <Box height={"10%"} display={"flex"} flexDirection={"row"} justifyContent={"flex-end"} alignItems={"center"}>
              <MyIcon icon={<CloseOutlined />} hasTooltip tooltipText={t("postMotorbike.registedForm.badge-close")} onClick={closeModal} position='bottom' />
            </Box>
          </Box>
          <Box
            sx={{
              borderBottomLeftRadius: "8px",
              borderBottomRightRadius: "8px",
              backgroundColor: '#fff',
            }}
            height={"90%"}
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            padding={"32px 64px"}
          >
            <Paper elevation={2} sx={{ width: '100%', bgcolor: "#fff" }}>
              <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"} padding={"32px"} gap={"32px"} >
                <Box width={"100%"} display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"} gap={"16px"} >

                  {
                    props.motorbikes && props.motorbikes.length > 0 &&
                    props.motorbikes.map((motor, index) => {
                      return (
                        <MotorbikeBookingCard key={`${index}_motor`} motorbike={motor} isMobile={isMobile} />
                      )
                    })
                  }
                </Box>
                <Divider sx={{ width: "100%" }} variant="fullWidth" />

                <Box width={"100%"} display={"flex"} flexDirection={"row"} justifyContent={"center"} alignItems={"start"} gap={"16px"} >
                  <Box width={"60%"} display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"} gap={"16px"} >
                    <RequireWhenRent />
                  </Box>
                  {/* Hóa đơn thanh toán */}
                  <Box width={"40%"} display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"start"} gap={"8px"} >
                    <Typography color={theme.palette.text.primary} sx={{ fontSize: '16px', fontWeight: "700", }}>
                      Thanh Toán
                    </Typography>
                    <Box
                      sx={{
                        backgroundColor: "rgba(139, 69, 19, 0.05)",
                        borderRadius: "8px",
                        minHeight: "300px",
                        width: "90%",
                      }}
                      margin={isIpad || isMobile ? "16px 0px" : "0px 0px"}
                      width={isIpad || isMobile ? "auto" : "35%"}
                      display="flex"
                      flexDirection="column"
                      alignItems="start"
                      padding="16px"
                    >{
                        props.motorbikes && props.motorbikes.length > 0 &&
                        <Box display="flex" flexDirection="row" alignItems="center" width={"100%"} justifyContent={"flex-start"} >
                          <Typography color={theme.palette.text.primary} sx={{ fontSize: '24px', fontWeight: "600", }}>
                            {`${formatMoneyNew(props.motorbikes.reduce((total, mt) => {
                              if (mt && mt.priceRent !== undefined) {
                                return total + mt.priceRent;
                              } else {
                                return total;
                              }
                            }, 0) || 0)}/${t("booking.perDay")}`} x  {props.motorbikes.length} {t("booking.perMotorbike")}
                          </Typography>
                        </Box>
                      }
                      <Box display="flex" flexDirection="column" alignItems="start" width={"100%"} justifyContent={"space-between"}>
                        {/* Line */}
                        <Divider sx={{ margin: "16px 0px", width: "100%" }} variant="fullWidth" />
                        {/* Chọn ngày giờ */}
                        <Box display={'flex'} flexDirection={'column'} alignItems={'center'} width={"100%"} justifyContent={'center'} sx={{ gap: '4px' }}>
                          <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'}>
                            {/* start date */}
                            <Typography width={"50%"} color={theme.palette.text.primary} sx={{ fontSize: '12px', fontWeight: "600", fontStyle: "italic" }}>
                              {t("booking.startDate")}
                            </Typography>
                            {/* end date */}
                            <Typography width={"50%"} color={theme.palette.text.primary} sx={{ fontSize: '12px', fontWeight: "600", fontStyle: "italic" }}>
                              {t("booking.endDate")}
                            </Typography>
                          </Box>
                          <RangePicker
                            className="custom-range-picker"
                            style={{
                              fontFamily: 'Inter',
                              fontStyle: 'normal',
                              fontSize: '20px',
                              height: '48px',
                            }}
                            size='large'
                            showTime={{ format: 'HH:mm' }}
                            format="DD-MM-YYYY HH:mm"
                            placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                            value={[
                              dayjs(values.startDate, "DD-MM-YYYY HH:mm"),
                              dayjs(values.endDate, "DD-MM-YYYY HH:mm"),
                            ]}
                            onChange={(dates, dateStrings) => {
                              setFieldValue('startDate', dateStrings[0]);
                              setFieldValue('endDate', dateStrings[1]);
                            }}
                            allowClear={false}
                          />
                        </Box>
                        {/* Chọn vị trí trả xe */}
                        <Box width={"100%"} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '4px' }} marginTop={'8px'}>
                          <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'start'} sx={{ gap: '8px' }}>
                            <Typography color={theme.palette.text.primary} sx={{ fontSize: '12px', fontWeight: "600", fontStyle: "italic" }}>
                              {t("booking.addressGetMotorbike")}
                            </Typography>
                          </Box>
                          <Box
                            className="custom-search-box-1"
                            width={"100%"}
                            display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'start'} sx={{ cursor: 'pointer', gap: '8px' }}
                            onClick={openMapModal}
                          >
                            <LocationOnOutlined sx={{
                              color: theme.palette.action.disabled,
                              marginLeft: '8px',
                            }} />
                            <Typography
                              color={theme.palette.text.primary}
                              sx={{ fontSize: '16px', fontWeight: "400", minWidth: '100px', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                              padding={'11px 0px'}
                              onChange={handleChange}
                            >
                              {values.address}
                            </Typography>
                          </Box>
                        </Box>
                        {/* Cảnh báo */}
                        {
                          // kiểm tra bất kỳ xe nào có trạng thái NotAvailable thì hiện cảnh báo                          
                          previewBookingData && previewBookingData.motorbikes.length > 0 && previewBookingData.status === "NotAvailable" &&
                          <Box pt={"8px"} display={'flex'} flexDirection={'row'} alignItems={'start'} justifyContent={'center'} sx={{ gap: '8px' }}>
                            <ReportProblemOutlined sx={{ color: "#f44747" }} />
                            {/* Lấy ra bất kỳ một xe nào có trạng thái NotAvailable */}
                            {
                              previewBookingData.motorbikes
                                .filter((m) => m.status === "NotAvailable")
                                .slice(0, 1) // Chỉ lấy phần tử đầu tiên
                                .map((m1) => (
                                  <Typography
                                    variant="h5"
                                    color={"#FF0000"}
                                    fontWeight="400"
                                    fontSize={isMobile ? "12px" : "14px"}
                                    textAlign={"justify"}
                                  >
                                    {isVn ? m1.statusComment[0].vi : m1.statusComment[0].en}
                                  </Typography>
                                ))
                            }
                          </Box>
                        }
                        {/* Line */}
                        <Divider sx={{ margin: "16px 0px", width: "100%" }} variant="fullWidth" />
                        {/* Đơn giá */}
                        <Box width={"100%"} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '4px' }}>
                          {/* Đơn giá thuê */}
                          <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }}>
                            <Typography color={theme.palette.text.primary} sx={{ fontSize: '16px', fontWeight: "400", }}>
                              {t("booking.pricePerday")}
                            </Typography>
                            <Typography color={theme.palette.text.primary} sx={{ fontSize: '16px', fontWeight: "600", }}>
                              {`${formatMoneyNew(props.motorbikes.reduce((total, mt) => {
                                if (mt && mt.priceRent !== undefined) {
                                  return total + mt.priceRent;
                                } else {
                                  return total;
                                }
                              }, 0) || 0)}/${t("booking.perDay")}`} x {props.motorbikes.length} {t("booking.perMotorbike")}
                            </Typography>
                          </Box>
                        </Box>
                        {/* Phí vận chuyển */}
                        {
                          // kiểm tra xem có xe nào mất phí vận chuyển không
                          previewBookingData && previewBookingData.motorbikes.filter((m) => m.totalFeeOfDelivery !== 0).length > 0 && (
                            <>
                              {/* Line */}
                              <Divider sx={{ margin: "16px 0px", width: "100%" }} variant="fullWidth" />
                              <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }}>
                                <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }}>
                                  <Typography color={theme.palette.text.primary} sx={{ fontSize: '16px', fontWeight: "400", }}>
                                    {t("booking.deliveryFee")}
                                  </Typography>
                                </Box>
                                <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>

                                  <Typography color={theme.palette.text.primary} sx={{ fontSize: '16px', fontWeight: "600", }}>
                                    {/* hiện tổng số tiền của những xe bị mất phí vận chuyển */}
                                    {formatMoney(previewBookingData?.motorbikes.filter((m) => m.totalFeeOfDelivery !== 0).reduce((total, mt) => {
                                      if (mt && mt.totalFeeOfDelivery !== undefined) {
                                        return total + mt.totalFeeOfDelivery;
                                      } else {
                                        return total;
                                      }
                                    }, 0))}
                                  </Typography>
                                  <MyIcon icon={
                                    openDetailDeliveryFee ?
                                      <ArrowUpward sx={{
                                        color: theme.palette.text.primary,
                                        width: "16px",
                                        height: "16px",
                                        cursor: "pointer"
                                      }}
                                      /> : <ArrowDownward sx={{
                                        color: theme.palette.text.primary,
                                        width: "16px",
                                        height: "16px",
                                        cursor: "pointer"
                                      }}
                                      />
                                  } hasTooltip tooltipText={"Chi tiết"} onClick={() => {
                                    setOpenDetailDeliveryFee(!openDetailDeliveryFee)
                                  }} position='right-start' />
                                </Box>
                              </Box>
                              <AnimatedBox isOpen={openDetailDeliveryFee} width={"100%"} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '4px' }}>
                                {
                                  // lấy ra list xe mất phí vận chuyển
                                  previewBookingData.motorbikes.filter((m) => m.totalFeeOfDelivery !== 0).map((motorbike, index) => {
                                    return (
                                      <Box width={"95%"} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '4px' }} key={`${index}_delivery`}>
                                        <Divider sx={{ margin: "8px 0px 0px 0px", width: "100%" }} variant="fullWidth" />
                                        <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }}>
                                          <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }}>
                                            <Typography color={theme.palette.text.primary} sx={{ fontSize: '14px', fontWeight: "700", fontStyle: 'italic' }}>
                                              {motorbike.model}
                                            </Typography>
                                            <MyIcon icon={
                                              <LocationOnOutlined sx={{
                                                color: theme.palette.text.primary,
                                                width: "14px",
                                                height: "14px",
                                                cursor: "pointer"
                                              }}
                                              />
                                            } hasTooltip tooltipText={
                                              `${motorbike.address}`
                                            } onClick={() => {
                                            }} position='right-start' />
                                          </Box>
                                        </Box>
                                        <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }}>
                                          <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }}>
                                            <Typography color={theme.palette.text.primary} sx={{ fontSize: '14px', fontWeight: "400", }}>
                                              {t("booking.distance")}
                                            </Typography>
                                            <MyIcon icon={
                                              <HelpOutlineOutlined sx={{
                                                color: theme.palette.text.primary,
                                                width: "12px",
                                                height: "12px",
                                                cursor: "pointer"
                                              }}
                                              />
                                            } hasTooltip tooltipText={
                                              t("booking.distance_hint")
                                            } onClick={() => {
                                            }} position='right-start' />

                                          </Box>
                                          <Typography color={theme.palette.text.primary} sx={{ fontSize: '14px', fontWeight: "600", }}>
                                            {motorbike.distance.toFixed(1)} km
                                          </Typography>
                                        </Box>
                                        <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }}>
                                          <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }}>
                                            <Typography color={theme.palette.text.primary} sx={{ fontSize: '14px', fontWeight: "400", }}>
                                              {t("booking.freeDeliveryDistance")}
                                            </Typography>
                                            <MyIcon icon={
                                              <HelpOutlineOutlined sx={{
                                                color: theme.palette.text.primary,
                                                width: "12px",
                                                height: "12px",
                                                cursor: "pointer"
                                              }}
                                              />
                                            } hasTooltip tooltipText={
                                              t("booking.freeDeliveryDistance_hint")
                                            } onClick={() => {
                                            }} position='right-start' />

                                          </Box>
                                          <Typography color={theme.palette.text.primary} sx={{ fontSize: '14px', fontWeight: "600", }}>
                                            {motorbike.freeDeliveryRange.toFixed(1)} km
                                          </Typography>
                                        </Box>
                                        <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }}>
                                          <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }}>
                                            <Typography color={theme.palette.text.primary} sx={{ fontSize: '14px', fontWeight: "400", }}>
                                              {t("booking.deliveryFee")}
                                            </Typography>
                                            <MyIcon icon={
                                              <HelpOutlineOutlined sx={{
                                                color: theme.palette.text.primary,
                                                width: "12px",
                                                height: "12px",
                                                cursor: "pointer"
                                              }}
                                              />
                                            } hasTooltip tooltipText={
                                              `${t("booking.deliveryFee_hint")} ${formatMoney(motorbike.feeOfDeliveryPerKm)}`
                                            } onClick={() => {
                                            }} position='right-start' />

                                          </Box>
                                          <Typography color={theme.palette.text.primary} sx={{ fontSize: '14px', fontWeight: "600", }}>
                                            {formatMoney(motorbike.totalFeeOfDelivery)} x {motorbike.deliveryDistanceChargeable.toFixed(1)
                                            } km
                                          </Typography>
                                        </Box>
                                      </Box>
                                    )
                                  })
                                }
                              </AnimatedBox>
                            </>
                          )
                        }
                        {/* Line */}
                        <Divider sx={{ margin: "16px 0px", width: "100%" }} variant="fullWidth" />

                        {/* Tổng tiền và app mã khuyến mãi */}
                        <Box width={"100%"} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '8px' }}>
                          {/* Tổng tiền */}
                          <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }}>
                            <Typography color={theme.palette.text.primary} sx={{ fontSize: '16px', fontWeight: "400", }}>
                              {t("booking.totalPriceRent")}
                            </Typography>
                            <Typography color={theme.palette.text.primary} sx={{ fontSize: '16px', fontWeight: "600", }}>
                              {formatMoney(previewBookingData?.totalAmountTemp)} x {previewBookingData?.rentalDays} {t("booking.perDay")}
                            </Typography>
                          </Box>
                          {/* Phí dịch vụ */}
                          <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }}>
                            <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }}>
                              <Typography color={theme.palette.text.primary} sx={{ fontSize: isMobile ? "14px" : '16px', fontWeight: "400", }}>
                                {t("booking.totalPriceService")}
                              </Typography>
                              <MyIcon icon={
                                <HelpOutlineOutlined sx={{
                                  color: theme.palette.text.primary,
                                  width: "12px",
                                  height: "12px",
                                  cursor: "pointer"
                                }}
                                />
                              } hasTooltip tooltipText={
                                t("booking.totalPriceService_hint")
                              } onClick={() => {
                              }} position='right-start' />
                            </Box>
                            <Typography color={theme.palette.text.primary} sx={{ fontSize: '16px', fontWeight: "600", }}>
                              {formatMoney(previewBookingData?.feeOfService)}
                            </Typography>
                          </Box>
                          {/* Mã khuyến mãi */}
                          {
                            values.couponCode !== "" &&
                            <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }}>
                              <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
                                <Typography color={theme.palette.text.primary} sx={{ fontSize: '16px', fontWeight: "400", }}>
                                  {t("booking.promotionCode")}: <span style={{ textTransform: 'uppercase', fontWeight: '700' }}>{values.couponCode}</span>
                                </Typography>
                                <MyIcon icon={<CloseOutlined sx={{ color: "#000", width: "14px", height: "14px" }} />} hasTooltip tooltipText={t("dashBoardManager.brand.delete")} onClick={() => {
                                  setFieldValue("couponCode", "")
                                }} position='right' />
                              </Box>
                              <Typography color={theme.palette.text.primary} sx={{ fontSize: '16px', fontWeight: "600", }}>
                                {formatMoney(previewBookingData?.promotion?.reducedAmount)}
                              </Typography>
                            </Box>
                          }
                          <MyCustomButton iconPosition='left' icon={<Loyalty sx={{ color: "#8B4513" }} />} width='100%'
                            onClick={
                              () => setModalPromotionOpen(true)
                            }
                            content={t("booking.promotionCode")} variant='outlined' />

                        </Box>
                        {/* Line */}
                        <Divider sx={{ margin: "16px 0px", width: "100%" }} variant="fullWidth" />

                        {/* Tổng tiền */}
                        <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }}>
                          <Typography color={theme.palette.text.primary} sx={{ fontSize: '16px', fontWeight: "600", }}>
                            {t("booking.totalPrice")}
                          </Typography>
                          <Typography color={theme.palette.text.primary} sx={{ fontSize: '16px', fontWeight: "600", }}>
                            {formatMoney(previewBookingData?.totalAmount)}
                          </Typography>
                        </Box>
                        {/* Line */}
                        <Divider sx={{ margin: "16px 0px", width: "100%" }} variant="fullWidth" />

                        {/* Button */}
                        {
                          UserService.isLoggedIn() ?
                            <MyCustomButton disabled={isProcessingBooking}
                              width='100%' onClick={() => {
                                setModalConfirmBookingOpen(true)
                              }} content={t("booking.bookMotorbikeButton")} variant='contained' />
                            :
                            <a style={{ width: '100%' }} href={ROUTES.account.login}>
                              <MyCustomButton disabled={isProcessingBooking}
                                width='100%' content={t("booking.loginToContinue")} variant='contained' />
                            </a>
                        }
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>

            </Paper>
          </Box>
        </Box>

      </Modal>


      {/* modal address */}
      <Modal
        open={isMapModalOpen}
        aria-labelledby="map-modal-title"
        aria-describedby="map-modal-description"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflowY: 'auto',
          zIndex: 10000
        }}
      >
        <Box width={isMobile ? "70%" : "50%"} height={"auto"} sx={{
          padding: "16px 32px",
          backgroundColor: 'white',
          borderRadius: '8px',
        }}>
          <Box width={"100%"} height={"10%"} display={"flex"} flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"}>
            <Typography variant='h2' color={theme.palette.text.primary} fontSize={isMobile ? "20px" : "24px"} fontWeight={600} textAlign={"start"}>
              {t("postMotorbike.registedForm.selectAddress")}
            </Typography>
            <Box height={"10%"} display={"flex"} flexDirection={"row"} justifyContent={"flex-end"} alignItems={"center"}>
              <MyIcon icon={<CloseOutlined />} hasTooltip tooltipText={t("postMotorbike.registedForm.badge-close")} onClick={closeMapModal} position='bottom' />
            </Box>
          </Box>
          <Box width={"100%"} height={"80%"} display={"flex"} flexDirection={"column"} justifyContent={"start"} alignItems={"center"}>
            <RegisterMotorbikeItem
              fontSizeTitle='16px'
              title={t("postMotorbike.registedForm.address")}
              isRequired={true}
              item={
                (!isLoaded)
                  ? (
                    <Box sx={{
                      display: 'flex', justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "row"
                    }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <>
                      <Box style={{ position: "relative", width: "100%" }}>
                        <TextField
                          sx={{
                            width: "100%",
                            "& .MuiOutlinedInput-root fieldset": { borderRadius: "8px" },
                            "& .MuiOutlinedInput-root:hover fieldset": {
                              borderColor: theme.palette.primary.main,
                            },
                            "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                              borderColor: theme.palette.primary.main,
                            }
                          }}
                          // disabled={values.province === "" || values.district === "" || values.ward === ""}
                          placeholder={t("component.MyMapWithSearchBox.searchPlaceholder")}
                          fullWidth
                          value={value}
                          SelectProps={{
                            native: true,
                          }}
                          onChange={(e: any) => {
                            setValue(e.target.value);
                            setShowMenu(true);
                            handleChange(e);
                          }}
                        ></TextField>
                        <Box
                          position="absolute"
                          display={showMenu ? "block" : "none"}
                          margin={"8px auto"}
                          width={"100%"}
                          top="100%"
                          zIndex="1"
                          sx={{ backgroundColor: "#E0E0E0" }}
                          borderRadius={"8px"}
                        >
                          {status === "OK" &&
                            data.map(({ place_id, description }) => (
                              <MenuItem
                                dense
                                sx={{
                                  cursor: "pointer",
                                  "&:hover": { backgroundColor: "#ebebeb" },
                                  width: "99%",
                                  color: "#000000",
                                  whiteSpace: "normal",
                                  wordWrap: "break-word",
                                }}
                                key={place_id}
                                value={description}
                                onClick={() => handleSelect(description)}
                              >
                                <Typography>{description}</Typography>
                              </MenuItem>
                            ))}
                        </Box>
                      </Box>
                      <Box
                        display={"flex"}
                        justifyContent={"start"}
                        alignItems={"center"}
                        flexDirection={"row"}
                        margin={"8px auto"}
                      >
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={handleGetLocationClick}
                        >
                          <MyLocation />
                        </IconButton>
                        <Typography variant="caption" fontSize={"12px"} color={theme.palette.text.secondary}>{"Lấy vị trí mặc định của xe"}</Typography>
                      </Box>

                      <Box
                        borderRadius={"10px"}
                        border={"3px solid"}
                        margin={"0px auto"}
                        width={"99%"}
                        justifyContent={"center"}
                        alignItems={"center"}
                        flexDirection={"column"}
                      >
                        <GoogleMap
                          zoom={18}
                          center={selected ? selected : defaultDeliveryLoction}
                          mapContainerStyle={{
                            width: "100%",
                            height: "40vh",
                            borderRadius: "8px",
                          }}
                          onDblClick={(e) => {
                            if (e.latLng) {
                              handleDoubleClick(e);
                            }
                          }}
                          options={{
                            disableDefaultUI: true,
                            zoomControl: true,
                            scrollwheel: true,
                            fullscreenControl: true,
                            zoomControlOptions: {
                              position: window.google.maps.ControlPosition.RIGHT_CENTER,
                            },
                            noClear: true,
                            styles: [
                              {
                                featureType: "poi",
                                elementType: "labels",
                                stylers: [{ visibility: "off" }],
                              },
                            ],
                            backgroundColor: "#fff",
                            clickableIcons: true,
                            scaleControl: true,
                            streetViewControl: true,
                            rotateControl: true,
                            mapTypeControl: true,
                            mapTypeControlOptions: {
                              style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                              position: window.google.maps.ControlPosition.TOP_CENTER,
                              mapTypeIds: [
                                window.google.maps.MapTypeId.ROADMAP,
                                window.google.maps.MapTypeId.SATELLITE,
                                window.google.maps.MapTypeId.HYBRID,
                                window.google.maps.MapTypeId.TERRAIN,
                              ],
                            },
                            panControl: true,
                            fullscreenControlOptions: {
                              position: window.google.maps.ControlPosition.RIGHT_CENTER,
                            },
                            gestureHandling: "greedy",
                            draggableCursor: "default",
                            draggingCursor: "grab",
                            mapId: "f1b7a8a9f0b1f1d",
                          }}
                        >
                          {selected &&
                            (
                              <>
                                <Marker position={selected} />
                                <TextField
                                  type='hidden'
                                  name="lat"
                                  value={selected.lat}
                                  onChange={handleChange}
                                />
                                <TextField
                                  type='hidden'
                                  name="lng"
                                  value={selected.lng}
                                  onChange={handleChange}
                                />
                              </>

                            )
                          }
                        </GoogleMap>
                      </Box>
                    </>
                  )

              }
              myButton={
                <Box
                  width={"100%"}
                  display={"flex"}
                  flexDirection={"row"}
                  justifyContent={"center"}
                  margin={"24px 0px 0px 0px"}>
                  <MyCustomButton
                    borderRadius={8}
                    fontSize={16}
                    fontWeight={600}
                    content={t("postMotorbike.registedForm.btnConfirm")}
                    onClick={closeMapModal} />
                </Box>
              }
            />
          </Box>
        </Box>
      </Modal>

      {/* modal promotion */}
      <PromotionModal minValue={previewBookingData?.totalAmount!} isModalPromotionOpen={isModalPromotionOpen} setModalPromotionOpen={setModalPromotionOpen} setFieldValue={setFieldValue} counponCode={values.couponCode} isMobile={isMobile} />

      {/*modal confirm booking*/}
      <ConfirmMotorbikeBookingModal
        isModalConfirmBookingOpen={isModalConfirmBookingOpen}
        setModalConfirmBookingOpen={setModalConfirmBookingOpen}
        values={values}
        isMobile={isMobile}
        motorbikes={props.motorbikes}
        previewBookingData={previewBookingData}
        isProcessingBooking={isProcessingBooking}
        handleSubmit={handleSubmit}
      />
    </>
  );
}

