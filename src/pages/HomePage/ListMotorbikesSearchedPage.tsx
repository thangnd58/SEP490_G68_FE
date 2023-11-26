import { Box, CircularProgress, Grid, Icon, IconButton, LinearProgress, MenuItem, Modal, Popover, Select, SelectChangeEvent, Slider, TextField, Typography, styled } from '@mui/material';
import React, { ReactNode, useEffect, useMemo, useState } from 'react'
import usei18next from '../../hooks/usei18next';
import { useNavigate, useParams } from 'react-router-dom';
import { AutoGraph, CheckBox, CheckBoxOutlineBlank, CloseOutlined, ElectricBike, FilterAltOutlined, FormatListBulletedOutlined, LocalGasStation, LocationOnOutlined, MapOutlined, MyLocation, RestartAltOutlined, SearchOutlined } from '@mui/icons-material';
import theme from '../../utils/theme';
import { Avatar, DatePicker } from 'antd';
import dayjs from 'dayjs';
import MyIcon from '../../components/common/MyIcon';
import RegisterMotorbikeItem from '../PostMotorbike/components/RegisterMotorbike/RegisterMotorbikeItem';
import { GoogleMap, InfoWindow, Marker, MarkerClusterer, MarkerClustererF, useLoadScript } from '@react-google-maps/api';
import MyCustomButton from '../../components/common/MyButton';
import useThemePage from '../../hooks/useThemePage';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { ROUTES } from '../../utils/Constant';
import { Brand, Motorbike, SearchMotorbikeRequest } from '../../utils/type';
import { SearchMotorbikeServices } from '../../services/SearchMotorbikeService';
import { forEach } from 'jszip';
import MotorbikeInforCard from './components/MotorbikeInforCard';
import { NoDataImage, PageNoteFoundImage, PinImage, SearchIcon } from '../../assets/images';
import { PostMotorbikeService } from '../../services/PostMotorbikeService';
import { BookingService } from '../../services/BookingService';

export interface Location {
    lat: number;
    lng: number;
}

