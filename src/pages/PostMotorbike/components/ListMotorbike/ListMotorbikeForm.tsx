import React, { useEffect, useMemo, useState } from 'react'
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MyIcon from '../../../../components/common/MyIcon';
import usei18next from '../../../../hooks/usei18next';
import { Chip, CircularProgress, Divider, FormControl, Grid, Modal, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { ChangeCircleOutlined, CheckCircleOutline, CloseOutlined, EditOutlined, ErrorOutline, GasMeterOutlined, LocalDrinkOutlined, LocationOn, NewReleasesOutlined, StopCircleOutlined, WarningAmber } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../utils/Constant';
import { DataGrid } from '@mui/x-data-grid';
import { Booking, Motorbike } from '../../../../utils/type';
import { PostMotorbikeService } from '../../../../services/PostMotorbikeService';
import { Fade } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import MySlideShowImage from '../../../../components/common/MySlideShowImage';
import theme from '../../../../utils/theme';
import useThemePage from '../../../../hooks/useThemePage';
import { CartIcon, HelmetIcon, ProtectClothesIcon, RainCoatIcon, RepairIcon, TelephoneIcon } from '../../../../assets/icons';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import MyBookingItem from '../../../BookMotorbike/components/MyBookingItem';
import { BookingService } from '../../../../services/BookingService';

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
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const ListMotorbikeForm = () => {

  const { t } = usei18next();
  const navigate = useNavigate();
  const { isMobile, isIpad } = useThemePage();

  const [isItemMotorbikeModalOpen, setItemMotorbikeModalOpen] = useState(false);
  const [defaultListRegisterMotorbike, setDefaultListRegisterMotorbike] = useState<Motorbike[]>([]);
  const [listRegisterMotorbike, setListRegisterMotorbike] = useState<Motorbike[]>([]);
  const [motorbike, setMotorbike] = useState<Motorbike>();
  const [modalImageList, setModalImageList] = useState([]);

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
  }, [])

  const getAllMotorbikesRegistered = async () => {
    try {
      const response = await PostMotorbikeService.getListMotorbikeByUserId();
      if (response) {
        setListRegisterMotorbike(response);
        setDefaultListRegisterMotorbike(response);
      }
    } catch (error) {

    }
  }

  // get unique status into 2D array has key is status and value is status using i18next
  const getUniqueStatus = [...new Set(defaultListRegisterMotorbike.map(item => item.status))];
  const setUniqueStatus = getUniqueStatus.map(item => {
    return { key: item, value: t(`postMotorbike.listform.status-${item.replace(/\s/g, '').toLowerCase()}`) }
  })

  const [selectedStatus, setSelectedStatus] = useState("All");
  const handleChangeStatus = (event: SelectChangeEvent) => {
    setSelectedStatus(event.target.value);
  };

  // change the list Register Motorbike when change status
  useEffect(() => {
    if (selectedStatus === "All") {
      setListRegisterMotorbike(defaultListRegisterMotorbike);
    } else {
      const newList = defaultListRegisterMotorbike.filter(item => item.status === selectedStatus);
      setListRegisterMotorbike(newList);
    }
  }, [selectedStatus])

  const columns = [
    {
      field: 'imageUrl', headerName: t("postMotorbike.listform.table-cell-image"), width: 250,
      renderCell: (params: any) => (
        <Box width={"100%"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
          <img src={params.value[0]} style={{
            width: "150px",
            height: "120px",
            border: '2px solid #8B4513',
            borderRadius: '8px',
          }} alt="image" />
        </Box>
      ),
    },
    {
      field: "model.modelName" || "model.brand.brandName",
      headerName: t("postMotorbike.listform.table-cell-model"),
      width: 150,
      valueGetter: ({ row }: any) => row.model.brand.brandName + " " + row.model.modelName,
    },
    { field: 'licensePlate', headerName: t("postMotorbike.listform.table-cell-plate"), width: 150 },
    {
      field: 'createDatetime', headerName: t("postMotorbike.listform.table-cell-registerdate"), width: 225,
      renderCell: (params: any) => (
        <Box>
          {new Date(params.value).toLocaleString()}
        </Box>
      ),
    },
    {
      field: 'status',
      headerName: t("postMotorbike.listform.table-cell-status"),
      width: 175,
      renderCell: (params: any) => (
        params.value === "Processing" ? (
          <Chip
            sx={{ '& .MuiChip-label': { fontSize: "16px" } }}
            color="warning"
            icon={<WarningAmber />}
            label={t('postMotorbike.listform.status-processing')} />)
          : params.value === "Approved" ? (
            <Chip
              sx={{ '& .MuiChip-label': { fontSize: "16px" } }}
              color="success"
              icon={<CheckCircleOutline />}
              label={t('postMotorbike.listform.status-approved')} />)
            : params.value === "Rejected" ? (
              <Chip
                sx={{ '& .MuiChip-label': { fontSize: "16px" } }}
                color="error"
                icon={<ErrorOutline />}
                label={t('postMotorbike.listform.status-rejected')} />)
              : params.value === "On Hiatus" ? (
                <Chip
                  sx={{ '& .MuiChip-label': { fontSize: "16px" } }}
                  color="warning"
                  icon={<StopCircleOutlined />}
                  label={t('postMotorbike.listform.status-onhiatus')} />)
                : (
                  <Chip
                    sx={{ '& .MuiChip-label': { fontSize: "16px" } }}
                    color="success"
                    icon={<ChangeCircleOutlined />}
                    label={t('postMotorbike.listform.status-inoporation')} />)
      ),
    },
    {
      field: 'id', headerName: t("postMotorbike.listform.table-cell-action"), width: 200,
      renderCell: (params: any) => (
        <MyIcon icon={<EditOutlined />} hasTooltip tooltipText={t("postMotorbike.listform.badge-edit")} onClick={() => navigate(`${ROUTES.user.updateregistermotorbike}/${params.value}`)} position='right' />
      ),
    },
  ];
  const [value1, setValue1] = useState(0);
  const [value2, setValue2] = useState(0);

  const handleChange1 = (event: React.SyntheticEvent, newValue: number) => {
    setValue1(newValue);
  };
  const handleChange2 = (event: React.SyntheticEvent, newValue: number) => {
    setValue2(newValue);
  };

  useEffect(() => {
    getData();
  }, []);

  const [listBooing, setListBooking] = useState<Booking[]>([]);
  const [isLoad, setIsLoad] = useState<boolean>(false);
  const getData = async () => {
    try {
      setIsLoad(true);
      const dataBooking = await BookingService.getListRentalBooking();
      if (dataBooking) {
        setListBooking(dataBooking);
        setIsLoad(false);
      }
      else {
        setListBooking([]);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoad(false);
  }

  type StatusOrder = {
    [key: string]: number;
  };

  const statusOrder: StatusOrder = {
    Delivered: 1,
    PendingDelivery: 2,
    Paid: 3,
    PendingPayment: 4,
  };

  return (
    <Box width={"80%"} margin={"32px auto"} display={"flex"} flexDirection={"row"} justifyContent={"center"} alignContent={"center"}>
      <Paper elevation={2} sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value1} onChange={handleChange1} aria-label="basic tabs example">
            <Tab
              sx={{
                textTransform: 'none',
                fontSize: '16px',
                fontWeight: '600',
                lineHeight: '24px',
                color: theme.palette.text.primary,
                '&.Mui-selected': {
                  color: theme.palette.primary.main
                }
              }}
              label={t("postMotorbike.listform.historyBooking")}
              {...a11yProps(0)}
            />
            <Tab sx={{
              textTransform: 'none',
              fontSize: '16px',
              fontWeight: '600',
              lineHeight: '24px',
              color: theme.palette.text.primary,
              '&.Mui-selected': {
                color: theme.palette.primary.main,
              }
            }} 
            label={t("postMotorbike.listform.allmymotorbikes")}
            {...a11yProps(1)} />
          </Tabs>
        </Box>
        <CustomTabPanel1 value={value1} index={0}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom:"16px" }}>
              <Tabs value={value2} onChange={handleChange2} aria-label="basic tabs example">
                <Tab
                  sx={{
                    backgroundColor: value2 === 0 ? 'rgb(139,69,13,0.1)' : 'none',
                    borderRadius: '16px 16px 0px 0px',
                    color: value2 === 0 ? '#8B4513' : '#000',
                    fontWeight: value2 === 0 ? 700 : 500,
                    textTransform: 'none',
                    fontSize: '16px',
                    lineHeight: '24px',
                    '&.Mui-selected': {
                      color: theme.palette.primary.main,
                      backgroundColor: "rgba(139, 69, 19, 0.05)"
                    },
                    "&:hover": {
                      transform: "scale(1.02)",
                      fontWeight: 700,
                      // transition: "all 0.3s ease-in-out",
                    },
                    // marginLeft: 'auto', // Đặt tab ở bên phải
                  }}
                  label={t("postMotorbike.listform.currentBooking")}
                  {...a11yProps(0)}
                />
                <Tab sx={{
                  backgroundColor: value2 === 1 ? 'rgb(139,69,13,0.1)' : 'none',
                  borderRadius: '16px 16px 0px 0px',
                  color: value2 === 1 ? '#8B4513' : '#000',
                  fontWeight: value2 === 1 ? 700 : 500,
                  textTransform: 'none',
                  fontSize: '16px',
                  lineHeight: '24px',
                  '&.Mui-selected': {
                    color: theme.palette.primary.main,
                    backgroundColor: "rgba(139, 69, 19, 0.05)"
                  },
                  "&:hover": {
                    transform: "scale(1.02)",
                    fontWeight: 700,
                    // transition: "all 0.3s ease-in-out",
                  },
                  // marginLeft: 'auto', // Đặt tab ở bên phải
                }} 
                label={t("postMotorbike.listform.bookingInHistory")}
                {...a11yProps(1)} />
              </Tabs>
              </div>
            </Box>
            <CustomTabPanel2 value={value2} index={0}>
              <MyBookingItem isOwner isLoad={isLoad} index={0} bookings={
                listBooing
                  .filter(
                    (item) =>
                      item.status === 'PendingPayment' ||
                      item.status === 'Paid' ||
                      item.status === 'PendingDelivery' ||
                      item.status === 'Delivered'
                  )
                  .sort((a, b) => {
                    // Sort by status order
                    const statusComparison = statusOrder[a.status] - statusOrder[b.status];

                    // If statuses are different, use the status order
                    if (statusComparison !== 0) {
                      return statusComparison;
                    }

                    // If statuses are the same, sort by startDatetime
                    return new Date(a.startDatetime).valueOf() - new Date(b.startDatetime).valueOf();
                  })
              } />
            </CustomTabPanel2>
            <CustomTabPanel2 value={value2} index={1}>
              <MyBookingItem isOwner isLoad={isLoad} index={1} bookings={
                listBooing
                  .filter(
                    (item) =>
                      item.status === 'Cancelled' ||
                      item.status === 'PendingReview' ||
                      item.status === 'Finished'
                  )
                  .sort((a, b) => {

                    // If statuses are the same, sort by startDatetime
                    return new Date(a.updateDatetime).valueOf() - new Date(b.updateDatetime).valueOf();
                  })
              } />
            </CustomTabPanel2>
        </CustomTabPanel1>
        <CustomTabPanel1 value={value1} index={1}>
          {/* tất cả xe */}
          <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"} alignContent={"center"} >
            <Box display={"flex"} flexDirection={"row"} width={"100%"} margin={"8px 0px 16px 0px"} justifyContent={"end"} alignContent={"center"}>
              <Typography fontSize={"18px"} fontWeight={"400"}
                margin={"auto 8px"}>{t("postMotorbike.listform.status")}</Typography>
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
                    <option value={status.key}>
                      {status.value}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
          <Box>
            <Box sx={{ borderRadius: "8px" }}>
              <DataGrid
                sx={{
                  cursor: "pointer",
                  fontSize: "16px",
                  borderRadius: "8px",
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: "#8B4513",
                  },
                  '& .MuiDataGrid-columnHeaderTitle ': {
                    color: "#fff",
                    fontWeight: "600",
                    fontSize: "18px",
                  },
                  '& .MuiDataGrid-cell:focus-within': {
                    outline: "none",
                  },

                }}
                rows={listRegisterMotorbike}
                initialState={{
                  pagination: { paginationModel: { pageSize: 10 } },
                }}
                pageSizeOptions={[5, 10, 25]}
                columns={columns}
                loading={listRegisterMotorbike.length === 0}
                disableRowSelectionOnClick
                rowHeight={150}
                pagination
                onRowClick={(params) => {
                  openItemModal(params.row, params.row.imageUrl);
                }}
              />
            </Box>
          </Box>
        </CustomTabPanel1>
      </Paper>

      <ItemMotorbikeModal isMobile={isMobile} isIpad={isIpad} isItemModalOpen={isItemMotorbikeModalOpen} closeItemModal={closeItemModal} imageList={modalImageList} motorbike={motorbike} />
    </Box>
  )
}

