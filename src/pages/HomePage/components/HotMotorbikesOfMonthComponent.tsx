import { Box, Grid, Typography } from '@mui/material'
import React from 'react'
import { Motorbike } from '../../../utils/type';
import usei18next from '../../../hooks/usei18next';
import { useNavigate } from 'react-router-dom';
import useThemePage from '../../../hooks/useThemePage';
import MotorbikeInforCard from './MotorbikeInforCard';

// list 3 records demo data has type Motorbike
const motorbikes: Motorbike[] = [
    {
        id: 8,
        licensePlate: "ABC123",
        releaseYear: 2020,
        type: "Điện",
        priceRent: 50,
        equipments: "Helmet, RainCoat",
        fuelConsumption: 3.5,
        maxDeliveryDistance: 50,
        freeDeliveryRange: 10,
        feeOfDeliveryPerKm: 5,
        provinceId: 1,
        districtId: 101,
        wardId: 1001,
        image: "motorbike1.jpg",
        imageUrl: ["https://i1-vnexpress.vnecdn.net/2023/07/11/F0-copy-2_1689051381.jpg?w=900&h=0&q=100&dpr=1&fit=crop&s=GAq8O4fzdRx6nj7lME8Mow", "https://i1-vnexpress.vnecdn.net/2023/07/11/F1-copy-2_1689051381.jpg?w=900&h=0&q=100&dpr=1&fit=crop&s=Q2gFGknD1qXH4l8PJEsXrg"],
        address: "123 Main Street",
        location: "20.12345, 30.67890",
        status: "Available",
        statusComment: "Good condition",
        user: {
            userId: 101,
            name: "John Doe",
            email: "john@example.com",
            phone: "1234567890",
            gender: "Male",
            dob: "1990-01-01",
            address: "456 Second Street",
            avatar: "avatar1.jpg",
            password: "hashedPassword",
            avatarUrl: "https://yt3.googleusercontent.com/-CFTJHU7fEWb7BYEb6Jh9gm1EpetvVGQqtof0Rbh-VQRIznYYKJxCaqv_9HeBcmJmIsp2vOO9JU=s900-c-k-c0x00ffffff-no-rj",
            role: {
                roleId: 1,
                roleName: "User",
                deleted: false,
                createDatetime: "",
                updateDatetime: "",
                createUserId: 0,
                updateUserId: 0
            },
            phoneVerified: true,
            balance: 100,
            googleIdentity: "google123",
        },
        createDatetime: "2022-01-01T12:00:00Z",
        model: {
            id: 1,
            modelName: "Sporty Model",
            modelImage: "model1.jpg",
            brand: {
                id: 1,
                brandName: "Awesome Brand",
                brandImage: "brand1.jpg",
            },
        },
        miscellaneous: "Miscellaneous information",
        description: "A cool sporty motorbike",
        distance: 20,
        isFavourite: false,
    },
    {
        id: 9,
        licensePlate: "XYZ789",
        releaseYear: 2021,
        type: "Xăng",
        priceRent: 60,
        equipments: "Helmet, RainCoat",
        fuelConsumption: 4.0,
        maxDeliveryDistance: 40,
        freeDeliveryRange: 8,
        feeOfDeliveryPerKm: 4,
        provinceId: 2,
        districtId: 102,
        wardId: 1002,
        image: "motorbike2.jpg",
        imageUrl: ["https://i1-vnexpress.vnecdn.net/2023/07/11/F6-copy-2_1689051395.jpg?w=900&h=0&q=100&dpr=1&fit=crop&s=nIpgc_mbLgP3q_2ezlYwIA", "https://i1-vnexpress.vnecdn.net/2023/07/11/F6-copy-2_1689051400.jpg?w=900&h=0&q=100&dpr=1&fit=crop&s=7iXGYnQxmsGlOysSAwMm1A"],
        address: "456 Third Street",
        location: "25.54321, 35.98765",
        status: "Available",
        statusComment: "Excellent condition",
        user: {
            userId: 102,
            name: "Jane Doe",
            email: "jane@example.com",
            phone: "9876543210",
            gender: "Female",
            dob: "1995-05-05",
            address: "789 Third Street",
            avatar: "avatar2.jpg",
            password: "hashedPassword",
            avatarUrl: "https://yt3.googleusercontent.com/-CFTJHU7fEWb7BYEb6Jh9gm1EpetvVGQqtof0Rbh-VQRIznYYKJxCaqv_9HeBcmJmIsp2vOO9JU=s900-c-k-c0x00ffffff-no-rj",
            role: {
                roleId: 1,
                roleName: "User",
                deleted: false,
                createDatetime: "",
                updateDatetime: "",
                createUserId: 0,
                updateUserId: 0
            },
            phoneVerified: true,
            balance: 150,
            googleIdentity: "google456",
        },
        createDatetime: "2022-02-01T14:30:00Z",
        model: {
            id: 2,
            modelName: "Cruiser Deluxe",
            modelImage: "model2.jpg",
            brand: {
                id: 2,
                brandName: "Fantastic Brand",
                brandImage: "brand2.jpg",
            },
        },
        miscellaneous: "More information here",
        description: "A stylish cruiser motorbike",
        distance: 15,
        isFavourite: true,
    },
    {
        id: 10,
        licensePlate: "PQR456",
        releaseYear: 2019,
        type: "Điện",
        priceRent: 70,
        equipments: "Helmet, RainCoat",
        fuelConsumption: 5.0,
        maxDeliveryDistance: 60,
        freeDeliveryRange: 12,
        feeOfDeliveryPerKm: 6,
        provinceId: 3,
        districtId: 103,
        wardId: 1003,
        image: "motorbike3.jpg",
        imageUrl: ["https://i1-vnexpress.vnecdn.net/2023/07/11/Man-Hinh-copy.jpg?w=900&h=0&q=100&dpr=1&fit=crop&s=chbiqcGcGQGaC_9goF2V7Q", "https://i1-vnexpress.vnecdn.net/2023/07/11/Tem-Xe-copy.jpg?w=900&h=0&q=100&dpr=1&fit=crop&s=vmniuiy7FLMC1sah6e1vsw"],
        address: "789 Fourth Street",
        location: "30.98765, 40.12345",
        status: "Unavailable",
        statusComment: "Under maintenance",
        user: {
            userId: 103,
            name: "Bob Smith",
            email: "bob@example.com",
            phone: "5556667777",
            gender: "Male",
            dob: "1985-08-15",
            address: "101 Main Street",
            avatar: "avatar3.jpg",
            password: "hashedPassword",
            avatarUrl: "https://yt3.googleusercontent.com/-CFTJHU7fEWb7BYEb6Jh9gm1EpetvVGQqtof0Rbh-VQRIznYYKJxCaqv_9HeBcmJmIsp2vOO9JU=s900-c-k-c0x00ffffff-no-rj",
            role: {
                roleId: 2,
                roleName: "Admin",
                deleted: false,
                createDatetime: "",
                updateDatetime: "",
                createUserId: 0,
                updateUserId: 0
            },
            phoneVerified: true,
            balance: 200,
            googleIdentity: "google789",
        },
        createDatetime: "2022-03-01T10:15:00Z",
        model: {
            id: 3,
            modelName: "Touring Explorer",
            modelImage: "model3.jpg",
            brand: {
                id: 3,
                brandName: "Amazing Brand",
                brandImage: "brand3.jpg",
            },
        },
        miscellaneous: "Additional details",
        description: "A comfortable touring motorbike",
        distance: 25,
        isFavourite: false,
    },
    {
        id: 17,
        licensePlate: "PQR456",
        releaseYear: 2019,
        type: "Điện",
        priceRent: 70,
        equipments: "Helmet, RainCoat",
        fuelConsumption: 5.0,
        maxDeliveryDistance: 60,
        freeDeliveryRange: 12,
        feeOfDeliveryPerKm: 6,
        provinceId: 3,
        districtId: 103,
        wardId: 1003,
        image: "motorbike3.jpg",
        imageUrl: ["https://i1-vnexpress.vnecdn.net/2023/07/11/Man-Hinh-copy.jpg?w=900&h=0&q=100&dpr=1&fit=crop&s=chbiqcGcGQGaC_9goF2V7Q", "https://i1-vnexpress.vnecdn.net/2023/07/11/Tem-Xe-copy.jpg?w=900&h=0&q=100&dpr=1&fit=crop&s=vmniuiy7FLMC1sah6e1vsw"],
        address: "789 Fourth Street",
        location: "30.98765, 40.12345",
        status: "Unavailable",
        statusComment: "Under maintenance",
        user: {
            userId: 103,
            name: "Bob Smith",
            email: "bob@example.com",
            phone: "5556667777",
            gender: "Male",
            dob: "1985-08-15",
            address: "101 Main Street",
            avatar: "avatar3.jpg",
            password: "hashedPassword",
            avatarUrl: "https://yt3.googleusercontent.com/-CFTJHU7fEWb7BYEb6Jh9gm1EpetvVGQqtof0Rbh-VQRIznYYKJxCaqv_9HeBcmJmIsp2vOO9JU=s900-c-k-c0x00ffffff-no-rj",
            role: {
                roleId: 2,
                roleName: "Admin",
                deleted: false,
                createDatetime: "",
                updateDatetime: "",
                createUserId: 0,
                updateUserId: 0
            },
            phoneVerified: true,
            balance: 200,
            googleIdentity: "google789",
        },
        createDatetime: "2022-03-01T10:15:00Z",
        model: {
            id: 3,
            modelName: "Touring Explorer",
            modelImage: "model3.jpg",
            brand: {
                id: 3,
                brandName: "Amazing Brand",
                brandImage: "brand3.jpg",
            },
        },
        miscellaneous: "Additional details",
        description: "A comfortable touring motorbike",
        distance: 25,
        isFavourite: false,
    },
];

