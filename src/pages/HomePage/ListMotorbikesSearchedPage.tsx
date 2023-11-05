import { Box, CircularProgress, IconButton, MenuItem, Modal, Select, TextField, Typography, styled } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react'
import usei18next from '../../hooks/usei18next';
import { useNavigate, useParams } from 'react-router-dom';
import { AutoGraph, CheckBox, CheckBoxOutlineBlank, CloseOutlined, ElectricBike, FilterAltOutlined, LocationOnOutlined, MyLocation, RestartAltOutlined, SearchOutlined } from '@mui/icons-material';
import theme from '../../utils/theme';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import MyIcon from '../../components/common/MyIcon';
import RegisterMotorbikeItem from '../PostMotorbike/components/RegisterMotorbike/RegisterMotorbikeItem';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import MyCustomButton from '../../components/common/MyButton';
import useThemePage from '../../hooks/useThemePage';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { ROUTES } from '../../utils/Constant';
import { SearchMotorbikeRequest } from '../../utils/type';
import { SearchMotorbikeServices } from '../../services/SearchMotorbikeService';


export default function ListMotorbikesSearchedPage() {
    const { startDate, endDate, address } = useParams();
    const { RangePicker } = DatePicker;
    const today = dayjs();
    const { t } = usei18next();
    const navigate = useNavigate();
    const { isMobile } = useThemePage();

    const [isMapModalOpen, setMapModalOpen] = useState(false);
    const [isAdvancedFilterModalOpen, setAdvancedFilterModalOpen] = useState(false);
    const [defaultlat, setDefaultLat] = useState();
    const [defaultlng, setDefaultLng] = useState();

    // convert timestamp to date
    const convertTimestampToDate = (timestamp: number) => {
        return dayjs(timestamp * 1000).format("DD-MM-YYYY HH:mm");
    }

    const MyTextFieldCustom = styled(TextField)(({ theme }) => ({
        width: '150px',
        '& .MuiInputBase-root': {
            fontSize: '14px',
            height: '32px',
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderRadius: "8px",
                border: "1px solid #e0e0e0",
            },
            '&:hover fieldset': {
                border: "1px solid #8b4513"
            },
            '&.Mui-focused fieldset': {
                border: "1px solid #8b4513"
            },
        },
    }));

    const sortOptions = [
        // tất cả
        {
            key: 'all',
            value: 'Tất cả'
        },
        // giá tăng dần
        {
            key: 'priceAsc',
            value: 'Giá tăng dần'
        },
        // giá giảm dần
        {
            key: 'priceDesc',
            value: 'Giá giảm dần'
        },
        // đánh giá cao nhất
        {
            key: 'ratingDesc',
            value: 'Đánh giá cao nhất'
        },
        // số lượt thuê nhiều nhất
        {
            key: 'rentTimesDesc',
            value: 'Số lượt thuê nhiều nhất'
        },
        // khoảng cách gần nhất
        {
            key: 'distanceAsc',
            value: 'Khoảng cách gần nhất'
        },
    ]



    useEffect(() => {
        getMotorbikesByPlaceAndTime();
    }, [startDate, endDate, address]);

    const getMotorbikesByPlaceAndTime = async () => {
        if (!startDate || !endDate || !address) return;
        const formData: SearchMotorbikeRequest = {
            startDate: convertTimestampToDate(Number(startDate)),
            endDate: convertTimestampToDate(Number(endDate)),
            address: address
        }
        const response = await SearchMotorbikeServices.getMotorbikesByPlaceAndTime(formData);
    }

    // FORM CONTROLLER
    const formik = useFormik({
        initialValues: {
            address: address,
            lat: 21.028511,
            lng: 105.804817,
            startDate: convertTimestampToDate(Number(startDate)),
            endDate: convertTimestampToDate(Number(endDate)),
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

    // ADVANCED FILTER MODAL CONTROLLER
    const openAdvancedFilterModal = () => {
        setAdvancedFilterModalOpen(true);
    };

    const closeAdvancedFilterModal = () => {
        setAdvancedFilterModalOpen(false);
    };

    const selectOptions = [
        {
            key: 'all',
            value: 'Chọn tất cả',
            isChecked: false
        },
        {
            key: '5star',
            value: 'Xe đạt đánh giá 5 sao',
            isChecked: false
        },
        {
            key: 'electric',
            value: 'Xe điện',
            isChecked: false
        },
    ];

    // state for select options
    const [selectOptionsState, setSelectOptionsState] = useState(selectOptions);

    const checkSelectOptions: any = (key: string) => {
        const isAllUnchecked = selectOptionsState.every(option => option.key === 'all' || option.isChecked); // Kiểm tra xem tất cả tùy chọn khác đã được chọn hay chưa (trừ 'all')

        setSelectOptionsState(prevState => prevState.map(option => {
            if (key === 'all') {
                option.isChecked = !isAllUnchecked;
            } else if (key === '') {
                option.isChecked = false;
            } else if (option.key === 'all') {
                option.isChecked = false;
            } else if (option.key === key) {
                option.isChecked = !option.isChecked;
            }
            return option;
        }));
    };




    // ADDRESS MODAL CONTROLLER
    const openMapModal = () => {
        setMapModalOpen(true);
    };

    const closeMapModal = () => {
        setMapModalOpen(false);
    };

    // MAP CONTROLLER
    // Map with search box
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string,
        libraries: ["places"],
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
        if (values.address)
            setValue(values.address);
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

    return (
        <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
            {/* filter motorbikes */}
            <Box width={"100%"} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '8px' }} borderBottom={'1px solid #e0e0e0'}
                padding={"8px 0px"} >
                {/* location and time */}
                <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '16px' }}>
                    {/* location */}
                    <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '4px' }}>
                        <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'start'} sx={{ gap: '8px' }}>
                            <Typography color={theme.palette.text.primary} sx={{ fontSize: '12px', fontWeight: "600", fontStyle: "italic" }}>
                                Địa điểm thuê xe:
                            </Typography>
                        </Box>
                        <Box
                            className="custom-search-box"
                            display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'} sx={{ cursor: 'pointer', gap: '8px' }} padding={"4px 0px"}
                            onClick={openMapModal} 
                            >
                            <LocationOnOutlined sx={{ color: theme.palette.action.disabled }} />
                            <Typography
                                color={theme.palette.text.primary}
                                sx={{ fontSize: '16px', fontWeight: "400", minWidth: '100px', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                onChange={handleChange}
                            >
                                {values.address}
                            </Typography>
                        </Box>
                    </Box>
                    {/* time */}
                    <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '4px' }}>
                        <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'}>
                            {/* start date */}
                            <Typography width={"50%"} color={theme.palette.text.primary} sx={{ fontSize: '12px', fontWeight: "600", fontStyle: "italic" }}>
                                Ngày bắt đầu:
                            </Typography>
                            {/* end date */}
                            <Typography width={"50%"} color={theme.palette.text.primary} sx={{ fontSize: '12px', fontWeight: "600", fontStyle: "italic" }}>
                                Ngày kết thúc:
                            </Typography>
                        </Box>
                        <RangePicker
                            className="custom-range-picker"
                            style={{
                                fontFamily: 'Inter',
                                fontStyle: 'normal',
                                fontSize: '20px',
                                height: '32px',
                            }}
                            size='large'
                            showTime={{ format: 'HH:mm' }}
                            format="DD-MM-YYYY HH:mm"
                            placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                            value={[
                                dayjs(convertTimestampToDate(Number(startDate)), "DD-MM-YYYY HH:mm"),
                                dayjs(convertTimestampToDate(Number(endDate)), "DD-MM-YYYY HH:mm"),
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
                    </Box>
                    <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '4px' }}>
                        {/* white space */}
                        <Box minHeight={"18px"} width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'} />
                        {/* search icon */}
                        <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '16px' }}>

                            <Box
                                className="custom-search-box"
                                sx={{
                                    padding: '3px 11px',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#8B4513',

                                }}
                            >
                                <SearchOutlined sx={{ cursor: 'pointer', color: theme.palette.common.white }} />
                            </Box>
                            {/* filter icon */}
                            <MyCustomButton
                                borderRadius={8}
                                fontWeight={400}
                                fontSize={14}
                                borderWeight={1}
                                height='32px'
                                variant='outlined'
                                borderColor='#000'
                                fontColor='#000'
                                icon={<FilterAltOutlined style={{ color: theme.palette.common.black, }} />}
                                iconPosition='left'
                                content={"Bộ lọc"}
                                onClick={openAdvancedFilterModal} />
                        </Box>

                    </Box>
                </Box>
            </Box>
            {/* list motorbikes */}
            <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                {/* title */}
                <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '8px' }}
                    padding={"8px 0px"} >
                    <Typography color={theme.palette.text.primary} sx={{ fontSize: '24px', fontWeight: "600" }}>
                        Danh sách xe tìm kiếm
                    </Typography>
                </Box>
                {/* list motorbikes */}
            </Box>

            {/* modal address */}
            <Modal
                open={isMapModalOpen}
                aria-labelledby="map-modal-title"
                aria-describedby="map-modal-description"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '32px 0px',
                    overflowY: 'auto',
                }}>
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
                                                <Typography variant="caption" fontSize={"12px"} color={theme.palette.text.secondary}>{t("component.MyMapWithSearchBox.getLocationButtonLabel")}</Typography>
                                            </Box>

                                            <Box
                                                borderRadius={"10px"}
                                                border={"3px solid"}
                                                margin={"0px auto"}
                                                width={"100%"}
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
            {/* modal advanced filter */}
            <Modal
                open={isAdvancedFilterModalOpen}
                aria-labelledby="map-modal-title"
                aria-describedby="map-modal-description"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '32px 0px',
                    overflowY: 'auto',
                }}>
                <Box width={isMobile ? "70%" : "50%"} height={"auto"} sx={{
                    padding: "16px 32px",
                    backgroundColor: 'white',
                    borderRadius: '8px',
                }}>
                    <Box width={"100%"} display={"flex"} flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"} pb={"8px"} borderBottom={"1px solid #e0e0e0"}>
                        <Typography variant='h2' color={theme.palette.text.primary} fontSize={isMobile ? "20px" : "24px"} fontWeight={600} textAlign={"start"}>
                            {"Bộ lọc nâng cao"}
                        </Typography>
                        <Box height={"10%"} display={"flex"} flexDirection={"row"} justifyContent={"flex-end"} alignItems={"center"}>
                            <MyIcon icon={<CloseOutlined />} hasTooltip tooltipText={t("postMotorbike.registedForm.badge-close")} onClick={closeAdvancedFilterModal} position='bottom' />
                        </Box>
                    </Box>
                    <Box width={"100%"} display={"flex"} flexDirection={"column"} justifyContent={"start"} alignItems={"center"}>
                        {/* Các lựa chọn */}
                        <Box width={"100%"} display={"flex"} flexDirection={"column"} justifyContent={"space-between"} alignItems={"center"} sx={{ gap: '8px' }} p={"8px 0px"}>
                            <Box width={"100%"} display={"flex"} flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"}>
                                {/* tilte */}
                                <Typography variant='h2' color={theme.palette.text.primary} fontSize={isMobile ? "12px" : "16px"} fontWeight={600} textAlign={"start"}>
                                    {"Các lựa chọn"}
                                </Typography>
                                {/* action button */}
                                <Box display={"flex"} flexDirection={"row"} justifyContent={"flex-end"} alignItems={"center"} sx={{ gap: '8px' }}>
                                    <MyCustomButton
                                        borderRadius={4}
                                        fontSize={12}
                                        fontWeight={500}
                                        height='28px'
                                        variant='outlined'
                                        backgroundColor='#F4EDE8'
                                        noBorder={true}
                                        content={"Xóa tất cả"}
                                        onClick={
                                            () => {
                                                checkSelectOptions('');
                                            }
                                        } />
                                    <MyCustomButton
                                        isChecked={selectOptionsState[0].isChecked}
                                        borderRadius={4}
                                        fontSize={12}
                                        fontWeight={500}
                                        height='28px'
                                        icon={
                                            selectOptionsState[0].isChecked ? <CheckBox style={{ color: "#8B4513", }} /> : <CheckBoxOutlineBlank style={{ color: "#8B4513", }}
                                            />
                                        }
                                        iconPosition='left'
                                        variant='outlined'
                                        content={selectOptionsState[0].value}
                                        onClick={
                                            () => {
                                                checkSelectOptions('all');
                                            }
                                        } />

                                </Box>
                            </Box>
                            {/* content */}
                            <Box width={"100%"} display={"flex"} flexDirection={"row"} justifyContent={"flex-start"} alignItems={"center"} sx={{ gap: '8px' }}>
                                <MyCustomButton
                                    isChecked={selectOptionsState[1].isChecked}
                                    borderRadius={4}
                                    fontSize={14}
                                    fontWeight={400}
                                    height='28px'
                                    variant='outlined'
                                    icon={<AutoGraph style={{ color: "#000", }} />}
                                    iconPosition='left'
                                    content={selectOptionsState[1].value}
                                    borderWeight={1}
                                    fontColor={"#000"}
                                    borderColor={"#000"}
                                    onClick={
                                        () => {
                                            checkSelectOptions('5star');
                                        }
                                    } />
                                <MyCustomButton
                                    isChecked={selectOptionsState[2].isChecked}
                                    borderRadius={4}
                                    fontSize={14}
                                    fontWeight={400}
                                    height='28px'
                                    variant='outlined'
                                    icon={<ElectricBike style={{ color: "#000", }} />}
                                    iconPosition='left'
                                    content={selectOptionsState[2].value}
                                    borderWeight={1}
                                    fontColor={"#000"}
                                    borderColor={"#000"}
                                    onClick={
                                        () => {
                                            checkSelectOptions('electric');
                                        }
                                    } />
                            </Box>
                        </Box>
                        {/* Hãng xe và mẫu xe */}
                        {/* box price */}
                        <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '8px' }}>
                            {/* min price */}
                            <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '8px' }}>
                                <Typography color={theme.palette.text.primary} sx={{ fontSize: '14px', fontWeight: "400" }}>
                                    Giá thấp nhất:
                                </Typography>
                                <MyTextFieldCustom
                                    variant="outlined"
                                    size="small"
                                    type='number'
                                // onChange={handleChange}
                                // value={values.minPrice}
                                />
                            </Box>
                            {/* max price */}
                            <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '8px' }}>
                                <Typography color={theme.palette.text.primary} sx={{ fontSize: '14px', fontWeight: "400" }}>
                                    Giá cao nhất:
                                </Typography>
                                <MyTextFieldCustom
                                    variant="outlined"
                                    size="small"
                                    type='number'
                                // onChange={handleChange}
                                // value={values.maxPrice}
                                />
                            </Box>





                        </Box>
                        {/* sort field */}
                        <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '8px' }}>
                            <Typography color={theme.palette.text.primary} sx={{ fontSize: '14px', fontWeight: "400" }}>
                                Sắp xếp theo:
                            </Typography>
                            <Select
                                labelId="demo-select-small-label"
                                id="demo-select-small"
                                // value={selectedStatus}
                                native
                                displayEmpty
                                size='small'
                                sx={{
                                    fontSize: '14px',
                                    height: '32px',
                                    borderRadius: '8px',
                                }}
                            // onChange={handleChangeStatus}
                            >
                                {sortOptions.map((option) => (
                                    <option key={option.key} value={option.key}>
                                        {option.value}
                                    </option>
                                ))}
                            </Select>
                        </Box>
                        {/* Năm sản xuất */}
                        {/* Mức tiêu thụ nhiên liệu */}
                        {/* Khoảng cách */}
                        {/* Loại nhiên liệu */}
                        {/* Các tính năng */}
                        {/* Action Button */}
                        <Box width={"100%"} display={"flex"} flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"} sx={{ gap: '8px' }} p={"8px 0px"}>
                            <MyCustomButton
                                borderRadius={8}
                                fontWeight={500}
                                variant='outlined'
                                icon={<RestartAltOutlined style={{ color: "#8B4513", }} />}
                                iconPosition='left'
                                content={"Đặt lại bộ lọc"}
                                onClick={
                                    () => {
                                        closeAdvancedFilterModal();
                                    }
                                } />
                            <MyCustomButton
                                borderRadius={8}
                                fontWeight={500}
                                content={"Áp dụng bộ lọc"}
                                onClick={
                                    () => {
                                        closeAdvancedFilterModal();
                                    }
                                } />
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </Box >
    )
}
