import { Box, Grid, IconButton, ImageList, ImageListItem, Modal, Typography } from '@mui/material';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import RegisterMotorbikeItem from './RegisterMotorbikeItem';
import MyCustomTextField from '../../../../components/common/MyTextField';
import { CloseOutlined, Map } from '@mui/icons-material';
import MyCustomButton from '../../../../components/common/MyButton';
import theme from '../../../../utils/theme';
import { PostMotorbikeService } from '../../../../services/PostMotorbikeService';
import { Brand, District, Model, Province } from '../../../../utils/type';
import { ProvincesService } from '../../../../services/ProvincesService';
import { CartIcon, HelmetIcon, ProtectClothesIcon, RainCoatIcon, RepairIcon, TelephoneIcon } from '../../../../assets/icons';
import EquipmentItem from './EquipmentItem';
import ToastComponent from '../../../../components/toast/ToastComponent';
import MyMapWithSearchBox from '../../../../components/common/MyMapWithSearchBox';
import { t } from 'i18next';
import MyIcon from '../../../../components/common/MyIcon';

const RegisterMotorbikeForm = () => {

    const [listProvince, setListProvince] = useState<Province[]>([]);
    const [listDistrict, setListDistrict] = useState<Province>();
    const [listWard, setListWard] = useState<District>();
    const [listBrand, setListBrand] = useState<Brand[]>([]);
    const [listModel, setListModel] = useState<Model[]>([]);
    const [selectedBrand, setSelectedBrand] = useState<number>(0);
    const [selectedProvince, setSelectedProvince] = useState<number>();
    const [selectedDistrict, setSelectedDistrict] = useState<number>();
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const [isMapModalOpen, setMapModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [licensePlate, setLicensePlate] = useState('');
    const [description, setDescription] = useState('');
    const [fuelConsumption, setFuelConsumption] = useState('');
    const [defaultPrice, setDefaultPrice] = useState('');
    const [selectedProvinceValue, setSelectedProvinceValue] = useState('');
    const [selectedDistrictValue, setSelectedDistrictValue] = useState('');
    const [selectedWardValue, setSelectedWardValue] = useState('');

    const handleSubmit = () => {
        // Log giá trị của các trường TextField
        console.log('Biển số xe:', licensePlate);
        // console.log('Mô tả:', description);
        // console.log('Mức tiêu thụ nhiên liệu:', fuelConsumption);
        // console.log('Giá thuê mặc định:', defaultPrice);
        // console.log('Tỉnh/Thành phố:', selectedProvinceValue);
        // console.log('Quận/Huyện:', selectedDistrictValue);
        // console.log('Phường/Xã:', selectedWardValue);

        // Thực hiện các thao tác cần thiết khi bấm nút submit
    };


    useEffect(() => {
        PostMotorbikeService.getAllBrand().then((res) => {
            if (res.length > 0) {
                setListBrand(res);
            }
        });
        ProvincesService.getAllProvinces().then((res) => {
            if (res.length > 0) {
                setListProvince(res);
            }
        });
    }, []);

    useEffect(() => {
        if (selectedBrand !== 0) {
            PostMotorbikeService.getAllModel(Number(selectedBrand)).then((res) => {
                if (res.length > 0) {
                    setListModel(res);
                }
            });
        }
    }, [selectedBrand]);

    // useEffect(() => {
    //     if (selectedProvince !== 0) {
    //         ProvincesService.getDistrictsByProvince(Number(selectedProvince)).then((res) => {
    //             if (res !== null) {
    //                 setListDistrict(res);
    //             }
    //         });
    //     }
    // }, [selectedProvince]);

    // useEffect(() => {
    //     if (selectedDistrict !== 0) {
    //         ProvincesService.getWardsByDistrict(Number(selectedDistrict)).then((res) => {
    //             if (res !== null) {
    //                 setListWard(res);
    //             }
    //         });
    //     }
    // }, [selectedDistrict]);



    const handleAddImages = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const MAX_IMAGES = 12;
    const MAX_IMAGE_SIZE_MB = 10;

    const handleImageSelection = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const imageFiles: File[] = Array.from(files);
            if (selectedImages.length + imageFiles.length <= MAX_IMAGES) {
                const isValidSize = imageFiles.every((file) => file.size / (1024 * 1024) <= MAX_IMAGE_SIZE_MB);
                if (isValidSize) {
                    setSelectedImages((prevImages) => [...prevImages, ...imageFiles]);
                } else {
                    ToastComponent(`Kích thước ảnh không được vượt quá ${MAX_IMAGE_SIZE_MB}MB`, "error",);
                }
            } else {
                ToastComponent(`Bạn chỉ có thể chọn tối đa ${MAX_IMAGES} ảnh`, "error",);
            }
        }
    };

    const handleRemoveImage = (indexToRemove: number) => {
        const updatedImages = selectedImages.filter((_, index) => index !== indexToRemove);
        setSelectedImages(updatedImages);
    };

    const handleLicensePlateChange = (value: string) => {
        setLicensePlate(value);
    };


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


    return (

        <Box width={"100%"}>
            <Box>
                <RegisterMotorbikeItem
                    title={t("postMotorbike.registedForm.licensePlate")}
                    isRequired={true}
                    item={
                        <MyCustomTextField
                            borderRadius={8}
                            width='100%'
                            placeholder={t("postMotorbike.registedForm.licensePlatePlaceHolder")}
                            onValueChange={handleLicensePlateChange}
                        />
                    }
                />
                <RegisterMotorbikeItem
                    title={t("postMotorbike.registedForm.image")}
                    isRequired={true}
                    secondTitle={t("postMotorbike.registedForm.imageSecondTitle")}
                    item={
                        <ImageList
                            sx={{ borderRadius: '8px', border: '3px solid #E0E0E0', width: '100%', height: 300 }}
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
                                        src={URL.createObjectURL(image)}
                                        alt={`Selected Image ${index + 1}`}
                                        loading="lazy"
                                    />
                                    <div
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
                                    </div>
                                    <div
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
                                    </div>
                                </ImageListItem>

                            ))}
                        </ImageList>
                    }
                    myButton={
                        <Box width={"100%"}>
                            <MyCustomButton
                                width="20%"
                                borderRadius={8}
                                fontSize={16}
                                fontWeight={600}
                                content={t("postMotorbike.registedForm.imageButton")}
                                onClick={handleAddImages}
                            />
                            <input
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
                <RegisterMotorbikeItem
                    title={t("postMotorbike.registedForm.basicInfo")}
                    marginBottomTitle='0px'
                    isRequired={true}
                    item={
                        <Box sx={{ width: '100%' }}>
                            <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                <Grid item xs={6}>
                                    <RegisterMotorbikeItem
                                        title={t("postMotorbike.registedForm.brand")}
                                        fontSizeTitle='20px'
                                        fontWeightTitle={500}
                                        isRequired={false}
                                        item={
                                            <MyCustomTextField
                                                borderRadius={8}
                                                placeholder={t("postMotorbike.registedForm.brandPlaceHolder")}
                                                listItems={listBrand.map((brand) => ({ key: brand.id.toString(), value: brand.brandName }))}
                                            // Lưu trạng thái hãng xe đã chọn
                                            // setSelectedBrand={setSelectedBrand}
                                            />
                                        }
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <RegisterMotorbikeItem
                                        title={t("postMotorbike.registedForm.model")}
                                        fontSizeTitle='20px'
                                        fontWeightTitle={500}
                                        isRequired={false}
                                        item={
                                            <MyCustomTextField
                                                borderRadius={8}
                                                placeholder={t("postMotorbike.registedForm.modelPlaceHolder")}
                                                listItems={listModel.map((model) => ({ key: model.id.toString(), value: model.modelName }))}
                                            // Vô hiệu hóa trường nhập liệu nếu chưa chọn hãng xe
                                            // disabled={selectedBrand === 0}
                                            // selectedBrand={selectedBrand}
                                            />
                                        }
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <RegisterMotorbikeItem
                                        title={t("postMotorbike.registedForm.year")}
                                        fontSizeTitle='20px'
                                        fontWeightTitle={500}
                                        isRequired={false}
                                        item={
                                            <MyCustomTextField
                                                borderRadius={8}
                                                placeholder={t("postMotorbike.registedForm.yearPlaceHolder")}
                                                listItems={[{ key: '2023', value: '2023' }, { key: '2022', value: '2022' }]}
                                            />
                                        }
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <RegisterMotorbikeItem
                                        title={t("postMotorbike.registedForm.fuel")}
                                        fontSizeTitle='20px'
                                        fontWeightTitle={500}
                                        isRequired={false}
                                        item={
                                            <MyCustomTextField
                                                borderRadius={8}
                                                placeholder={t("postMotorbike.registedForm.fuelPlaceHolder")}
                                                listItems={[{ key: 'Xăng', value: 'Xăng' }, { key: 'Điện', value: 'Điện' }]}
                                            />
                                        }
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <RegisterMotorbikeItem
                                        title={t("postMotorbike.registedForm.fuelConsumption")}
                                        fontSizeTitle='20px'
                                        fontWeightTitle={500}
                                        marginBottomTitle='8px'
                                        isRequired={true}
                                        secondTitle={t("postMotorbike.registedForm.fuelConsumptionSecondTitle")}
                                        fontSizeSecondTitle='16px'
                                        fontWeightSecondTitle={400}
                                        item={
                                            <MyCustomTextField
                                                type='number'
                                                borderRadius={8}
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
                    title={t("postMotorbike.registedForm.description")}
                    isRequired={false}
                    item={
                        <MyCustomTextField
                            borderRadius={8}
                            width='100%'
                            multiline={true}
                            placeholder={t("postMotorbike.registedForm.descriptionPlaceHolder")}
                        />
                    }
                />

                <RegisterMotorbikeItem
                    title={t("postMotorbike.registedForm.Equipment")}
                    isRequired={false}
                    item={
                        <Box sx={{ width: '100%' }}>
                            <Grid container spacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                <Grid item xs={4}>
                                    <EquipmentItem icon={<RainCoatIcon />} label={t("postMotorbike.registedForm.raincoat")} />
                                </Grid>
                                <Grid item xs={4}>
                                    <EquipmentItem icon={<HelmetIcon />} label={t("postMotorbike.registedForm.helmet")} />
                                </Grid>
                                <Grid item xs={4}>
                                    <EquipmentItem icon={<ProtectClothesIcon />} label={t("postMotorbike.registedForm.reflectiveClothes")} />
                                </Grid>
                                <Grid item xs={4}>
                                    <EquipmentItem icon={<CartIcon />} label={t("postMotorbike.registedForm.bagage")} />
                                </Grid>
                                <Grid item xs={4}>
                                    <EquipmentItem icon={<RepairIcon />} label={t("postMotorbike.registedForm.repairKit")} />
                                </Grid>
                                <Grid item xs={4}>
                                    <EquipmentItem icon={< TelephoneIcon />} label={t("postMotorbike.registedForm.caseTelephone")} />
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
                                    <MyCustomTextField
                                        type='number'
                                        borderRadius={8}
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
                <RegisterMotorbikeItem
                    title={t("postMotorbike.registedForm.location")}
                    isRequired={true}
                    item={
                        <MyCustomTextField
                            borderRadius={8}
                            width='100%'
                            // disabled={true}
                            placeholder={t("postMotorbike.registedForm.locationPlaceHolder")}
                            icon={
                                <Map
                                    onClick={openMapModal}
                                    style={{ cursor: 'pointer' }}
                                />
                            }
                            iconPosition='end'
                        />
                    }
                />
                <RegisterMotorbikeItem
                    title={t("postMotorbike.registedForm.miscellaneous")}
                    isRequired={false}
                    secondTitle={t("postMotorbike.registedForm.miscellaneousSecondTitle")}
                    item={
                        <MyCustomTextField
                            borderRadius={8}
                            width='100%'
                            multiline={true}
                            placeholder={t("postMotorbike.registedForm.miscellaneousPlaceHolder")}
                        />
                    }
                />
                <Box width={"100%"} display={"flex"} flexDirection={"row"} justifyContent={"center"} margin={"32px 0px 0px 0px"}>
                    <MyCustomButton width='30%' borderRadius={8} fontSize={16} fontWeight={600} content={t("postMotorbike.registedForm.btnSubmit")} onClick={() => { }} />
                </Box>
            </Box>
            <ImageModal selectedImages={selectedImages} selectedImageIndex={selectedImageIndex} closeModal={closeModal} />
            <Modal open={isMapModalOpen} onClose={closeMapModal} aria-labelledby="map-modal-title" aria-describedby="map-modal-description" sx={{
                display: 'flex',
                alignItems: 'start',
                justifyContent: 'center',
                margin: '32px 0px',
                overflowY: 'auto',
            }}>
                <Box width={"30%"} height={"auto"} sx={{
                    padding: "16px 32px",
                    backgroundColor: 'white',
                    borderRadius: '8px',
                }}>
                    <Box width={"100%"} height={"10%"} display={"flex"} flexDirection={"row"} justifyContent={"start"} alignItems={"center"}>
                        <Typography width={"100%"} variant='h2' color={theme.palette.text.primary} fontSize={"24px"} fontWeight={600} textAlign={"start"}>
                        {t("postMotorbike.registedForm.selectAddress")}
                        </Typography>
                        <Box width={"100%"} height={"10%"} display={"flex"} flexDirection={"row"} justifyContent={"flex-end"} alignItems={"center"}>
            
                            <MyIcon icon={<CloseOutlined />} hasTooltip tooltipText={t("postMotorbike.registedForm.badge-close")} onClick={closeMapModal} position='bottom'/>

                        </Box>
                    </Box>
                    <Box width={"100%"} height={"80%"} display={"flex"} flexDirection={"column"} justifyContent={"start"} alignItems={"center"}>
                        <RegisterMotorbikeItem title={t("postMotorbike.registedForm.selectProvince")} fontSizeTitle='16px' isRequired={true} item={<MyCustomTextField borderRadius={8} fontSize={16} height='48px' width='100%' placeholder={t("postMotorbike.registedForm.selectProvincePlaceHolder")}
                            listItems={listProvince.map((province) => ({ key: province.code.toString(), value: province.name }))}
                        />} />

                        <RegisterMotorbikeItem title={t("postMotorbike.registedForm.selectDistrict")} fontSizeTitle='16px' isRequired={true} item={<MyCustomTextField borderRadius={8} width='100%' placeholder={t("postMotorbike.registedForm.selectDistrictPlaceHolder")}
                            listItems={listProvince.map((province) => ({ key: province.code.toString(), value: province.name }))}
                        />} />

                        <RegisterMotorbikeItem fontSizeTitle='16px' title={t("postMotorbike.registedForm.selectWard")} isRequired={true} item={<MyCustomTextField borderRadius={8} width='100%' placeholder={t("postMotorbike.registedForm.selectWardPlaceHolder")} listItems={[{
                            key: '1',
                            value: 'Phường Hoàng Văn Thụ'
                        }, {
                            key: '2',
                            value: 'Phường Thanh Xuân Trung'
                        }, {
                            key: '3',
                            value: 'Phường Thanh Xuân Bắc'
                        }]} />} />


                        <RegisterMotorbikeItem
                            fontSizeTitle='16px'
                            title={t("postMotorbike.registedForm.address")}
                            isRequired={true}
                            item={<MyMapWithSearchBox />}
                            myButton={
                                <Box width={"100%"} display={"flex"} flexDirection={"row"} justifyContent={"center"} margin={"24px 0px 0px 0px"}>
                                    <MyCustomButton width='30%' borderRadius={8} fontSize={16} fontWeight={600} content={t("postMotorbike.registedForm.btnConfirm")} onClick={handleSubmit} />
                                </Box>
                            }
                        />
                    </Box>
                </Box>
            </Modal>

        </Box>
    );
};

interface MapModalProps {
    isMapModalOpen: boolean;
    closeMapModal: () => void;
}

interface ImageModalProps {
    selectedImages: File[];
    selectedImageIndex: number | null;
    closeModal: () => void;
}

// function MapModal({ isMapModalOpen, closeMapModal }: MapModalProps) {
//     return ();
// }

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