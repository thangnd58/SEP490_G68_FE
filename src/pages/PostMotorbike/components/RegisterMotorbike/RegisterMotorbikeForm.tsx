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
                    alert('Image size exceeds the limit.');
                }
            } else {
                alert('You can only upload up to 12 images.');
            }
        }
    };

    const handleRemoveImage = (indexToRemove: number) => {
        const updatedImages = selectedImages.filter((_, index) => index !== indexToRemove);
        setSelectedImages(updatedImages);
    };

    const handleLicensePlateChange = (value: string) => {
        setLicensePlate(value); // Update the licensePlate state
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
                    title={'Biển số xe '}
                    isRequired={true}
                    item={
                        <MyCustomTextField
                            borderRadius={8}
                            width='100%'
                            placeholder={'Vui lòng nhập biển sổ xe'}
                            onValueChange={handleLicensePlateChange}
                        />
                    }
                />
                <RegisterMotorbikeItem
                    title={'Hình ảnh xe'}
                    isRequired={true}
                    secondTitle="Thêm nhiều ảnh ở các góc độ khác nhau của xe để tăng tính xác thực cho xe"
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
                                content="Thêm ảnh"
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
                    title={'Thông tin cơ bản '}
                    marginBottomTitle='0px'
                    isRequired={true}
                    item={
                        <Box sx={{ width: '100%' }}>
                            <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                <Grid item xs={6}>
                                    <RegisterMotorbikeItem
                                        title={'Hãng xe'}
                                        fontSizeTitle='20px'
                                        fontWeightTitle={500}
                                        isRequired={false}
                                        item={
                                            <MyCustomTextField
                                                borderRadius={8}
                                                placeholder='Vui lòng chọn hãng xe'
                                                listItems={listBrand.map((brand) => ({ key: brand.id.toString(), value: brand.brandName }))}
                                            // Lưu trạng thái hãng xe đã chọn
                                            // setSelectedBrand={setSelectedBrand}
                                            />
                                        }
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <RegisterMotorbikeItem
                                        title={'Mẫu xe'}
                                        fontSizeTitle='20px'
                                        fontWeightTitle={500}
                                        isRequired={false}
                                        item={
                                            <MyCustomTextField
                                                borderRadius={8}
                                                placeholder='Vui lòng chọn hãng xe trước'
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
                                        title={'Năm sản xuất'}
                                        fontSizeTitle='20px'
                                        fontWeightTitle={500}
                                        isRequired={false}
                                        item={
                                            <MyCustomTextField
                                                borderRadius={8}
                                                placeholder='Vui lòng chọn năm sản xuất'
                                                listItems={[{ key: '2023', value: '2023' }, { key: '2022', value: '2022' }]}
                                            />
                                        }
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <RegisterMotorbikeItem
                                        title={'Loại nhiên liệu'}
                                        fontSizeTitle='20px'
                                        fontWeightTitle={500}
                                        isRequired={false}
                                        item={
                                            <MyCustomTextField
                                                borderRadius={8}
                                                placeholder='Vui lòng chọn loại nhiên liệu'
                                                listItems={[{ key: 'Xăng', value: 'Xăng' }, { key: 'Điện', value: 'Điện' }]}
                                            />
                                        }
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <RegisterMotorbikeItem
                                        title={'Mức tiêu thụ nhiên liệu '}
                                        fontSizeTitle='20px'
                                        fontWeightTitle={500}
                                        marginBottomTitle='8px'
                                        isRequired={true}
                                        secondTitle='Ví dụ: 3 lít/100km'
                                        fontSizeSecondTitle='16px'
                                        fontWeightSecondTitle={400}
                                        item={
                                            <MyCustomTextField
                                                type='number'
                                                borderRadius={8}
                                                placeholder='3'
                                            />
                                        }
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    }
                />
                <RegisterMotorbikeItem
                    title={'Mô tả'}
                    isRequired={false}
                    item={
                        <MyCustomTextField
                            borderRadius={8}
                            width='100%'
                            multiline={true}
                            placeholder={'Nhập mô tả cho xe của bạn'}
                        />
                    }
                />

                <RegisterMotorbikeItem
                    title={'Trang bị'}
                    isRequired={false}
                    item={
                        <Box sx={{ width: '100%' }}>
                            <Grid container spacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                <Grid item xs={4}>
                                    <EquipmentItem icon={<RainCoatIcon />} label='Áo mưa' />
                                </Grid>
                                <Grid item xs={4}>
                                    <EquipmentItem icon={<HelmetIcon />} label='Mũ bảo hiểm 3/4' />
                                </Grid>
                                <Grid item xs={4}>
                                    <EquipmentItem icon={<ProtectClothesIcon />} label='Dây đeo phản quang' />
                                </Grid>
                                <Grid item xs={4}>
                                    <EquipmentItem icon={<CartIcon />} label='Baga sau' />
                                </Grid>
                                <Grid item xs={4}>
                                    <EquipmentItem icon={<RepairIcon />} label='Bộ dụng cụ vá xe' />
                                </Grid>
                                <Grid item xs={4}>
                                    <EquipmentItem icon={< TelephoneIcon/>} label='Giá đỡ điện thoại' />
                                </Grid>
                            </Grid>
                        </Box>
                    }
                />

                <RegisterMotorbikeItem
                    title={'Giá thuê mặc định '}
                    isRequired={true}
                    item={
                        <Box sx={{ width: '100%' }}>
                            <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                <Grid item xs={6}>
                                    <MyCustomTextField
                                        type='number'
                                        borderRadius={8}
                                        placeholder='120'
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
                                        Nghìn VND/ngày
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    }
                />
                <RegisterMotorbikeItem
                    title={'Địa chỉ xe '}
                    isRequired={true}
                    item={
                        <MyCustomTextField
                            borderRadius={8}
                            width='100%'
                            // disabled={true}
                            placeholder={'Địa chỉ mặc định giao nhận xe'}
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
                    title={'Các điều khoản khác'}
                    isRequired={false}
                    secondTitle='Ghi rõ các yêu cầu để khách hàng có thể thuê xe'
                    item={
                        <MyCustomTextField
                            borderRadius={8}
                            width='100%'
                            multiline={true}
                            placeholder={'Vui lòng nhập các điều khoản cho thuê xe khác của bạn'}
                        />
                    }
                />
                <Box width={"100%"} display={"flex"} flexDirection={"row"} justifyContent={"center"} margin={"32px 0px 0px 0px"}>
                    <MyCustomButton width='30%' borderRadius={8} fontSize={16} fontWeight={600} content='Đăng ký xe' onClick={() => { }} />
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
                            Chọn địa chỉ xe
                        </Typography>
                        <Box width={"100%"} height={"10%"} display={"flex"} flexDirection={"row"} justifyContent={"flex-end"} alignItems={"center"}>
                            <IconButton onClick={closeMapModal}>
                                <CloseOutlined />
                            </IconButton>
                        </Box>
                    </Box>
                    <Box width={"100%"} height={"80%"} display={"flex"} flexDirection={"column"} justifyContent={"start"} alignItems={"center"}>
                        <RegisterMotorbikeItem title={'Tỉnh/Thành phố '} fontSizeTitle='16px' isRequired={true} item={<MyCustomTextField borderRadius={8} fontSize={16} height='48px' width='100%' placeholder={'Chọn Tỉnh/ Thành phố'}
                            listItems={listProvince.map((province) => ({ key: province.code.toString(), value: province.name }))}
                        />} />

                        <RegisterMotorbikeItem title={'Quận/Huyện '} fontSizeTitle='16px' isRequired={true} item={<MyCustomTextField borderRadius={8} width='100%' placeholder={'Chọn Quận/Huyện'}
                            listItems={listProvince.map((province) => ({ key: province.code.toString(), value: province.name }))}
                        />} />

                        <RegisterMotorbikeItem fontSizeTitle='16px' title={'Phường/Xã '} isRequired={true} item={<MyCustomTextField borderRadius={8} width='100%' placeholder={'Chọn Phường/Xã'} listItems={[{
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
                            title={'Địa chỉ '}
                            isRequired={true}
                            item={<MyCustomTextField borderRadius={8} width='100%' placeholder={'Nhập địa chỉ'} />}
                            myButton={
                                <Box width={"100%"} display={"flex"} flexDirection={"row"} justifyContent={"center"} margin={"24px 0px 0px 0px"}>
                                    <MyCustomButton width='30%' borderRadius={8} fontSize={16} fontWeight={600} content='Xác nhận' onClick={handleSubmit} />
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
        margin: '32px 0px'
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