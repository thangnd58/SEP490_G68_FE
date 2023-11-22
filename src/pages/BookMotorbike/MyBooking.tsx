import * as React from 'react';
import { useState, useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Paper } from '@mui/material';
import usei18next from '../../hooks/usei18next';
import theme from '../../utils/theme';
import LoginForm from '../AccountPage/components/LoginForm';
import { BookingService } from '../../services/BookingService';
import { Booking } from '../../utils/type';
import MyBookingItem from './components/MyBookingItem';
import { transform } from 'typescript';
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function MyBooking() {
    const [value, setValue] = useState(0);
    const { t } = usei18next();

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    useEffect(() => {
        getData();
    }, []);

    const [listBooing, setListBooking] = useState<Booking[]>([]);
    const [isLoad, setIsLoad] = useState<boolean>(false);
    const getData = async () => {
        try {
            setIsLoad(true);
            const dataBooking = await BookingService.getListBookingCurrentUser();
            if (dataBooking) {
                setListBooking(dataBooking);
                setIsLoad(false);
            }
            else {
                setListBooking([]);
            }
        } catch (error) {
            console.log(error);
        }
        setIsLoad(false);
    }

    type StatusOrder = {
        [key: string]: number;
    };

    const statusOrder: StatusOrder = {
        Delivered: 1,
        PendingDelivery: 2,
        Paid: 3,
        PendingPayment: 4,
    };

    return (
        <Box
            sx={{ width: '100%' }}
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '32px 0px',
                gap: '32px'
            }}
        >
            <Typography
                variant='h1'
                color={theme.palette.text.primary}
                fontSize={"32px"}
                lineHeight={"60px"}
                fontWeight={"600"}
                sx={{ textAlign: 'center' }}>
                {t("header.my_booking")}
            </Typography>
            <Paper elevation={2} sx={{ width: '80%', bgcolor: 'background.paper' }}>
                <Box sx={{borderRadius:'8px 8px 0px 0px', borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab
                            sx={{
                                textTransform: 'none',
                                fontSize: '16px',
                                fontWeight: '600',
                                lineHeight: '24px',
                                color: theme.palette.text.primary,
                                '&.Mui-selected': {
                                    color: theme.palette.primary.main
                                },
                                '&:hover': {
                                    color: theme.palette.primary.main,
                                    transform: 'scale(1.01)',
                                    transition: 'all 0.3s ease-in-out',
                                }
                            }}
                            label={t("myBooking.currentBooking")}
                            {...a11yProps(0)}
                        />
                        <Tab sx={{
                            textTransform: 'none',
                            fontSize: '16px',
                            fontWeight: '600',
                            lineHeight: '24px',
                            color: theme.palette.text.primary,
                            '&.Mui-selected': {
                                color: theme.palette.primary.main
                            },
                            '&:hover': {
                                color: theme.palette.primary.main,
                                transform: 'scale(1.01)',
                                transition: 'all 0.3s ease-in-out',
                            }
                        }} label={t("myBooking.historyBooking")} {...a11yProps(1)} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    <MyBookingItem isLoad={isLoad} index={0} bookings={
                        listBooing
                            .filter(
                                (item) =>
                                    item.status === 'PendingPayment' ||
                                    item.status === 'Paid' ||
                                    item.status === 'PendingDelivery' ||
                                    item.status === 'Delivered'
                            )
                            .sort((a, b) => {
                                // Sort by status order
                                const statusComparison = statusOrder[a.status] - statusOrder[b.status];

                                // If statuses are different, use the status order
                                if (statusComparison !== 0) {
                                    return statusComparison;
                                }

                                // If statuses are the same, sort by startDatetime
                                return new Date(a.startDatetime).valueOf() - new Date(b.startDatetime).valueOf();
                            })
                    } />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <MyBookingItem isLoad={isLoad} index={1} bookings={
                        listBooing
                            .filter(
                                (item) =>
                                    item.status === 'Cancelled' ||
                                    item.status === 'PendingReview' ||
                                    item.status === 'Finished'
                            )
                            .sort((a, b) => {

                                // If statuses are the same, sort by startDatetime
                                return new Date(a.updateDatetime).valueOf() - new Date(b.updateDatetime).valueOf();
                            })
                    } />
                </CustomTabPanel>
            </Paper>
        </Box>
    );
}
