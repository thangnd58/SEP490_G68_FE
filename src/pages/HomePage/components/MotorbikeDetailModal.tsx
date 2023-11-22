import React, { useContext, useEffect, useMemo, useState } from 'react'
import { BookingRequest, BookingResponse, Feedback, Motorbike } from '../../../utils/type'
import MyDialog from '../../../components/common/MyDialog'
import usei18next from '../../../hooks/usei18next';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { Box, CircularProgress, Divider, Grid, IconButton, MenuItem, Modal, TextField, Typography, Rating, Avatar } from '@mui/material';
import MyIcon from '../../../components/common/MyIcon';
import { BusinessCenterOutlined, CloseOutlined, GasMeterOutlined, HelpOutlineOutlined, LocalDrinkOutlined, LocationOn, LocationOnOutlined, Loyalty, MyLocation, NewReleasesOutlined, ReportProblemOutlined, StarPurple500Outlined } from '@mui/icons-material';
import MySlideShowImage from '../../../components/common/MySlideShowImage';
import theme from '../../../utils/theme';
import { CartIcon, HelmetIcon, ProtectClothesIcon, RainCoatIcon, RepairIcon, TelephoneIcon } from '../../../assets/icons';
import useThemePage from '../../../hooks/useThemePage';
import { ModalContext } from '../../../contexts/ModalContext';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import MyCustomButton from '../../../components/common/MyButton';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { PostMotorbikeService } from '../../../services/PostMotorbikeService';
import RegisterMotorbikeItem from '../../PostMotorbike/components/RegisterMotorbike/RegisterMotorbikeItem';
import { BookingService } from '../../../services/BookingService';
import ToastComponent from '../../../components/toast/ToastComponent';
import { BookingDeliveryMode, BookingPaymentType, ROUTES } from '../../../utils/Constant';
import { PromotionModal } from '../../MotorbikePage/components/PromotionModal';
import { ConfirmMotorbikeBookingModal } from '../../MotorbikePage/components/ConfirmMotorbikeBookingModal';
import { RequireWhenRent } from '../../MotorbikePage/components/RequireWhenRent';
import UserService from '../../../services/UserService';
import { LoginModal } from '../../AccountPage/LoginModal';
import { FeedbackService } from '../../../services/FeedbackService';
import FeedbackCard from './FeedbackCard';