export default function ListMotorbikesSearchedPage() {
    const { startDate, endDate, address } = useParams();
    const { RangePicker } = DatePicker;
    const { t } = usei18next();
    const navigate = useNavigate();
    const { isMobile } = useThemePage();

    const [listMotorbikes, setListMotorbikes] = useState<Motorbike[]>([]);
    const [listBrand, setListBrand] = useState<Brand[]>([]);
    const [isMapModalOpen, setMapModalOpen] = useState(false);
    const [isAdvancedFilterModalOpen, setAdvancedFilterModalOpen] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [equipments, setEquipments] = React.useState<string[]>([]);
    const [defaultLocation, setDefaultLocation] = useState<Location>();

    // convert timestamp to date
    const convertTimestampToDate = (timestamp: number) => {
        return dayjs(timestamp * 1000).format("DD-MM-YYYY HH:mm");
    }

    useEffect(() => {
        BookingService.getLatLngByAddress(address!).then((data) => {
            const location = data.split(',');
            const result: Location = {
                lat: Number(location[0]),
                lng: Number(location[1])
            }
            setDefaultLocation(result)
            setSelected(result)
            setFieldValue("lat", result.lat);
            setFieldValue("lng", result.lng);
        })
    }, [address])

    // format number * 1000 to type 1.000 VND/ngày
    const formatMoney = (money: number | undefined) => {
        if (money) {
            return (money * 1000).toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
        }
        return '0 VND';
    }

    // get current year
    const currentYear = new Date().getFullYear();

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
            key: '',
            value: 'Tất cả'
        },
        // giá tăng dần
        {
            key: 'PRICERENTASC',
            value: 'Giá tăng dần'
        },
        // giá giảm dần
        {
            key: 'PRICERENTDESC',
            value: 'Giá giảm dần'
        },
        // đánh giá cao nhất
        {
            key: 'RATINGDESC',
            value: 'Đánh giá cao nhất'
        },
        // số lượt thuê nhiều nhất
        {
            key: 'COUNTCOMPLETEDBOOKINGDESC',
            value: 'Số lượt thuê nhiều nhất'
        },
        // khoảng cách gần nhất
        {
            key: 'DISTANCEASC',
            value: 'Khoảng cách gần nhất'
        },
    ]



    // FORM CONTROLLER
    const formik = useFormik({
        initialValues: {
            address: address,
            lat: defaultLocation?.lat,
            lng: defaultLocation?.lng,
            startDate: convertTimestampToDate(Number(startDate)),
            endDate: convertTimestampToDate(Number(endDate)),
            maximumRating: false,
            electric: false,
            brandId: "",
            minPrice: 1,
            maxPrice: 200,
            minReleaseYear: 1990,
            maxReleaseYear: currentYear,
            minFuelConsumption: 1,
            maxFuelConsumption: 10,
            minDistance: 1,
            maxDistance: 50,
            Raincoat: false,
            Helmet: false,
            ReflectiveClothes: false,
            RepairKit: false,
            CaseTelephone: false,
            Bagage: false,
            orderBy: "",
        },
        validationSchema: Yup.object({
            address: Yup.string().required(t("postMotorbike.registedForm.addressRequired")),
            startDate: Yup.string().required(t("postMotorbike.registedForm.startDateRequired")),
            endDate: Yup.string().required(t("postMotorbike.registedForm.endDateRequired")),
        }),

        onSubmit: async (values, actions) => {
            getMotorbikesByFilter(values.startDate, values.endDate, values.address);
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
    // useEffect(() => { 
    //     getMotorbikesByFilter(convertTimestampToDate(Number(startDate)),convertTimestampToDate(Number(endDate)),address)
    // }, [startDate, endDate, address])

    useEffect(() => {
        getMotorbikesByFilter(
            values.startDate,
            values.endDate,
            values.address,
            values.maximumRating,
            values.electric,
            values.brandId,
            values.minPrice,
            values.maxPrice,
            values.minReleaseYear,
            values.maxReleaseYear,
            values.minFuelConsumption,
            values.maxFuelConsumption,
            values.minDistance,
            values.maxDistance,
            equipments,
            values.orderBy,
        );

    }, [
        values.orderBy,
    ]);

    const getMotorbikesByFilter = async (
        startDateTimeParam?: string,
        endDateTimeParam?: string,
        addressParam?: string,
        maximumRatingParam?: boolean,
        electricParam?: boolean,
        brandIdParam?: string,
        minPriceParam?: number,
        maxPriceParam?: number,
        minReleaseYearParam?: number,
        maxReleaseYearParam?: number,
        minFuelConsumptionParam?: number,
        maxFuelConsumptionParam?: number,
        minDistanceParam?: number,
        maxDistanceParam?: number,
        equipmentsParam?: string[],
        orderByParam?: string,
    ) => {
        // alert ("startDateTimeParam: " + startDateTimeParam + "endDateTimeParam: " + endDateTimeParam + "addressParam: " + addressParam) 
        setIsLoadingData(true); // Bắt đầu tải dữ liệu

        if (!startDateTimeParam || !endDateTimeParam || !addressParam) {
            setIsLoadingData(false); // Dừng tải dữ liệu
            return;
        }

        const formData: SearchMotorbikeRequest = {
            startDate: startDateTimeParam,
            endDate: endDateTimeParam,
            address: encodeURIComponent(addressParam),
            minPrice: minPriceParam,
            maxPrice: maxPriceParam,
            type: electricParam ? "Điện" : "",
            brandId: Number(brandIdParam),
            minReleaseYear: minReleaseYearParam,
            maxReleaseYear: maxReleaseYearParam,
            minFuelConsumption: minFuelConsumptionParam,
            maxFuelConsumption: maxFuelConsumptionParam,
            equipments: equipmentsParam?.join(','),
            minDistance: minDistanceParam,
            maxDistance: maxDistanceParam,
            maximumRating: maximumRatingParam,
            orderBy: orderByParam,
        }

        try {
            const response = await SearchMotorbikeServices.getMotorbikesByFilter(formData);
            setListMotorbikes(response);
        } catch (error) {
            console.log(error);
        }
        setIsLoadingData(false); // Dừng tải dữ liệu
    }

    // ADVANCED FILTER MODAL CONTROLLER
    useEffect(() => {
        getAllBrand();
        // getAllProvince();
    }, []);

    const getAllBrand = async () => {
        try {
            const response = await PostMotorbikeService.getAllBrand();
            if (response) {
                setListBrand(response);
            }
        } catch (error) {

        }
    }

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
            isChecked: values.maximumRating && values.electric
        },
        {
            key: '5star',
            value: 'Xe đạt đánh giá 5 sao',
            isChecked: values.maximumRating
        },
        {
            key: 'electric',
            value: 'Xe điện',
            isChecked: values.electric
        }
    ];

    // state for select options
    const [selectOptionsState, setSelectOptionsState] = useState(selectOptions);

    const checkSelectOptions: any = (key: string) => {
        const isAllUnchecked = selectOptionsState.every(option => option.key === 'all' || option.isChecked);

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
            isChecked: values.Raincoat && values.Helmet && values.ReflectiveClothes && values.RepairKit && values.CaseTelephone && values.Bagage
        },
        {
            key: 'Raincoat',
            value: 'Áo mưa',
            isChecked: values.Raincoat
        },
        {
            key: 'Helmet',
            value: 'Mũ bảo hiểm',
            isChecked: values.Helmet
        },

        {
            key: 'ReflectiveClothes',
            value: 'Dây đeo phản quang',
            isChecked: values.ReflectiveClothes
        },
        {
            key: 'RepairKit',
            value: 'Bộ dụng cụ sửa chữa',
            isChecked: values.RepairKit
        },
        {
            key: 'CaseTelephone',
            value: 'Giá đỡ điện thoại',
            isChecked: values.CaseTelephone
        },
        {
            key: 'Bagage',
            value: 'Baga sau',
            isChecked: values.Bagage
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

    const [libraries] = useState(['places']);
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string,
        libraries: libraries as any,
    });


    // declare vaiables
    const defaultLoction = useMemo(() => ({ lat: values.lat || 0, lng: values.lng || 0 }), []);
    const [selected, setSelected] = useState<Location>(defaultLoction!);
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
    const [price, setPrice] = React.useState<number[]>([1, 200]);

    const handlePriceChange = (event: Event, newValue: number | number[]) => {
        setPrice(newValue as number[]);
    };
    useEffect(() => {
        setFieldValue('minPrice', price[0]);
        setFieldValue('maxPrice', price[1]);
    }, [price]);

    const [releaseYear, setReleaseYear] = React.useState<number[]>([1990, currentYear]);
    const handleReleaseYearChange = (event: Event, newValue: number | number[]) => {
        setReleaseYear(newValue as number[]);

    }
    useEffect(() => {
        setFieldValue('minReleaseYear', releaseYear[0]);
        setFieldValue('maxReleaseYear', releaseYear[1]);
    }, [releaseYear]);

    const [fuelConsumption, setFuelConsumption] = React.useState<number[]>([1, 10]);
    const handleFuelConsumptionChange = (event: Event, newValue: number | number[]) => {
        setFuelConsumption(newValue as number[]);
        setFieldValue('minFuelConsumption', fuelConsumption[0]);
        setFieldValue('maxFuelConsumption', fuelConsumption[1]);
    }
    useEffect(() => {
        setFieldValue('minFuelConsumption', fuelConsumption[0]);
        setFieldValue('maxFuelConsumption', fuelConsumption[1]);
    }, [fuelConsumption]);


    const [maxDistance, setMaxDistance] = React.useState<number[]>([1, 50]);
    const handleMaxDistanceChange = (event: Event, newValue: number | number[]) => {
        setMaxDistance(newValue as number[]);
    }
    useEffect(() => {
        setFieldValue('minDistance', maxDistance[0]);
        setFieldValue('maxDistance', maxDistance[1]);
    }, [maxDistance]);

    // handle click reset filter
    const handleResetFilter = () => {
        setFieldValue('maximumRating', false);
        setFieldValue('electric', false);
        setFieldValue('brandId', "");
        setFieldValue('minPrice', 1);
        setFieldValue('maxPrice', 200);
        setFieldValue('minReleaseYear', 1990);
        setFieldValue('maxReleaseYear', currentYear);
        setFieldValue('minFuelConsumption', 1);
        setFieldValue('maxFuelConsumption', 10);
        setFieldValue('minDistance', 1);
        setFieldValue('maxDistance', 50);
        setFieldValue('Raincoat', false);
        setFieldValue('Helmet', false);
        setFieldValue('ReflectiveClothes', false);
        setFieldValue('RepairKit', false);
        setFieldValue('CaseTelephone', false);
        setFieldValue('Bagage', false);
        // setFieldValue('orderBy', '');
        checkSelectOptions('');
        checkFeatureOptions('');
        setPrice([1, 200]);
        setReleaseYear([1990, currentYear]);
        setFuelConsumption([1, 10]);
        setMaxDistance([1, 50]);
        setEquipments([]);
    }

    const handleSubmitSearch = () => {
        getMotorbikesByFilter(
            values.startDate,
            values.endDate,
            values.address,
            values.maximumRating,
            values.electric,
            values.brandId,
            values.minPrice,
            values.maxPrice,
            values.minReleaseYear,
            values.maxReleaseYear,
            values.minFuelConsumption,
            values.maxFuelConsumption,
            values.minDistance,
            values.maxDistance,
            equipments,
            values.orderBy,
        );
        closeAdvancedFilterModal();
    }

    const [anchorEls, setAnchorEls] = useState<Record<string, HTMLElement | null>>({});
    const [multipleMotorbikes, setMultipleMotorbikes] = useState<{ location: google.maps.LatLng; motorbikes: Motorbike[] } | null>(null);

    const handleMarkerClick = (motorbikeId: string, event: google.maps.MapMouseEvent) => {
        // Find all motorbikes at the clicked location
        const motorbikesAtLocation = listMotorbikes.filter((motorbike) => {
            const motorbikeLocation = motorbike.location.split(',');
            const clickedLocation = event.latLng?.toJSON();
            return (
                Number(motorbikeLocation[0]) === clickedLocation?.lat &&
                Number(motorbikeLocation[1]) === clickedLocation?.lng
            );
        });

        // If there is more than one motorbike at the location, set the state
        if (motorbikesAtLocation.length > 1) {
            setMultipleMotorbikes({ location: event.latLng!, motorbikes: motorbikesAtLocation });
            alert("Có nhiều xe ở địa điểm này");
        } else {
            setAnchorEls((prev) => ({ ...prev, [motorbikeId]: event.domEvent.currentTarget } as Record<string, HTMLElement | null>));
        }
    };

    const handleClosePopover = (motorbikeId: string) => {
        // Đóng Popover khi click bên ngoài
        setAnchorEls((prev) => ({ ...prev, [motorbikeId]: null } as Record<string, HTMLElement | null>));
    };

    const open = (motorbikeId: string) => Boolean(anchorEls[motorbikeId]);
    const id = (motorbikeId: string) => open(motorbikeId) ? `popover-${motorbikeId}` : undefined;

    const [modeMap, setSetModeMap] = useState(false);
    const handleChangeMode = () => {
        setSetModeMap(!modeMap);
        window.scrollTo({
            top: 86,
            behavior: 'smooth', // Optional: Adds smooth scrolling animation
        });
    }
    const [hoveredMarkerId, setHoveredMarkerId] = useState<number | null>(null);

    return (
        <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} height={modeMap ? "100vh" : "auto"}>
            {/* filter motorbikes */}
            <Box
                position={'sticky'}
                top={0}
                zIndex={1}
                sx={{
                    backgroundColor: '#fff'
                }}
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
                justifyContent={'center'}
                gap={'8px'}
                borderBottom={'1px solid #e0e0e0'}
                padding={isMobile ? "8px 16px" : "16px"}
                mx={isMobile ? "0px" : "64px"}
                boxShadow={
                    "0px 4px 4px rgba(0, 0, 0, 0.01)"
                }
            >
                {/* location and time */}
                <Box display={'flex'} flexDirection={isMobile ? 'column' : 'row'} alignItems={isMobile ? 'start' : 'center'} justifyContent={'center'} sx={{ gap: isMobile ? '8px' : '16px' }}>
                    {/* location */}
                    <Box width={isMobile ? "100%" : "auto"} display={'flex'} flexDirection={isMobile ? 'row' : 'column'} alignItems={'center'} justifyContent={isMobile ? 'space-between' : 'center'} sx={{ gap: '4px' }}>
                        <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'start'} sx={{ gap: '8px' }}>
                            <Typography color={theme.palette.text.primary} sx={{ fontSize: isMobile ? '12px' : '12px', fontWeight: "600", fontStyle: "italic" }}>
                                Địa điểm thuê xe:
                            </Typography>
                        </Box>
                        <Box
                            className={isMobile ? "custom-search-box-1" : "custom-search-box"}
                            display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'} sx={{ cursor: 'pointer', gap: '8px' }} padding={"4px 0px"}
                            onClick={openMapModal}
                        >
                            <LocationOnOutlined sx={{ color: theme.palette.action.disabled }} />
                            <Typography
                                color={theme.palette.text.primary}
                                sx={{ fontSize: isMobile ? '14px' : '16px', fontWeight: "400", minWidth: '100px', maxWidth: isMobile ? '175px' : '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
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
                    <Box width={isMobile ? "100%" : "auto"} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '4px' }}>
                        {/* white space */}
                        {!isMobile &&
                            (
                                <Box minHeight={"18px"} width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'} />
                            )
                        }
                        {/* search icon */}
                        <Box width={"100%"} display={'flex'} flexDirection={isMobile ? 'column' : 'row'} alignItems={'center'} justifyContent={'center'} sx={{ gap: isMobile ? '8px' : '8px' }}>

                            <MyCustomButton
                                width={isMobile ? "100%" : "20%"}
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
                            {!isMobile &&
                                (
                                    <Typography color={theme.palette.action.disabled} sx={{ fontSize: '14px', fontWeight: "400" }}>
                                        |
                                    </Typography>
                                )
                            }
                            <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '4px' }}>
                                {/* filter icon */}
                                <MyCustomButton
                                    width={isMobile ? "100%" : "auto"}
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
                                {!isMobile &&
                                    (
                                        <Typography color={theme.palette.text.primary} sx={{ fontSize: '14px', fontWeight: "400" }}>
                                            -
                                        </Typography>
                                    )
                                }
                                {/* sort field */}
                                <Box width={isMobile ? "100%" : "auto"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={isMobile ? 'space-between' : 'center'} sx={{ gap: '8px' }}>
                                    {!isMobile &&
                                        (
                                            <Typography color={theme.palette.text.primary} sx={{ whiteSpace: "nowrap", fontSize: '14px', fontWeight: "400" }}>
                                                Sắp xếp theo:
                                            </Typography>
                                        )
                                    }
                                    <Select
                                        labelId="demo-select-small-label"
                                        id="demo-select-small"
                                        native
                                        displayEmpty
                                        size='small'
                                        sx={{
                                            fontSize: '14px',
                                            borderRadius: '8px',
                                        }}
                                        name='orderBy'
                                        value={values.orderBy}
                                        onChange={(e: SelectChangeEvent) => {
                                            handleChange(e);
                                            setFieldValue('orderBy', e.target.value);
                                        }}
                                    >
                                        {sortOptions.map((option) => (
                                            <option style={{
                                                fontSize: isMobile ? '10px' : '14px',
                                                lineHeight: isMobile ? '4px' : '14px',
                                            }}
                                                key={option.key} value={option.key}>
                                                {option.value}
                                            </option>
                                        ))}
                                    </Select>
                                    {/* map mode */}
                                    {
                                        !isMobile && (

                                            <IconButton
                                                onClick={handleChangeMode}
                                            >
                                                {modeMap ?
                                                    <FormatListBulletedOutlined style={{ color: theme.palette.primary.main, }} /> : <MapOutlined style={{ color: theme.palette.primary.main, }} />}
                                            </IconButton>
                                        )
                                    }

                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
            {
                !modeMap || isMobile ? (
                    <>
                        <Box
                            zIndex={1}
                            sx={{
                                backgroundColor: '#f1f1f1',
                                transition: 'all 1s ease-in-out',
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
                                    <Box width={"90%"}>
                                        <LinearProgress />
                                    </Box>
                                ) : (
                                    listMotorbikes.length > 0 ? (
                                        <Box sx={{
                                            width: isMobile ? "80%" : "90%",
                                            minHeight: '65vh',
                                            mx: '',
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
                                                        <MotorbikeInforCard motorbike={item} isFavoritePage={false} startDate={values.startDate} endDate={values.endDate} searchedAddress={values.address} />
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
                    </>
                ) : (
                    <>
                        < Box
                            flex={1} position="relative"
                            borderRadius={"10px"}
                            border={"3px solid"}
                            margin={"0px auto"}
                            width={"90%"}
                            justifyContent={"center"}
                            alignItems={"center"}
                            flexDirection={"column"}
                            sx={{
                                transition: 'all 1s ease'
                            }}
                        >
                            <GoogleMap
                                zoom={13}
                                center={selected ? selected : defaultLocation}
                                mapContainerStyle={{
                                    width: "100%",
                                    height: "100%",
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
                                    fullscreenControl: true,
                                    scrollwheel: true,
                                    mapTypeControl: true,
                                    // draggableCursor: "default",
                                    noClear: true,
                                    styles: [
                                        {
                                            featureType: "poi",
                                            elementType: "labels",
                                            stylers: [{ visibility: "off" }],
                                        },
                                    ],

                                }}
                            >
                                <Marker position={selected} icon={SearchIcon} />
                                {listMotorbikes && (
                                    <MarkerClusterer
                                        options={{
                                            imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
                                        }}
                                        onClusteringEnd={() => {
                                            // Đóng tất cả các InfoWindow khi clustering kết thúc
                                            setHoveredMarkerId(null);
                                        }}
                                    >
                                        {(clusterer) => (
                                            <div>
                                                {listMotorbikes.map((motorbike: Motorbike, index: number) => (
                                                    <>

                                                        <Marker
                                                            key={motorbike.id}
                                                            position={
                                                                {
                                                                    lat: Number(motorbike.location.split(',')[0]),
                                                                    lng: Number(motorbike.location.split(',')[1])
                                                                }}
                                                            icon={{
                                                                url: PinImage,
                                                                scaledSize: hoveredMarkerId === motorbike.id
                                                                    ? new window.google.maps.Size(64, 64)
                                                                    : new window.google.maps.Size(48, 48),
                                                                // transition

                                                            }}
                                                            onMouseOver={() => {
                                                                if (motorbike.id)
                                                                    setHoveredMarkerId(motorbike.id)
                                                            }
                                                            }
                                                            onMouseOut={() => setHoveredMarkerId(null)}
                                                            onClick={(event) => {
                                                                if (motorbike.id)
                                                                    handleMarkerClick(motorbike.id.toString(), event)
                                                            }
                                                            }
                                                            clusterer={clusterer}
                                                        >
                                                            {hoveredMarkerId === motorbike.id && (
                                                                <InfoWindow
                                                                position={
                                                                    {
                                                                        lat: Number(motorbike.location.split(',')[0]),
                                                                        lng: Number(motorbike.location.split(',')[1])
                                                                    }}
                                                                options={{
                                                                    pixelOffset: new window.google.maps.Size(0, 20), // Điều chỉnh độ lệch theo nhu cầu của bạn
                                                                    zIndex: 1,
                                                                }}
                                                            >
                                                                <Typography variant="subtitle2"
                                                                    sx={{
                                                                        fontWeight: "700",
                                                                        color: "#000"
                                                                    }}>
                                                                    {motorbike.priceRent}K
                                                                </Typography>
                                                            </InfoWindow>
                                                            )}
                                                            {/*  */}
                                                        </Marker>
                                                        {
                                                            multipleMotorbikes ? (
                                                                <Box
                                                                    sx={{
                                                                        tabIndex: "0",
                                                                        position: "absolute",
                                                                        bottom: "0",
                                                                        left: "0",
                                                                        right: "0",
                                                                        maxWidth: "80vw",
                                                                        backgroundColor: "transparent",
                                                                        padding: "2",
                                                                        display: "flex",
                                                                        overflowX: "auto",
                                                                        gap: "32px",
                                                                        justifyContent: "center"
                                                                    }}
                                                                >
                                                                    {multipleMotorbikes.motorbikes.map((motorbike, index) => (
                                                                        <Box>
                                                                            <MotorbikeInforCard
                                                                                key={index}
                                                                                motorbike={motorbike}
                                                                                isFavoritePage={true}
                                                                                startDate={values.startDate}
                                                                                endDate={values.endDate}
                                                                                searchedAddress={values.address}
                                                                            />
                                                                        </Box>
                                                                    ))}
                                                                </Box>
                                                            ) : (
                                                                motorbike.id &&
                                                                <Popover
                                                                    id={id(motorbike.id?.toString())}
                                                                    open={open(motorbike.id?.toString())}
                                                                    anchorEl={anchorEls[motorbike.id?.toString()]}
                                                                    onClose={() => {
                                                                        if (motorbike.id)
                                                                            handleClosePopover(motorbike.id.toString())
                                                                    }
                                                                    }
                                                                    anchorOrigin={{
                                                                        vertical: "bottom",
                                                                        horizontal: "center",
                                                                    }}
                                                                    transformOrigin={{
                                                                        vertical: "top",
                                                                        horizontal: "center",
                                                                    }}
                                                                    sx={{
                                                                        "& .MuiPaper-root": {
                                                                            backgroundColor: "transparent",
                                                                            boxShadow: "none",
                                                                            borderRadius: "8px"
                                                                        },

                                                                    }}
                                                                >
                                                                    <Box
                                                                    >
                                                                        {/* Thêm thông tin của motorbike tại đây */}
                                                                        <MotorbikeInforCard motorbike={motorbike} isFavoritePage={false} startDate={values.startDate} endDate={values.endDate} searchedAddress={values.address} />
                                                                        {/* Thêm các thông tin khác nếu cần */}
                                                                    </Box>
                                                                </Popover>
                                                            )}
                                                        {/* ) */}
                                                    </>
                                                ))}
                                            </div>
                                        )}
                                    </MarkerClusterer>
                                )}
                                {/* Hiển thị thông tin trong Popover */}
                            </GoogleMap>
                        </Box></>
                )
            }


            {/* modal address */}
            <Modal
                open={isMapModalOpen}
                onClose={closeMapModal}
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
                                                width={"99%"}
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
                onClose={closeAdvancedFilterModal}
                aria-labelledby="map-modal-title"
                aria-describedby="map-modal-description"
                sx={{
                    display: 'flex',
                    alignItems: 'start',
                    justifyContent: 'center',
                    margin: '32px 0px',
                    overflowY: 'auto',
                }}>
                <Box width={isMobile ? "90%" : "50%"}
                    height={"auto"}
                    sx={{
                        padding: isMobile ? "8px 8px" : "16px 32px",
                        backgroundColor: 'white',
                        borderRadius: '8px',
                    }}>
                    <Box
                        top={16} width={"100%"} display={"flex"} flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"} pb={"8px"} borderBottom={"1px solid #e0e0e0"}>
                        <Typography variant='h2' color={theme.palette.text.primary} fontSize={isMobile ? "20px" : "24px"} ml={isMobile ? "8px" : "0px"} fontWeight={600} textAlign={"start"}>
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
                                <Typography variant='h2' color={theme.palette.text.primary} fontSize={"16px"} fontWeight={600} textAlign={"start"}>
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
                                                setFieldValue('maximumRating', false);
                                                setFieldValue('electric', false);
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
                                                // get ischecked of all selectOptions and set setFieldValue for maximumRating and electric follow selectOptionsState of all
                                                const isAllUnchecked = selectOptionsState.every(option => option.key === 'all' || option.isChecked);
                                                if (isAllUnchecked) {
                                                    setFieldValue('maximumRating', true);
                                                    setFieldValue('electric', true);
                                                } else {
                                                    setFieldValue('maximumRating', false);
                                                    setFieldValue('electric', false);
                                                }
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
                                            setFieldValue('maximumRating', !values.maximumRating);
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
                                            setFieldValue('electric', !values.electric);
                                        }
                                    } />
                            </Box>
                        </Box>
                        {/* Hãng xe và mẫu xe */}
                        <Box width={"100%"} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '8px' }}>
                            <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }}>
                                {/* tilte */}
                                <Typography variant='h2' color={theme.palette.text.primary} fontSize={"16px"} fontWeight={600} textAlign={"start"}>
                                    {"Hãng xe"}
                                </Typography>
                            </Box>
                            <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'}>
                                {/* price */}
                                <Select
                                    sx={{
                                        borderRadius: '8px',
                                    }}
                                    fullWidth
                                    displayEmpty
                                    name="brandId"
                                    value={values.brandId}
                                    onChange={handleChange}
                                >
                                    <MenuItem key={0} value="">
                                        <em>{t("postMotorbike.registedForm.brandPlaceHolder")}</em>
                                    </MenuItem>
                                    {listBrand.map((brand) => (
                                        <MenuItem key={brand.id} value={brand.id}>
                                            {brand.brandName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Box>
                        </Box>
                        {/* box price */}
                        <Box width={"100%"} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '4px' }}>
                            <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }}>
                                {/* tilte */}
                                <Typography variant='h2' color={theme.palette.text.primary} fontSize={"16px"} fontWeight={600} textAlign={"start"}>
                                    {"Giới hạn giá"}
                                </Typography>
                            </Box>
                            <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'}>
                                {/* price */}
                                <Box sx={{ width: "97%" }}>
                                    <Slider
                                        aria-label='Price'
                                        value={price}
                                        max={200}
                                        step={1}
                                        min={1}
                                        valueLabelFormat={formatMoney}
                                        onChange={handlePriceChange}
                                        valueLabelDisplay="auto"
                                    />
                                </Box>
                            </Box>
                            <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }}>
                                <Box display={'flex'} flexDirection={isMobile ? 'column' : 'row'} alignItems={'start'} justifyContent={'space-between'} sx={{ gap: '8px' }} border={'1px solid #e0e0e0'} borderRadius={'8px'} padding={'8px'} >
                                    <Typography color={theme.palette.text.primary} sx={{ fontSize: '14px', fontWeight: "400" }}>
                                        Tối thiểu:
                                    </Typography>
                                    <Typography color={theme.palette.text.primary} sx={{ fontSize: '14px', fontWeight: "400" }}>
                                        {formatMoney(price[0])}
                                    </Typography>
                                </Box>
                                <Box display={'flex'} flexDirection={isMobile ? 'column' : 'row'} alignItems={'start'} justifyContent={'space-between'} sx={{ gap: '8px' }} border={'1px solid #e0e0e0'} borderRadius={'8px'} padding={'8px'} >
                                    <Typography color={theme.palette.text.primary} sx={{ fontSize: '14px', fontWeight: "400" }}>
                                        Tối đa:
                                    </Typography>
                                    <Typography color={theme.palette.text.primary} sx={{ fontSize: '14px', fontWeight: "400" }}>
                                        {formatMoney(price[1])}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                        {/* Năm sản xuất */}
                        <Box width={"100%"} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} sx={{ gap: '4px' }}>
                            <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }}>
                                {/* tilte */}
                                <Typography variant='h2' color={theme.palette.text.primary} fontSize={"16px"} fontWeight={600} textAlign={"start"}>
                                    {"Năm sản xuất"}
                                </Typography>
                            </Box>
                            <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'}>
                                {/* price */}
                                <Box sx={{ width: "97%" }}>
                                    <Slider
                                        aria-label="Release year"
                                        value={releaseYear}
                                        onChange={handleReleaseYearChange}
                                        valueLabelDisplay="auto"
                                        max={currentYear}
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
                                <Typography variant='h2' color={theme.palette.text.primary} fontSize={"16px"} fontWeight={600} textAlign={"start"}>
                                    {"Mức tiêu thụ nhiên liệu"}
                                </Typography>
                            </Box>
                            <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'}>
                                {/* price */}
                                <Box sx={{ width: "97%" }}>
                                    <Slider
                                        aria-label="Fuel consumption"
                                        value={fuelConsumption}
                                        onChange={handleFuelConsumptionChange}
                                        valueLabelDisplay="auto"
                                        max={10}
                                        min={1}
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
                                <Typography variant='h2' color={theme.palette.text.primary} fontSize={"16px"} fontWeight={600} textAlign={"start"}>
                                    {"Khoảng cách"}
                                </Typography>
                            </Box>
                            <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'}>
                                {/* price */}
                                <Box sx={{ width: "97%" }}>
                                    <Slider
                                        aria-label="Max distance"
                                        valueLabelDisplay="auto"
                                        value={maxDistance}
                                        onChange={handleMaxDistanceChange}
                                        max={50}
                                        min={1}
                                    />
                                </Box>
                            </Box>
                            <Box width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ gap: '8px' }}>
                                <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'start'} sx={{ gap: '8px' }} border={'1px solid #e0e0e0'} borderRadius={'8px'} padding={'8px'} >
                                    <Typography color={theme.palette.text.primary} sx={{ fontSize: '14px', fontWeight: "400" }}>
                                        Tối thiểu:
                                    </Typography>
                                    <Typography color={theme.palette.text.primary} sx={{ fontSize: '14px', fontWeight: "400" }}>
                                        {maxDistance[0]}km
                                    </Typography>
                                </Box>
                                <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'start'} sx={{ gap: '8px' }} border={'1px solid #e0e0e0'} borderRadius={'8px'} padding={'8px'} >
                                    <Typography color={theme.palette.text.primary} sx={{ fontSize: '14px', fontWeight: "400" }}>
                                        Tối đa:
                                    </Typography>
                                    <Typography color={theme.palette.text.primary} sx={{ fontSize: '14px', fontWeight: "400" }}>
                                        {maxDistance[1]}km
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                        {/* Loại nhiên liệu */}
                        {/* Các tính năng */}
                        <Box width={"100%"} display={"flex"} flexDirection={"column"} justifyContent={"space-between"} alignItems={"center"} sx={{ gap: '8px' }}>
                            <Box width={"100%"} display={"flex"} flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"}>
                                {/* tilte */}
                                <Typography variant='h2' color={theme.palette.text.primary} fontSize={"16px"} fontWeight={600} textAlign={"start"}>
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
                                                setFieldValue('Helmet', false);
                                                setFieldValue('Raincoat', false);
                                                setFieldValue('ReflectiveClothes', false);
                                                setFieldValue('RepairKit', false);
                                                setFieldValue('CaseTelephone', false);
                                                setFieldValue('Bagage', false);
                                                // remove all feature options from values.equipments
                                                setEquipments([]);
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
                                                // add or remove all feature options to values.equipments accept first option and setFieldValue
                                                const updatedEquipments = equipments.includes('Helmet') && equipments.includes('Raincoat') && equipments.includes('ReflectiveClothes') && equipments.includes('RepairKit') && equipments.includes('CaseTelephone') && equipments.includes('Bagage')
                                                    ? equipments.filter((equipment) => equipment !== 'Helmet' && equipment !== 'Raincoat' && equipment !== 'ReflectiveClothes' && equipment !== 'RepairKit' && equipment !== 'CaseTelephone' && equipment !== 'Bagage')
                                                    : [...equipments, 'Helmet', 'Raincoat', 'ReflectiveClothes', 'RepairKit', 'CaseTelephone', 'Bagage'];

                                                setEquipments(updatedEquipments);
                                            }
                                        } />

                                </Box>
                            </Box>
                            {/* content */}
                            <Box width={"100%"} display={"flex"} flexDirection={"column"} sx={{ gap: '8px' }}>
                                <Box display={"flex"} flexWrap={'wrap'} flexDirection={"row"} justifyContent={"space"} alignItems={"center"} sx={{
                                    gap: '8px',
                                }} >
                                    {
                                        featureOptionsState.map((option, index) => (
                                            option.key !== 'all' && (
                                                <MyCustomButton
                                                    width='210px'
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
                                                            // add or remove feature options to values.equipments
                                                            if (option.key === 'Helmet' || option.key === 'Raincoat' || option.key === 'ReflectiveClothes' || option.key === 'RepairKit' || option.key === 'CaseTelephone' || option.key === 'Bagage') {
                                                                const updatedEquipments = equipments.includes(option.key)
                                                                    ? equipments.filter((equipment) => equipment !== option.key)
                                                                    : [...equipments, option.key];

                                                                setEquipments(updatedEquipments);
                                                            }
                                                        }
                                                    } />
                                            )))
                                    }
                                </Box>

                                {/* <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"} sx={{ gap: '8px' }}>
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
                                                            // add or remove feature options to values.equipments
                                                            if (option.key === 'RepairKit' || option.key === 'CaseTelephone' || option.key === 'Bagage') {
                                                                const updatedEquipments = equipments.includes(option.key)
                                                                    ? equipments.filter((equipment) => equipment !== option.key)
                                                                    : [...equipments, option.key];

                                                                setEquipments(updatedEquipments);
                                                            }
                                                        }
                                                    } />
                                            )))
                                    }
                                </Box> */}
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
                                        handleResetFilter();
                                    }
                                } />
                            <MyCustomButton
                                borderRadius={8}
                                fontWeight={400}
                                fontSize={14}
                                content={"Áp dụng bộ lọc"}
                                onClick={
                                    () => {
                                        handleSubmitSearch();
                                    }
                                } />
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </Box >
    )
}
