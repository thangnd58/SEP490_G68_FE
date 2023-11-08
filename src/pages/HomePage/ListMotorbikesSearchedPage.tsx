import { Box, CircularProgress, Grid, Icon, IconButton, MenuItem, Modal, Select, Slider, TextField, Typography, styled } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react'
import usei18next from '../../hooks/usei18next';
import { useNavigate, useParams } from 'react-router-dom';
import { AutoGraph, CheckBox, CheckBoxOutlineBlank, CloseOutlined, ElectricBike, FilterAltOutlined, LocalGasStation, LocationOnOutlined, MyLocation, RestartAltOutlined, SearchOutlined } from '@mui/icons-material';
import theme from '../../utils/theme';
import { Avatar, DatePicker } from 'antd';
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
import { Motorbike, SearchMotorbikeRequest } from '../../utils/type';
import { SearchMotorbikeServices } from '../../services/SearchMotorbikeService';
import { forEach } from 'jszip';
import MotorbikeInforCard from './components/MotorbikeInforCard';
import { NoDataImage, PageNoteFoundImage } from '../../assets/images';


export default function ListMotorbikesSearchedPage() {
    const { startDate, endDate, address } = useParams();
    const { RangePicker } = DatePicker;
    const { t } = usei18next();
    const navigate = useNavigate();
    const { isMobile } = useThemePage();
    const [listMotorbikes, setListMotorbikes] = useState<Motorbike[]>([]);

    const [isMapModalOpen, setMapModalOpen] = useState(false);
    const [isAdvancedFilterModalOpen, setAdvancedFilterModalOpen] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);
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
        getMotorbikesByPlaceAndTime(startDate, endDate, address);
    }, [startDate, endDate, address]);

    const getMotorbikesByPlaceAndTime = async (startDateTimeParam?: string, endDateTimeParam?: string, addressParam?: string) => {
        setIsLoadingData(true); // Bắt đầu tải dữ liệu

        if (!startDateTimeParam || !endDateTimeParam || !addressParam) {
            setIsLoadingData(false); // Dừng tải dữ liệu
            return;
        }

        const formData: SearchMotorbikeRequest = {
            startDate: convertTimestampToDate(Number(startDateTimeParam)),
            endDate: convertTimestampToDate(Number(endDateTimeParam)),
            address: addressParam,
        }

        try {
            const response = await SearchMotorbikeServices.getMotorbikesByPlaceAndTime(formData);
            setListMotorbikes(response);
        } catch (error) {
            // Xử lý lỗi tại đây (nếu cần)
        }

        setIsLoadingData(false); // Tải dữ liệu hoàn tất
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
            // convert date to timestamp
            const startDate = dayjs(values.startDate, "DD-MM-YYYY HH:mm").unix();
            const endDate = dayjs(values.endDate, "DD-MM-YYYY HH:mm").unix();
            let encodeAddress = '';
            // encode address
            if (values.address) {
                encodeAddress = encodeURIComponent(values.address);
            }
            console.log(getMotorbikesByPlaceAndTime(startDate.toString(), endDate.toString(), encodeAddress));
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
        }
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

    const featureOptions = [
        {
            key: 'all',
            value: 'Tất cả',
            isChecked: false
        },
        {
            key: 'raincoat',
            value: 'Áo mưa',
            isChecked: false
        },
        {
            key: 'helmet',
            value: 'Mũ bảo hiểm',
            isChecked: false
        },

        {
            key: 'reflectiveClothes',
            value: 'Dây đeo phản quang',
            isChecked: false
        },
        {
            key: 'repairKit',
            value: 'Bộ dụng cụ sửa chữa',
            isChecked: false
        },
        {
            key: 'caseTelephone',
            value: 'Giá đỡ điện thoại',
            isChecked: false
        },
        {
            key: 'bagage',
            value: 'Baga sau',
            isChecked: false
        },
    ];

    // state for feature options
    const [featureOptionsState, setFeatureOptionsState] = useState(featureOptions);

    const checkFeatureOptions: any = (key: string) => {
        const isAllUnchecked = featureOptionsState.every(option => option.key === 'all' || option.isChecked); // Kiểm tra xem tất cả tùy chọn khác đã được chọn hay chưa (trừ 'all')

        setFeatureOptionsState(prevState => prevState.map(option => {
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

    // Tạo hai mảng chứa dữ liệu của từng hàng
    const featureOptionsRow1 = featureOptionsState.slice(0, Math.ceil(featureOptionsState.length / 2));
    const featureOptionsRow2 = featureOptionsState.slice(Math.ceil(featureOptionsState.length / 2));

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


    // HANDLE RangeSlider
    const [price, setPrice] = React.useState<number[]>([0, 200]);

    const handlePriceChange = (event: Event, newValue: number | number[]) => {
        setPrice(newValue as number[]);
    };

    const [releaseYear, setReleaseYear] = React.useState<number[]>([1990, 2023]);
    const handleReleaseYearChange = (event: Event, newValue: number | number[]) => {
        setReleaseYear(newValue as number[]);
    }

    const [fuelConsumption, setFuelConsumption] = React.useState<number[]>([0, 10]);
    const handleFuelConsumptionChange = (event: Event, newValue: number | number[]) => {
        setFuelConsumption(newValue as number[]);
    }

    const [maxDistance, setMaxDistance] = React.useState<number[]>([0, 100]);
    const handleMaxDistanceChange = (event: Event, newValue: number | number[]) => {
        setMaxDistance(newValue as number[]);
    }

    return (
        <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
            {/* filter motorbikes */}
            <Box
                sx={{
                    backgroundColor: '#fff'
                }}
                width={"100%"}
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
                justifyContent={'center'}
                gap={'8px'}
                position={'sticky'}
                top={0}
                borderBottom={'1px solid #e0e0e0'}
                padding={"16px 0px"}
                zIndex={1}
                boxShadow={
                    "0px 4px 4px rgba(0, 0, 0, 0.01)"
                }
            >
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
                    <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '4px' }}>
                        {/* white space */}
                        <Box minHeight={"18px"} width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'} />
                        {/* search icon */}
                        <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '16px' }}>

                            <MyCustomButton
                                borderRadius={8}
                                fontSize={14}
                                height='32px'
                                fontWeight={400}
                                disabled={isLoadingData}
                                onClick={handleSubmit}
                                icon={<SearchOutlined style={{ color: theme.palette.common.white, }} />}
                                iconPosition='left'
                                content={"Tìm xe"}
                            />
                            {/* | */}
                            <Typography color={theme.palette.action.disabled} sx={{ fontSize: '14px', fontWeight: "400" }}>
                                |
                            </Typography>
                            {/* filter icon */}
                            <MyCustomButton
                                borderRadius={8}
                                fontWeight={400}
                                fontSize={14}
                                borderWeight={1}
                                height='32px'
                                variant='outlined'
                                borderColor='#e0e0e0'
                                fontColor='#000'
                                icon={<FilterAltOutlined style={{ color: theme.palette.common.black, }} />}
                                iconPosition='left'
                                content={"Bộ lọc"}
                                onClick={openAdvancedFilterModal} />

                            {/* - */}
                            <Typography color={theme.palette.text.primary} sx={{ fontSize: '14px', fontWeight: "400" }}>
                                -
                            </Typography>

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
                        </Box>
                    </Box>
                </Box>
            </Box>
            {/* list motorbikes */}
            <Box
                zIndex={0}
                sx={{
                    backgroundColor: '#f1f1f1',
                }}
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
                justifyContent={'start'}
                gap={'16px'}
                minHeight={'65vh'}
                minWidth={"100%"}
                padding={"16px 0px 32px 0px"}
            >
                {/* title */}
                <Box
                    width={"100%"}
                    display={'flex'}
                    flexDirection={'row'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    sx={{ gap: '8px' }}
                >
                    <Typography color={theme.palette.text.primary} sx={{ fontSize: '24px', fontWeight: "600" }}>
                        Danh sách xe tìm kiếm
                    </Typography>
                </Box>
                {/* list motorbikes */}
                {
                    isLoadingData ? (
                        <Box width={"100%"} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '8px' }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        listMotorbikes.length > 0 ? (
                            <Box sx={{
                                width: '90%',
                                minHeight: '65vh',
                            }} alignItems={'center'} justifyContent={'center'}>
                                <Grid
                                    width={"100%"}
                                    container
                                    columnSpacing={{ xs: 1, sm: 1, md: 1 }}
                                    rowSpacing={{ xs: 1, sm: 2, md: 3 }}
                                >
                                    {listMotorbikes.map((item: Motorbike, index: number) => (
                                        <Grid key={index} item xs={12} sm={6} md={4} lg={3} xl={3} sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            <MotorbikeInforCard motorbike={item} isFavoritePage={false} />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        ) : (
                            <Box width={"100%"} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '8px' }}>
                                <Avatar
                                    src={NoDataImage}
                                    style={{ width: '400px', height: '400px' }}
                                    shape='square'
                                    alt="image"
                                />
                            </Box>
                        )
                    )
                }

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
                    alignItems: 'start',
                    justifyContent: 'center',
                    margin: '32px 0px',
                    overflowY: 'auto',
                }}>
                <Box width={isMobile ? "70%" : "50%"}
                    height={"auto"}
                    sx={{
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
                    <Box width={"95%"} display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"} margin={"8px auto"} sx={{ gap: '16px' }}>
                        {/* Các lựa chọn */}
                        <Box width={"100%"} display={"flex"} flexDirection={"column"} justifyContent={"space-between"} alignItems={"center"} sx={{ gap: '8px' }}>
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
                                        borderWeight={1}
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
                                    borderColor={"#e0e0e0"}
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
                                    borderColor={"#e0e0e0"}
                                    onClick={
                                        () => {
                                            checkSelectOptions('electric');
                                        }
                                    } />
                            </Box>
                        </Box>
                        {/* Hãng xe và mẫu xe */}
                        {/* box price */}
                        <Box width={"100%"} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '4px' }}>
                            <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }}>
                                {/* tilte */}
                                <Typography variant='h2' color={theme.palette.text.primary} fontSize={isMobile ? "12px" : "16px"} fontWeight={600} textAlign={"start"}>
                                    {"Giới hạn giá / Ngày thuê"}
                                </Typography>
                            </Box>
                            <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'}>
                                {/* price */}
                                <Box sx={{ width: "97%" }}>
                                    <Slider
                                        value={price}
                                        max={200}
                                        min={0}
                                        onChange={handlePriceChange}
                                        valueLabelDisplay="auto"
                                    />
                                </Box>
                            </Box>
                            <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }}>
                                <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }} border={'1px solid #e0e0e0'} borderRadius={'8px'} padding={'8px'} >
                                    <Typography color={theme.palette.text.primary} sx={{ fontSize: '14px', fontWeight: "400" }}>
                                        Tối thiểu:
                                    </Typography>
                                    <Typography color={theme.palette.text.primary} sx={{ fontSize: '14px', fontWeight: "400" }}>
                                        {price[0]}K
                                    </Typography>
                                </Box>
                                <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }} border={'1px solid #e0e0e0'} borderRadius={'8px'} padding={'8px'} >
                                    <Typography color={theme.palette.text.primary} sx={{ fontSize: '14px', fontWeight: "400" }}>
                                        Tối đa:
                                    </Typography>
                                    <Typography color={theme.palette.text.primary} sx={{ fontSize: '14px', fontWeight: "400" }}>
                                        {price[1]}K
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                        {/* Năm sản xuất */}
                        <Box width={"100%"} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '4px' }}>
                            <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }}>
                                {/* tilte */}
                                <Typography variant='h2' color={theme.palette.text.primary} fontSize={isMobile ? "12px" : "16px"} fontWeight={600} textAlign={"start"}>
                                    {"Năm sản xuất"}
                                </Typography>
                            </Box>
                            <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'}>
                                {/* price */}
                                <Box sx={{ width: "97%" }}>
                                    <Slider
                                        value={releaseYear}
                                        onChange={handleReleaseYearChange}
                                        valueLabelDisplay="auto"
                                        max={2023}
                                        min={1990}
                                    />
                                </Box>
                            </Box>
                            <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }}>
                                <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }} border={'1px solid #e0e0e0'} borderRadius={'8px'} padding={'8px'} >
                                    <Typography color={theme.palette.text.primary} sx={{ fontSize: '14px', fontWeight: "400" }}>
                                        Tối thiểu:
                                    </Typography>
                                    <Typography color={theme.palette.text.primary} sx={{ fontSize: '14px', fontWeight: "400" }}>
                                        {releaseYear[0]}
                                    </Typography>
                                </Box>
                                <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }} border={'1px solid #e0e0e0'} borderRadius={'8px'} padding={'8px'} >
                                    <Typography color={theme.palette.text.primary} sx={{ fontSize: '14px', fontWeight: "400" }}>
                                        Tối đa:
                                    </Typography>
                                    <Typography color={theme.palette.text.primary} sx={{ fontSize: '14px', fontWeight: "400" }}>
                                        {releaseYear[1]}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                        {/* Mức tiêu thụ nhiên liệu */}
                        <Box width={"100%"} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '4px' }}>
                            <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }}>
                                {/* tilte */}
                                <Typography variant='h2' color={theme.palette.text.primary} fontSize={isMobile ? "12px" : "16px"} fontWeight={600} textAlign={"start"}>
                                    {"Mức tiêu thụ nhiên liệu"}
                                </Typography>
                            </Box>
                            <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'}>
                                {/* price */}
                                <Box sx={{ width: "97%" }}>
                                    <Slider
                                        value={fuelConsumption}
                                        onChange={handleFuelConsumptionChange}
                                        valueLabelDisplay="auto"
                                        max={10}
                                        min={0}
                                    />
                                </Box>
                            </Box>
                            <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }}>
                                <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }} border={'1px solid #e0e0e0'} borderRadius={'8px'} padding={'8px'} >
                                    <Typography color={theme.palette.text.primary} sx={{ fontSize: '14px', fontWeight: "400" }}>
                                        Tối thiểu:
                                    </Typography>
                                    <Typography color={theme.palette.text.primary} sx={{ fontSize: '14px', fontWeight: "400" }}>
                                        {fuelConsumption[0]}L/km
                                    </Typography>
                                </Box>
                                <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }} border={'1px solid #e0e0e0'} borderRadius={'8px'} padding={'8px'} >
                                    <Typography color={theme.palette.text.primary} sx={{ fontSize: '14px', fontWeight: "400" }}>
                                        Tối đa:
                                    </Typography>
                                    <Typography color={theme.palette.text.primary} sx={{ fontSize: '14px', fontWeight: "400" }}>
                                        {fuelConsumption[1]}L/km
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                        {/* Khoảng cách */}
                        <Box width={"100%"} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '4px' }}>
                            <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }}>
                                {/* tilte */}
                                <Typography variant='h2' color={theme.palette.text.primary} fontSize={isMobile ? "12px" : "16px"} fontWeight={600} textAlign={"start"}>
                                    {"Khoảng cách"}
                                </Typography>
                            </Box>
                            <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'}>
                                {/* price */}
                                <Box sx={{ width: "97%" }}>
                                    <Slider defaultValue={100} aria-label="Default" valueLabelDisplay="auto" />
                                </Box>
                            </Box>
                            <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }}>
                                <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'start'} sx={{ gap: '8px' }} border={'1px solid #e0e0e0'} borderRadius={'8px'} padding={'8px'} >
                                    <Typography color={theme.palette.text.primary} sx={{ fontSize: '14px', fontWeight: "400" }}>
                                        Tối đa:
                                    </Typography>
                                    <Typography color={theme.palette.text.primary} sx={{ fontSize: '14px', fontWeight: "400" }}>
                                        20km
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                        {/* Loại nhiên liệu */}
                        {/* Các tính năng */}
                        <Box width={"100%"} display={"flex"} flexDirection={"column"} justifyContent={"space-between"} alignItems={"center"} sx={{ gap: '8px' }}>
                            <Box width={"100%"} display={"flex"} flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"}>
                                {/* tilte */}
                                <Typography variant='h2' color={theme.palette.text.primary} fontSize={isMobile ? "12px" : "16px"} fontWeight={600} textAlign={"start"}>
                                    {"Các tính năng"}
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
                                                checkFeatureOptions('');
                                            }
                                        } />
                                    <MyCustomButton
                                        isChecked={featureOptionsState[0].isChecked}
                                        borderRadius={4}
                                        fontSize={12}
                                        fontWeight={500}
                                        height='28px'
                                        borderWeight={1}
                                        icon={
                                            featureOptionsState[0].isChecked ? <CheckBox style={{ color: "#8B4513", }} /> : <CheckBoxOutlineBlank style={{ color: "#8B4513", }}
                                            />
                                        }
                                        iconPosition='left'
                                        variant='outlined'
                                        content={selectOptionsState[0].value}
                                        onClick={
                                            () => {
                                                checkFeatureOptions('all');
                                            }
                                        } />

                                </Box>
                            </Box>
                            {/* content */}
                            <Box width={"100%"} display={"flex"} flexDirection={"column"} sx={{ gap: '8px' }}>
                                <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"} sx={{ gap: '8px' }}>
                                    {
                                        featureOptionsRow1.map((option, index) => (
                                            option.key !== 'all' && (
                                                <MyCustomButton
                                                    width='30%'
                                                    key={index}
                                                    justifyContent='start'
                                                    isChecked={option.isChecked}
                                                    borderRadius={4}
                                                    fontSize={14}
                                                    fontWeight={400}
                                                    height='28px'
                                                    variant='outlined'
                                                    icon={
                                                        option.isChecked ? <CheckBox style={{ color: "#8B4513", }} /> : <CheckBoxOutlineBlank style={{ color: "#8B4513", }}
                                                        />
                                                    }
                                                    iconPosition='left'
                                                    content={option.value}
                                                    borderWeight={1}
                                                    fontColor={"#000"}
                                                    borderColor={"#e0e0e0"}
                                                    onClick={
                                                        () => {
                                                            checkFeatureOptions(option.key);
                                                        }
                                                    } />
                                            )))
                                    }
                                </Box>

                                <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"} sx={{ gap: '8px' }}>
                                    {
                                        featureOptionsRow2.map((option, index) => (
                                            option.key !== 'all' && (
                                                <MyCustomButton
                                                    width='30%'
                                                    justifyContent='start'
                                                    key={index}
                                                    isChecked={option.isChecked}
                                                    borderRadius={4}
                                                    fontSize={14}
                                                    fontWeight={400}
                                                    height='28px'
                                                    variant='outlined'
                                                    icon={
                                                        option.isChecked ? <CheckBox style={{ color: "#8B4513", }} /> : <CheckBoxOutlineBlank style={{ color: "#8B4513", }}
                                                        />
                                                    }
                                                    iconPosition='left'
                                                    content={option.value}
                                                    borderWeight={1}
                                                    fontColor={"#000"}
                                                    borderColor={"#e0e0e0"}
                                                    onClick={
                                                        () => {
                                                            checkFeatureOptions(option.key);
                                                        }
                                                    } />
                                            )))
                                    }
                                </Box>
                            </Box>
                        </Box>
                        {/* Action Button */}
                        <Box width={"100%"} display={"flex"} flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"} sx={{ gap: '8px' }} p={"8px 0px"}>
                            <MyCustomButton
                                borderRadius={8}
                                fontWeight={400}
                                fontSize={14}
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
                                fontWeight={400}
                                fontSize={14}
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