export default function HotMotorbikesOfMonthComponent() {
    const { isMobile } = useThemePage();
    const navigate = useNavigate();
    const { t } = usei18next();

    return (
        <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'} width={'100%'}
            sx={{
                backgroundColor: '#f1f1f1',
            }}>
            <Box
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
                justifyContent={'start'}
                gap={'8px'}
                width={'100%'}
                padding={"32px 64px"}
            >
                <Typography sx={{
                    fontSize: isMobile ? '24px' : '32px',
                    fontWeight: 'bold',
                    color: 'common.black',
                }}>Xe hot trong tháng</Typography>
                {/* list motorbikes */}
                {
                    <Box sx={{
                        minHeight: '65vh',
                        width: '100%',
                        display: 'flex',
                    }} alignItems={'center'} justifyContent={'center'}


                    >
                        <Grid
                            width={"100%"}
                            container
                            columnSpacing={{ xs: 1, sm: 1, md: 1 }}
                            rowSpacing={{ xs: 1, sm: 2, md: 3 }}
                        >
                            {motorbikes.map((item: Motorbike, index: number) => (
                                <Grid key={index} item xs={12} sm={6} md={4} lg={3} xl={3} sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <MotorbikeInforCard motorbike={item} isFavoritePage={false}
                                    // startDate={values.startDate} 
                                    // endDate={values.endDate} 
                                    // searchedAddress={address} 
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                }
            </Box>
        </Box>
    )
}