export default ListMotorbikeForm;

function ItemMotorbikeModal({ isMobile, isIpad, isItemModalOpen, closeItemModal, imageList, motorbike }: { isMobile: boolean, isIpad: boolean, isItemModalOpen: boolean, closeItemModal: any, imageList: any, motorbike?: Motorbike }) {
  interface Location {
    lat: number,
    lng: number,
  }

  const { t } = usei18next();
  const [equipmentList, setEquipmentList] = useState<string[]>([]);
  const [location, setLocation] = useState<Location>();

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

  // MAP CONTROLLER
  // Map with search box
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string,
    libraries: ["places"],
  });

  const defaultLoction = useMemo(() => ({ lat: location?.lat || 10.762622, lng: location?.lng || 106.660172 }), [location]);

  return (
    <Modal
      open={isItemModalOpen}
      onClose={closeItemModal}
      aria-labelledby="map-modal-title"
      aria-describedby="map-modal-description"
      sx={{
        display: 'flex',
        alignItems: 'start',
        justifyContent: 'center',
        margin: '32px 0px',
        overflowY: 'auto',
      }}>
      <Box width={"90%"} height={"auto"}
        sx={{
          backgroundColor: '#fff',
          borderRadius: '8px'
        }}>
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
            <MyIcon icon={<CloseOutlined />} hasTooltip tooltipText={t("postMotorbike.registedForm.badge-close")} onClick={closeItemModal} position='bottom' />
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
            mb={"16px"}>
            <MySlideShowImage images={imageList} />
          </Box>

          {/* Divider Line */}
          <Divider sx={{ width: "100%", margin: "16px 0px" }} variant="middle" />
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
            <Box display="flex" flexDirection="column" alignItems="start" width={"100%"} justifyContent={"space-between"} margin={"16px 0px"}>
              <Typography
                color={theme.palette.text.primary}
                variant="h5"
                fontWeight="600"
                fontSize={isMobile ? "32px" : "48px"}
                textTransform={"uppercase"}>
                {motorbike?.model.brand.brandName} {motorbike?.model.modelName}
              </Typography>
              <Box display="flex" flexDirection="row" alignItems="center" width={"100%"} mb={"32px"}>
                <MyIcon icon={<LocationOn />} hasTooltip tooltipText={t("postMotorbike.listform.badge-location")} onClick={() => { }} position='left' />
                <Typography variant="h5" color={theme.palette.text.secondary} fontSize={isMobile ? "16px" : "20px"}>
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
              paddingBottom="16px">

              {/* Phần Thứ Hai */}
              <Box
                sx={{
                  backgroundColor: "rgba(139, 69, 19, 0.05)",
                  borderRadius: "8px",
                  minHeight: "300px",
                }}
                margin={isIpad || isMobile ? "16px 0px" : "0px 0px"}
                width={isIpad || isMobile ? "auto" : "25%"}
                display="flex"
                flexDirection="column"
                alignItems="start"
                padding="16px"
              >
                <Box display="flex" flexDirection="row" alignItems="center" width={"100%"} justifyContent={"space-between"} pb={"18px"}>
                  <Typography variant="h5" color={theme.palette.text.primary} fontSize={"32px"} fontWeight="600">
                    {t("postMotorbike.listform.profit")}
                  </Typography>
                  <Chip
                    style={{ fontSize: "28px", fontWeight: "600", borderRadius: "8px", padding: "16px 8px" }}
                    color="success" label={Number(motorbike?.priceRent) * 0.85 + "K"} />
                </Box>
                <Box display="flex" flexDirection="column" alignItems="start" width={"100%"} justifyContent={"space-between"}>
                  <TableContainer
                    sx={{
                      borderRadius: '8px',
                      backgroundColor: '#fff',
                      border: '2px solid #8B4513',
                      '& .MuiTableHead-root': {
                        '& .MuiTableCell-head': {
                          fontWeight: '600',
                          fontSize: '20px',
                        },
                      },
                      '& .MuiTableCell-root': {
                        border: 'none'
                      }
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
                          <TableCell align="right">{motorbike?.priceRent} 000 VND</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell align="left">
                            <>
                              - Giá giảm
                              <Chip
                                style={{ fontSize: "16px", fontWeight: "600", borderRadius: "8px", marginLeft: "8px" }}
                                color="error" label={"15%"} />
                            </>
                          </TableCell>
                          <TableCell align="right">{Number(motorbike?.priceRent) * 0.15} 000 VND</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell align="left">Lợi nhuận</TableCell>
                          <TableCell align="right">{Number(motorbike?.priceRent) * 0.85} 000 VND</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Box>
              <Box
                width={isIpad || isMobile ? "100%" : "70%"}
                display="flex"
                flexDirection="column"
                alignItems="start"
                paddingBottom="16px"
              >
                {/* Thông tin xe */}
                <Box display="flex" flexDirection="column" alignItems="start" width={"100%"} justifyContent={"space-between"} gap={"16px"} mt={"16px"}>
                  <Typography variant="h5" color={theme.palette.text.primary} fontWeight="600" fontSize={isMobile ? "20px" : "24px"}>
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

                <Divider sx={{ margin: "32px 0px", width: "100%" }} variant="fullWidth" />

                {/* Mô tả */}
                <Box display="flex" flexDirection="column" alignItems="start" width={"100%"} justifyContent={"space-between"} gap={"16px"}>
                  <Typography variant="h5" color={theme.palette.text.primary} fontWeight="600" fontSize={isMobile ? "20px" : "24px"}>
                    {t("postMotorbike.listform.description")}
                  </Typography>
                  <Box width={"100%"}>
                    <Typography variant="h6" color={theme.palette.text.primary} fontSize={isMobile ? "16px" : "20px"}>
                      <div dangerouslySetInnerHTML={{ __html: motorbike?.description || "" }}></div>
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ margin: "32px 0px", width: "100%" }} variant="fullWidth" />

                {/* Điều khoản khác */}
                <Box display="flex" flexDirection="column" alignItems="start" width={"100%"} justifyContent={"space-between"} gap={"16px"}>
                  <Typography variant="h6" color={theme.palette.text.primary} fontWeight="600" fontSize={isMobile ? "20px" : "24px"}>
                    {t("postMotorbike.listform.miscellaneous")}
                  </Typography>
                  <Box width={"100%"}>
                    <Typography variant="h6" color={theme.palette.text.primary} fontSize={isMobile ? "16px" : "20px"}>
                      <div dangerouslySetInnerHTML={{ __html: motorbike?.miscellaneous || "" }}></div>
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ margin: "32px 0px", width: "100%" }} variant="fullWidth" />

                {/* Biển số xe */}
                <Box display="flex" flexDirection="column" alignItems="start" width={"100%"} justifyContent={"space-between"} gap={"16px"}>
                  <Typography variant="h5" color={theme.palette.text.primary} fontWeight="600" fontSize={isMobile ? "20px" : "24px"}>
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

                <Divider sx={{ margin: "32px 0px", width: "100%" }} variant="fullWidth" />

                {/* Trang bị */}
                <Box display="flex" flexDirection="column" alignItems="start" width={"100%"} justifyContent={"space-between"} gap={"16px"}>
                  <Typography variant="h5" color={theme.palette.text.primary} fontWeight="600" fontSize={isMobile ? "20px" : "24px"}>
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

                <Divider sx={{ margin: "32px 0px", width: "100%" }} variant="fullWidth" />

                {/* Hiển thị bản đồ vị trí xe */}
                <Box display="flex" flexDirection="column" alignItems="start" width={"100%"} justifyContent={"space-between"} gap={"16px"}>
                  <Typography variant="h5" color={theme.palette.text.primary} fontWeight="600" fontSize={isMobile ? "20px" : "24px"}>
                    {t("postMotorbike.listform.address")}
                  </Typography>
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
                        center={defaultLoction}
                        mapContainerStyle={{
                          width: "100%",
                          height: "40vh",
                          borderRadius: "8px",
                        }}
                        clickableIcons={false}
                      >
                        <Marker position={defaultLoction} />
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

                <Divider sx={{ margin: "32px 0px", width: "100%" }} variant="fullWidth" />

                {/* Thông tin khác */}
                <Typography variant="h5" fontWeight="600">
                  Rating & Feedback: {/* Thêm rating và feedback */}
                </Typography>
              </Box>


            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
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
