import React, { useContext, useEffect, useMemo, useState } from "react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MyIcon from "../../../../components/common/MyIcon";
import usei18next from "../../../../hooks/usei18next";
import {
  Avatar,
  Chip,
  CircularProgress,
  Collapse,
  Divider,
  FormControl,
  Grid,
  IconButton,
  Modal,
  Paper,
  Popover,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { Box } from "@mui/system";
import {
  ChangeCircleOutlined,
  CheckCircleOutline,
  CloseOutlined,
  EditOutlined,
  ErrorOutline,
  GasMeterOutlined,
  LocalDrinkOutlined,
  LocationOn,
  NewReleasesOutlined,
  StopCircleOutlined,
  WarningAmber,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../../utils/Constant";
import { DataGrid } from "@mui/x-data-grid";
import {
  Booking,
  Feedback,
  IncomeFromMotorbike,
  Motorbike,
} from "../../../../utils/type";
import { PostMotorbikeService } from "../../../../services/PostMotorbikeService";
import { Fade } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import MySlideShowImage from "../../../../components/common/MySlideShowImage";
import theme from "../../../../utils/theme";
import useThemePage from "../../../../hooks/useThemePage";
import {
  CartIcon,
  HelmetIcon,
  ProtectClothesIcon,
  RainCoatIcon,
  RepairIcon,
  TelephoneIcon,
} from "../../../../assets/icons";
import {
  Circle,
  GoogleMap,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";
import MyBookingItem from "../../../BookMotorbike/components/MyBookingItem";
import { BookingService } from "../../../../services/BookingService";
import MotorbikeFavouriteInforCard from "../../../FavouritePage/components/MotorbikeFavouriteInforCard";
import { NoDataImage, PinImage } from "../../../../assets/images";
import { CommentItem } from "../../../UserProfilePage/UserInforModal";
import MotorbikeInforCard from "../../../HomePage/components/MotorbikeInforCard";
import { getUserInfo } from "../../../../redux/reducers/authReducer";
import { useAppDispatch, useAppSelector } from "../../../../hooks/useAction";
import FeedbackCard from "../../../HomePage/components/FeedbackCard";
import { RequireWhenRent } from "../../../MotorbikePage/components/RequireWhenRent";
import { FeedbackService } from "../../../../services/FeedbackService";
import { ModalContext } from "../../../../contexts/ModalContext";
import { connection } from "../../../../redux/reducers/signalRReducer";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { formatMoney, formatMoneyNew } from "../../../../utils/helper";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel1(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
function CustomTabPanel2(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const ListMotorbikeForm = () => {
  const { t } = usei18next();
  const navigate = useNavigate();
  const { isMobile, isIpad } = useThemePage();

  const [isItemMotorbikeModalOpen, setItemMotorbikeModalOpen] = useState(false);
  const [defaultListRegisterMotorbike, setDefaultListRegisterMotorbike] =
    useState<Motorbike[]>([]);
  const [listRegisterMotorbike, setListRegisterMotorbike] = useState<
    Motorbike[]
  >([]);
  const [motorbike, setMotorbike] = useState<Motorbike>();
  const [modalImageList, setModalImageList] = useState([]);
  const [reload, setReload] = useState<boolean>(false);

  const openItemModal = (motorbike: Motorbike, imageList: any) => {
    setMotorbike(motorbike);
    setModalImageList(imageList);
    setItemMotorbikeModalOpen(true);
  };

  const closeItemModal = () => {
    setItemMotorbikeModalOpen(false);
  };

  useEffect(() => {
    getAllMotorbikesRegistered();
  }, [reload]);

  useEffect(() => {
    connection.on("IsReloadMotorbikes", () => {
      setReload((prev) => !prev);
    });
  }, []);

  const getAllMotorbikesRegistered = async () => {
    try {
      const response = await PostMotorbikeService.getListMotorbikeByUserId();
      if (response) {
        setListRegisterMotorbike(response);
        setDefaultListRegisterMotorbike(response);
      }
    } catch (error) {}
  };

  // get unique status into 2D array has key is status and value is status using i18next
  const getUniqueStatus = [
    ...new Set(defaultListRegisterMotorbike.map((item) => item.status)),
  ];
  const setUniqueStatus = getUniqueStatus.map((item) => {
    return {
      key: item,
      value: t(
        `postMotorbike.listform.status-${item.replace(/\s/g, "").toLowerCase()}`
      ),
    };
  });

  const [selectedStatus, setSelectedStatus] = useState("All");
  const handleChangeStatus = (event: SelectChangeEvent) => {
    setSelectedStatus(event.target.value);
  };

  // change the list Register Motorbike when change status
  useEffect(() => {
    if (selectedStatus === "All") {
      setListRegisterMotorbike(defaultListRegisterMotorbike);
    } else {
      const newList = defaultListRegisterMotorbike.filter(
        (item) => item.status === selectedStatus
      );
      setListRegisterMotorbike(newList);
    }
  }, [selectedStatus]);

  const [value1, setValue1] = useState(0);
  const [value2, setValue2] = useState(0);

  const handleChange1 = (event: React.SyntheticEvent, newValue: number) => {
    setValue1(newValue);
  };
  const handleChange2 = (event: React.SyntheticEvent, newValue: number) => {
    setValue2(newValue);
  };

  const [listBooing, setListBooking] = useState<Booking[]>([]);
  const [isLoad, setIsLoad] = useState<boolean>(false);
  const [listMotorbikeWithFeedback, setListMotorbikeWithFeedback] = useState<
    Motorbike[]
  >([]);

  const [incomeData, setIcomeData] = useState<IncomeFromMotorbike[]>([]);

  useEffect(() => {
    getData();
    getDataIncome();
  }, []);
  const getData = async () => {
    try {
      setIsLoad(true);
      const dataBooking = await BookingService.getListRentalBooking();
      if (dataBooking) {
        setListBooking(dataBooking);
        const motorbikesWithFeedback = dataBooking.flatMap(
          (booking) => booking.motorbikes
        );
        // Remove duplicates based on motorbikeId
        const uniqueMotorbikeIds = Array.from(
          new Set(motorbikesWithFeedback.map((motorbike) => motorbike.id))
        );
        // Filter out duplicate motorbikes
        const uniqueMotorbikes = uniqueMotorbikeIds
          .map((motorbikeId) =>
            motorbikesWithFeedback.find(
              (motorbike) => motorbike.id === motorbikeId
            )
          )
          .filter(
            (motorbike) => motorbike && motorbike.feedbacks.length > 0
          ) as Motorbike[];
        setListMotorbikeWithFeedback(uniqueMotorbikes);
        setIsLoad(false);
      } else {
        setListBooking([]);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoad(false);
  };

  const getDataIncome = async () => {
    try {
      setIsLoad(true);
      const dataIncome = await BookingService.getIncomeFromMotorbike();
      if (dataIncome && dataIncome.length > 0) {
        setIcomeData(dataIncome);
      }
      setIsLoad(false);
    } catch (error) {}
  };

  type StatusOrder = {
    [key: string]: number;
  };

  const statusOrder: StatusOrder = {
    Delivered: 1,
    PendingDelivery: 2,
    Paid: 3,
    PendingPayment: 4,
  };

  // reload page
  const reloadPage = () => {
    window.location.reload();
  };

  const TableStyle = styled("form")(({ theme }) => ({
    "& .MuiTableCell-root": {
      borderTop: "none",
      borderLeft: "none",
      borderRight: "none"
    },
  }));

  return (
    <Box
      width={"80%"}
      margin={"32px auto"}
      display={"flex"}
      flexDirection={"row"}
      justifyContent={"center"}
      alignContent={"center"}
    >
      <Paper elevation={2} sx={{ width: "100%", bgcolor: "background.paper" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value1}
            onChange={handleChange1}
            aria-label="basic tabs example"
          >
            <Tab
              sx={{
                textTransform: "none",
                fontSize: "16px",
                fontWeight: "600",
                lineHeight: "24px",
                color: theme.palette.text.primary,
                "&.Mui-selected": {
                  color: theme.palette.primary.main,
                },
              }}
              label={t("postMotorbike.listform.historyBooking")}
              {...a11yProps(0)}
            />
            <Tab
              sx={{
                textTransform: "none",
                fontSize: "16px",
                fontWeight: "600",
                lineHeight: "24px",
                color: theme.palette.text.primary,
                "&.Mui-selected": {
                  color: theme.palette.primary.main,
                },
              }}
              label={t("postMotorbike.listform.allmymotorbikes")}
              {...a11yProps(1)}
            />
            <Tab
              sx={{
                textTransform: "none",
                fontSize: "16px",
                fontWeight: "600",
                lineHeight: "24px",
                color: theme.palette.text.primary,
                "&.Mui-selected": {
                  color: theme.palette.primary.main,
                },
              }}
              label={t("postMotorbike.listform.myMotorbikeFeedback")}
              {...a11yProps(2)}
            />
            <Tab
              sx={{
                textTransform: "none",
                fontSize: "16px",
                fontWeight: "600",
                lineHeight: "24px",
                color: theme.palette.text.primary,
                "&.Mui-selected": {
                  color: theme.palette.primary.main,
                },
              }}
              label={t("postMotorbike.listform.myMotorbikeIncome")}
              {...a11yProps(3)}
            />
          </Tabs>
        </Box>
        <CustomTabPanel1 value={value1} index={0}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "16px",
              }}
            >
              <Tabs
                value={value2}
                onChange={handleChange2}
                aria-label="basic tabs example"
              >
                <Tab
                  sx={{
                    backgroundColor:
                      value2 === 0 ? "rgb(139,69,13,0.1)" : "none",
                    borderRadius: "16px 16px 0px 0px",
                    color: value2 === 0 ? "#8B4513" : "#000",
                    fontWeight: value2 === 0 ? 700 : 500,
                    textTransform: "none",
                    fontSize: "16px",
                    lineHeight: "24px",
                    "&.Mui-selected": {
                      color: theme.palette.primary.main,
                      backgroundColor: "rgba(139, 69, 19, 0.05)",
                    },
                    "&:hover": {
                      transform: "scale(1.02)",
                      fontWeight: 700,
                    },
                  }}
                  label={t("postMotorbike.listform.currentBooking")}
                  {...a11yProps(0)}
                />
                <Tab
                  sx={{
                    backgroundColor:
                      value2 === 1 ? "rgb(139,69,13,0.1)" : "none",
                    borderRadius: "16px 16px 0px 0px",
                    color: value2 === 1 ? "#8B4513" : "#000",
                    fontWeight: value2 === 1 ? 700 : 500,
                    textTransform: "none",
                    fontSize: "16px",
                    lineHeight: "24px",
                    "&.Mui-selected": {
                      color: theme.palette.primary.main,
                      backgroundColor: "rgba(139, 69, 19, 0.05)",
                    },
                    "&:hover": {
                      transform: "scale(1.02)",
                      fontWeight: 700,
                    },
                  }}
                  label={t("postMotorbike.listform.bookingInHistory")}
                  {...a11yProps(1)}
                />
              </Tabs>
            </div>
          </Box>
          <CustomTabPanel2 value={value2} index={0}>
            <MyBookingItem
              isOwner
              isLoad={isLoad}
              index={0}
              bookings={listBooing
                .filter(
                  (item) =>
                    item.status === "PendingPayment" ||
                    item.status === "Paid" ||
                    item.status === "PendingDelivery" ||
                    item.status === "Delivered"
                )
                .sort((a, b) => {
                  // Sort by status order
                  const statusComparison =
                    statusOrder[a.status] - statusOrder[b.status];

                  // If statuses are different, use the status order
                  if (statusComparison !== 0) {
                    return statusComparison;
                  }

                  // If statuses are the same, sort by startDatetime
                  return (
                    new Date(a.startDatetime).valueOf() -
                    new Date(b.startDatetime).valueOf()
                  );
                })
                .reverse()}
            />
          </CustomTabPanel2>
          <CustomTabPanel2 value={value2} index={1}>
            <MyBookingItem
              isOwner
              isLoad={isLoad}
              index={1}
              bookings={listBooing
                .filter(
                  (item) =>
                    item.status === "Cancelled" ||
                    item.status === "PendingReview" ||
                    item.status === "Finished"
                )
                .sort((a, b) => {
                  // If statuses are the same, sort by startDatetime
                  return (
                    new Date(a.updateDatetime).valueOf() -
                    new Date(b.updateDatetime).valueOf()
                  );
                })
                .reverse()}
            />
          </CustomTabPanel2>
        </CustomTabPanel1>
        <CustomTabPanel1 value={value1} index={1}>
          {/* tất cả xe */}
          <Box
            width={"100%"}
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"space-between"}
            alignContent={"center"}
          >
            <Box
              display={"flex"}
              flexDirection={"row"}
              width={"100%"}
              margin={"8px 0px 16px 0px"}
              justifyContent={"end"}
              alignContent={"center"}
            >
              <Typography
                fontSize={"18px"}
                fontWeight={"400"}
                margin={"auto 8px"}
              >
                {t("postMotorbike.listform.status")}
              </Typography>
              <FormControl sx={{ minWidth: 120 }} size="small">
                <Select
                  labelId="demo-select-small-label"
                  id="demo-select-small"
                  value={selectedStatus}
                  native
                  displayEmpty
                  onChange={handleChangeStatus}
                >
                  <option value={"All"}>
                    <em>{t("postMotorbike.listform.all")}</em>
                  </option>
                  {setUniqueStatus.map((status) => (
                    <option value={status.key}>{status.value}</option>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
          <Box
            width={"100%"}
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"space-evenly"}
            alignItems={"center"}
            flexWrap={"wrap"}
            gap={"16px"}
          >
            {listRegisterMotorbike.length === 0 ? (
              <Box
                display={"flex"}
                flexDirection={"column"}
                alignItems={"center"}
                justifyContent={"center"}
                width={"100%"}
                marginTop={2}
                gap={2}
              >
                <img
                  src={NoDataImage}
                  alt={"no-data"}
                  width={"400px"}
                  height={"400px"}
                />
              </Box>
            ) : (
              listRegisterMotorbike
                .slice()
                .reverse()
                .map((motorbike: Motorbike) => (
                  <MotorbikeFavouriteInforCard
                    motorbike={motorbike}
                    isListForm
                    openItemDetailModal={() =>
                      openItemModal(motorbike, motorbike.imageUrl)
                    }
                    openUpdateInforPage={() =>
                      navigate(
                        `${ROUTES.user.updateregistermotorbike}/${motorbike.id}`
                      )
                    }
                  />
                ))
            )}
          </Box>
        </CustomTabPanel1>
        <CustomTabPanel1 value={value1} index={2}>
          {listMotorbikeWithFeedback.length > 0 ? (
            listMotorbikeWithFeedback.map((item: Motorbike, index1: number) => {
              return (
                <Box
                  key={index1}
                  sx={{
                    backgroundColor: "rgb(5, 69, 19, 0.1)",
                    borderRadius: "8px",
                    padding: "16px",
                    alignItems: "start",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    marginTop: index1 === 0 ? "0px" : "16px",
                  }}
                >
                  <Box>
                    <MotorbikeInforCard
                      isInModal
                      canClickDetailPage
                      motorbike={item}
                      isFavoritePage={false}
                      isNotFavorite
                      isIntroduced={true}
                    />
                  </Box>
                  {/* motorbike card */}
                  {/* Box comment */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "start",
                      alignItems: "center",
                      marginLeft: "16px",
                      width: "100%",
                    }}
                  >
                    {item.feedbacks.length > 0
                      ? item.feedbacks.map(
                          (feedback: Feedback, index2: number) => {
                            return (
                              <Box
                                key={index2}
                                sx={{
                                  width: "100%",
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "start",
                                  alignItems: "center",
                                  marginTop: index2 === 0 ? "0px" : "16px",
                                }}
                              >
                                <CommentItem
                                  isOwner
                                  isDetail
                                  bookingId={feedback.bookingId}
                                  avatar={feedback.user.avatarUrl}
                                  dateComment={feedback.createDatetime}
                                  name={feedback.user.name}
                                  rating={feedback.rating}
                                  comment={feedback.comment}
                                  // replyComment={"Cảm ơn bạn"}
                                  replyComment={
                                    feedback.response
                                      ? feedback.response.comment
                                      : ""
                                  }
                                  motorbikeId={item.id}
                                  feedbackId={
                                    feedback.response
                                      ? feedback.response.feedbackId
                                      : 0
                                  }
                                  dateReplyComment={
                                    feedback.response
                                      ? feedback.response.createDatetime
                                      : ""
                                  }
                                  reload={reloadPage}
                                  isMobile={isMobile}
                                />
                              </Box>
                            );
                          }
                        )
                      : null}
                  </Box>
                </Box>
              );
            })
          ) : (
            <Box
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
              justifyContent={"center"}
              width={"100%"}
              marginTop={2}
              gap={2}
            >
              <img
                src={NoDataImage}
                alt={"no-data"}
                width={"400px"}
                height={"400px"}
              />
            </Box>
          )}
        </CustomTabPanel1>
        <CustomTabPanel1 value={value1} index={3}>
          {incomeData.length > 0 ? (
            <TableStyle>
              <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                  <TableBody>
                    {incomeData.map((income, index) => {
                      return (
                        <RowIncome
                          row={income}
                          index={index + 1}
                          key={`income_${index}`}
                        />
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </TableStyle>
          ) : (
            <Box
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
              justifyContent={"center"}
              width={"100%"}
              marginTop={2}
              gap={2}
            >
              <img
                src={NoDataImage}
                alt={"no-data"}
                width={"400px"}
                height={"400px"}
              />
            </Box>
          )}
        </CustomTabPanel1>
      </Paper>
      <ItemMotorbikeModal
        isMobile={isMobile}
        isIpad={isIpad}
        isItemModalOpen={isItemMotorbikeModalOpen}
        closeItemModal={closeItemModal}
        motorbikeId={motorbike?.id}
      />
    </Box>
  );
};

export default ListMotorbikeForm;

function ItemMotorbikeModal({
  isMobile,
  isIpad,
  isItemModalOpen,
  closeItemModal,
  motorbikeId,
}: {
  isMobile: boolean;
  isIpad: boolean;
  isItemModalOpen: boolean;
  closeItemModal: any;
  motorbikeId?: number;
}) {
  interface Location {
    lat: number;
    lng: number;
  }

  const { t } = usei18next();
  const [equipmentList, setEquipmentList] = useState<string[]>([]);
  const [location, setLocation] = useState<Location>();
  const [motorbike, setMotorbike] = useState<Motorbike>();
  const [listFeedback, setlistFeedback] = useState<Feedback[]>([]);
  const [reloadFeedback, setReloadFeedback] = useState<boolean>(false);
  const { setContentModal } = useContext(ModalContext);

  const getFeedbackById = async (id: string) => {
    try {
      const response = await FeedbackService.getFeedbackById(id);
      if (response) {
        setlistFeedback(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (motorbikeId) {
      getMotorbikeById(motorbikeId.toString());
      getFeedbackById(motorbikeId.toString());
    }
  }, [motorbikeId, reloadFeedback]);

  const getMotorbikeById = async (id: string) => {
    try {
      const response = await PostMotorbikeService.getMotorbikeById(id);
      if (response) {
        setMotorbike(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (motorbike) {
      const tempEquipmentList = motorbike.equipments.split(",");
      const location = motorbike.location.split(",");
      const lat = Number(location[0]);
      const lng = Number(location[1]);
      setLocation({ lat, lng });
      setEquipmentList(tempEquipmentList);
    }
  }, [motorbike]);

  // MAP CONTROLLER
  // Map with search box
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string,
    libraries: ["places"],
  });

  const defaultLoction = useMemo(
    () => ({
      lat: location?.lat || 10.762622,
      lng: location?.lng || 106.660172,
    }),
    [location]
  );

  const [anchorEl, setAnchorEl] = useState<any>(null);

  const handleMarkerClick = (event: google.maps.MapMouseEvent) => {
    // Hiển thị Popover khi click vào Marker
    setAnchorEl(event.domEvent.currentTarget);
  };

  const handleClosePopover = () => {
    // Đóng Popover khi click bên ngoài
    setAnchorEl(null);
  };

  const handleDragMap = () => {
    // không cho nguời dùng kéo map
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  // auto close modal if user click back button on webrowser
  useEffect(() => {
    window.onpopstate = () => {
      closeItemModal();
    };
  }, []);

  return (
    <Modal
      open={isItemModalOpen}
      onClose={closeItemModal}
      aria-labelledby="map-modal-title"
      aria-describedby="map-modal-description"
      sx={{
        display: "flex",
        alignItems: "start",
        justifyContent: "center",
        margin: "32px 0px",
        overflowY: "auto",
      }}
    >
      <Box
        width={"90%"}
        height={"auto"}
        sx={{
          backgroundColor: "#fff",
          borderRadius: "8px",
        }}
      >
        <Box
          sx={{
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "8px",
            backgroundColor: "#fff",
            borderBottom: "1px solid #E0E0E0",
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
          <Typography
            variant="h2"
            color={theme.palette.text.primary}
            fontSize={isMobile ? "24px" : "32px"}
            fontWeight={600}
            textAlign={"start"}
          >
            {t("postMotorbike.listform.motorbikeInfo")}
          </Typography>
          <Box
            height={"10%"}
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"flex-end"}
            alignItems={"center"}
          >
            <MyIcon
              icon={<CloseOutlined />}
              hasTooltip
              tooltipText={t("postMotorbike.registedForm.badge-close")}
              onClick={closeItemModal}
              position="bottom"
            />
          </Box>
        </Box>
        <Box
          margin={isMobile ? "32px 32px" : "32px 64px"}
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
            mb={"16px"}
          >
            {motorbike?.imageUrl && motorbike?.imageUrl.length > 0 && (
              <MySlideShowImage
                images={motorbike.imageUrl}
                isMobile={isMobile}
              />
            )}
          </Box>

          {/* Divider Line */}
          <Divider
            sx={{ width: "100%", margin: "16px 0px" }}
            variant="middle"
          />
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
            <Box
              display="flex"
              flexDirection="column"
              alignItems="start"
              width={"100%"}
              justifyContent={"space-between"}
              margin={"16px 0px"}
            >
              <Typography
                color={theme.palette.text.primary}
                variant="h5"
                fontWeight="600"
                fontSize={isMobile ? "32px" : "48px"}
                textTransform={"uppercase"}
              >
                {motorbike?.model.brand.brandName} {motorbike?.model.modelName}
              </Typography>
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                width={"100%"}
                mb={"32px"}
              >
                <MyIcon
                  icon={<LocationOn />}
                  hasTooltip
                  tooltipText={t("postMotorbike.listform.badge-location")}
                  onClick={() => {}}
                  position="left"
                />
                <Typography
                  variant="h5"
                  color={theme.palette.text.secondary}
                  fontSize={isMobile ? "16px" : "20px"}
                >
                  {motorbike?.address}
                </Typography>
              </Box>
              <Divider sx={{ width: "100%" }} variant="fullWidth" />
            </Box>
            {/* Phần Thứ Nhất */}
            <Box
              width={"100%"}
              display="flex"
              flexDirection={isIpad || isMobile ? "column" : "row"}
              alignItems="start"
              justifyContent={"space-between"}
              paddingBottom="16px"
            >
              {/* Phần Thứ Hai */}
              <Box
                sx={{
                  backgroundColor: "rgba(139, 69, 19, 0.05)",
                  borderRadius: "8px",
                  minHeight: "300px",
                }}
                margin={isIpad || isMobile ? "16px 0px" : "0px 0px"}
                width={isIpad || isMobile ? "auto" : "30%"}
                display="flex"
                flexDirection="column"
                alignItems="start"
                padding="16px"
              >
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  width={"100%"}
                  justifyContent={"space-between"}
                  pb={"18px"}
                >
                  <Typography
                    variant="h5"
                    color={theme.palette.text.primary}
                    fontSize={"32px"}
                    fontWeight="600"
                  >
                    {t("postMotorbike.listform.profit")}
                  </Typography>
                  <Chip
                    style={{
                      fontSize: "28px",
                      fontWeight: "600",
                      borderRadius: "8px",
                      padding: "16px 8px",
                    }}
                    color="success"
                    label={Number(motorbike?.priceRent) * 0.9 + "K"}
                  />
                </Box>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="start"
                  width={"100%"}
                  justifyContent={"space-between"}
                >
                  <TableContainer
                    sx={{
                      borderRadius: "8px",
                      backgroundColor: "#fff",
                      border: "2px solid #8B4513",
                      "& .MuiTableHead-root": {
                        "& .MuiTableCell-head": {
                          fontWeight: "600",
                          fontSize: "20px",
                        },
                      },
                      "& .MuiTableCell-root": {
                        border: "none",
                      },
                    }}
                  >
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell align="left">Loại</TableCell>
                          <TableCell align="right">Giá</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell align="left">Giá thuê mặc định</TableCell>
                          <TableCell align="right">
                            {motorbike?.priceRent} 000 VND
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell align="left">
                            <>
                              - Phí dịch vụ
                              <Chip
                                style={{
                                  fontSize: "16px",
                                  fontWeight: "600",
                                  borderRadius: "8px",
                                  marginLeft: "8px",
                                }}
                                color="error"
                                label={"10%"}
                              />
                            </>
                          </TableCell>
                          <TableCell align="right">
                            {Number(motorbike?.priceRent) * 0.1} 000 VND
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell align="left">Lợi nhuận</TableCell>
                          <TableCell align="right">
                            {Number(motorbike?.priceRent) * 0.9} 000 VND
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Box>
              {/* Thông tin xe */}
              <Box
                width={isIpad || isMobile ? "100%" : "65%"}
                display="flex"
                flexDirection="column"
                alignItems="start"
                paddingBottom="16px"
              >
                {isMobile && (
                  <Divider
                    sx={{ margin: "0px 0px 16px 0px", width: "100%" }}
                    variant="fullWidth"
                  />
                )}
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="start"
                  width={"100%"}
                  justifyContent={"space-between"}
                  gap={"16px"}
                  mt={isMobile ? "0px" : "16px"}
                >
                  <Typography
                    variant="h5"
                    color={theme.palette.text.primary}
                    fontWeight="700"
                    fontSize={"16px"}
                  >
                    {t("postMotorbike.listform.motorbikeFeature")}
                  </Typography>

                  <Box width={"100%"}>
                    <Box
                      sx={{
                        backgroundColor: "rgba(19, 139, 31, 0.05)",
                        borderRadius: "8px",
                      }}
                      padding={"16px"}
                      display="flex"
                      flexDirection={isMobile ? "column" : "row"}
                      alignItems="center"
                      gap={"8px"}
                      justifyContent={"space-between"}
                    >
                      <MotorbikeFeatureItem
                        icon={
                          <NewReleasesOutlined
                            color="primary"
                            fontSize="large"
                          />
                        }
                        title={t("postMotorbike.listform.release-year")}
                        content={motorbike?.releaseYear}
                        isMobile={isMobile}
                        t={t}
                      />

                      <MotorbikeFeatureItem
                        icon={
                          <GasMeterOutlined color="primary" fontSize="large" />
                        }
                        title={t("postMotorbike.listform.type")}
                        content={motorbike?.type}
                        isMobile={isMobile}
                        t={t}
                      />
                      <MotorbikeFeatureItem
                        icon={
                          <LocalDrinkOutlined
                            color="primary"
                            fontSize="large"
                          />
                        }
                        title={t("postMotorbike.listform.fuel-consumption")}
                        content={motorbike?.fuelConsumption + "L/100km"}
                        isMobile={isMobile}
                        t={t}
                      />
                    </Box>
                  </Box>
                </Box>

                <Divider
                  sx={{ margin: "16px 0px", width: "100%" }}
                  variant="fullWidth"
                />
                {/* Biển số xe */}
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="start"
                  width={"100%"}
                  justifyContent={"space-between"}
                  gap={"16px"}
                >
                  <Typography
                    variant="h5"
                    color={theme.palette.text.primary}
                    fontWeight="700"
                    fontSize={"16px"}
                  >
                    {t("postMotorbike.listform.licensePlate")}
                  </Typography>
                  <Box width={"100%"}>
                    <Box
                      display="flex"
                      flexDirection="row"
                      alignItems="center"
                      justifyContent={"center"}
                      borderRadius={"8px"}
                      margin={"0px 16px"}
                      padding={"16px 0px"}
                      border={"2px solid #8B4513"}
                    >
                      <Typography
                        variant="h5"
                        fontWeight="600"
                        color={theme.palette.text.primary}
                        fontSize={isMobile ? "16px" : "20px"}
                      >
                        {motorbike?.licensePlate} {/* Thêm biển số xe */}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Divider
                  sx={{
                    margin: isMobile ? "16px 0px 16px 0px" : "16px 0px",
                    width: "100%",
                  }}
                  variant="fullWidth"
                />

                {/* Trang bị */}
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="start"
                  width={"100%"}
                  justifyContent={"space-between"}
                  gap={"16px"}
                >
                  <Typography
                    variant="h5"
                    color={theme.palette.text.primary}
                    fontWeight="700"
                    fontSize={"16px"}
                  >
                    {t("postMotorbike.listform.equipments")}
                  </Typography>

                  <Box width={"100%"}>
                    <Box
                      sx={{
                        backgroundColor: "rgba(19, 139, 31, 0.05)",
                        borderRadius: "8px",
                      }}
                      padding={"16px 16px"}
                      display="flex"
                      flexDirection="row"
                      alignItems="center"
                      justifyContent={"center"}
                      borderRadius={"8px"}
                    >
                      <Grid
                        container
                        columnSpacing={{ xs: 3, sm: 3, md: 3 }}
                        rowSpacing={3}
                      >
                        {equipmentList.filter((item) => item === "Raincoat")
                          .length > 0 && (
                          <Grid item xs={isMobile ? 12 : 4}>
                            <EquipmentItem
                              icon={<RainCoatIcon />}
                              label={t("postMotorbike.registedForm.raincoat")}
                            />
                          </Grid>
                        )}
                        {equipmentList.filter((item) => item === "Helmet")
                          .length > 0 && (
                          <Grid item xs={isMobile ? 12 : 4}>
                            <EquipmentItem
                              icon={<HelmetIcon />}
                              label={t("postMotorbike.registedForm.helmet")}
                            />
                          </Grid>
                        )}
                        {equipmentList.filter(
                          (item) => item === "ReflectiveClothes"
                        ).length > 0 && (
                          <Grid item xs={isMobile ? 12 : 4}>
                            <EquipmentItem
                              icon={<ProtectClothesIcon />}
                              label={t(
                                "postMotorbike.registedForm.reflectiveClothes"
                              )}
                            />
                          </Grid>
                        )}
                        {equipmentList.filter((item) => item === "RepairKit")
                          .length > 0 && (
                          <Grid item xs={isMobile ? 12 : 4}>
                            <EquipmentItem
                              icon={<RepairIcon />}
                              label={t("postMotorbike.registedForm.repairKit")}
                            />
                          </Grid>
                        )}
                        {equipmentList.filter((item) => item === "Bagage")
                          .length > 0 && (
                          <Grid item xs={isMobile ? 12 : 4}>
                            <EquipmentItem
                              icon={<CartIcon />}
                              label={t("postMotorbike.registedForm.bagage")}
                            />
                          </Grid>
                        )}
                        {equipmentList.filter(
                          (item) => item === "CaseTelephone"
                        ).length > 0 && (
                          <Grid item xs={isMobile ? 12 : 4}>
                            <EquipmentItem
                              icon={<TelephoneIcon />}
                              label={t(
                                "postMotorbike.registedForm.caseTelephone"
                              )}
                            />
                          </Grid>
                        )}
                      </Grid>
                    </Box>
                  </Box>
                </Box>

                <Divider
                  sx={{
                    margin: isMobile ? "16px 0px 16px 0px" : "16px 0px",
                    width: "100%",
                  }}
                  variant="fullWidth"
                />

                {/* Hiển thị bản đồ vị trí xe */}
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="start"
                  width={"100%"}
                  justifyContent={"space-between"}
                  gap={"16px"}
                >
                  <Typography
                    variant="h5"
                    color={theme.palette.text.primary}
                    fontWeight="700"
                    fontSize={"16px"}
                  >
                    {t("postMotorbike.listform.address")}
                  </Typography>
                  <TextField
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderRadius: "8px",
                          border: "1px solid #e0e0e0",
                        },
                        "&:hover fieldset": {
                          border: "1px solid #e0e0e0",
                        },
                        "&.Mui-focused fieldset": {
                          border: "1px solid #e0e0e0",
                        },
                      },
                    }}
                    size="small"
                    fullWidth
                    multiline
                    value={motorbike?.address}
                    inputProps={{
                      readOnly: true,
                    }}
                  />
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
                        zoom={10}
                        center={defaultLoction}
                        mapContainerStyle={{
                          width: "100%",
                          height: "40vh",
                          borderRadius: "8px",
                        }}
                      >
                        <Marker position={defaultLoction} icon={PinImage} />
                        {/* Circle with 8km radius */}
                        <Circle
                          center={defaultLoction}
                          radius={
                            motorbike && motorbike?.maxDeliveryDistance * 1000
                          }
                          options={{
                            fillColor: "rbga(255, 0, 0, 0.1)",
                            fillOpacity: 0.35,
                            strokeColor: "#8B4513",
                            strokeOpacity: 0.8,
                            strokeWeight: 2,
                          }}
                        />
                        {/* Hiển thị thông tin trong Popover */}
                        <Popover
                          id={id}
                          open={open}
                          anchorEl={anchorEl}
                          onClose={handleClosePopover}
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "center",
                          }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "center",
                          }}
                        >
                          <Box
                            m={3}
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "8px",
                              padding: "8px",
                              borderRadius: "8px",
                              backgroundColor: "rgba(139, 69, 19, 0.05)",
                              border: "1px solid #8B4513",
                            }}
                          >
                            {/* Thêm thông tin của motorbike tại đây */}
                            <Typography>
                              Tầm hoạt động:{" "}
                              {motorbike && motorbike?.maxDeliveryDistance} km
                            </Typography>
                            {/* Thêm các thông tin khác nếu cần */}
                          </Box>
                        </Popover>
                      </GoogleMap>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                      }}
                    >
                      <CircularProgress />
                    </Box>
                  )}
                </Box>

                <Divider
                  sx={{
                    margin: isMobile ? "16px 0px 16px 0px" : "16px 0px",
                    width: "100%",
                  }}
                  variant="fullWidth"
                />
                {/* Mô tả */}
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="start"
                  width={"100%"}
                  justifyContent={"space-between"}
                >
                  <Typography
                    variant="h5"
                    color={theme.palette.text.primary}
                    fontWeight="700"
                    fontSize={"16px"}
                  >
                    {t("postMotorbike.listform.description")}
                  </Typography>
                  <Box width={"100%"}>
                    {/* <Typography variant="h6" color={theme.palette.text.primary} fontSize={isMobile ? "12px" : "16px"} fontWeight={400}>
                        <div
                          style={{ whiteSpace: "pre-wrap", fontSize: isMobile ? "12px" : "16px", fontWeight: "400" }}
                          dangerouslySetInnerHTML={{ __html: motorbike?.description || "" }}></div>
                      </Typography> */}
                    <Typography
                      variant="h6"
                      color={theme.palette.text.primary}
                      fontSize={"14px"}
                      fontWeight={400}
                    >
                      <div
                        style={{ textAlign: "justify" }}
                        dangerouslySetInnerHTML={{
                          __html: motorbike?.description || "",
                        }}
                      ></div>
                    </Typography>
                  </Box>
                </Box>
                <Divider
                  sx={{
                    margin: isMobile ? "0px 0px 16px 0px" : "0px 0px 16px 0px",
                    width: "100%",
                  }}
                  variant="fullWidth"
                />

                {/* Điều khoản khác */}
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="start"
                  width={"100%"}
                  justifyContent={"space-between"}
                >
                  <Typography
                    variant="h6"
                    color={theme.palette.text.primary}
                    fontWeight="700"
                    fontSize={"16px"}
                  >
                    {t("postMotorbike.listform.miscellaneous")}
                  </Typography>
                  <Box width={"100%"}>
                    <Typography
                      variant="h6"
                      color={theme.palette.text.primary}
                      fontSize={"14px"}
                      fontWeight={400}
                    >
                      <div
                        style={{ textAlign: "justify" }}
                        dangerouslySetInnerHTML={{
                          __html: motorbike?.miscellaneous || "",
                        }}
                      ></div>
                    </Typography>
                  </Box>
                </Box>
                <Divider
                  sx={{
                    margin: isMobile ? "0px 0px 16px 0px" : "0px 0px 16px 0px",
                    width: "100%",
                  }}
                  variant="fullWidth"
                />
                <RequireWhenRent />
                <Divider
                  sx={{
                    margin: isMobile ? "0px 0px 16px 0px" : "0px 0px 16px 0px",
                    width: "100%",
                  }}
                  variant="fullWidth"
                />

                {/* Rating and comment */}
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="start"
                  width={"100%"}
                  justifyContent={"space-between"}
                >
                  <Typography
                    variant="h6"
                    color={theme.palette.text.primary}
                    fontWeight="700"
                    fontSize={"16px"}
                  >
                    {t("postMotorbike.listform.rating_comment")}
                  </Typography>
                  <Box
                    display={"flex"}
                    flexDirection={"column"}
                    gap={"8px"}
                    width={"99.5%"}
                    marginTop={"15px"}
                  >
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent={"center"}
                      gap={"8px"}
                      p={"8px"}
                      border={"1px solid #e0e0e0"}
                      borderRadius={"8px"}
                    >
                      {listFeedback.length !== 0 ? (
                        listFeedback.map((item: Feedback, index: number) => (
                          <FeedbackCard
                            motorbike={motorbike}
                            setReload={setReloadFeedback}
                            setContentModal={setContentModal}
                            closeModal={closeItemModal}
                            feedback={item}
                            key={index}
                          ></FeedbackCard>
                        ))
                      ) : (
                        <Box>
                          <Typography
                            sx={{
                              backgroundColor: "rgba(140, 126, 126, 0.1)",
                              borderRadius: "8px",
                              padding: "8px",
                              fontSize: isMobile ? "12px" : "14px",
                              color: "black",
                            }}
                          >
                            {t("feedback.nonComment")}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

function MotorbikeFeatureItem({ icon, title, content, isMobile }: any) {
  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="start"
      width={isMobile ? "90%" : "30%"}
      justifyContent={"start"}
      gap={"8px"}
      border={"2px solid #8B4513"}
      borderRadius={"8px"}
      padding={"8px"}
    >
      {icon}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="start"
        justifyContent={"space-between"}
        gap={"8px"}
      >
        <Typography
          variant="h5"
          color={theme.palette.text.primary}
          fontWeight={600}
          fontSize={isMobile ? "16px" : "16px"}
        >
          {title}
        </Typography>
        <Typography
          variant="h5"
          color={theme.palette.text.secondary}
          fontSize={isMobile ? "16px" : "16px"}
        >
          {content}
        </Typography>
      </Box>
    </Box>
  );
}
function EquipmentItem({ icon, label }: any) {
  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent={"center"}
      padding={"16px 0px"}
      border={"2px solid #8B4513"}
      borderRadius={"8px"}
      gap={"16px"}
    >
      {icon}
      <Typography
        variant="h5"
        fontWeight="400"
        color={theme.palette.text.primary}
        fontSize={"16px"}
      >
        {label}
      </Typography>
    </Box>
  );
}

function RowIncome(props: { row: IncomeFromMotorbike; index: number }) {
  const { row, index } = props;
  const [open, setOpen] = React.useState(false);
  const { t } = usei18next();
  const { isMobile } = useThemePage();

  const columnsBooking = [
    {
      field: "bookingId",
      headerName: t("wallet.title_booking_id"),
      flex: 1,
      renderCell: (params: any) => <Box>{`${params.value}`}</Box>,
    },
    {
      field: "startDatetime",
      headerName: t("wallet.title_startdate_rent"),
      flex: 1,
      renderCell: (params: any) => (
        <Box>{new Date(params.value).toLocaleString()}</Box>
      ),
    },
    {
      field: "endDatetime",
      headerName: t("wallet.title_enddate_rent"),
      flex: 1,
      renderCell: (params: any) => (
        <Box>{new Date(params.value).toLocaleString()}</Box>
      ),
    },
    {
      field: "totalPriceRent",
      headerName: t("wallet.title_total_amount"),
      flex: 1,
      renderCell: (params: any) => <Box>{formatMoneyNew(params.value)}</Box>,
    },
  ];

  return (
    <React.Fragment>
      <TableRow
        sx={{
          "& > *": { borderBottom: "unset" },
          backgroundColor: "#f5f5f5",
        }}
      >
        <TableCell scope="row">
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid item xs={1}>
              <Typography>{index}</Typography>
            </Grid>
            <Grid item xs={1}>
              <Avatar src={row.motorbike.imageUrl[0]}/>
            </Grid>
            <Grid item xs={2}>
              <Typography>{`${row.motorbike.model.brand.brandName} ${row.motorbike.model.modelName}`}</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography>{`${t("dashBoardManager.motorbikeRentalManager.columnLicensePlate")}: ${row.motorbike.licensePlate}`}</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography>{`${t("booking.completeBook", {count: row.totalBooking})}`}</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography>{`${t("dashBoardManager.dashboard.income")}: ${formatMoneyNew(row.totalRevenue)}`}</Typography>
            </Grid>
          </Grid>
        </TableCell>
        <TableCell align="right">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} unmountOnExit>
            <Box sx={{ margin: 1 }}>
              {row.bookings.length === 0 ? (
                <Typography
                  variant="body1"
                  padding={"1rem 0rem"}
                  sx={{ textAlign: "center" }}
                >
                  {t("wallet.title_no_transaction")}
                </Typography>
              ) : (
                <DataGrid
                  sx={{
                    "& .MuiDataGrid-cell:focus-within": {
                      outline: "none",
                    },
                    width: isMobile ? "800px" : "100%",
                  }}
                  getRowId={(row) => row.bookingId}
                  rows={row.bookings!}
                  checkboxSelection={false}
                  initialState={{
                    pagination: { paginationModel: { pageSize: 7 } },
                  }}
                  pageSizeOptions={[7, 10, 25]}
                  columns={columnsBooking}
                  loading={row.bookings?.length === 0}
                  rowHeight={48}
                  disableRowSelectionOnClick
                  pagination
                  // onRowClick={(event) => {
                  //   if (event.row.status !== BookingStatus.Cancelled) {
                  //     navigate(
                  //       `/${ROUTES.booking.detail}/${event.row.bookingId}`
                  //     );
                  //   }
                  // }}
                />
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
