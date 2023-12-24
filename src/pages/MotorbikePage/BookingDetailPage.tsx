import { useEffect, useState, useContext } from "react";
import { Booking, BookingResponse } from "../../utils/type";
import { useNavigate, useParams } from "react-router-dom";
import { BookingService } from "../../services/BookingService";
import {
  Box,
  Chip,
  Divider,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Step,
  StepLabel,
  Stepper,
  styled,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { ArrowRightIcon } from "@mui/x-date-pickers";
import useThemePage from "../../hooks/useThemePage";
import {
  CalendarImage,
  ClockImage,
  MotorbikeImage,
  MyWallet,
  SuccessIconNew,
  VNPay,
  motorbikeDropOff,
  motorbikePickup,
} from "../../assets/images";
import usei18next from "../../hooks/usei18next";
import { GoogleMap, InfoWindow, Marker, useLoadScript } from "@react-google-maps/api";
import { MotorbikeBookingCard } from "./components/MotorbikeBookingCard";
import { RequireWhenRent } from "./components/RequireWhenRent";
import theme from "../../utils/theme";
import { countdownTime, formatMoney, formatMoneyNew } from "../../utils/helper";
import dayjs from "dayjs";
import {
  BookingPaymentType,
  BookingStatus,
  ROUTES
} from "../../utils/Constant";
import MyCustomButton from "../../components/common/MyButton";
import { ModalContext } from "../../contexts/ModalContext";
import MyDialog from "../../components/common/MyDialog";
import { PaymentService } from "../../services/PaymentService";
import { useAppDispatch, useAppSelector } from "../../hooks/useAction";
import ToastComponent from "../../components/toast/ToastComponent";
import { getUserInfo } from "../../redux/reducers/authReducer";
import MyIcon from "../../components/common/MyIcon";
import {
  ArrowBack,
  CheckCircle,
  CheckCircleOutline,
  CloseOutlined,
  Edit,
  ErrorOutline,
  Feedback,
  HelpOutlineOutlined,
  Verified,
  WarningAmber,
} from "@mui/icons-material";
import { ConfirmCompleteTripModal } from "./components/ConfirmCompleteTripModal";
import ModalStatus from "../WalletPage/component/ModalStatus";
import { getBookingInfo } from "../../redux/reducers/bookingReducer";
import RequestChangeAddressAndTime from "../BookMotorbike/components/RequestChangeAddressAndTime";
import { connection } from "../../redux/reducers/signalRReducer";

interface Location {
  lat: number;
  lng: number;
}

export const BookingDetailPage = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState<Booking>();
  const [activeStep, setActiveStep] = useState<number>(0);
  const { isMobile } = useThemePage();
  const { t } = usei18next();
  const { openModal } = useContext(ModalContext);
  const steps = [
    t("booking.paymentCol"),
    t("booking.startUsingService"),
    t("booking.endUsingService"),
  ];
  const [paymentType, setPaymentType] = useState<string>(
    BookingPaymentType.Card
  );
  const { user } = useAppSelector((state) => state.userInfo);
  const { reloadStatus } = useAppSelector((state) => state.bookingInfo);
  const dispatch = useAppDispatch();
  const [reloadBooking, setReloadBooking] = useState<boolean>(false);
  const [endDate, setEndDate] = useState<string>("");
  const [countdown, setCountdown] = useState<string>("");
  const [location, setLocation] = useState<Location>({
    lat: 21.028511,
    lng: 105.804817,
  });
  const [locationReturn, setLocationReturn] = useState<Location>({
    lat: 21.028511,
    lng: 105.804817,
  });
  useEffect(() => {
    try {
      getData(bookingId || "", reloadBooking);
    } catch (error) {
      navigate(ROUTES.other.pagenotfound);
    }
  }, [bookingId, reloadBooking]);

  // useEffect(() => {
  //     try {
  //         const intervalId = setInterval(() => {
  //             getData(bookingId || "", reloadBooking)
  //         }, 5000);
  //         return () => clearInterval(intervalId);
  //     } catch (error) {
  //         navigate(ROUTES.other.pagenotfound)
  //     }
  // }, [])

  useEffect(() => {
    connection.on('IsReloadBooking', () => {
      setReloadBooking((prev) => !prev)
    });
  }, []);

  const getData = (bookingId: string, reloadBooking: boolean) => {
    try {
      BookingService.getBookingById(bookingId || "").then((data) => {
        if (data) {
          if (data.status === BookingStatus.PendingPayment) {
            setActiveStep(0);
          } else if (
            data.status === BookingStatus.Paid ||
            data.status === BookingStatus.PendingDelivery
          ) {
            setActiveStep(1);
          } else if (data.status === BookingStatus.Delivered) {
            setActiveStep(2);
          } else if (
            data.status === BookingStatus.Cancelled ||
            data.status === BookingStatus.Finished ||
            data.status === BookingStatus.PendingReview
          ) {
            setActiveStep(3);
          } else {
            navigate(ROUTES.other.pagenotfound);
          }
          setBooking(data);
          setPaymentType(data.paymentType);
          BookingService.getLatLngByAddress(
            data.address || "Quận Ba Đình, Hà Nội"
          ).then((d) => {
            const location = d.split(",");
            const result: Location = {
              lat: Number(location[0]),
              lng: Number(location[1]),
            };
            setLocation(result);
          });
          BookingService.getLatLngByAddress(
            data.returnAddress || "Quận Ba Đình, Hà Nội"
          ).then((d) => {
            const location = d.split(",");
            const result: Location = {
              lat: Number(location[0]),
              lng: Number(location[1]),
            };
            setLocationReturn(result);
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMovingMotorbike, setIsMovingMotorbike] = useState<boolean>(
    booking?.status === "Delivered"
  );

  useEffect(() => {
    setIsMovingMotorbike(booking?.status === "Delivered");
  }, [booking?.status]);

  const changeStatusBookingDetail = async (status: string) => {
    try {
      if (status === "Delivered") {
        setIsMovingMotorbike(true);
      }
      if (status === "PendingReview") {
        setIsMovingMotorbike(false);
      }

      const startTime = new Date().getTime();
      setIsLoading(true);

      const motorbikeIdString = booking?.motorbikes
        ?.map((motorbike) => motorbike.id)
        .join(",");

      await BookingService.updateStatusBookingDetail(
        booking!.bookingId,
        motorbikeIdString,
        status
      );

      const endTime = new Date().getTime();
      const elapsedTime = endTime - startTime;

      const minimumWaitTime = 1000;
      const remainingWaitTime = minimumWaitTime - elapsedTime;

      if (remainingWaitTime > 0) {
        setTimeout(() => {
          setIsLoading(false);
          setReloadBooking(!reloadBooking);
        }, remainingWaitTime);
      } else {
        setIsLoading(false);
        setReloadBooking(!reloadBooking);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleConfirmDeposit = () => {
    setReloadBooking((prev) => !prev);
  };

  const search = window.location.search;
  const params = new URLSearchParams(search);

  const allQueryParameters: any = {};

  for (const [key, value] of params) {
    allQueryParameters[key] = value;
  }

  useEffect(() => {
    if (allQueryParameters.vnp_ResponseCode === "00") {
      try {
        PaymentService.processPaymentDb(search).then((data) => {
          dispatch(getUserInfo());
          openModal(
            <ModalStatus
              icon={SuccessIconNew}
              title={t("Thanh toán thành công")}
              content={
                "Bạn đã thanh toán đơn đặt xe thành công. Hệ thống sẽ xử lý yêu cầu đặt xe của bạn sớm nhất"
              }
              handleConfirm={handleConfirmDeposit}
            />
          );
        });
      } catch (error) { }
    }
  }, []);

  const handleProcessPayment = async (booking: Booking) => {
    try {
      if (paymentType === BookingPaymentType.UserBalance) {
        await PaymentService.paymentWithWallet(
          booking.bookingId,
          booking.deposit * 1000
        );
        ToastComponent(t("booking.toast.paymentBookSuccess"), "success");
        setReloadBooking(!reloadBooking);
        dispatch(getUserInfo());
        dispatch(getBookingInfo(!reloadStatus));
      } else {
        const res: any = await PaymentService.createRequestBooking(
          booking.bookingId,
          booking.deposit * 1000
        );
        if (res) {
          window.location.replace(res.data);
        }
      }
    } catch (error) { }
  };

  const [position, setPosition] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (booking?.createDatetime) {
      const endDateMilliseconds =
        new Date(booking.createDatetime).getTime() + 6 * 60 * 60 * 1000;
      setEndDate(new Date(endDateMilliseconds).toString());
    }
  }, [booking]);

  useEffect(() => {
    if (activeStep === 0) {
      const intervalId = setInterval(() => {
        setCountdown(countdownTime(endDate, t));
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [endDate]);

  useEffect(() => {
    if (booking?.status === "Delivered") {
      const moveMotorcycle = () => {
        setPosition((prevPosition) => prevPosition + 5);
      };

      const startAnimation = () => {
        const animationInterval = setInterval(moveMotorcycle, 100);

        setTimeout(() => {
          clearInterval(animationInterval);
          setPosition(0);
        }, 2000);
      };

      startAnimation();

      const loopInterval = setInterval(() => {
        startAnimation();
      }, 2000);

      return () => clearInterval(loopInterval);
    }
  }, [activeStep]);

  const handleCancelBooking = async (id: number) => {
    try {
      await BookingService.cancelBooking(id);
      ToastComponent(t("booking.toast.cancelBookSuccess"), "success");
      setTimeout(() => {
        navigate(ROUTES.homepage);
      }, 1000);
    } catch (error) { }
  };

  const showModalCancelBooking = (id: number) => {
    openModal(
      <MyDialog
        style={{
          zIndex: 10000,
        }}
        title={t("booking.confirmCancelBook")}
        content={t("booking.contentConfirmCancelBook")}
        hasAgreeButton
        hasCancelButton
        onClickAgree={() => handleCancelBooking(id)}
      />
    );
  };

  // MAP CONTROLLER
  const [libraries] = useState(["places"]);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string,
    libraries: libraries as any,
  });

  return (
    <>
      {booking && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            margin: "32px 0px",
            width: "100%",
          }}
        >
          <Box
            display={"flex"}
            justifyContent={"start"}
            alignItems={"center"}
            width={isMobile ? "95%" : "70%"}
            position={"relative"}
            mb={isMobile ? "0px" : "16px"}
          >
            <MyIcon
              icon={<ArrowBack style={{ color: theme.palette.common.black }} />}
              hasTooltip
              tooltipText={t("postMotorbike.registedForm.badge-back")}
              onClick={() => navigate(ROUTES.booking.mybooking)}
              position="bottom"
            />
            <Typography
              sx={{
                color: "#000",
                fontSize: isMobile ? "20px" : "32px",
                fontWeight: "600",
                textAlign: "center",
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              {t("booking.detailTitle")}
            </Typography>
          </Box>
          {booking.status === "Cancelled" ? (
            <>
              <Box
                sx={{
                  background: "rgba(139, 19, 19, 0.1)",
                  borderRadius: "8px",
                  padding: "32px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
                width={isMobile ? "75%" : "65%"}
              >
                <Typography
                  fontWeight={600}
                  fontSize={isMobile ? "16px" : "20px"}
                  color={"common.black"}
                >
                  {t("editional.bookingCancel")}
                </Typography>
              </Box>
            </>
          ) : (
            <Stepper
              sx={{ width: isMobile ? "100%" : "70%" }}
              activeStep={activeStep}
              alternativeLabel
            >
              {steps.map((label) => (
                <Step
                  sx={{
                    alignContent: "center",
                    justifyContent: "center",
                    "& .MuiStepLabel-label": {
                      fontSize: "16px",
                      fontWeight: "600",
                      color: theme.palette.text.primary,
                    },
                    "& .MuiStepIcon-root": {
                      fontSize: "48px",
                      zIndex: 1,
                    },
                    "& .MuiStepConnector-root": {
                      flex: 1,
                    },
                    "& .MuiStepConnector-line": {
                      marginTop: "12px",
                      borderColor: "#e0e0e0",
                      width: "98%",
                    },
                    "& .MuiStepConnector-alternativeLabel": {
                      top: "12px",
                    },
                  }}
                  key={label}
                >
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          )}
          <Box
            className="hiddenSroll"
            width={isMobile ? "90%" : "65%"}
            sx={{ overflowY: "auto", overflowX: "hidden" }}
            height={"80%"}
            display={"flex"}
            flexDirection={"column"}
            gap={"32px"}
            justifyContent={"start"}
            padding={"0px 8px"}
          >
            <Box
              display={"flex"}
              gap={"32px"}
              flexDirection={isMobile ? "column" : "row"}
              marginTop={"16px"}
            >
              <Box
                display={"flex"}
                flexDirection={"column"}
                gap={"8px"}
                width={isMobile ? "100%" : "50%"}
              >
                {booking.status === "Cancelled" ? (
                  <></>
                ) : (
                  <Box
                    sx={{
                      background: "rgba(139, 69, 19, 0.10)",
                      borderRadius: "8px",
                      padding: "32px",
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      fontWeight={600}
                      fontSize={"16px"}
                      color={"common.black"}
                    >
                      {activeStep === 0
                        ? t("booking.timeRemainingPay")
                        : booking.status === "PendingDelivery"
                          ? t("booking.startUsingService")
                          : booking.status === "Delivered"
                            ? t("booking.startedUsingService")
                            : ""}
                    </Typography>
                    <Box
                      display={"flex"}
                      gap={"8px"}
                      alignItems={"center"}
                      // className="motorcycle-container"
                      mb={"8px"}
                    >
                      {activeStep === 0 ? (
                        <Box display={"flex"} gap={"8px"} alignItems={"center"}>
                          {!isMobile && (
                            <img src={ClockImage} width={36} height={36} />
                          )}
                          <Typography color={"common.black"}>
                            {countdown}
                          </Typography>
                        </Box>
                      ) : (
                        <Box
                          display={"flex"}
                          flexDirection={"column"}
                          alignItems={"center"}
                          gap={"8px"}
                        >
                          {(booking.status === "PendingDelivery" ||
                            booking.status === "Delivered") && (
                              <img
                                src={MotorbikeImage}
                                width={128}
                                height={128}
                                className="motorcycle-image"
                                style={{
                                  transform: isMovingMotorbike
                                    ? `translateX(-50%) translateX(${position}px)`
                                    : "",
                                  transition: isMovingMotorbike
                                    ? "transform 0.2s ease-in-out"
                                    : "",
                                }}
                              />
                            )}
                          {(booking.status === "PendingReview" ||
                            booking.status === "Finished") && (
                              <Box
                                display={"flex"}
                                flexDirection={"column"}
                                alignItems={"center"}
                                gap={"8px"}
                                justifyContent={"center"}
                              >
                                <Box
                                  display={"flex"}
                                  flexDirection={"row"}
                                  alignItems={"center"}
                                  gap={"8px"}
                                >
                                  <CheckCircle
                                    sx={{
                                      color: theme.palette.primary.main,
                                      width: "56px",
                                      height: "56px",
                                    }}
                                  />
                                  <Typography color={"common.black"}>
                                    Chuyến đi đã kết thúc
                                  </Typography>
                                </Box>
                                <MyCustomButton
                                  icon={
                                    <Feedback
                                      sx={{
                                        color: "main",
                                      }}
                                    />
                                  }
                                  iconPosition="left"
                                  width="auto"
                                  onClick={() =>
                                    openModal(
                                      <ConfirmCompleteTripModal
                                        booking={booking}
                                        isMobile={isMobile}
                                        setReloadBooking={setReloadBooking}
                                      />
                                    )
                                  }
                                  content={
                                    booking.status === "Finished"
                                      ? t("booking.myfeedback")
                                      : t("booking.commentandrating")
                                  }
                                  variant="outlined"
                                />
                              </Box>
                            )}
                        </Box>
                      )}
                    </Box>
                  </Box>
                )}
                {booking.returnAddress !== booking.address &&
                  booking.status === BookingStatus.Delivered && (
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <Typography>
                          {t("booking.titleChangeInfoReturn")}
                        </Typography>
                        {booking.returnStatus === "Processing" && (
                          <Chip
                            sx={{ "& .MuiChip-label": { fontSize: "14px" } }}
                            color="warning"
                            icon={<WarningAmber />}
                            label={t("licenseInfo.Processing")}
                          />
                        )}
                        {booking.returnStatus === "Approved" && (
                          <Chip
                            sx={{ "& .MuiChip-label": { fontSize: "14px" } }}
                            color="success"
                            icon={<CheckCircleOutline />}
                            label={t("licenseInfo.Approve")}
                          />
                        )}
                        {booking.returnStatus === "Rejected" && (
                          <Chip
                            sx={{ "& .MuiChip-label": { fontSize: "14px" } }}
                            color="error"
                            icon={<ErrorOutline />}
                            label={t("licenseInfo.Reject")}
                          />
                        )}
                      </Box>
                      {
                        (booking.returnStatus === "Approved" || booking.returnStatus === "Rejected") && booking.returnStatusComment !== "" &&
                        <Typography sx={{ mt: '2px' }}>Note: {booking.returnStatusComment}</Typography>
                      }
                    </Box>
                  )}
                <Box
                  display={"flex"}
                  flexDirection={"row"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  width={"100%"}
                  sx={{ gap: "8px" }}
                >
                  <Typography
                    fontSize={isMobile ? 16 : 20}
                    fontWeight={"700"}
                    color={"common.black"}
                  >
                    {t("booking.timeRent")}
                  </Typography>
                  {booking.status === "Delivered" && (
                    <MyIcon
                      icon={
                        <Edit
                          sx={{
                            color: theme.palette.common.black,
                            cursor: "pointer",
                            "&:hover": {
                              color: theme.palette.primary.main,
                            },
                          }}
                        />
                      }
                      hasTooltip
                      tooltipText={t("booking.changeReturnAddressAndTime")}
                      onClick={() =>
                        openModal(
                          <RequestChangeAddressAndTime
                            booking={booking}
                            setReload={setReloadBooking}
                          />
                        )
                      }
                      position="bottom"
                    />
                  )}
                </Box>

                <Box
                  display={"flex"}
                  flexWrap={"wrap"}
                  gap={isMobile ? "16px" : "32px"}
                  justifyContent={isMobile ? "space-between" : "start"}
                  flexDirection={isMobile ? "column" : "row"}
                  mb={"16px"}
                >
                  <Box display={"flex"} gap={"16px"}>
                    <img
                      src={CalendarImage}
                      alt="calendar"
                      width={isMobile ? 20 : 24}
                      height={isMobile ? 20 : 24}
                    />
                    <Box
                      display={"flex"}
                      flexDirection={"column"}
                      gap={"4px"}
                      justifyContent={"start"}
                    >
                      <Typography
                        fontSize={isMobile ? 14 : 16}
                        color={theme.palette.text.secondary}
                      >
                        {t("booking.startDate")}
                      </Typography>
                      <Typography
                        fontSize={isMobile ? 14 : 16}
                        color={theme.palette.text.primary}
                      >
                        {dayjs(booking?.startDatetime).format(
                          "DD-MM-YYYY HH:mm"
                        )}
                      </Typography>
                    </Box>
                  </Box>
                  <Box display={"flex"} gap={"16px"}>
                    <img
                      src={CalendarImage}
                      alt="calendar"
                      width={isMobile ? 20 : 24}
                      height={isMobile ? 20 : 24}
                    />
                    <Box
                      display={"flex"}
                      flexDirection={"column"}
                      gap={"4px"}
                      justifyContent={"start"}
                    >
                      <Typography
                        fontSize={isMobile ? 14 : 16}
                        color={theme.palette.text.secondary}
                      >
                        {t("booking.endDate")}
                      </Typography>
                      <Typography
                        fontSize={isMobile ? 14 : 16}
                        color={theme.palette.text.primary}
                      >
                        {dayjs(booking?.endDatetime).format("DD-MM-YYYY HH:mm")}
                      </Typography>
                    </Box>
                  </Box>
                  {
                    location !== locationReturn && booking.status === BookingStatus.Delivered &&
                    <Box display={"flex"} gap={"16px"}>
                      <img
                        src={CalendarImage}
                        alt="calendar"
                        width={isMobile ? 20 : 24}
                        height={isMobile ? 20 : 24}
                      />
                      <Box
                        display={"flex"}
                        flexDirection={"column"}
                        gap={"4px"}
                        justifyContent={"start"}
                      >
                        <Typography
                          fontSize={isMobile ? 14 : 16}
                          color={theme.palette.text.secondary}
                        >
                          {t("booking.returnDate")}
                        </Typography>
                        <Typography
                          fontSize={isMobile ? 14 : 16}
                          color={theme.palette.text.primary}
                        >
                          {dayjs(booking?.returnDatetime).format(
                            "DD-MM-YYYY HH:mm"
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  }
                </Box>

                <Typography
                  fontSize={isMobile ? 16 : 20}
                  fontWeight={"700"}
                  color={"common.black"}
                >
                  {t("booking.addressGetMotorbike")}
                </Typography>
                <TextField
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderRadius: "8px",
                        border: "1px solid #e0e0e0",
                      },
                      "&:hover fieldset": {
                        border: "1px solid #8b4513",
                      },
                      "&.Mui-focused fieldset": {
                        border: "1px solid #8b4513",
                      },
                    },
                  }}
                  value={booking?.address}
                  inputProps={{
                    readOnly: true,
                  }}
                />
                <Typography
                  fontSize={isMobile ? 16 : 20}
                  fontWeight={"700"}
                  color={"common.black"}
                >
                  {t("booking.addressReturn")}
                </Typography>
                <TextField
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderRadius: "8px",
                        border: "1px solid #e0e0e0",
                      },
                      "&:hover fieldset": {
                        border: "1px solid #8b4513",
                      },
                      "&.Mui-focused fieldset": {
                        border: "1px solid #8b4513",
                      },
                    },
                  }}
                  value={booking?.returnAddress}
                  inputProps={{
                    readOnly: true,
                  }}
                />
                <Box
                  borderRadius={"10px"}
                  border={"3px solid #8b4513"}
                  margin={"0px auto"}
                  width={isMobile ? "98%" : "99%"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  flexDirection={"column"}
                >
                  {isLoaded &&
                    booking &&
                    booking.address &&
                    booking.address !== "" && (
                      <GoogleMap
                        zoom={12}
                        center={
                          {
                            lat: (location.lat + locationReturn.lat) / 2 + 0.012,
                            lng: (location.lng + locationReturn.lng) / 2,
                          } as any
                        }
                        mapContainerStyle={{
                          width: "100%",
                          height: "40vh",
                          borderRadius: "8px",
                        }}
                      >
                        {booking && (
                          <>
                            {
                              (location.lat !== locationReturn.lat ||
                                location.lng !== locationReturn.lng)
                              && booking.returnStatus === "Approved" && (
                                <>
                                  <Marker
                                    icon={{
                                      url: motorbikePickup,
                                      scaledSize: new window.google.maps.Size(40, 40)
                                    }}
                                    position={{
                                      lat: location.lat,
                                      lng: location.lng,
                                    }}
                                  >
                                    <InfoWindow
                                      position={
                                        {
                                          lat: location.lat,
                                          lng: location.lng,
                                        }}
                                      options={{
                                        pixelOffset: new window.google.maps.Size(0, -25), // Điều chỉnh độ lệch theo nhu cầu của bạn
                                        zIndex: 1,
                                      }}
                                    >
                                      <Typography variant="subtitle2"
                                        sx={{
                                          fontWeight: "700",
                                          color: "#000"
                                        }}>
                                        {t("editional.deliveryLocation")}
                                      </Typography>
                                    </InfoWindow>
                                  </Marker>
                                  <Marker
                                    icon={{
                                      url: motorbikeDropOff,
                                      scaledSize: new window.google.maps.Size(48, 48)
                                    }}
                                    position={{
                                      lat: locationReturn.lat,
                                      lng: locationReturn.lng,
                                    }}
                                  >
                                    <InfoWindow
                                      position={
                                        {
                                          lat: locationReturn.lat,
                                          lng: locationReturn.lng,
                                        }}
                                      options={{
                                        pixelOffset: new window.google.maps.Size(6, -30), // Điều chỉnh độ lệch theo nhu cầu của bạn
                                        zIndex: 1,
                                      }}
                                    >
                                      <Typography variant="subtitle2"
                                        sx={{
                                          fontWeight: "700",
                                          color: "#000"
                                        }}>
                                        {t("editional.returnLocation")}
                                      </Typography>
                                    </InfoWindow>
                                  </Marker>
                                </>
                              )
                            }
                            {
                              location.lat === locationReturn.lat &&
                              location.lng === locationReturn.lng &&
                              <Marker
                                icon={{
                                  url: motorbikePickup,
                                  scaledSize: new window.google.maps.Size(40, 40)
                                }}
                                position={{
                                  lat: location.lat,
                                  lng: location.lng,
                                }}
                              >
                                <InfoWindow
                                  position={
                                    {
                                      lat: location.lat,
                                      lng: location.lng,
                                    }}
                                  options={{
                                    pixelOffset: new window.google.maps.Size(0, -25), // Điều chỉnh độ lệch theo nhu cầu của bạn
                                    zIndex: 1,
                                  }}
                                >
                                  <Typography variant="subtitle2"
                                    sx={{
                                      fontWeight: "700",
                                      color: "#000"
                                    }}>
                                    {t("editional.deliveryandpickupLocation")}
                                  </Typography>
                                </InfoWindow>
                              </Marker>
                            }
                          </>
                        )}
                      </GoogleMap>
                    )}
                </Box>
              </Box>
              <Box
                width={isMobile ? "100%" : "45%"}
                sx={{
                  background: isMobile ? "none" : "rgba(139, 69, 19, 0.10)",
                  borderRadius: "8px",
                  padding: isMobile ? "4px" : "32px",
                }}
              >
                <Typography
                  fontSize={isMobile ? 16 : 20}
                  fontWeight={"700"}
                  color={"common.black"}
                  mb={"16px"}
                >
                  {t("booking.totalPriceRent")}
                </Typography>
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
                      sx={{ fontSize: "16px", fontWeight: "400" }}
                    >
                      {t("booking.pricePerday")}
                    </Typography>
                    <Typography
                      color={theme.palette.text.primary}
                      sx={{ fontSize: "16px", fontWeight: "600" }}
                      textAlign={'end'}
                    >
                      {`${booking &&
                        booking.motorbikes &&
                        formatMoneyNew(
                          booking.motorbikes.reduce(
                            (total, mt) => total + mt.priceRent,
                            0
                          ) || 0
                        )
                        }/${t("booking.perDay")}`}{" "}
                      x{" "}
                      {booking &&
                        booking.motorbikes &&
                        booking.motorbikes.length}{" "}
                      {t("booking.perMotorbike")}
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
                  {/* Phí giao xe */}
                  <Box
                    width={"100%"}
                    display={"flex"}
                    flexDirection={"row"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    sx={{ gap: "8px" }}
                  >
                    <Box display={"flex"} alignItems={"center"} gap={1}>
                      <Typography
                        color={theme.palette.text.primary}
                        sx={{ fontSize: "16px", fontWeight: "400" }}
                      >
                        {t("booking.deliveryFee")}
                      </Typography>
                      <MyIcon
                        icon={
                          <HelpOutlineOutlined
                            sx={{
                              color: theme.palette.text.primary,
                              width: "12px",
                              height: "12px",
                              cursor: "pointer",
                            }}
                          />
                        }
                        hasTooltip
                        tooltipText={`${t(
                          "booking.deliveryFee_hint"
                        )} ${formatMoneyNew(
                          booking.motorbikes.reduce(
                            (total, mt) => total + mt.totalFeeOfDelivery,
                            0
                          ) || 0
                        )}`}
                        onClick={() => { }}
                        position="right-start"
                      />
                    </Box>
                    <Typography
                      color={theme.palette.text.primary}
                      sx={{ fontSize: "16px", fontWeight: "600" }}
                      textAlign={'end'}
                    >
                      {`${booking &&
                        booking.motorbikes &&
                        formatMoneyNew(
                          booking.motorbikes.reduce(
                            (total, mt) => total + mt.totalFeeOfDelivery,
                            0
                          ) || 0
                        )
                        }/${t("booking.perDay")}`}{" "}
                      x{" "}
                      {booking &&
                        booking.motorbikes &&
                        booking.motorbikes.length}{" "}
                      {t("booking.perMotorbike")}
                    </Typography>
                  </Box>
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
                      sx={{ fontSize: "16px", fontWeight: "400" }}
                    >
                      {t("booking.totalPriceRent")}
                    </Typography>
                    <Typography
                      color={theme.palette.text.primary}
                      sx={{ fontSize: "16px", fontWeight: "600" }}
                      textAlign={'end'}
                    >
                      {formatMoneyNew(booking?.totalAmountTemp)} x{" "}
                      {booking?.rentalDays} {t("booking.perDay")}
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
                    <Box display={"flex"} alignItems={"center"} gap={1}>
                      <Typography
                        color={theme.palette.text.primary}
                        sx={{ fontSize: "16px", fontWeight: "400" }}
                      >
                        {t("booking.totalPriceService")}
                      </Typography>
                      <MyIcon
                        icon={
                          <HelpOutlineOutlined
                            sx={{
                              color: theme.palette.text.primary,
                              width: "12px",
                              height: "12px",
                              cursor: "pointer",
                            }}
                          />
                        }
                        hasTooltip
                        tooltipText={t("booking.totalPriceService_hint")}
                        onClick={() => { }}
                        position="right-start"
                      />
                    </Box>
                    <Typography
                      color={theme.palette.text.primary}
                      sx={{ fontSize: "16px", fontWeight: "600" }}
                    >
                      {formatMoneyNew(booking?.feeOfService)}
                    </Typography>
                  </Box>

                  {/* Mã khuyến mãi */}
                  {booking?.promotion && (
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
                        sx={{ fontSize: "16px", fontWeight: "400" }}
                      >
                        {t("booking.promotionCode")}:{" "}
                        <span
                          style={{
                            textTransform: "uppercase",
                            fontWeight: "700",
                          }}
                        >
                          {booking?.promotion?.code}
                        </span>
                      </Typography>
                      <Typography
                        color={theme.palette.text.primary}
                        sx={{ fontSize: "16px", fontWeight: "600" }}
                      >
                        {/* {formatMoneyNew(booking?.couponPrice)} */}
                        {formatMoneyNew(booking.reducedAmount)}
                      </Typography>
                    </Box>
                  )}
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
                    {t("booking.totalPrice")}
                  </Typography>
                  <Typography
                    color={theme.palette.text.primary}
                    sx={{ fontSize: "16px", fontWeight: "600" }}
                  >
                    {formatMoneyNew(booking?.totalAmount)}
                  </Typography>
                </Box>

                {/* Tiền cọc */}
                <Box
                  width={"100%"}
                  display={"flex"}
                  flexDirection={"row"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  sx={{ gap: "8px" }}
                >
                  <Box
                    display={"flex"}
                    flexDirection={"row"}
                    alignItems={"center"}
                    gap={"4px"}
                  >
                    <Typography
                      color={theme.palette.text.primary}
                      sx={{ fontSize: "16px", fontWeight: "600" }}
                    >
                      {t("booking.depositMoney")}
                    </Typography>
                    {booking.status !== BookingStatus.PendingPayment && (
                      <Tooltip title={t("booking.toolTipPaid")}>
                        <Verified
                          sx={{
                            cursor: "pointer",
                            width: "16px",
                            height: "16px",
                          }}
                        />
                      </Tooltip>
                    )}
                  </Box>
                  <Typography
                    color={theme.palette.text.primary}
                    sx={{
                      fontSize: "16px",
                      fontWeight: "600",
                      textDecoration:
                        booking.status !== BookingStatus.PendingPayment
                          ? "line-through"
                          : "none",
                    }}
                  >
                    {formatMoneyNew(booking?.deposit)}
                  </Typography>
                </Box>

                {/* Thanh toán khi nhận xe */}
                <Box
                  width={"100%"}
                  display={"flex"}
                  flexDirection={"row"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  sx={{ gap: "8px" }}
                >
                  <Box
                    display={"flex"}
                    flexDirection={"row"}
                    alignItems={"center"}
                    gap={"4px"}
                  >
                    <Typography
                      color={theme.palette.text.primary}
                      sx={{ fontSize: "16px", fontWeight: "600" }}
                    >
                      {t("booking.remainingAmount")}
                    </Typography>
                    {booking.status !== BookingStatus.PendingPayment &&
                      booking.status !== BookingStatus.PendingDelivery && (
                        <Tooltip title={t("booking.toolTipPaid")}>
                          <Verified
                            sx={{
                              cursor: "pointer",
                              width: "16px",
                              height: "16px",
                            }}
                          />
                        </Tooltip>
                      )}
                  </Box>

                  <Typography
                    color={theme.palette.text.primary}
                    sx={{
                      fontSize: "16px",
                      fontWeight: "600",
                      textDecoration:
                        booking.status !== BookingStatus.PendingPayment &&
                          booking.status !== BookingStatus.PendingDelivery
                          ? "line-through"
                          : "none",
                    }}
                  >
                    {formatMoneyNew(booking?.totalAmount - booking?.deposit)}
                  </Typography>
                </Box>

                <Divider
                  sx={{ margin: "16px 0px", width: "100%" }}
                  variant="fullWidth"
                />
                {activeStep === 0 && (
                  <Box
                    sx={{
                      backgroundColor: isMobile ? "none" : "#FFFFFF",
                      borderRadius: "8px",
                      padding: isMobile ? "0px" : "8px 16px",
                    }}
                  >
                    <Typography
                      fontSize={16}
                      fontWeight={"700"}
                      color={"common.black"}
                      marginBottom={"8px"}
                    >
                      {t("booking.paymentType")}
                    </Typography>
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "space-around",
                        gap: "16px",
                        my: "8px",
                      }}
                    >
                      <RadioGroup
                        value={paymentType}
                        onChange={(event) => {
                          setPaymentType(event.target.value);
                        }}
                        sx={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <FormControlLabel
                          checked={
                            paymentType === BookingPaymentType.UserBalance
                          }
                          value={BookingPaymentType.UserBalance}
                          control={<Radio />}
                          label={
                            <Box
                              minWidth={isMobile ? "250px" : "290px"}
                              display={"flex"}
                              flexDirection={"column"}
                              alignItems={"center"}
                              justifyContent={"center"}
                              sx={{ gap: "8px" }}
                              border={"2px solid #8b4513"}
                              borderRadius={"8px"}
                              padding={"8px"}
                            >
                              <img
                                alt="my-wallet"
                                src={MyWallet}
                                width={24}
                                height={24}
                              />
                              {`${t("booking.payWallet")} (${formatMoney(
                                user!.balance || 0
                              )})`}
                            </Box>
                          }
                          disabled={user!.balance < booking.totalAmount * 1000}
                          sx={{
                            "& .MuiFormControlLabel-label": {
                              fontSize: "16px",
                              fontWeight: "400",
                              color: theme.palette.text.primary,
                            },
                            margin: "0px",
                            borderRadius: "10px",
                          }}
                        />
                        <FormControlLabel
                          checked={paymentType === BookingPaymentType.Card}
                          value={BookingPaymentType.Card}
                          control={<Radio />}
                          label={
                            <Box
                              minWidth={isMobile ? "250px" : "290px"}
                              display={"flex"}
                              flexDirection={"column"}
                              alignItems={"center"}
                              justifyContent={"center"}
                              sx={{ gap: "8px" }}
                              border={"2px solid #8b4513"}
                              borderRadius={"8px"}
                              padding={"8px"}
                            >
                              <img alt="my-wallet" src={VNPay} height={24} />
                              <Typography
                                fontSize={isMobile ? 14 : 16}
                                fontWeight={"500"}
                                color={"common.black"}
                              >
                                {t("booking.payVnPay")}
                              </Typography>
                            </Box>
                          }
                          sx={{
                            "& .MuiFormControlLabel-label": {
                              fontSize: "16px",
                              fontWeight: "400",
                              color: theme.palette.text.primary,
                            },
                            margin: "0px",
                            borderRadius: "10px",
                          }}
                        />
                      </RadioGroup>
                    </Box>
                  </Box>
                )}
                {activeStep !== 0 && (
                  <Box
                    sx={{
                      backgroundColor: isMobile ? "none" : "#FFFFFF",
                      borderRadius: "8px",
                      padding: isMobile ? "0px" : "8px 16px",
                    }}
                  >
                    <Typography
                      fontSize={16}
                      fontWeight={"700"}
                      color={"common.black"}
                      marginBottom={"8px"}
                    >
                      {t("booking.paymentType")}
                    </Typography>
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "space-around",
                        gap: "16px",
                        my: "8px",
                      }}
                    >
                      {booking?.paymentType === BookingPaymentType.Card ? (
                        <Box
                          width={"90%"}
                          display={"flex"}
                          flexDirection={"column"}
                          alignItems={"center"}
                          justifyContent={"center"}
                          sx={{ gap: "8px" }}
                          border={"2px solid #8b4513"}
                          borderRadius={"8px"}
                          padding={"8px"}
                        >
                          <img alt="my-wallet" src={VNPay} height={24} />
                          <Typography
                            fontSize={isMobile ? 14 : 16}
                            fontWeight={"500"}
                            color={"common.black"}
                          >
                            {t("booking.payVnPay")}
                          </Typography>
                        </Box>
                      ) : (
                        <Box
                          width={"90%"}
                          display={"flex"}
                          flexDirection={"column"}
                          alignItems={"center"}
                          justifyContent={"center"}
                          sx={{ gap: "8px" }}
                          border={"2px solid #8b4513"}
                          borderRadius={"8px"}
                          padding={"8px"}
                        >
                          <img
                            alt="my-wallet"
                            src={MyWallet}
                            width={24}
                            height={24}
                          />
                          <Typography
                            fontSize={isMobile ? 14 : 16}
                            fontWeight={"400"}
                            color={"common.black"}
                          >{`${t("booking.payWallet")}`}</Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                )}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-around",
                    gap: "16px",
                    my: "16px",
                  }}
                >
                  {activeStep === 0 && (
                    <MyCustomButton
                      disabled={false}
                      width="100%"
                      onClick={() => {
                        openModal(
                          <MyDialog
                            title={t("booking.paymentBooking")}
                            content={t("booking.confirmPaymentBooking")}
                            hasAgreeButton={true}
                            hasCancelButton={true}
                            onClickAgree={() => handleProcessPayment(booking!)}
                          />
                        );
                      }}
                      content={t("booking.bookMotorbikeButton")}
                      variant="contained"
                    />
                  )}
                  {activeStep !== 2 && activeStep !== 3 && (
                    <MyCustomButton
                      width="100%"
                      onClick={() =>
                        showModalCancelBooking(booking?.bookingId || 0)
                      }
                      content={t("booking.cancelBook")}
                      variant="outlined"
                    />
                  )}
                </Box>
              </Box>
            </Box>
            {booking &&
              booking.motorbikes &&
              booking.motorbikes.length > 0 &&
              booking.motorbikes.map((motor, index) => {
                return (
                  <MotorbikeBookingCard
                    key={`${index}_motor`}
                    motorbike={motor}
                    isMobile={isMobile}
                  />
                );
              })}
            <Box mb={"8px"}>
              <RequireWhenRent />
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};
