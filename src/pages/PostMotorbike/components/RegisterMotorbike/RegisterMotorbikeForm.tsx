import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, CircularProgress, FormControl, Grid, IconButton, ImageList, ImageListItem, InputLabel, List, MenuItem, Modal, Select, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import RegisterMotorbikeItem from './RegisterMotorbikeItem';
import { CloseOutlined, ForkRight, Map, MyLocation } from '@mui/icons-material';
import MyCustomButton from '../../../../components/common/MyButton';
import theme from '../../../../utils/theme';
import { PostMotorbikeService } from '../../../../services/PostMotorbikeService';
import { Brand, District, ImageUpload, Model, MotorbikeRequest, Province } from '../../../../utils/type';
import { ProvincesService } from '../../../../services/ProvincesService';
import { CartIcon, HelmetIcon, ProtectClothesIcon, RainCoatIcon, RepairIcon, TelephoneIcon } from '../../../../assets/icons';
import EquipmentItem from './EquipmentItem';
import ToastComponent from '../../../../components/toast/ToastComponent';
import MyMapWithSearchBox from '../../../../components/common/MyMapWithSearchBox';
import MyIcon from '../../../../components/common/MyIcon';
import { useFormik } from 'formik';
import { GoogleMap, Libraries, Marker, useLoadScript } from '@react-google-maps/api';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import usei18next from '../../../../hooks/usei18next';
import ErrorMessage from '../../../../components/common/ErrorMessage';
import * as Yup from "yup";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import UploadImageService from '../../../../services/UploadImageService';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../../../../utils/Constant';
import useThemePage from '../../../../hooks/useThemePage';
import Editor from '../../../../components/common/Editor';



