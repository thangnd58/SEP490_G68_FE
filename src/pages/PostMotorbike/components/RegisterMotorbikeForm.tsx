import { Box, Grid, IconButton, ImageList, ImageListItem, ImageListItemBar, Modal, TextField, Typography, styled } from '@mui/material';
import React, { ChangeEvent, useRef, useState } from 'react';
import RegisterMotorbikeItem from './RegisterMotorbikeItem';
import MyCustomTextField from '../../../components/common/MyTextField';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { CloseOutlined, Map } from '@mui/icons-material';
import MyCustomButton from '../../../components/common/MyButton';
import theme from '../../../utils/theme';

const RegisterMotorbikeForm = () => {

    const [selectedBrand, setSelectedBrand] = useState<string | undefined>();
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const [isMapModalOpen, setMapModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleAddImages = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleImageSelection = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const imageFiles: File[] = Array.from(files);
            setSelectedImages((prevImages) => [...prevImages, ...imageFiles]);
        }
    };

    const handleRemoveImage = (indexToRemove: number) => {
        const updatedImages = selectedImages.filter((_, index) => index !== indexToRemove);
        setSelectedImages(updatedImages);
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
                                    onClick={() => openModal(index)}
                                >
                                    <img
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
                                                listItems={[
                                                    { key: '1', value: 'Honda' },
                                                    { key: '2', value: 'Yamaha' },
                                                ]}
                                                // Lưu trạng thái hãng xe đã chọn
                                                onChange={(e) => setSelectedBrand(e.target.value)}
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
                                                listItems={[{ key: '1', value: 'Honda' }, { key: '2', value: 'Yamaha' }]}
                                                // Vô hiệu hóa trường nhập liệu nếu chưa chọn hãng xe
                                                disabled={!selectedBrand}
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
                                                listItems={[{ key: '1', value: 'Xăng' }, { key: '2', value: 'Điện' }]}
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
                            disabled={true}
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
            <MapModal isMapModalOpen={isMapModalOpen} closeMapModal={closeMapModal} />

        </Box>
    );
};

interface MapModalProps {
    isMapModalOpen: boolean;
    closeMapModal: () => void;
}

interface ImageModalProps {
    selectedImages : File[];
    selectedImageIndex: number | null;
    closeModal: () => void;
}

function MapModal({ isMapModalOpen, closeMapModal }: MapModalProps) {
    return (<Modal open={isMapModalOpen} onClose={closeMapModal} aria-labelledby="map-modal-title" aria-describedby="map-modal-description" sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }}>
        <Box width={"30%"} height={"auto"} sx={{
            padding: "16px 32px",
            backgroundColor: 'white',
            borderRadius: '8px'
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
                <RegisterMotorbikeItem title={'Tỉnh/Thành phố '} fontSizeTitle='16px' isRequired={true} item={<MyCustomTextField borderRadius={8} fontSize={16} height='48px' width='100%' placeholder={'Chọn Tỉnh/ Thành phố'} listItems={[{
                    key: '1',
                    value: 'Hà Nội'
                }, {
                    key: '2',
                    value: 'Hồ Chí Minh'
                }, {
                    key: '3',
                    value: 'Đà Nẵng'
                }]} />} />

                <RegisterMotorbikeItem title={'Quận/Huyện '} fontSizeTitle='16px' isRequired={true} item={<MyCustomTextField borderRadius={8} width='100%' placeholder={'Chọn Quận/Huyện'} listItems={[{
                    key: '1',
                    value: 'Quận Hoàng Mai'
                }, {
                    key: '2',
                    value: 'Quận Đống Đa'
                }, {
                    key: '3',
                    value: 'Quận Ba Đình'
                }]} />} />

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
                            <MyCustomButton width='30%' borderRadius={8} fontSize={16} fontWeight={600} content='Xác nhận' onClick={() => { }} />
                        </Box>
                    }
                />
            </Box>
        </Box>
    </Modal>);
}

function ImageModal({ selectedImages,selectedImageIndex, closeModal }: ImageModalProps) {
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