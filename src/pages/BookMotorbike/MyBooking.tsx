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
import { Booking, Feedback, Motorbike } from '../../utils/type';
import MyBookingItem from './components/MyBookingItem';
import { transform } from 'typescript';
import { useAppDispatch, useAppSelector } from '../../hooks/useAction';
import { getUserInfo } from '../../redux/reducers/authReducer';
import { CommentItem } from '../UserProfilePage/UserInforModal';
import useThemePage from '../../hooks/useThemePage';
import MotorbikeInforCard from '../HomePage/components/MotorbikeInforCard';
import { NoDataImage } from '../../assets/images';
import { useNavigate } from 'react-router-dom';
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    const { isMobile } = useThemePage();
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: isMobile ? 0 : 3 }}>
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
    const [listBooing, setListBooking] = useState<Booking[]>([]);
    const [listMotorbikeWithFeedback, setListMotorbikeWithFeedback] = useState<Motorbike[]>([]);
    const [isLoad, setIsLoad] = useState<boolean>(false);
    const { user } = useAppSelector((state) => state.userInfo);
    const { isMobile } = useThemePage();
    const navigate = useNavigate();

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            setIsLoad(true);
            const dataBooking = await BookingService.getListBookingCurrentUser();
            if (dataBooking) {
                setListBooking(dataBooking);

                const filteredBookings = dataBooking.filter((booking) =>
                    booking.motorbikes.some((motorbike) =>
                        motorbike.feedbacks.some((feedback) => feedback.user.userId === user?.userId)
                    )
                );
                const motorbikesWithFeedback = filteredBookings.flatMap((booking) => booking.motorbikes);
                // Remove duplicates based on motorbikeId
                const uniqueMotorbikeIds = Array.from(new Set(motorbikesWithFeedback.map((motorbike) => motorbike.id)));
                // Filter out duplicate motorbikes
                const uniqueMotorbikes = uniqueMotorbikeIds.map((motorbikeId) =>
                    motorbikesWithFeedback.find((motorbike) => motorbike.id === motorbikeId)
                ) as Motorbike[];
                setListMotorbikeWithFeedback(uniqueMotorbikes);

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
                margin: isMobile ? "16px 0px" : "32px 0px",
                gap: isMobile ? "16px" : '32px'
            }}
        >
            <Typography
                variant='h1'
                color={theme.palette.text.primary}
                fontSize={isMobile ? "24px" : "32px"}
                lineHeight={isMobile ? "48px" : "60px"}
                fontWeight={"600"}
                sx={{ textAlign: 'center' }}>
                {t("header.my_booking")}
            </Typography>
            <Paper elevation={2} sx={{ width: isMobile ? "92.5%" : '80%', bgcolor: 'background.paper' }}>
                <Box sx={{ borderRadius: '8px 8px 0px 0px', borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        variant={isMobile ? "scrollable" : "standard"}
                        scrollButtons="auto"
                        value={value} onChange={handleChange} aria-label="basic tabs example">
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
                        }} label={t("myBooking.myfeedback")} {...a11yProps(2)} />
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
                            }).reverse()
                    } />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={2}>
                    {
                        listMotorbikeWithFeedback.length > 0 ?
                            (
                                listMotorbikeWithFeedback.
                                    map((item: Motorbike, index1: number) => {
                                        return (
                                            <Box key={index1} sx={{
                                                backgroundColor: "rgb(5, 69, 19, 0.1)",
                                                borderRadius: '8px',
                                                padding: '16px',
                                                alignItems: 'start',
                                                display: 'flex',
                                                flexDirection: isMobile ? "column" : "row",
                                                justifyContent: 'center',
                                                marginTop: index1 === 0 ? "0px" : "16px",
                                                gap: isMobile ? "16px" : "0px",

                                            }}>
                                                <Box display={"flex"} flexDirection={"column"} width={isMobile ? "100%" : "auto"} alignItems={"center"} justifyContent={"center"}>
                                                    <MotorbikeInforCard isInModal canClickDetailPage motorbike={item} isFavoritePage={false} isNotFavorite isIntroduced={true} />
                                                </Box>
                                                {/* motorbike card */}
                                                {/* Box comment */}
                                                <Box sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'start',
                                                    alignItems: 'center',
                                                    marginLeft: isMobile ? "0px" : "16px",
                                                    width: '100%',
                                                }}>
                                                    {
                                                        item.feedbacks.length > 0 ?
                                                            (
                                                                item.feedbacks.map((feedback: Feedback, index2: number) => {
                                                                    return (
                                                                        user?.userId === feedback.user.userId &&
                                                                        <Box key={index2} sx={{
                                                                            width: '100%',
                                                                            display: 'flex',
                                                                            flexDirection: 'column',
                                                                            justifyContent: 'start',
                                                                            alignItems: 'center',
                                                                            marginTop: index2 === 0 ? "0px" : "16px",
                                                                        }}>
                                                                            <CommentItem isDetail bookingId={feedback.bookingId} avatar={feedback.user.avatarUrl} dateComment={feedback.createDatetime} name={feedback.user.name} rating={feedback.rating} comment={feedback.comment}
                                                                                replyComment={feedback.response ? feedback.response.comment : ""}
                                                                                dateReplyComment={feedback.response ? feedback.response.createDatetime : ""}
                                                                                isMobile={isMobile} />
                                                                        </Box>
                                                                    )

                                                                })
                                                            ) : (null)
                                                    }
                                                </Box>
                                            </Box>
                                        )
                                    })
                            ) : (
                                <Box display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"} width={"100%"} marginTop={2} gap={2}>
                                    <img src={NoDataImage} alt={"no-data"} width={isMobile ? "200px" : "400px"} height={isMobile ? "200px" : "400px"} />
                                </Box>
                            )
                    }
                </CustomTabPanel>
            </Paper>
        </Box>
    );
}
