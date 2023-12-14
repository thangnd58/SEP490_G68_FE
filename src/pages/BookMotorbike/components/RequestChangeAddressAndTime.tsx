import {
  Box,
  CircularProgress,
  IconButton,
  MenuItem,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { ModalContext } from "../../../contexts/ModalContext";
import useThemePage from "../../../hooks/useThemePage";
import theme from "../../../utils/theme";
import MyIcon from "../../../components/common/MyIcon";
import usei18next from "../../../hooks/usei18next";
import { CloseOutlined } from "@mui/icons-material";
import RegisterMotorbikeItem from "../../PostMotorbike/components/RegisterMotorbike/RegisterMotorbikeItem";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { useFormik } from "formik";
import * as Yup from "yup";
import MyCustomButton from "../../../components/common/MyButton";
import { Booking } from "../../../utils/type";
import { BookingService } from "../../../services/BookingService";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import ToastComponent from "../../../components/toast/ToastComponent";

interface Location {
  lat: number;
  lng: number;
}

function RequestChangeAddressAndTime(props: { booking: Booking }) {
  const { setContentModal } = useContext(ModalContext);
  const { booking } = props;
  const { isMobile } = useThemePage();
  const { t } = usei18next();
  const formik = useFormik({
    initialValues: {
      address: booking.returnAddress,
      lat: 0,
      lng: 0,
      returnDate: dayjs(booking.returnDatetime).format("DD-MM-YYYY HH:mm"),
    },
    validationSchema: Yup.object({
      address: Yup.string().required(
        t("postMotorbike.registedForm.addressRequired")
      ),
      returnDate: Yup.string().required(
        t("postMotorbike.registedForm.startDateRequired")
      ),
    }),
    onSubmit: async (values) => {
      try {
        BookingService.updateReturnInfo(booking.bookingId, {returnAddress: values.address, returnDatetime: values.returnDate}).then((result) => {
            ToastComponent("Yeu cau thanh cong", "success");
        })
      } catch (error) {
        ToastComponent("Yeu cau that bai", "error");
      }
    },
  });

  useEffect(() => {
    BookingService.getLatLngByAddress(values.address).then((data) => {
      const location = data.split(",");
      const result: Location = {
        lat: Number(location[0]),
        lng: Number(location[1]),
      };
      setSelected(result);
      setFieldValue("lat", result.lat);
      setFieldValue("lng", result.lng);
    });
  }, []);

  const { values, errors, touched, handleChange, handleSubmit, setFieldValue } =
    formik;

  const defaultDeliveryLoction = useMemo(
    () => ({ lat: values.lat, lng: values.lng }),
    []
  );
  const [selected, setSelected] = useState<Location>(defaultDeliveryLoction);

  // MAP CONTROLLER
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string,
    libraries: ["places"],
  });

  // handle change address
  const {
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  useEffect(() => {
    if (values.address) setValue(values.address);
  }, [values.address]);

  const [showMenu, setShowMenu] = useState(false);

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

  const disabledDate = (current: any) => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    return current && current.valueOf() < currentDate.valueOf();
  };

  return (
    <Modal
      open={true}
      aria-labelledby="map-modal-title"
      aria-describedby="map-modal-description"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflowY: "auto",
        zIndex: 10000,
      }}
    >
      <Box
        width={isMobile ? "70%" : "50%"}
        height={"auto"}
        sx={{
          padding: "16px 32px",
          backgroundColor: "white",
          borderRadius: "8px",
        }}
      >
        <Box
          width={"100%"}
          height={"10%"}
          display={"flex"}
          flexDirection={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Typography
            variant="h2"
            color={theme.palette.text.primary}
            fontSize={isMobile ? "20px" : "24px"}
            fontWeight={600}
            textAlign={"start"}
          >
            {t("postMotorbike.registedForm.changeReturnInfo")}
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
              onClick={() => setContentModal(<></>)}
              position="bottom"
            />
          </Box>
        </Box>
        <Box
          width={"100%"}
          height={"80%"}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"start"}
          alignItems={"center"}
        >
          <RegisterMotorbikeItem
            isRequired={true}
            fontSizeTitle="16px"
            title={t("booking.returnDate")}
            item={
              <DatePicker
                className="custom-range-picker"
                style={{
                  fontFamily: "Inter",
                  fontStyle: "normal",
                  fontSize: "20px",
                  height: "48px",
                }}
                disabledDate={disabledDate}
                size={isMobile ? "middle" : "large"}
                format="DD-MM-YYYY HH:mm"
                showTime={{ format: "HH:mm" }}
                value={dayjs(values.returnDate, "DD-MM-YYYY HH:mm")}
                onChange={(value) => {
                  setFieldValue("returnDate", value);
                }}
                allowClear={false}
              />
            }
            myButton={<></>}
          />

          <RegisterMotorbikeItem
            fontSizeTitle="16px"
            title={t("postMotorbike.registedForm.address")}
            isRequired={true}
            item={
              !isLoaded ? (
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
              ) : (
                <>
                  <Box style={{ position: "relative", width: "100%" }}>
                    <TextField
                      sx={{
                        width: "100%",
                        "& .MuiOutlinedInput-root fieldset": {
                          borderRadius: "8px",
                        },
                        "& .MuiOutlinedInput-root:hover fieldset": {
                          borderColor: theme.palette.primary.main,
                        },
                        "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                          borderColor: theme.palette.primary.main,
                        },
                      }}
                      // disabled={values.province === "" || values.district === "" || values.ward === ""}
                      placeholder={t(
                        "component.MyMapWithSearchBox.searchPlaceholder"
                      )}
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
                    {/* <IconButton
                      size="small"
                      color="primary"
                      onClick={handleGetLocationClick}
                    >
                      <MyLocation />
                    </IconButton> */}
                    <Typography
                      variant="caption"
                      fontSize={"12px"}
                      color={theme.palette.text.secondary}
                    >
                      {"Lấy vị trí mặc định của xe"}
                    </Typography>
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
                          position:
                            window.google.maps.ControlPosition.RIGHT_CENTER,
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
                          style:
                            window.google.maps.MapTypeControlStyle
                              .HORIZONTAL_BAR,
                          position:
                            window.google.maps.ControlPosition.TOP_CENTER,
                          mapTypeIds: [
                            window.google.maps.MapTypeId.ROADMAP,
                            window.google.maps.MapTypeId.SATELLITE,
                            window.google.maps.MapTypeId.HYBRID,
                            window.google.maps.MapTypeId.TERRAIN,
                          ],
                        },
                        panControl: true,
                        fullscreenControlOptions: {
                          position:
                            window.google.maps.ControlPosition.RIGHT_CENTER,
                        },
                        gestureHandling: "greedy",
                        draggableCursor: "default",
                        draggingCursor: "grab",
                        mapId: "f1b7a8a9f0b1f1d",
                      }}
                    >
                      {selected && (
                        <>
                          <Marker position={selected} />
                          <TextField
                            type="hidden"
                            name="lat"
                            value={selected.lat}
                            onChange={handleChange}
                          />
                          <TextField
                            type="hidden"
                            name="lng"
                            value={selected.lng}
                            onChange={handleChange}
                          />
                        </>
                      )}
                    </GoogleMap>
                  </Box>
                  <Typography
                    variant="caption"
                    fontSize={"12px"}
                    color={"red"}
                    fontStyle={"italic"}
                  >
                    {t("editional.noteMap")}
                  </Typography>
                </>
              )
            }
            myButton={
              <Box
                width={"100%"}
                display={"flex"}
                flexDirection={"row"}
                justifyContent={"center"}
                margin={"24px 0px 0px 0px"}
              >
                <MyCustomButton
                  borderRadius={8}
                  fontSize={16}
                  fontWeight={600}
                  content={t("postMotorbike.registedForm.btnConfirm")}
                  onClick={() => {
                    handleSubmit();
                    setContentModal(<></>);
                  }}
                />
              </Box>
            }
          />
        </Box>
      </Box>
    </Modal>
  );
}

export default RequestChangeAddressAndTime;