export default function MotorbikeDetailModal(props: { motorbikeId: string | undefined, searchedAddress?: string, startDate?: string, endDate?: string }) {

  const { isMobile, isIpad } = useThemePage();
  const { t, isVn } = usei18next();
  const [equipmentList, setEquipmentList] = useState<string[]>([]);
  const [location, setLocation] = useState<Location>();
  const { closeModal, setContentModal, setShowModal } = useContext(ModalContext);
  const { RangePicker } = DatePicker;
  const [isMapModalOpen, setMapModalOpen] = useState(false);
  const [isModalPromotionOpen, setModalPromotionOpen] = useState(false);
  const [isModalConfirmBookingOpen, setModalConfirmBookingOpen] = useState(false);
  const [motorbike, setMotorbike] = useState<Motorbike>();
  const [listFeedback, setlistFeedback] = useState<Feedback[]>([]);
  const [previewBookingData, setPreviewBookingData] = useState<BookingResponse>();
  const [isProcessingBooking, setIsProcessingBooking] = useState(false);
  const [isOpenLoginModal, setIsOpenLoginModal] = useState<boolean>(false);

  interface Location {
    lat: number,
    lng: number,
  }

  // get motorbike by id
  useEffect(() => {
    if (props.motorbikeId){
      getMotorbikeById(props.motorbikeId.toString());
      getFeedbackById(props.motorbikeId.toString());
    }
      
  }, [props.motorbikeId]);

  const getMotorbikeById = async (id: string) => {
    try {
      const response = await PostMotorbikeService.getMotorbikeById(id);
      if (response) {
        setMotorbike(response);
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  const getFeedbackById = async (id: string) => {
    try {
      const response = await FeedbackService.getFeedbackById(id);
      if (response) {
        setlistFeedback(response);
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  // format number * 1000 to type 1.000 VND/ngày
  const formatMoney = (money: number | undefined) => {
    if (money) {
      return (money * 1000).toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
    }
    return '0 VND';
  }
  // convert timestamp to date
  const convertTimestampToDate = (timestamp: number) => {
    return dayjs(timestamp * 1000).format("DD-MM-YYYY HH:mm");
  }

  // get today date and tomorrow
  const today = dayjs().format("DD-MM-YYYY HH:mm");
  const tomorrow = dayjs().add(1, 'day').format("DD-MM-YYYY HH:mm");

  useEffect(() => {
    if (motorbike) {
      const tempEquipmentList = motorbike.equipments.split(",");
      const location = motorbike.location.split(",");
      const lat = Number(location[0]);
      const lng = Number(location[1]);
      setLocation({ lat, lng });
      setEquipmentList(tempEquipmentList);
    }
  }, [motorbike])



  // FORM CONTROLLER
  const formik = useFormik({
    initialValues: {
      address: props?.searchedAddress,
      lat: 21.028511,
      lng: 105.804817,
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
          motorbikeId: props?.motorbikeId || "0",
          address: values.address || "",
          deliveryMode: values.deliveryMode,
          startDatetime: values.startDate || "",
          endDatetime: values.endDate || "",
          couponCode: values.couponCode || "",
          paymentType: BookingPaymentType.Card
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

  useEffect(() => {
    if (!props.startDate || !props.endDate || !props.searchedAddress) {
      setFieldValue("startDate", today);
      setFieldValue("endDate", tomorrow);
      setFieldValue("address", "Quận Ba Đình, Hà Nội");
      // navigate(
      //   `${ROUTES.user.detailmotorbike}/${motorbikeId}/${encodeURIComponent("Quận Ba Đình, Hà Nội")}/${values.startDate}/${values.endDate}`
      // )
    }
  }, [])

  useEffect(() => {
    const bookingPreview: BookingRequest = {
      motorbikeId: props?.motorbikeId || "0",
      address: values.address || "Quận Ba Đình, Hà Nội",
      deliveryMode: values.deliveryMode,
      startDatetime: values.startDate || today,
      endDatetime: values.endDate || tomorrow,
      couponCode: values.couponCode || ""
    }
    BookingService.getPreviewBooking(bookingPreview).then((data) => {
      setPreviewBookingData(data)
      setIsProcessingBooking(data.motorbikes[0].status === "NotAvailable")
      if (data.promotion && data.promotion.status === "NotAvailable") {
        ToastComponent(isVn ? data.promotion.statusComment[0].vi : data.promotion.statusComment[0].en, "warning")
        setFieldValue("couponCode", "")
      }
    })
  }, [props?.motorbikeId, values.address, values.startDate, values.endDate, values.couponCode])

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

  // MAP CONTROLLER

  // handle get location click then set default location motorbike
  const handleGetLocationClick = () => {
    setFieldValue("deliveryMode", BookingDeliveryMode.SelfPickup)
    if (motorbike) {
      setValue(motorbike?.address);
      setFieldValue("address", motorbike?.address);
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

  const showModalPromotion = () => {
    setContentModal(
      <MyDialog
        style={{
          zIndex: 10000
        }}
        title="Thông báo"
        content="Bạn có muốn áp dụng mã giảm giá không?"
        hasAgreeButton
        hasCancelButton
        onClickAgree={() => { }}
      />
    )
    setShowModal(true)
  }

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
          margin: isMobile ? "8px 0px" : '32px 0px',
          overflowY: 'auto',
        }}>
        <Box width={isMobile ? "95%" : "90%"} height={"auto"}
          sx={{
            backgroundColor: '#fff',
            borderRadius: '8px'
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
              {t("postMotorbike.listform.motorbikeInfo")}
            </Typography>
            <Box height={"10%"} display={"flex"} flexDirection={"row"} justifyContent={"flex-end"} alignItems={"center"}>
              <MyIcon icon={<CloseOutlined />} hasTooltip tooltipText={t("postMotorbike.registedForm.badge-close")} onClick={closeModal} position='bottom' />
            </Box>
          </Box>
          <Box
            margin={isMobile ? "8px 32px" : "32px 64px"}
            height={"100%"}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"start"}
            alignItems={"center"}
            zIndex={999}
          >
            {/* Image List */}
            <Box
              width={"100%"}
              display={"flex"}
              flexDirection={"row"}
              justifyContent={"center"}
              alignItems={"center"}
              mb={"16px"}>
              {motorbike?.imageUrl && motorbike?.imageUrl.length > 0 && (
                <MySlideShowImage images={motorbike.imageUrl} isMobile={isMobile} />)}
            </Box>

            {/* Divider Line */}
            <Divider sx={{ width: "100%", margin: isMobile ? "8px 0px" : "16px 0px" }} variant="middle" />
            {/* Basic Infor List */}
            <Box
              width={"100%"}
              height={"auto"}
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"space-between"}
              alignItems={"start"}
            >
              {/* Tên xe và địa chỉ */}
              <Box display="flex" flexDirection="column" alignItems="start" width={"100%"} justifyContent={"space-between"} >
                <Typography
                  color={theme.palette.text.primary}
                  variant="h5"
                  fontWeight="600"
                  fontSize={isMobile ? "32px" : "48px"}
                  textTransform={"uppercase"}>
                  {motorbike?.model?.brand.brandName} {motorbike?.model?.modelName}
                </Typography>
                <Box display="flex" flexDirection="row" alignItems="center" width={"100%"} >
                  <MyIcon icon={<LocationOn />} hasTooltip tooltipText={t("postMotorbike.listform.badge-location")} onClick={() => { }} position='left' />
                  <Typography variant="h5" color={theme.palette.text.secondary} fontSize={isMobile ? "14px" : "16px"} fontStyle={'italic'}>
                    {motorbike?.address}
                  </Typography>
                </Box>
                <Box display="flex" flexDirection="row" alignItems="center" width={"100%"}>
                  <MyIcon icon={<StarPurple500Outlined
                    sx={{ color: "#FBC241" }}
                    fontSize="medium"
                  />} hasTooltip onClick={() => { }} position='left' />

                  <Typography
                    color={theme.palette.text.secondary}
                    fontSize={isMobile ? "14px" : "16px"} align="center"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                    overflow="hidden"
                  >
                    {previewBookingData && previewBookingData.motorbikes[0].ratingAverage}
                  </Typography>
                  <MyIcon icon={<BusinessCenterOutlined
                    fontWeight={300}
                    sx={{ color: "#8B4513" }}
                    fontSize="medium"
                  />} hasTooltip onClick={() => { }} position='left' />

                  <Typography
                    color={theme.palette.text.secondary}
                    fontSize={isMobile ? "14px" : "16px"} align="center"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                    overflow="hidden"
                  >
                    {t("booking.completeBook", {count: previewBookingData && previewBookingData.motorbikes[0].countCompletedBooking})}
                  </Typography>
                </Box>
                <Divider sx={{ margin: isMobile ? "8px 0px" : "16px 0px", width: "100%" }} variant="fullWidth" />
              </Box>
              {/* Infor*/}
              <Box
                width={"100%"}
                display="flex"
                flexDirection={isIpad || isMobile ? "column" : "row"}
                alignItems="start"
                justifyContent={"space-between"}
                paddingBottom="16px">

                {/* Hóa đơn thanh toán */}
                <Box
                  sx={{
                    backgroundColor: "rgba(139, 69, 19, 0.05)",
                    borderRadius: "8px",
                    minHeight: "300px",
                  }}
                  margin={isIpad || isMobile ? "16px 0px" : "0px 0px"}
                  width={isIpad || isMobile ? "auto" : "35%"}
                  display="flex"
                  flexDirection="column"
                  alignItems="start"
                  padding="16px"
                >
                  <Box display="flex" flexDirection="row" alignItems="center" width={"100%"} justifyContent={"flex-start"} >
                    <Typography color={theme.palette.text.primary} sx={{ fontSize: '24px', fontWeight: "600", }}>
                      {`${formatMoney(motorbike?.priceRent)}/${t("booking.perDay")}`}
                    </Typography>
                  </Box>
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
                        size={isMobile ? 'middle' : 'large'}
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
                          sx={{ fontSize: isMobile ? "14px" : '16px', fontWeight: "400", minWidth: '100px', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                          padding={'11px 0px'}
                          onChange={handleChange}
                        >
                          {values.address}
                        </Typography>
                      </Box>
                    </Box>
                    {/* Cảnh báo */}
                    {
                      previewBookingData && previewBookingData.motorbikes.length > 0 && previewBookingData.motorbikes[0].status === "NotAvailable" &&

                      <Box pt={"8px"} display={'flex'} flexDirection={'row'} alignItems={'start'} justifyContent={'center'} sx={{ gap: '8px' }}>
                        <ReportProblemOutlined sx={{ color: "#f44747" }} />
                        <Typography variant="h5" color={"#FF0000"} fontWeight="400" fontSize={isMobile ? "12px" : "14px"} textAlign={'justify'}>{isVn ? previewBookingData.motorbikes[0].statusComment[0].vi : previewBookingData.motorbikes[0].statusComment[0].en}</Typography>
                      </Box>
                    }
                    {/* Line */}
                    <Divider sx={{ margin: "16px 0px", width: "100%" }} variant="fullWidth" />
                    {/* Đơn giá */}
                    <Box width={"100%"} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '4px' }}>
                      {/* Đơn giá thuê */}
                      <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }}>
                        <Typography color={theme.palette.text.primary} sx={{ fontSize: isMobile ? "14px" : '16px', fontWeight: "400", }}>
                          {t("booking.pricePerday")}
                        </Typography>
                        <Typography color={theme.palette.text.primary} sx={{
                          fontSize: isMobile ? "14px" : '16px', fontWeight: "600", whiteSpace: 'nowrap',
                        }}>
                          {`${formatMoney(motorbike?.priceRent)}/${t("booking.perDay")}`}
                        </Typography>
                      </Box>
                    </Box>
                    {/* Phí vận chuyển */}
                    {
                      previewBookingData?.motorbikes[0].totalFeeOfDelivery! > 0 && (
                        <>
                          {/* Line */}
                          <Divider sx={{ margin: "16px 0px", width: "100%" }} variant="fullWidth" />
                          <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }}>
                            <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }}>
                              <Typography color={theme.palette.text.primary} sx={{ fontSize: isMobile ? "14px" : '16px', fontWeight: "400", }}>
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
                            <Typography color={theme.palette.text.primary} sx={{
                              fontSize: isMobile ? "14px" : '16px', fontWeight: "600", whiteSpace: 'nowrap',
                            }}>
                              {previewBookingData?.motorbikes[0].distance.toFixed(1)} km
                            </Typography>
                          </Box>
                          <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }}>
                            <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }}>
                              <Typography color={theme.palette.text.primary} sx={{
                                fontSize: isMobile ? "14px" : '16px',
                                fontWeight: "400",
                                flexWrap: 'wrap',

                              }}>
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
                            <Typography color={theme.palette.text.primary} sx={{
                              fontSize: isMobile ? "14px" : '16px',
                              fontWeight: "600",
                              whiteSpace: 'nowrap',
                            }}>
                              {previewBookingData?.motorbikes[0].freeDeliveryRange.toFixed(1)} km
                            </Typography>
                          </Box>

                          <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }}>
                            <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }}>
                              <Typography color={theme.palette.text.primary} sx={{ fontSize: isMobile ? "14px" : '16px', fontWeight: "400", }}>
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
                                `${t("booking.deliveryFee_hint")} ${formatMoney(previewBookingData?.motorbikes[0].feeOfDeliveryPerKm)}`
                              } onClick={() => {
                              }} position='right-start' />

                            </Box>
                            <Typography color={theme.palette.text.primary} sx={{
                              fontSize: isMobile ? "14px" : '16px', fontWeight: "600", whiteSpace: 'nowrap',
                            }}>
                              {formatMoney(previewBookingData?.motorbikes[0].totalFeeOfDelivery)} x {previewBookingData?.motorbikes[0].deliveryDistanceChargeable.toFixed(1)
                              } km
                            </Typography>
                          </Box>
                        </>
                      )
                    }
                    {/* Line */}
                    <Divider sx={{ margin: "16px 0px", width: "100%" }} variant="fullWidth" />

                    {/* Tổng tiền và app mã khuyến mãi */}
                    <Box width={"100%"} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '8px' }}>
                      {/* Tổng tiền */}
                      <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }}>
                        <Typography color={theme.palette.text.primary} sx={{ fontSize: isMobile ? "14px" : '16px', fontWeight: "400", }}>
                          {t("booking.totalPriceRent")}
                        </Typography>
                        <Typography color={theme.palette.text.primary} sx={{
                          fontSize: isMobile ? "14px" : '16px', fontWeight: "600", whiteSpace: 'nowrap',
                        }}>
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
                        <Typography color={theme.palette.text.primary} sx={{
                          fontSize: isMobile ? "14px" : '16px', fontWeight: "600", whiteSpace: 'nowrap',
                        }}>
                          {formatMoney(previewBookingData?.feeOfService)}
                        </Typography>
                      </Box>
                      {/* Mã khuyến mãi */}
                      {
                        values.couponCode !== "" &&
                        <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }}>
                          <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
                            <Typography color={theme.palette.text.primary} sx={{ fontSize: isMobile ? "14px" : '16px', fontWeight: "400", }}>
                              {t("booking.promotionCode")}: <span style={{ textTransform: 'uppercase', fontWeight: '700' }}>{values.couponCode}</span>
                            </Typography>
                            <MyIcon icon={<CloseOutlined sx={{ color: "#000", width: "14px", height: "14px" }} />} hasTooltip tooltipText={t("dashBoardManager.brand.delete")} onClick={() => {
                              setFieldValue("couponCode", "")
                            }} position='right' />
                          </Box>
                          <Typography color={theme.palette.text.primary} sx={{
                            fontSize: isMobile ? "14px" : '16px', fontWeight: "600", whiteSpace: 'nowrap',
                          }}>
                            {formatMoney(previewBookingData?.promotion?.reducedAmount)}
                          </Typography>
                        </Box>
                      }
                      <MyCustomButton fontSize={isMobile ? 14 : 16} iconPosition='left' icon={<Loyalty sx={{ color: "#8B4513" }} />} width='100%' onClick={() => setModalPromotionOpen(true)} content={t("booking.promotionCode")} variant='outlined' />

                    </Box>
                    {/* Line */}
                    <Divider sx={{ margin: "16px 0px", width: "100%" }} variant="fullWidth" />

                    {/* Tổng tiền */}
                    <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }}>
                      <Typography color={theme.palette.text.primary} sx={{ fontSize: '16px', fontWeight: "600", }}>
                        {t("booking.totalPrice")}
                      </Typography>
                      <Typography color={theme.palette.text.primary} sx={{
                        fontSize: '16px', fontWeight: "600", whiteSpace: 'nowrap',
                      }}>
                        {formatMoney(previewBookingData?.totalAmount)}
                      </Typography>
                    </Box>
                    {/* Line */}
                    <Divider sx={{ margin: "16px 0px", width: "100%" }} variant="fullWidth" />

                    {/* Button */}
                    {/* {
                      UserService.isLoggedIn() ?
                        <MyCustomButton disabled={isProcessingBooking}
                          width='100%' onClick={() => {
                            setModalConfirmBookingOpen(true)
                          }} content={t("booking.bookMotorbikeButton")} variant='contained' />
                        :
                        <a style={{ width: '100%' }} href={ROUTES.account.login}>
                          <MyCustomButton fontSize={isMobile ? 14 : 16} disabled={isProcessingBooking}
                            width='100%' content={t("booking.loginToContinue")} variant='contained' />
                        </a>
                    } */}
                    {
                      <MyCustomButton disabled={isProcessingBooking}
                        width='100%' onClick={() => {
                          if (!UserService.isLoggedIn()) {
                            setIsOpenLoginModal(true)
                          } else {
                            setModalConfirmBookingOpen(true)
                          }
                        }} content={t("booking.bookMotorbikeButton")} variant='contained' />
                    }
                  </Box>
                </Box>

                {/* Thông tin xe */}
                <Box
                  width={isIpad || isMobile ? "100%" : "60%"}
                  display="flex"
                  flexDirection="column"
                  alignItems="start"
                  paddingBottom="16px"
                >

                  {isMobile && <Divider sx={{ margin: "0px 0px 16px 0px", width: "100%" }} variant="fullWidth" />}
                  <Box display="flex" flexDirection="column" alignItems="start" width={"100%"} justifyContent={"space-between"} gap={"16px"} mt={isMobile ? "0px" : "16px"}>

                    <Typography variant="h5" color={theme.palette.text.primary} fontWeight="700" fontSize={"16px"}>
                      {t("postMotorbike.listform.motorbikeFeature")}
                    </Typography>

                    <Box width={"100%"}>
                      <Box
                        sx={{ backgroundColor: "rgba(19, 139, 31, 0.05)", borderRadius: "8px" }}
                        padding={"16px"}
                        display="flex"
                        flexDirection={isMobile ? "column" : "row"}
                        alignItems="center"
                        gap={"8px"}
                        justifyContent={"space-between"}>

                        <MotorbikeFeatureItem
                          icon={<NewReleasesOutlined color='primary' fontSize='large' />}
                          title={t("postMotorbike.listform.release-year")}
                          content={motorbike?.releaseYear}
                          isMobile={isMobile}
                          t={t}
                        />

                        <MotorbikeFeatureItem
                          icon={<GasMeterOutlined color='primary' fontSize='large' />}
                          title={t("postMotorbike.listform.type")}
                          content={motorbike?.type}
                          isMobile={isMobile}
                          t={t}
                        />
                        <MotorbikeFeatureItem
                          icon={<LocalDrinkOutlined color='primary' fontSize='large' />}
                          title={t("postMotorbike.listform.fuel-consumption")}
                          content={motorbike?.fuelConsumption + "L/100km"}
                          isMobile={isMobile}
                          t={t}
                        />
                      </Box>
                    </Box>
                  </Box>

                  <Divider sx={{ margin: "16px 0px", width: "100%" }} variant="fullWidth" />
                  {/* Biển số xe */}
                  <Box display="flex" flexDirection="column" alignItems="start" width={"100%"} justifyContent={"space-between"} gap={"16px"}>
                    <Typography variant="h5" color={theme.palette.text.primary} fontWeight="700" fontSize={"16px"}>
                      {t("postMotorbike.listform.licensePlate")}
                    </Typography>
                    <Box width={"100%"}>
                      <Box display="flex" flexDirection="row" alignItems="center" justifyContent={"center"} borderRadius={"8px"} margin={"0px 16px"} padding={"16px 0px"} border={"2px solid #8B4513"}>
                        <Typography variant="h5" fontWeight="600" color={theme.palette.text.primary} fontSize={isMobile ? "16px" : "20px"}>
                          {motorbike?.licensePlate} {/* Thêm biển số xe */}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Divider sx={{ margin: isMobile ? "16px 0px 16px 0px" : "16px 0px", width: "100%" }} variant="fullWidth" />

                  {/* Trang bị */}
                  <Box display="flex" flexDirection="column" alignItems="start" width={"100%"} justifyContent={"space-between"} gap={"16px"}>
                    <Typography variant="h5" color={theme.palette.text.primary} fontWeight="700" fontSize={"16px"}>
                      {t("postMotorbike.listform.equipments")}
                    </Typography>

                    <Box width={"100%"}>
                      <Box
                        sx={{ backgroundColor: "rgba(19, 139, 31, 0.05)", borderRadius: "8px" }}
                        padding={"16px 16px"}
                        display="flex" flexDirection="row" alignItems="center" justifyContent={"center"} borderRadius={"8px"}>

                        <Grid container columnSpacing={{ xs: 3, sm: 3, md: 3 }} rowSpacing={3}>
                          {equipmentList.filter(item => item === "Raincoat").length > 0 && (
                            <Grid item xs={isMobile ? 12 : 4}>
                              <EquipmentItem icon={< RainCoatIcon />} label={t("postMotorbike.registedForm.raincoat")} />
                            </Grid>
                          )}
                          {equipmentList.filter(item => item === "Helmet").length > 0 && (
                            <Grid item xs={isMobile ? 12 : 4}>
                              <EquipmentItem icon={< HelmetIcon />} label={t("postMotorbike.registedForm.helmet")} />
                            </Grid>
                          )}
                          {equipmentList.filter(item => item === "ReflectiveClothes").length > 0 && (
                            <Grid item xs={isMobile ? 12 : 4}>
                              <EquipmentItem icon={< ProtectClothesIcon />} label={t("postMotorbike.registedForm.reflectiveClothes")} />
                            </Grid>
                          )}
                          {equipmentList.filter(item => item === "RepairKit").length > 0 && (
                            <Grid item xs={isMobile ? 12 : 4}>
                              <EquipmentItem icon={< RepairIcon />} label={t("postMotorbike.registedForm.repairKit")} />
                            </Grid>
                          )}
                          {equipmentList.filter(item => item === "Bagage").length > 0 && (
                            <Grid item xs={isMobile ? 12 : 4}>
                              <EquipmentItem icon={< CartIcon />} label={t("postMotorbike.registedForm.bagage")} />
                            </Grid>
                          )}
                          {equipmentList.filter(item => item === "CaseTelephone").length > 0 && (
                            <Grid item xs={isMobile ? 12 : 4}>
                              <EquipmentItem icon={< TelephoneIcon />} label={t("postMotorbike.registedForm.caseTelephone")} />
                            </Grid>
                          )}
                        </Grid>
                      </Box>
                    </Box>
                  </Box>

                  <Divider sx={{ margin: isMobile ? "16px 0px 16px 0px" : "16px 0px", width: "100%" }} variant="fullWidth" />

                  {/* Hiển thị bản đồ vị trí xe */}
                  <Box display="flex" flexDirection="column" alignItems="start" width={"100%"} justifyContent={"space-between"} gap={"16px"}>
                    <Typography variant="h5" color={theme.palette.text.primary} fontWeight="700" fontSize={"16px"}>
                      {t("postMotorbike.listform.address")}
                    </Typography>
                    <TextField
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderRadius: "8px",
                            border: "1px solid #e0e0e0",
                          },
                          '&:hover fieldset': {
                            border: "1px solid #e0e0e0"
                          },
                          '&.Mui-focused fieldset': {
                            border: "1px solid #e0e0e0"
                          },
                        },
                      }}
                      size='small'
                      fullWidth
                      multiline
                      value={motorbike?.address}
                      inputProps={{
                        readOnly: true,
                      }} />
                    {isLoaded ? (
                      <Box
                        borderRadius={"10px"}
                        border={"3px solid"}
                        margin={"0px auto"}
                        width={"100%"}
                        display="flex"
                        justifyContent={"center"}
                        alignItems={"center"}
                        flexDirection={"column"}
                      >
                        <GoogleMap
                          zoom={18}
                          center={defaultLoctionMotorbike}
                          mapContainerStyle={{
                            width: "100%",
                            height: "40vh",
                            borderRadius: "8px",
                          }}
                          clickableIcons={false}
                        >
                          <Marker position={defaultLoctionMotorbike} />
                        </GoogleMap>
                      </Box>
                    ) : (
                      <Box sx={{
                        display: 'flex', justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row"
                      }}>
                        <CircularProgress />
                      </Box>
                    )}
                  </Box>

                  <Divider sx={{ margin: isMobile ? "16px 0px 16px 0px" : "16px 0px", width: "100%" }} variant="fullWidth" />
                  {/* Mô tả */}
                  <Box display="flex" flexDirection="column" alignItems="start" width={"100%"} justifyContent={"space-between"} >
                    <Typography variant="h5" color={theme.palette.text.primary} fontWeight="700" fontSize={"16px"}>
                      {t("postMotorbike.listform.description")}
                    </Typography>
                    <Box width={"100%"}>
                      {/* <Typography variant="h6" color={theme.palette.text.primary} fontSize={isMobile ? "12px" : "16px"} fontWeight={400}>
                        <div
                          style={{ whiteSpace: "pre-wrap", fontSize: isMobile ? "12px" : "16px", fontWeight: "400" }}
                          dangerouslySetInnerHTML={{ __html: motorbike?.description || "" }}></div>
                      </Typography> */}
                      <Typography variant="h6" color={theme.palette.text.primary} fontSize={"14px"} fontWeight={400}>
                        <div style={{ textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: motorbike?.description || "" }}></div>
                      </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ margin: isMobile ? "0px 0px 16px 0px" : "0px 0px 16px 0px", width: "100%" }} variant="fullWidth" />

                  {/* Điều khoản khác */}
                  <Box display="flex" flexDirection="column" alignItems="start" width={"100%"} justifyContent={"space-between"}>
                    <Typography variant="h6" color={theme.palette.text.primary} fontWeight="700" fontSize={"16px"}>
                      {t("postMotorbike.listform.miscellaneous")}
                    </Typography>
                    <Box width={"100%"}>
                      <Typography variant="h6" color={theme.palette.text.primary} fontSize={"14px"} fontWeight={400}>
                        <div style={{ textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: motorbike?.miscellaneous || "" }}></div>
                      </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ margin: isMobile ? "0px 0px 16px 0px" : "0px 0px 16px 0px", width: "100%" }} variant="fullWidth" />
                  <RequireWhenRent />
                  <Divider sx={{ margin: isMobile ? "0px 0px 16px 0px" : "0px 0px 16px 0px", width: "100%" }} variant="fullWidth" />

                  {/* Thông tin khác */}
                  <Typography variant="h5" fontWeight="600">
                    Rating & Feedback: {/* Thêm rating và feedback */}
                  </Typography>
                  <Box display={'flex'} flexDirection={'column'} gap={'8px'} width={'99.5%'} marginTop={'15px'}>
                  <Box display="flex" flexDirection="column" justifyContent={"center"} gap={"8px"} p={'8px'} border={"1px solid #e0e0e0"} borderRadius={"8px"}  
                    >
                      {listFeedback.length !== 0 ? listFeedback.map((item: Feedback) => (
                        <FeedbackCard feedback={item}></FeedbackCard>
                      ))
                      :
                      <Box>
                        <Typography fontSize={'18px'}>
                        {t("feedback.nonComment")}
                      </Typography>
                      </Box>
                      }
                    </Box>
                  </Box>
                  
                </Box>


              </Box>
            </Box>
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
                          name="address"
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
      <PromotionModal isModalPromotionOpen={isModalPromotionOpen} setModalPromotionOpen={setModalPromotionOpen} setFieldValue={setFieldValue} counponCode={values.couponCode} isMobile={isMobile} />

      {/*modal confirm booking*/}
      <ConfirmMotorbikeBookingModal
        isModalConfirmBookingOpen={isModalConfirmBookingOpen}
        setModalConfirmBookingOpen={setModalConfirmBookingOpen}
        values={values}
        isMobile={isMobile}
        motorbikes={previewBookingData && previewBookingData!.motorbikes}
        previewBookingData={previewBookingData}
        isProcessingBooking={isProcessingBooking}
        handleSubmit={handleSubmit}
      />
      {/* modal login */}
      <LoginModal isOpenLoginModal={isOpenLoginModal} setIsOpenLoginModal={setIsOpenLoginModal} isMobile={isMobile} />
    </>
  );
}

function MotorbikeFeatureItem({ icon, title, content, isMobile }: any) {
  return (<Box display="flex" flexDirection="row" alignItems="start" width={isMobile ? "90%" : "30%"} justifyContent={"start"} gap={"8px"} border={"2px solid #8B4513"} borderRadius={"8px"} padding={"8px"}>
    {icon}
    <Box display="flex" flexDirection="column" alignItems="start" justifyContent={"space-between"} gap={"8px"}>
      <Typography variant="h5" color={theme.palette.text.primary} fontWeight={600} fontSize={isMobile ? "16px" : "16px"}>
        {title}
      </Typography>
      <Typography variant="h5" color={theme.palette.text.secondary} fontSize={isMobile ? "16px" : "16px"}>
        {content}
      </Typography>
    </Box>
  </Box>);
}

function EquipmentItem({ icon, label }: any) {
  return (
    <Box display="flex" flexDirection="row" alignItems="center" justifyContent={"center"} padding={"16px 0px"} border={"2px solid #8B4513"} borderRadius={"8px"} gap={"16px"}>
      {icon}
      <Typography variant="h5" fontWeight="400" color={theme.palette.text.primary} fontSize={"16px"}>
        {label}
      </Typography>
    </Box>);
}