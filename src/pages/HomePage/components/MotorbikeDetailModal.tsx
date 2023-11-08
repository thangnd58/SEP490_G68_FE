import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Motorbike } from '../../../utils/type'
import MyDialog from '../../../components/common/MyDialog'
import usei18next from '../../../hooks/usei18next';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { Box, Chip, CircularProgress, Divider, Grid, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import MyIcon from '../../../components/common/MyIcon';
import { CloseOutlined, GasMeterOutlined, LocalDrinkOutlined, LocationOn, NewReleasesOutlined } from '@mui/icons-material';
import MySlideShowImage from '../../../components/common/MySlideShowImage';
import theme from '../../../utils/theme';
import { CartIcon, HelmetIcon, ProtectClothesIcon, RainCoatIcon, RepairIcon, TelephoneIcon } from '../../../assets/icons';
import useThemePage from '../../../hooks/useThemePage';
import { ModalContext } from '../../../contexts/ModalContext';

export default function MotorbikeDetailModal(props: { motorbike: Motorbike }) {
  interface Location {
    lat: number,
    lng: number,
  }

  const { isMobile, isIpad } = useThemePage();
  const { t } = usei18next();
  const [equipmentList, setEquipmentList] = useState<string[]>([]);
  const [location, setLocation] = useState<Location>();
  const { closeModal } = useContext(ModalContext);

  useEffect(() => {
    if (props.motorbike) {
      const tempEquipmentList = props.motorbike.equipments.split(",");
      const location = props.motorbike.location.split(",");
      const lat = Number(location[0]);
      const lng = Number(location[1]);
      setLocation({ lat, lng });
      setEquipmentList(tempEquipmentList);
    }
  }, [props.motorbike])

  // MAP CONTROLLER
  // Map with search box
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string,
    libraries: ["places"],
  });

  const defaultLoction = useMemo(() => ({ lat: location?.lat || 10.762622, lng: location?.lng || 106.660172 }), [location]);
  return (

    <Modal
      open={true}
      onClose={closeModal}
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
            <MyIcon icon={<CloseOutlined />} hasTooltip tooltipText={t("postMotorbike.registedForm.badge-close")} onClick={closeModal} position='bottom' />
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
            <MySlideShowImage images={props.motorbike.imageUrl} />
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
                {props.motorbike?.model?.modelName}
              </Typography>
              <Box display="flex" flexDirection="row" alignItems="center" width={"100%"} mb={"32px"}>
                <MyIcon icon={<LocationOn />} hasTooltip tooltipText={t("postMotorbike.listform.badge-location")} onClick={() => { }} position='left' />
                <Typography variant="h5" color={theme.palette.text.secondary} fontSize={isMobile ? "16px" : "20px"}>
                  {props.motorbike?.address}
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
                    color="success" label={Number(props.motorbike?.priceRent) * 0.85 + "K"} />
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
                          <TableCell align="right">{props.motorbike?.priceRent} 000 VND</TableCell>
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
                          <TableCell align="right">{Number(props.motorbike?.priceRent) * 0.15} 000 VND</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell align="left">Lợi nhuận</TableCell>
                          <TableCell align="right">{Number(props.motorbike?.priceRent) * 0.85} 000 VND</TableCell>
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
                        content={props.motorbike?.releaseYear}
                        isMobile={isMobile}
                        t={t}
                      />
                      <MotorbikeFeatureItem
                        icon={<GasMeterOutlined color='primary' fontSize='large' />}
                        title={t("postMotorbike.listform.type")}
                        content={props.motorbike?.type}
                        isMobile={isMobile}
                        t={t}
                      />
                      <MotorbikeFeatureItem
                        icon={<LocalDrinkOutlined color='primary' fontSize='large' />}
                        title={t("postMotorbike.listform.fuel-consumption")}
                        content={props.motorbike?.fuelConsumption + "L/100km"}
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
                        {props.motorbike?.licensePlate} {/* Thêm biển số xe */}
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