const RegisterMotorbikeForm = () => {

    const navigate = useNavigate();
    const { t } = usei18next();
    const { isMobile } = useThemePage();
    const { id } = useParams();
    const [listProvince, setListProvince] = useState<Province[]>([]);
    const [listDistrict, setListDistrict] = useState<Province>();
    const [listWard, setListWard] = useState<District>();
    const [listBrand, setListBrand] = useState<Brand[]>([]);
    const [listModel, setListModel] = useState<Model[]>([]);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const [isMapModalOpen, setMapModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [canSubmitting, setCanSubmitting] = useState(false);
    const [listImageFiles, setListImageFiles] = useState<File[]>([]);
    const [getBrandName, setGetBrandName] = useState("");
    const [getModelName, setGetModelName] = useState("");


    const MAX_IMAGES = 12;
    const MAX_IMAGE_SIZE_MB = 10;

    interface Location {
        lat: number;
        lng: number;
    }

    // default list year from 1990 to current year
    const listYear = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const listYear = [];
        for (let i = currentYear; i >= 1990; i--) {
            listYear.push({ key: i, value: i });
        }
        return listYear;
    }, []);

    // default list fuel has same key and value
    const listFuel = useMemo(() => {
        return [
            { key: "Xăng", value: "Xăng" },
            { key: "Điện", value: "Điện" }
        ];
    }, []);

    useEffect(() => {
        if (id) {
            getMotorbikeById(id);
        }
    }, [id]);

    const getMotorbikeById = async (id: string) => {
        try {
            const response = await PostMotorbikeService.getMotorbikeById(id);
            if (response) {
                const motorbike = response;
                const imageList = motorbike.imageUrl;
                setSelectedImages(imageList);
                setSelectedItems(motorbike.equipments.split(","));
                setCanSubmitting(false);
                setFieldValue("licensePlate", motorbike.licensePlate);
                setFieldValue("images", motorbike.image.split(","));
                setFieldValue("brand", motorbike.model.brand.id);
                setFieldValue("model", motorbike.model.id);
                setFieldValue("year", motorbike.releaseYear);
                setFieldValue("fuel", motorbike.type);
                setFieldValue("defaultPrice", motorbike.priceRent);
                setFieldValue("fuelConsumption", motorbike.fuelConsumption);
                setFieldValue("maxDeliveryDistance", motorbike.maxDeliveryDistance);
                setFieldValue("freeDeliveryRange", motorbike.freeDeliveryRange);
                setFieldValue("feeOfDeliveryPerKm", motorbike.feeOfDeliveryPerKm);
                setFieldValue("province", motorbike.provinceId);
                setFieldValue("district", motorbike.districtId);
                setFieldValue("ward", motorbike.wardId);
                setFieldValue("address", motorbike.address);
                setFieldValue("lat", motorbike.location.split(",")[0]);
                setFieldValue("lng", motorbike.location.split(",")[1]);
                setFieldValue("description", motorbike.description);
                setFieldValue("miscellaneous", motorbike.miscellaneous);
                setFieldValue("raincoat", motorbike.equipments.includes("Raincoat"));
                setFieldValue("helmet", motorbike.equipments.includes("Helmet"));
                setFieldValue("reflectiveClothes", motorbike.equipments.includes("ReflectiveClothes"));
                setFieldValue("bagage", motorbike.equipments.includes("Bagage"));
                setFieldValue("repairKit", motorbike.equipments.includes("RepairKit"));
                setFieldValue("caseTelephone", motorbike.equipments.includes("CaseTelephone"));
                setValue(motorbike.address, false);
            }
        } catch (error) {

        }
    }

    const formik = useFormik({
        initialValues: {
            licensePlate: "",
            images: [],
            brand: "",
            model: "",
            year: "",
            fuel: "",
            fuelConsumption: "3",
            maxDeliveryDistance: 20,
            freeDeliveryRange: 10,
            feeOfDeliveryPerKm: 4000,
            description: "",
            raincoat: false,
            helmet: false,
            reflectiveClothes: false,
            bagage: false,
            repairKit: false,
            caseTelephone: false,
            defaultPrice: "120",
            province: "",
            district: "",
            ward: "",
            address: "",
            lat: 21,
            lng: 105,
            miscellaneous: ""
        },
        validationSchema: Yup.object({
            licensePlate: Yup.string()
                .required(t("form.required")),
            images: Yup.array()
                .min(1, "Bạn phải nhập ảnh cho xe")
                .max(12, "Bạn chỉ có thể nhập tối đa 12 ảnh"),
            brand: Yup.string()
                .required("Bạn phải chọn hãng xe"),
            model: Yup.string()
                .required("Bạn phải chọn mẫu xe"),
            year: Yup.string()
                .required("Bạn phải chọn năm sản xuất"),
            fuel: Yup.string()
                .required("Bạn phải chọn loại nhiên liệu"),
            defaultPrice: Yup.string()
                .required("Bạn phải nhập giá thuê mặc định"),
            address: Yup.string()
                .required("Bạn phải nhập vị trí mặc định của xe"),
            province: Yup.string()
                .required("Bạn phải chọn tỉnh/thành phố"),
            district: Yup.string()
                .required("Bạn phải chọn quận/huyện"),
            ward: Yup.string()
                .required("Bạn phải chọn phường/xã"),
            maxDeliveryDistance: Yup.number()
                .required("Bạn phải nhập khoảng cách giao xe tối đa")
                .max(50, "Bạn chỉ có thể nhập tối đa 50 km")
                .min(1, "Bạn phải nhập ít nhất 1 km"),
            freeDeliveryRange: Yup.number()
                .required("Bạn phải nhập khoảng cách giao xe miễn phí")
                .max(50, "Bạn chỉ có thể nhập tối đa 50 km")
                .min(1, "Bạn phải nhập ít nhất 1 km")
                .concat(Yup.number().max(Yup.ref('maxDeliveryDistance'), "Khoảng cách giao xe miễn phí phải nhỏ hơn khoảng cách giao xe tối đa")),
            feeOfDeliveryPerKm: Yup.number()
                .required("Bạn phải nhập phí giao xe /km")
                .max(10000, "Bạn chỉ có thể nhập tối đa 10000 đ/km")
                .min(1000, "Bạn phải nhập ít nhất 1000 đ/km"),
        }),

        onSubmit: async (values, actions) => {
            try {
                setCanSubmitting(true);
                const imageString = values.images.join(",");
                const equipmentsString = selectedItems.join(",");
                const formSubmit: MotorbikeRequest = {
                    licensePlate: values.licensePlate,
                    releaseYear: Number(values.year),
                    type: values.fuel,
                    priceRent: Number(values.defaultPrice),
                    equipments: equipmentsString,
                    fuelConsumption: Number(values.fuelConsumption),
                    maxDeliveryDistance: Number(values.maxDeliveryDistance),
                    freeDeliveryRange: Number(values.freeDeliveryRange),
                    feeOfDeliveryPerKm: Number(values.feeOfDeliveryPerKm),
                    provinceId: Number(values.province),
                    districtId: Number(values.district),
                    wardId: Number(values.ward),
                    image: imageString,
                    address: values.address,
                    location: values.lat + "," + values.lng,
                    modelId: Number(values.model),
                    description: values.description === "" ? (getBrandName + " " + getModelName + " " + values.year) : values.description,
                    miscellaneous: values.miscellaneous === "" ? t("postMotorbike.registedForm.terms_and_conditions") : values.miscellaneous,
                }

                if (id) {
                    formSubmit.id = Number(id);
                    const response = await PostMotorbikeService.updateMotorbike(formSubmit);
                    const params: ImageUpload = {
                        tableName: 'motorbike',
                        columnName: 'image',
                        code: response,
                        fileName: "images.zip",
                    };
                    if (listImageFiles.length > 0) {
                        await handleZipImages(params);
                    }

                } else {
                    const response = await PostMotorbikeService.postMotorbike(formSubmit);
                    const params: ImageUpload = {
                        tableName: 'motorbike',
                        columnName: 'image',
                        code: response,
                        fileName: "images.zip",
                    };
                    if (listImageFiles.length > 0) {
                        await handleZipImages(params);
                    }
                }
                if (id) {
                    ToastComponent(t('postMotorbike.registedForm.update_success'), 'success');
                } else {
                    ToastComponent(t('postMotorbike.registedForm.register_success'), 'success');
                }
                // wait 2s to upload image
                setTimeout(() => {
                    navigate(ROUTES.user.listmotorbike);
                }, 2000);

            } catch (error) {
                if (id) {
                    ToastComponent(t('postMotorbike.registedForm.update_fail'), 'error');
                } else {
                    ToastComponent(t('postMotorbike.registedForm.register_fail'), 'error');
                }
                setCanSubmitting(false);
            }
            finally {
            }
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


    // EQUIPMENT CONTROLLER
    const handleItemClick = (itemLabel: string) => {
        if (selectedItems.includes(itemLabel)) {
            // Nếu mục đã được chọn, hãy loại bỏ nó khỏi mảng selectedItems
            setSelectedItems(selectedItems.filter(item => item !== itemLabel));
            if (itemLabel === "Raincoat") {
                setFieldValue("raincoat", false);
            }
            if (itemLabel === "Helmet") {
                setFieldValue("helmet", false);
            }
            if (itemLabel === "ReflectiveClothes") {
                setFieldValue("reflectiveClothes", false);
            }
            if (itemLabel === "Bagage") {
                setFieldValue("bagage", false);
            }
            if (itemLabel === "RepairKit") {
                setFieldValue("repairKit", false);
            }
            if (itemLabel === "CaseTelephone") {
                setFieldValue("caseTelephone", false);
            }
        } else {
            // Nếu mục chưa được chọn, hãy thêm nó vào mảng selectedItems
            setSelectedItems([...selectedItems, itemLabel]);
            if (itemLabel === "Raincoat") {
                setFieldValue("raincoat", true);
            }
            if (itemLabel === "Helmet") {
                setFieldValue("helmet", true);
            }
            if (itemLabel === "ReflectiveClothes") {
                setFieldValue("reflectiveClothes", true);
            }
            if (itemLabel === "Bagage") {
                setFieldValue("bagage", true);
            }
            if (itemLabel === "RepairKit") {
                setFieldValue("repairKit", true);
            }
            if (itemLabel === "CaseTelephone") {
                setFieldValue("caseTelephone", true);
            }
        }
    };

    const getAllBrand = async () => {
        try {
            const response = await PostMotorbikeService.getAllBrand();
            if (response) {
                setListBrand(response);
            }
        } catch (error) {

        }
    }

    const getAllProvince = async () => {
        try {
            const response = await ProvincesService.getAllProvinces();
            if (response) {
                setListProvince(response);
            }
        } catch (error) {

        }
    }

    useEffect(() => {
        getAllBrand();
        getAllProvince();
    }, []);

    useEffect(() => {
        setGetBrandName(listBrand.find((brand) => brand.id === Number(values.brand))?.brandName || "");
        if (values.brand === "") {
            setFieldValue("model", "");
        }
        if (values.brand !== "") {
            PostMotorbikeService.getModelByBrandId(values.brand).then((res) => {
                if (res.length > 0) {
                    setListModel(res);
                }
            });
        }
    }, [values.brand]);

    useEffect(() => {
        setGetModelName(listModel.find((model) => model.id === Number(values.model))?.modelName || "");
    }, [values.model]);

    useEffect(() => {
        if (values.province === "") {
            setFieldValue("district", "");
            setFieldValue("ward", "");
        }
        if (values.province !== "") {
            ProvincesService.getDistrictsByProvince(values.province).then((res) => {
                setListDistrict(res);

            });
        }
    }, [values.province]);
    useEffect(() => {
        if (values.district === "") {
            setFieldValue("ward", "");
        }
        if (values.district !== "") {
            ProvincesService.getWardsByDistrict(values.district).then((res) => {
                setListWard(res);
            });
        }
    }, [values.district]);

    // IMAGE CONTROLLER
    const handleAddImages = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleImageSelection = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const imageFiles: File[] = Array.from(files);
            if (selectedImages.length + imageFiles.length <= MAX_IMAGES) {
                const isValidSize = imageFiles.every((file) => file.size / (1024 * 1024) <= MAX_IMAGE_SIZE_MB);
                if (isValidSize) {
                    const imageFilesString = imageFiles.map((image) => URL.createObjectURL(image));
                    const imageFilesName = imageFiles.map((image) => image.name);
                    setSelectedImages((prevImages) => [...prevImages, ...imageFilesString]);
                    setListImageFiles([...listImageFiles, ...imageFiles]);
                    setFieldValue("images", [...values.images, ...imageFilesName]);
                } else {
                    ToastComponent(`Kích thước ảnh không được vượt quá ${MAX_IMAGE_SIZE_MB}MB`, "error",);
                }
            } else {
                ToastComponent(`Bạn chỉ có thể chọn tối đa ${MAX_IMAGES} ảnh`, "error",);
            }
        }
    };

    // zip all images into a single file
    const handleZipImages = async (params: ImageUpload) => {
        try {
            const responseUrl = await UploadImageService.generateUrlUpload(params);
            if (responseUrl.status !== 200) {
                ToastComponent(t('toast.uploadImage.error'), 'error');
                return;
            }
            const urlUpload = responseUrl.data.uploadUrl;
            const zip = new JSZip();
            listImageFiles.forEach((image) => {
                zip.file(image.name, image);
            });
            zip.generateAsync({ type: "blob" }).then((content) => {
                UploadImageService.uploadZipFile(urlUpload, content).then((responseUpload) => {
                    UploadImageService.extractFolder(params).then((responseUnzip) => {
                        if (responseUnzip.status !== 200) {
                            ToastComponent(t('toast.uploadImage.error'), 'error');
                            return;
                        }
                    });
                });
            });
        } catch (error) {

        }
    };

    const handleRemoveImage = (indexToRemove: number) => {
        const updatedImages = selectedImages.filter((_, index) => index !== indexToRemove);
        const updatedImagesName = values.images.filter((_, index) => index !== indexToRemove);
        setSelectedImages(updatedImages);
        setFieldValue("images", updatedImagesName)
    };

    // MODAL CONTROLLER
    const openModal = (index: number) => {
        setSelectedImageIndex(index);
    };

    const closeModal = () => {
        setSelectedImageIndex(null);
    };

    const openMapModal = () => {
        setMapModalOpen(true);
    };

    const closeMapModal = () => {
        setMapModalOpen(false);
    };

    // MAP CONTROLLER

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string,
        libraries: ["places"],
    });

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
        <Box width={"100%"}>
            <Box>
                <RegisterMotorbikeItem
                    title={t("postMotorbike.registedForm.licensePlate")}
                    isRequired={true}
                    item={
                        <TextField
                            sx={{
                                "& .MuiOutlinedInput-root fieldset": { borderRadius: "8px" },
                                "& .MuiOutlinedInput-root:hover fieldset": {
                                    borderColor: theme.palette.primary.main,
                                },
                                "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                                    borderColor: theme.palette.primary.main,
                                }
                            }}
                            name='licensePlate'
                            value={values.licensePlate}
                            onChange={handleChange}
                            fullWidth
                            placeholder={t("postMotorbike.registedForm.licensePlatePlaceHolder")}
                        />
                    }
                />
                {errors.licensePlate && touched.licensePlate && (
                    <ErrorMessage message={errors.licensePlate} />
                )}
                <RegisterMotorbikeItem
                    title={t("postMotorbike.registedForm.image")}
                    isRequired={true}
                    secondTitle={t("postMotorbike.registedForm.imageSecondTitle")}
                    item={
                        <ImageList
                            sx={{ borderRadius: '8px', border: '2px solid #E0E0E0', width: '100%', height: 300 }}
                            cols={3}
                            variant="quilted"
                            rowHeight={165}

                        >
                            {selectedImages.map((image, index) => (
                                <ImageListItem
                                    key={index}
                                    cols={1}
                                    rows={1}
                                >
                                    <img
                                        onClick={() => openModal(index)}
                                        style={{ borderRadius: '4px', border: '1px solid #E0E0E0' }}
                                        src={image}
                                        alt={`Selected Image ${index + 1}`}
                                        loading="lazy"
                                    />
                                    <Box
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                            color: '#fff',
                                            padding: '4px',
                                            borderBottomLeftRadius: '4px',
                                        }}
                                        onClick={() => handleRemoveImage(index)}
                                    >
                                        <CloseOutlined />
                                    </Box>
                                    <Box
                                        style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            backgroundColor: '#8B4513',
                                            color: '#fff',
                                            padding: '4px 8px',
                                            margin: '8px',
                                            borderRadius: '100px',
                                            fontSize: '12px',
                                        }}
                                    >
                                        {index + 1}
                                    </Box>
                                </ImageListItem>

                            ))}
                        </ImageList>
                    }
                    myButton={
                        <Box width={"100%"}>
                            <MyCustomButton
                                borderRadius={8}
                                fontSize={16}
                                fontWeight={600}
                                content={t("postMotorbike.registedForm.imageButton")}
                                onClick={handleAddImages}
                            />
                            <input
                                aria-label='btn-add-image'
                                type="file"
                                accept="image/*"
                                multiple
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleImageSelection}
                            />
                        </Box>
                    }
                />
                {errors.images && touched.images && (
                    <ErrorMessage message={errors.images} />
                )}

                <RegisterMotorbikeItem
                    title={t("postMotorbike.registedForm.basicInfo")}
                    marginBottomTitle='0px'
                    isRequired={true}
                    item={
                        <Box sx={{ width: '100%' }}>
                            <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                <Grid item xs={isMobile ? 12 : 6}>
                                    <RegisterMotorbikeItem
                                        title={t("postMotorbike.registedForm.brand")}
                                        fontSizeTitle='20px'
                                        fontWeightTitle={500}
                                        isRequired={false}
                                        item={
                                            <Select
                                                sx={{
                                                    borderRadius: '8px',
                                                }}

                                                fullWidth
                                                displayEmpty
                                                name="brand"
                                                value={values.brand}
                                                onChange={handleChange}
                                            >
                                                <MenuItem value="">
                                                    <em>{t("postMotorbike.registedForm.brandPlaceHolder")}</em>
                                                </MenuItem>
                                                {listBrand.map((brand) => (
                                                    <MenuItem key={brand.id} value={brand.id}>
                                                        {brand.brandName}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        }
                                    />
                                    {errors.brand && touched.brand && (
                                        <ErrorMessage message={errors.brand} />
                                    )}
                                </Grid>
                                <Grid item xs={isMobile ? 12 : 6}>
                                    <RegisterMotorbikeItem
                                        title={t("postMotorbike.registedForm.model")}
                                        fontSizeTitle='20px'
                                        fontWeightTitle={500}
                                        isRequired={false}
                                        item={
                                            <Select
                                                sx={{

                                                    borderRadius: '8px',
                                                }}
                                                fullWidth
                                                disabled={values.brand === ""}
                                                displayEmpty
                                                name="model"
                                                value={values.model}
                                                onChange={handleChange}
                                            >
                                                <MenuItem value="">
                                                    <em>{t("postMotorbike.registedForm.modelPlaceHolder")}</em>
                                                </MenuItem>
                                                {
                                                    listModel.map((model) => (
                                                        <MenuItem key={model.id} value={model.id}>
                                                            {model.modelName}
                                                        </MenuItem>
                                                    ))
                                                }
                                            </Select>
                                        }
                                    />
                                    {errors.model && touched.model && (
                                        <ErrorMessage message={errors.model} />
                                    )}
                                </Grid>
                                <Grid item xs={isMobile ? 12 : 6}>
                                    <RegisterMotorbikeItem
                                        title={t("postMotorbike.registedForm.year")}
                                        fontSizeTitle='20px'
                                        fontWeightTitle={500}
                                        isRequired={false}
                                        item={
                                            <Select
                                                sx={{

                                                    borderRadius: '8px',
                                                }}
                                                fullWidth
                                                displayEmpty
                                                name="year"
                                                value={values.year}
                                                onChange={handleChange}
                                            >
                                                <MenuItem value="">
                                                    <em>{t("postMotorbike.registedForm.yearPlaceHolder")}</em>
                                                </MenuItem>
                                                {
                                                    listYear.map((year) => (
                                                        <MenuItem key={year.key} value={year.value}>
                                                            {year.value}
                                                        </MenuItem>
                                                    ))
                                                }
                                            </Select>
                                        }
                                    />
                                    {errors.year && touched.year && (
                                        <ErrorMessage message={errors.year} />
                                    )}
                                </Grid>
                                <Grid item xs={isMobile ? 12 : 6}>
                                    <RegisterMotorbikeItem
                                        title={t("postMotorbike.registedForm.fuel")}
                                        fontSizeTitle='20px'
                                        fontWeightTitle={500}
                                        isRequired={false}
                                        item={
                                            <Select
                                                sx={{

                                                    borderRadius: '8px',
                                                }}
                                                fullWidth
                                                displayEmpty
                                                name="fuel"
                                                value={values.fuel}
                                                onChange={handleChange}
                                            >
                                                <MenuItem value="">
                                                    <em>{t("postMotorbike.registedForm.fuelPlaceHolder")}</em>
                                                </MenuItem>
                                                {
                                                    listFuel.map((fuel) => (
                                                        <MenuItem key={fuel.key} value={fuel.value}>
                                                            {fuel.value}
                                                        </MenuItem>
                                                    ))
                                                }
                                            </Select>
                                        }
                                    />
                                    {errors.fuel && touched.fuel && (
                                        <ErrorMessage message={errors.fuel} />
                                    )}
                                </Grid>
                                <Grid item xs={isMobile ? 12 : 6}>
                                    <RegisterMotorbikeItem
                                        title={t("postMotorbike.registedForm.fuelConsumption")}
                                        fontSizeTitle='20px'
                                        fontWeightTitle={500}
                                        marginBottomTitle='8px'
                                        isRequired={false}
                                        secondTitle={t("postMotorbike.registedForm.fuelConsumptionSecondTitle")}
                                        fontSizeSecondTitle='16px'
                                        fontWeightSecondTitle={400}
                                        item={
                                            <TextField
                                                sx={{
                                                    "& .MuiOutlinedInput-root fieldset": { borderRadius: "8px" },
                                                    "& .MuiOutlinedInput-root:hover fieldset": {
                                                        borderColor: theme.palette.primary.main,
                                                    },
                                                    "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                                                        borderColor: theme.palette.primary.main,
                                                    }
                                                }}
                                                name='fuelConsumption'
                                                value={values.fuelConsumption}
                                                onChange={handleChange}
                                                fullWidth
                                                type='number'
                                                placeholder={t("postMotorbike.registedForm.fuelConsumptionPlaceHolder")}
                                            />
                                        }
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    }
                />

                <RegisterMotorbikeItem
                    moreInfo={true}
                    title={t("postMotorbike.registedForm.advancedInfo")}
                    marginBottomTitle='0px'
                    isRequired={true}
                    item={
                        <Box sx={{ width: '100%' }}>
                            <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                <Grid item xs={isMobile ? 12 : 6}>
                                    <RegisterMotorbikeItem
                                        title={t("postMotorbike.registedForm.maxDeliveryDistance")}
                                        fontSizeTitle='20px'
                                        fontWeightTitle={500}
                                        marginBottomTitle='8px'
                                        isRequired={false}
                                        secondTitle={t("postMotorbike.registedForm.maxDeliveryDistanceSecondTitle")}
                                        fontSizeSecondTitle='16px'
                                        fontWeightSecondTitle={400}
                                        item={
                                            <TextField
                                                sx={{
                                                    "& .MuiOutlinedInput-root fieldset": { borderRadius: "8px" },
                                                    "& .MuiOutlinedInput-root:hover fieldset": {
                                                        borderColor: theme.palette.primary.main,
                                                    },
                                                    "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                                                        borderColor: theme.palette.primary.main,
                                                    }
                                                }}
                                                name='maxDeliveryDistance'
                                                value={values.maxDeliveryDistance}
                                                onChange={handleChange}
                                                fullWidth
                                                type='number'
                                                placeholder={t("postMotorbike.registedForm.maxDeliveryDistancePlaceHolder")}
                                            />
                                        }
                                    />
                                    {errors.maxDeliveryDistance && touched.maxDeliveryDistance && (
                                        <ErrorMessage message={errors.maxDeliveryDistance} />
                                    )}
                                </Grid>
                                <Grid item xs={isMobile ? 12 : 6}>
                                    <RegisterMotorbikeItem
                                        title={t("postMotorbike.registedForm.freeDeliveryDistance")}
                                        fontSizeTitle='20px'
                                        fontWeightTitle={500}
                                        marginBottomTitle='8px'
                                        isRequired={false}
                                        secondTitle={t("postMotorbike.registedForm.freeDeliveryDistanceSecondTitle")}
                                        fontSizeSecondTitle='16px'
                                        fontWeightSecondTitle={400}
                                        item={
                                            <TextField
                                                sx={{
                                                    "& .MuiOutlinedInput-root fieldset": { borderRadius: "8px" },
                                                    "& .MuiOutlinedInput-root:hover fieldset": {
                                                        borderColor: theme.palette.primary.main,
                                                    },
                                                    "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                                                        borderColor: theme.palette.primary.main,
                                                    }
                                                }}
                                                name='freeDeliveryRange'
                                                value={values.freeDeliveryRange}
                                                onChange={handleChange}
                                                fullWidth
                                                type='number'
                                                placeholder={t("postMotorbike.registedForm.freeDeliveryDistancePlaceHolder")}
                                            />
                                        }
                                    />
                                    {errors.freeDeliveryRange && touched.freeDeliveryRange && (
                                        <ErrorMessage message={errors.freeDeliveryRange} />
                                    )}
                                </Grid>
                                <Grid item xs={isMobile ? 12 : 6}>
                                    <RegisterMotorbikeItem
                                        title={t("postMotorbike.registedForm.feeDeliveryDistancePerKilometer")}
                                        fontSizeTitle='20px'
                                        fontWeightTitle={500}
                                        marginBottomTitle='8px'
                                        isRequired={false}
                                        secondTitle={t("postMotorbike.registedForm.feeDeliveryDistancePerKilometerSecondTitle")}
                                        fontSizeSecondTitle='16px'
                                        fontWeightSecondTitle={400}
                                        item={
                                            <TextField
                                                sx={{
                                                    "& .MuiOutlinedInput-root fieldset": { borderRadius: "8px" },
                                                    "& .MuiOutlinedInput-root:hover fieldset": {
                                                        borderColor: theme.palette.primary.main,
                                                    },
                                                    "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                                                        borderColor: theme.palette.primary.main,
                                                    }
                                                }}
                                                name='feeOfDeliveryPerKm'
                                                value={values.feeOfDeliveryPerKm}
                                                onChange={handleChange}
                                                fullWidth
                                                type='number'
                                                placeholder={t("postMotorbike.registedForm.feeDeliveryDistancePerKilometerPlaceHolder")}
                                            />
                                        }
                                    />
                                    {errors.feeOfDeliveryPerKm && touched.feeOfDeliveryPerKm && (
                                        <ErrorMessage message={errors.feeOfDeliveryPerKm} />
                                    )}
                                </Grid>
                            </Grid>
                        </Box>
                    }
                />
                <RegisterMotorbikeItem
                    title={t("postMotorbike.registedForm.description")}
                    isRequired={false}
                    item={
                        <Editor onChangeData={(data) => {
                            setFieldValue("description", data);
                        }}
                            content={values.description} />
                        // <TextField
                        //     sx={{
                        //         "& .MuiOutlinedInput-root fieldset": { borderRadius: "8px" },
                        //         "& .MuiOutlinedInput-root:hover fieldset": {
                        //             borderColor: theme.palette.primary.main,
                        //         },
                        //         "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                        //             borderColor: theme.palette.primary.main,
                        //         }
                        //     }}
                        //     name='description'
                        //     value={values.description}
                        //     onChange={handleChange}
                        //     rows={8}
                        //     multiline
                        //     fullWidth
                        //     type='number'
                        //     placeholder={t("postMotorbike.registedForm.descriptionPlaceHolder")}
                        // />
                    }
                />

                <RegisterMotorbikeItem
                    title={t("postMotorbike.registedForm.equipment")}
                    isRequired={false}
                    item={
                        <Box sx={{ width: '98%' }}>
                            <Grid container spacing={2} columnSpacing={{ xs: 3, sm: 3, md: 3 }}>
                                <Grid item xs={isMobile ? 6 : 4}>
                                    <Box key="Raincoat" onClick={() => handleItemClick("Raincoat")}>
                                        <EquipmentItem isChosen={values.raincoat} icon={<RainCoatIcon />} label={t("postMotorbike.registedForm.raincoat")} />
                                    </Box>
                                </Grid>
                                <Grid item xs={isMobile ? 6 : 4}>
                                    <Box key="Helmet" onClick={() => handleItemClick("Helmet")}>
                                        <EquipmentItem isChosen={values.helmet} icon={<HelmetIcon />} label={t("postMotorbike.registedForm.helmet")} />
                                    </Box>
                                </Grid>
                                <Grid item xs={isMobile ? 6 : 4}>
                                    <Box key="ReflectiveClothes" onClick={() => handleItemClick("ReflectiveClothes")}>
                                        <EquipmentItem isChosen={values.reflectiveClothes} icon={<ProtectClothesIcon />} label={t("postMotorbike.registedForm.reflectiveClothes")} />
                                    </Box>
                                </Grid>
                                <Grid item xs={isMobile ? 6 : 4}>
                                    <Box key="Bagage" onClick={() => handleItemClick("Bagage")}>
                                        <EquipmentItem isChosen={values.bagage} icon={<CartIcon />} label={t("postMotorbike.registedForm.bagage")} />
                                    </Box>
                                </Grid>
                                <Grid item xs={isMobile ? 6 : 4}>
                                    <Box key="RepairKit" onClick={() => handleItemClick("RepairKit")}>
                                        <EquipmentItem isChosen={values.repairKit} icon={<RepairIcon />} label={t("postMotorbike.registedForm.repairKit")} />
                                    </Box>
                                </Grid>
                                <Grid item xs={isMobile ? 6 : 4}>
                                    <Box key="CaseTelephone" onClick={() => handleItemClick("CaseTelephone")}>
                                        <EquipmentItem isChosen={values.caseTelephone} icon={< TelephoneIcon />} label={t("postMotorbike.registedForm.caseTelephone")} />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    }
                />

                <RegisterMotorbikeItem
                    title={t("postMotorbike.registedForm.defaultRentPrice")}
                    isRequired={true}
                    item={
                        <Box sx={{ width: '100%' }}>
                            <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                <Grid item xs={6}>

                                    <TextField
                                        sx={{
                                            "& .MuiOutlinedInput-root fieldset": { borderRadius: "8px" },
                                            "& .MuiOutlinedInput-root:hover fieldset": {
                                                borderColor: theme.palette.primary.main,
                                            },
                                            "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                                                borderColor: theme.palette.primary.main,
                                            }
                                        }}
                                        name='defaultPrice'
                                        value={values.defaultPrice}
                                        onChange={handleChange}
                                        fullWidth
                                        type='number'
                                        placeholder={t("postMotorbike.registedForm.defaultRentPricePlaceHolder")}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography
                                        width={"100%"}
                                        variant='h3'
                                        color={theme.palette.text.secondary}
                                        fontSize={"16px"}
                                        fontWeight={400}
                                        sx={{ wordWrap: 'break-word' }}
                                        textAlign={"start"}
                                        marginTop={"16px"}
                                        marginBottom={"16px"}
                                    >
                                        {t("postMotorbike.registedForm.defaultRentPriceSecondTitle")}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    }
                />
                {errors.defaultPrice && touched.defaultPrice && (
                    <ErrorMessage message={errors.defaultPrice} />
                )}
                <RegisterMotorbikeItem
                    title={t("postMotorbike.registedForm.location")}
                    isRequired={true}
                    item={
                        <TextField
                            sx={{
                                "& .MuiOutlinedInput-root fieldset": { borderRadius: "8px" },
                                "& .MuiOutlinedInput-root:hover fieldset": {
                                    borderColor: theme.palette.primary.main,
                                },
                                "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                                    borderColor: theme.palette.primary.main,
                                }
                            }}

                            name='address'
                            value={values.address}
                            onChange={handleChange}
                            fullWidth
                            placeholder={t("postMotorbike.registedForm.locationPlaceHolder")}
                            InputProps={
                                {
                                    endAdornment: (
                                        <Map
                                            onClick={openMapModal}
                                            style={{ cursor: 'pointer' }}
                                        />
                                    )
                                }
                            }
                            inputProps={
                                { readOnly: true, }
                            }
                        />
                    }
                />
                {errors.address && touched.address && (
                    <ErrorMessage message={errors.address} />
                )}
                <RegisterMotorbikeItem
                    title={t("postMotorbike.registedForm.miscellaneous")}
                    isRequired={false}
                    secondTitle={t("postMotorbike.registedForm.miscellaneousSecondTitle")}
                    item={
                        <Editor onChangeData={(data) => {
                            setFieldValue("miscellaneous", data);
                        }} content={values.miscellaneous} />
                        // <TextField
                        //     sx={{
                        //         "& .MuiOutlinedInput-root fieldset": { borderRadius: "8px" },
                        //         "& .MuiOutlinedInput-root:hover fieldset": {
                        //             borderColor: theme.palette.primary.main,
                        //         },
                        //         "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                        //             borderColor: theme.palette.primary.main,
                        //         }
                        //     }}
                        //     name='miscellaneous'
                        //     value={values.miscellaneous}
                        //     onChange={handleChange}
                        //     rows={8}
                        //     multiline
                        //     fullWidth
                        //     type='number'
                        //     placeholder={t("postMotorbike.registedForm.miscellaneousPlaceHolder")}
                        // />
                    }
                />
                <Box width={"100%"} display={"flex"} flexDirection={"row"} justifyContent={"center"} margin={"32px 0px 0px 0px"}>
                    <MyCustomButton
                        disabled={canSubmitting}
                        borderRadius={8}
                        fontSize={16}
                        fontWeight={600}
                        content={id ? t("postMotorbike.registedForm.btnConfirm") : t("postMotorbike.registedForm.btnSubmit")}
                        onClick={handleSubmit} />
                </Box>
            </Box>
            {/* <ImageModal selectedImages={listImageFiles} selectedImageIndex={selectedImageIndex} closeModal={closeModal} /> */}
            <Modal open={isMapModalOpen} onClose={closeMapModal} aria-labelledby="map-modal-title" aria-describedby="map-modal-description" sx={{
                display: 'flex',
                alignItems: 'start',
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
                            title={t("postMotorbike.registedForm.selectProvince")}
                            fontSizeTitle='16px'
                            isRequired={true}
                            item={
                                <Select
                                    sx={{
                                        width: '100%', borderRadius: '8px',
                                    }}
                                    displayEmpty
                                    name="province"
                                    value={values.province}
                                    onChange={handleChange}
                                >
                                    <MenuItem value={""} key={0}>
                                        <em>{t("postMotorbike.registedForm.selectProvincePlaceHolder")}</em>
                                    </MenuItem>
                                    {listProvince.map((province) => (
                                        <MenuItem key={province.code} value={province.code}>{province.name}</MenuItem>
                                    ))}
                                </Select>
                            }
                        />
                        <Box display={'flex'} alignContent={"flex-start"} width={"100%"}>
                            {errors.province && touched.province && (
                                <ErrorMessage message={errors.province} />
                            )}
                        </Box>


                        <RegisterMotorbikeItem
                            title={t("postMotorbike.registedForm.selectDistrict")}
                            fontSizeTitle='16px' isRequired={true} item={
                                <Select
                                    sx={{
                                        width: '100%', borderRadius: '8px',
                                    }}
                                    displayEmpty

                                    disabled={values.province === "" || !listDistrict}
                                    name="district"
                                    value={values.district}
                                    onChange={handleChange}
                                >
                                    <MenuItem value={""} key={0}>
                                        <em>{t("postMotorbike.registedForm.selectDistrictPlaceHolder")}</em>
                                    </MenuItem>
                                    {
                                        listDistrict?.districts?.map((district) => (
                                            <MenuItem
                                                key={district.code}
                                                value={district.code}
                                            >{district.name}</MenuItem>
                                        ))
                                    }
                                </Select>}
                        />
                        <Box display={'flex'} alignContent={"flex-start"} width={"100%"}>
                            {errors.district && touched.district && (
                                <ErrorMessage message={errors.district} />
                            )}
                        </Box>

                        <RegisterMotorbikeItem
                            fontSizeTitle='16px'
                            title={t("postMotorbike.registedForm.selectWard")}
                            isRequired={true}
                            item={
                                <Select
                                    sx={{
                                        width: '100%', borderRadius: '8px',
                                    }}
                                    disabled={values.province === "" || values.district === "" || !listWard}
                                    displayEmpty
                                    name="ward"
                                    value={values.ward}
                                    onChange={handleChange}
                                >
                                    <MenuItem value={""} key={0}>
                                        <em>{t("postMotorbike.registedForm.selectWardPlaceHolder")}</em>
                                    </MenuItem>
                                    {
                                        listWard?.wards?.map((ward) => (
                                            <MenuItem
                                                key={ward.code}
                                                value={ward.code}
                                            >{ward.name}</MenuItem>
                                        ))
                                    }
                                </Select>}
                        />
                        <Box display={'flex'} alignContent={"flex-start"} width={"100%"}>
                            {errors.ward && touched.ward && (
                                <ErrorMessage message={errors.ward} />
                            )}
                        </Box>

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
                                                    disabled={values.province === "" || values.district === "" || values.ward === ""}
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
                                                    sx={{ backgroundColor: "#ffffff" }}
                                                    border={"3px solid #ebebeb"}
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
                                                                    whiteSpace: "normal", // Cho phép nội dung tự động xuống dòng
                                                                    wordWrap: "break-word", // Tự động xuống dòng khi cần thiết
                                                                    // whiteSpace: "nowrap", // Ngăn menu item xuống dòng tự động
                                                                    // overflow: "hidden", // Ẩn nội dung bị tràn
                                                                    // textOverflow: "ellipsis", // Hiển thị "..." cho nội dung tràn
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
                                                    disabled={values.province === "" || values.district === "" || values.ward === ""}
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
                                                display={values.province === "" || values.district === "" || values.ward === "" || values.address === "" ? "none" : "flex"}
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
                                        disabled={values.province === "" || values.district === "" || values.ward === "" || values.address === ""}
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

    );
};

interface ImageModalProps {
    selectedImages: File[];
    selectedImageIndex: number | null;
    closeModal: () => void;
}

function ImageModal({ selectedImages, selectedImageIndex, closeModal }: ImageModalProps) {
    return (<Modal open={selectedImageIndex !== null} onClose={closeModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description" sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '32px 32px'
    }}>
        <img style={{
            maxWidth: '100%',
            maxHeight: '100%',
            borderRadius: '8px',
            border: '3px solid #E0E0E0'
        }} src={selectedImageIndex !== null ? URL.createObjectURL(selectedImages[selectedImageIndex]) : ''} alt="Selected Image" />
    </Modal>);
}
export default RegisterMotorbikeForm;