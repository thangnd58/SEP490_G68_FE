import React, { useEffect, useMemo, useState } from 'react'
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MyIcon from '../../../../components/common/MyIcon';
import usei18next from '../../../../hooks/usei18next';
import { Chip, CircularProgress, Divider, FormControl, Grid, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { ChangeCircleOutlined, CheckCircleOutline, CloseOutlined, EditOutlined, ErrorOutline, GasMeterOutlined, LocalDrinkOutlined, LocationOn, NewReleasesOutlined, StopCircleOutlined, WarningAmber } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../utils/Constant';
import { DataGrid } from '@mui/x-data-grid';
import { Motorbike } from '../../../../utils/type';
import { PostMotorbikeService } from '../../../../services/PostMotorbikeService';
import { Fade } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import MySlideShowImage from '../../../../components/common/MySlideShowImage';
import theme from '../../../../utils/theme';
import useThemePage from '../../../../hooks/useThemePage';
import { CartIcon, HelmetIcon, ProtectClothesIcon, RainCoatIcon, RepairIcon, TelephoneIcon } from '../../../../assets/icons';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

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
      const response = await PostMotorbikeService.getListRegisterMotorbike();
      if (response) {
        setListRegisterMotorbike(response);
        setDefaultListRegisterMotorbike(response);
      }
    } catch (error) {

    }
  }

  // get unique status into 2D array has key is status and value is status using i18next
  const getUniqueStatus = [...new Set(listRegisterMotorbike.map(item => item.status))];
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
      const newList = listRegisterMotorbike.filter(item => item.status === selectedStatus);
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
    { field: 'modelName', headerName: t("postMotorbike.listform.table-cell-model"), width: 150 },
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

  return (
    <Box width={"95%"} margin={"32px auto"} display={"flex"} flexDirection={"column"} justifyContent={"center"} alignContent={"flex-end"}>
      <Box display={"flex"} flexDirection={"row"} justifyContent={"end"} alignContent={"center"} marginBottom={"8px"}>
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
      <Box >
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
                {motorbike?.modelName}
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
