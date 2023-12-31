import { Box, CircularProgress, Icon, IconButton, MenuItem, Modal, Skeleton, TextField, Typography } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { ImageSearchBox, Snow } from '../../../assets/images'
import { OrnamentIcon } from '../../../assets/icons'
import { DatePicker } from 'antd';
import '../styles/CustomRangePicker.css';
import MyCustomButton from '../../../components/common/MyButton';
import { CloseOutlined, EditLocation, MyLocation } from '@mui/icons-material';
import useThemePage from '../../../hooks/useThemePage';
import theme from '../../../utils/theme';
import usei18next from '../../../hooks/usei18next';
import MyIcon from '../../../components/common/MyIcon';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { useFormik } from 'formik';
import * as Yup from "yup";
import RegisterMotorbikeItem from '../../PostMotorbike/components/RegisterMotorbike/RegisterMotorbikeItem';
import dayjs from 'dayjs';
import { SearchMotorbikeRequest } from '../../../utils/type';
import ToastComponent from '../../../components/toast/ToastComponent';
import { SearchMotorbikeServices } from '../../../services/SearchMotorbikeService';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/Constant';




const SeachBoxComponent = () => {
    const { RangePicker } = DatePicker;
    const { isMobile } = useThemePage();
    const { t } = usei18next();
    const navigate = useNavigate();
    const [isMapModalOpen, setMapModalOpen] = useState(false);
    const today = dayjs();
    const tomorrow = today.add(1, 'day');


    const formik = useFormik({
        initialValues: {
            address: "Quận Ba Đình, Hà Nội",
            lat: 21.028511,
            lng: 105.804817,
            startDate: today.format("DD-MM-YYYY HH:mm"),
            endDate: tomorrow.format("DD-MM-YYYY HH:mm"),
        },
        validationSchema: Yup.object({
            address: Yup.string().required(t("postMotorbike.registedForm.addressRequired")),
            startDate: Yup.string().required(t("postMotorbike.registedForm.startDateRequired")),
            endDate: Yup.string().required(t("postMotorbike.registedForm.endDateRequired")),
        }),

        onSubmit: async (values, actions) => {
            // alert(JSON.stringify(values, null, 2));
            // convert date to timestamp
            const startDate = dayjs(values.startDate, "DD-MM-YYYY HH:mm").unix();
            const endDate = dayjs(values.endDate, "DD-MM-YYYY HH:mm").unix();

            // encode address
            const encodeAddress = encodeURIComponent(values.address);

            navigate(`${ROUTES.search.filtermotorbike}/${startDate}/${endDate}/${encodeAddress}`)
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


    const openMapModal = () => {
        setMapModalOpen(true);
    };

    const closeMapModal = () => {
        setMapModalOpen(false);
    };

    // MAP CONTROLLER
    // Map with search box
    const [libraries] = useState(['places']);
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string,
        libraries: libraries as any,
    });

    interface Location {
        lat: number;
        lng: number;
    }

    // declare vaiables
    const defaultLoction = useMemo(() => ({ lat: values.lat, lng: values.lng }), []);
    const [selected, setSelected] = useState<Location>(defaultLoction);
    const [showMenu, setShowMenu] = useState(false);

    // handle get location click
    const handleGetLocationClick = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                setSelected({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });

                getGeocode({
                    location: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    },
                }).then((results) => {
                    setValue(results[0].formatted_address, false);
                    setFieldValue("address", results[0].formatted_address);
                    setFieldValue("lat", position.coords.latitude);
                    setFieldValue("lng", position.coords.longitude);
                    setShowMenu(false);
                });
            });
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
        setValue(values.address);
    }, []);

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

    // handle load ảnh
    const [imageLoaded, setImageLoaded] = useState(false);

    const handleImageLoad = () => {
        setImageLoaded(true);
    };


    return (
        <Box display={'flex'} alignItems={'center'} justifyContent={'center'}
            padding={isMobile ? '16px 0px' : '32px 64px'}
            gap={isMobile ? '16px' : '32px'}
            flexDirection={isMobile ? 'column' : 'row'} width={'100%'}
            >
            {/* search box input */}
            <Box
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
                justifyContent={'center'}
                minWidth={isMobile ? "90%" : "30%"}
                width={isMobile ? "90%" : "30%"}
                height={isMobile ? "auto" : "573.11px"}

                sx={{
                    backgroundImage: `url(${Snow})`,
                    borderRadius : '8px',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                {/* Đồng hành cùng bạn ~ wandro box */}
                <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'start'} width={'100%'}
                    sx={{
                        animation: "fadeInDown 1s ease-out"
                    }}
                >
                    <Typography
                        width={'100%'}
                        variant={'h6'}
                        fontWeight={'700'}
                        fontSize={isMobile ? '40px' : '50px'}
                        color={(theme) => theme.palette.text.primary}
                    >
                        {t("editional.beWithYouOn")}
                    </Typography>
                    <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'start'} width={'100%'} gap={'8px'}>
                        <Typography
                            variant={'h6'}
                            fontWeight={'700'}
                            fontSize={isMobile ? '40px' : '50px'}
                            color={(theme) => theme.palette.text.primary}
                        >
                            {t("editional.theJourney")}
                        </Typography>
                        <Icon>
                            <OrnamentIcon style={{ width: '100%' }} />
                        </Icon>
                        <Typography
                            variant={'h6'}
                            fontWeight={'700'}
                            fontSize={isMobile ? '40px' : '50px'}
                            color={(theme) => theme.palette.primary.main}
                        >
                            WANDRO
                        </Typography>
                    </Box>
                </Box>
                <Box display={'flex'} flexDirection={'column'} alignItems={'end'} justifyContent={'center'} width={'100%'} gap={'16px'}>
                    {/* search address input */}
                    <TextField
                        name="address"
                        value={values.address}
                        fullWidth
                        sx={{
                            "& .MuiOutlinedInput-root fieldset": {
                                borderRadius: "8px",
                                borderColor: "#E5E5E5",
                            },
                            "& .MuiOutlinedInput-root:hover fieldset": {
                                border: "1px solid #8b4513"
                            },
                            "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                                border: "1px solid #8b4513"
                            },
                            animation: "fadeInRight 1s ease-out",
                            backgroundColor: 'white',
                        }}
                        variant="outlined"
                        InputProps={
                            {
                                endAdornment: (
                                    <EditLocation
                                        onClick={openMapModal}
                                        style={{
                                            cursor: 'pointer',
                                            color: '#BFBFBF',
                                        }}
                                    />
                                )
                            }
                        }
                        inputProps={
                            { readOnly: true, }
                        }
                        placeholder='Địa điểm'
                    />
                    {/* date picker input */}
                    <RangePicker
                        className="custom-range-picker custom-table" // Sử dụng class CSS tùy chỉnh
                        style={{
                            fontFamily: 'Inter',
                            fontStyle: 'normal',
                            fontSize: '20px',
                            animation: "fadeInRight 1s ease-out"
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
                            if (dates && dates.length === 2) {
                                setFieldValue('startDate', dateStrings[0]);
                                setFieldValue('endDate', dateStrings[1]);
                            } else {
                                // Xử lý trường hợp người dùng xóa hết giá trị
                                setFieldValue('startDate', ''); // Đặt giá trị mặc định khác hoặc null tùy theo nhu cầu
                                setFieldValue('endDate', ''); // Đặt giá trị mặc định khác hoặc null tùy theo nhu cầu
                            }
                        }}
                        allowClear={false}
                    />
                    {/* button submit */}
                    <MyCustomButton
                        sx={{
                            animation: "fadeInBottom 1s ease-out"
                        }}
                        width={isMobile ? "100%" : "auto"}
                        borderRadius={8}
                        fontSize={16}
                        fontWeight={600}
                        onClick={handleSubmit}
                        content={t("editional.findMotorbike")}
                    />
                </Box>
            </Box>
            {/* search box image */}
            <Box
                display={'flex'}
                flexDirection={'row'}
                alignItems={'center'}
                justifyContent={'center'}
                minWidth={isMobile ? '90%' : '60%'}
                width={isMobile ? '90%' : '60%'}
            >
                <img
                    alt="search box"
                    style={{
                        cursor: 'pointer',
                        borderRadius: '8px',
                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                        display: imageLoaded ? 'block' : 'none', // Hiển thị ảnh khi đã load xong
                    }}
                    loading="eager"
                    src={ImageSearchBox}
                    width={'100%'}
                    onLoad={handleImageLoad}
                />
                {!imageLoaded && (
                    <Skeleton
                        variant="rounded"
                        width={'100%'}
                        height={isMobile ? 200 : 573.11}
                        animation="wave"
                    />
                )}
            </Box>
            <Modal
                open={isMapModalOpen}
                aria-labelledby="map-modal-title"
                aria-describedby="map-modal-description"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '32px 0px',
                }}>
                <Box width={isMobile ? "80%" : "50%"} height={"auto"} sx={{
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
                    <Box width={"100%"} height={"90%"} display={"flex"} flexDirection={"column"} justifyContent={"start"} alignItems={"center"}>
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
                                                    sx={{ backgroundColor: "#ffffff" }}
                                                    // border={"3px solid #ebebeb"}
                                                    borderRadius={"8px"}>
                                                    {status === "OK" &&
                                                        data.map(({ place_id, description }) => (
                                                            <MenuItem
                                                                dense
                                                                sx={{
                                                                    cursor: "pointer",
                                                                    "&:hover": { backgroundColor: "#ebebeb" },
                                                                    width: "99%",
                                                                    borderBottom: "1px solid #ebebeb",
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
                                                <Typography variant="caption" fontSize={"12px"} color={theme.palette.text.secondary}>{t("component.MyMapWithSearchBox.getLocationButtonLabel")}</Typography>
                                            </Box>

                                            <Box
                                                borderRadius={"10px"}
                                                border={"3px solid"}
                                                margin={"0px auto"}
                                                width={"97%"}
                                                justifyContent={"center"}
                                                alignItems={"center"}
                                                flexDirection={"column"}
                                            >
                                                <GoogleMap
                                                    zoom={18}
                                                    center={selected ? selected : defaultLoction}
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
                                            <Typography variant="caption" fontSize={"12px"} color={"red"} fontStyle={"italic"}>
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
        </Box>
    )
}

export default SeachBoxComponent
