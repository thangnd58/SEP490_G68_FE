import React, { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js/auto';
import { Line, Pie } from 'react-chartjs-2';
import { MoneyFlow } from '../../../utils/type';
import StatisticService from '../../../services/StatisticService';
import { Box, Checkbox, Typography } from "@mui/material"
import theme from '../../../utils/theme';
import usei18next from '../../../hooks/usei18next';
import useThemePage from '../../../hooks/useThemePage';
import dayjs from 'dayjs';
import { DatePicker } from 'antd';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { formatMoney, formatMoneyNew } from '../../../utils/helper';
import MyCustomButton from '../../../components/common/MyButton';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/Constant';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);


export const DashboardManagement = () => {
    const [moneyFlow, setMoneyFlow] = useState<MoneyFlow[]>([])
    const { t, isVn } = usei18next()
    const { isMobile } = useThemePage();
    const today = dayjs();
    const sevenDaysBefore = today.subtract(7, 'day');
    const { RangePicker } = DatePicker;
    const navigate = useNavigate();

    const groupDataByDate = (data: any) => {
        return data.reduce((acc: any, item: any) => {
            const date = item.createDate.slice(0, 10); // Get year-month-day
            if (!acc[date]) {
                acc[date] = { moneyIn: 0, moneyOut: 0 };
            }
            acc[date].moneyIn += item.moneyIn || 0;
            acc[date].moneyOut += item.moneyOut || 0;
            return acc;
        }, {});
    };

    const aggregatedData = groupDataByDate(moneyFlow);

    const dataEntries = Object.entries(aggregatedData);

    dataEntries.sort(([dateA], [dateB]) => {
        const parsedDateA: any = new Date(dateA);
        const parsedDateB: any = new Date(dateB);
        return parsedDateA - parsedDateB;
    });

    const labels = dataEntries.map(([date]) => date);
    const sortedMoneyInValues = dataEntries.map(([_, data]: any) => data.moneyIn);
    const sortedMoneyOutValues = dataEntries.map(([_, data]: any) => data.moneyOut);


    const chartData = {

        labels: labels,
        datasets: [
            {
                label: isVn ? 'Tiền ra' : 'Money Out',
                data: sortedMoneyOutValues,
                fill: true,
                borderColor: 'rgba(192,75,192,1)',
                lineTension: 0.1,
            },
            {
                label: isVn ? 'Tiền vào' : 'Money In',
                data: sortedMoneyInValues,
                fill: true,
                borderColor: 'rgba(75,192,192,1)',
                lineTension: 0.1,
            },
        ],
    };

    const chartOptions: any = {
        plugins: {
            title: {
                display: true,
                text: `${t("dashBoardManager.dashboard.totalMoney")}: ${formatMoney(moneyFlow.reduce((total, m) => total + m.moneyIn, 0) + moneyFlow.reduce((total, m) => total + m.moneyOut, 0))}`,
                font: {
                    size: 24,
                    weight: 'bold',
                },
            },
            subtitle: {
                display: true,
                text: `${t("dashBoardManager.dashboard.totalMoneyIn")}: ${formatMoney(moneyFlow.reduce((total, m) => total + m.moneyIn, 0))}    ${t("dashBoardManager.dashboard.totalMoneyOut")}: ${formatMoney(moneyFlow.reduce((total, m) => total + m.moneyOut, 0))}    ${t("dashBoardManager.dashboard.income")}: ${formatMoney(moneyFlow.reduce((total, m) => total + m.moneyIn, 0) - moneyFlow.reduce((total, m) => total + m.moneyOut, 0))}`,
                font: {
                    size: 18,
                    weight: 'normal',
                },
                padding: {
                    top: 5, // Adjust top padding for subtext
                },
                lineHeight: 1.2, // Adjust line height for better spacing
            },
        },
        responsive: true,
    };

    const pieOptions: any = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: t("dashBoardManager.dashboard.paymentType"),
                font: {
                    size: 24,
                    weight: 'bold',
                },
            },
        },
    };

    // Calculate the counts of each payment type
    const paymentTypeCounts = moneyFlow.reduce((acc: any, item: any) => {
        if (!acc[item.type]) {
            acc[item.type] = 0;
        }
        acc[item.type]++;
        return acc;
    }, {});

    const paymentTypeLabels = Object.keys(paymentTypeCounts);
    const paymentTypeData = Object.values(paymentTypeCounts);

    const pieChartData = {
        labels: paymentTypeLabels,
        datasets: [{
            label: isVn ? 'Số lượng' : 'Number',
            data: paymentTypeData,
            backgroundColor: [
                '#af6633',
                '#74BDE6',
            ],
            borderWidth: 1,
        }],
    };


    const formik = useFormik({
        initialValues: {
            startDate: sevenDaysBefore.format("YYYY-MM-DD"),
            endDate: today.format("YYYY-MM-DD"),
        },
        validationSchema: Yup.object({
            startDate: Yup.string().required(t("postMotorbike.registedForm.startDateRequired")),
            endDate: Yup.string().required(t("postMotorbike.registedForm.endDateRequired")),
        }),

        onSubmit: async (values, actions) => {

        }
    }
    );

    const {
        values,
        setFieldValue
    } = formik;

    useEffect(() => {
        StatisticService.moneyFlow(values.startDate, values.endDate).then((data) => {
            setMoneyFlow(data)
        })
    }, [values.endDate, values.startDate])

    const [accoutBalance, setAccoutBalance] = useState<number>(0);

    const getAccountBalance = async () => {
        try {
            const data = await StatisticService.adminBalance();
            setAccoutBalance(data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getAccountBalance();
    }, [])
    const [getAllData, setGetAllData] = useState<boolean>(false);

    console.log(accoutBalance);

    return (
        <Box height={"700px"}>
            <Box sx={{ backgroundColor: "#8B4513" }}>
                <Typography color={theme.palette.common.white} variant="h1" fontSize={24} fontWeight={700} pb={2}>
                    {t("dashBoardManager.Navigation.dashboard")}
                </Typography>

            </Box>
            <Box sx={{
                backgroundColor: "#fff",
                borderRadius: "4px",
                display: 'flex',
                alignItems: 'center',
                p: '8px',
                flexDirection: isMobile ? 'column' : 'row'
            }}>
                <Box width={'100%'}>
                    <Box display={'flex'} flexDirection={isMobile ? 'column' : 'row'} gap={'8px'} justifyContent={'space-between'} color={'common.black'} alignItems={'stretch'}>
                        {/* Part 1 */}
                        <Box width={isMobile ? '100%' : '70%'} display={'flex'} flexDirection={isMobile ? 'column' : 'row'} gap={'8px'} justifyContent={'space-between'} alignItems={'stretch'} sx={{
                            borderRadius: "8px",
                            border: "2px solid #8B4513",
                        }}>
                            <Typography
                                width={'100%'}
                                fontWeight={'bold'}
                                alignSelf={'center'}
                                textAlign={"center"}
                                color={"#666666"}
                                fontSize={isMobile ? '20px' : '24px'}>
                                {t("dashBoardManager.dashboard.transactionStatistics") + ": "}
                                <span style={{ color: theme.palette.primary.main }}>
                                    {formatMoney(accoutBalance)}
                                </span>
                            </Typography>
                        </Box>
                        {/* Part 2 */}
                        <Box width={isMobile ? '100%' : '27%'}>
                            <Box display={'flex'} width={'100%'} pb={'8px'} >
                                <Typography color={"#666666"} width={'50%'} fontWeight={'bold'} >{t("dashBoardManager.dashboard.startDate")}</Typography>
                                <Typography color={"#666666"} width={'50%'} fontWeight={'bold'} >{t("dashBoardManager.dashboard.endDate")}</Typography>
                            </Box>
                            <RangePicker
                                className="custom-range-picker custom-table"
                                style={{
                                    fontFamily: 'Inter',
                                    fontStyle: 'normal',
                                    fontSize: '20px',
                                    height: isMobile ? '32px' : 'auto',
                                    color: "#666666"
                                }}
                                size={isMobile ? 'middle' : 'large'}
                                format="YYYY-MM-DD"
                                placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                                value={[
                                    dayjs(values.startDate, "YYYY-MM-DD"),
                                    dayjs(values.endDate, "YYYY-MM-DD"),
                                ]}
                                onChange={(dates, dateStrings) => {
                                    setFieldValue('startDate', dateStrings[0]);
                                    setFieldValue('endDate', dateStrings[1]);
                                }}
                                disabled={getAllData}
                                allowClear={false}
                            />
                        </Box>
                        <Checkbox
                            onClick={() => setGetAllData(!getAllData)}
                            checked={getAllData}
                            sx={{
                                color: theme.palette.primary.main,
                                '&.Mui-checked': {
                                    color: theme.palette.primary.main,
                                },
                                // none background hover
                                '&:hover': {
                                    backgroundColor: 'transparent',
                                },
                            }}
                        />

                    </Box>
                    <Box width={'100%'} marginTop={'32px'} sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
                        <Box width={isMobile ? '100%' : '70%'} >
                            <Box display={'flex'} width={'100%'} pb={'8px'} justifyContent={'space-between'}>
                                <MyCustomButton
                                    content={t('dashBoardManager.dashboard.moneyIn')}
                                    onClick={() => navigate(ROUTES.admin.dashboardStatistic.moneyInDetail)}
                                    width="30%"
                                    variant='outlined'
                                    borderColor='rgba(75,192,192,1)'
                                    backgroundColor='rgba(75,192,192,1)'
                                    fontColor='#fff'
                                    height="32px"
                                    fontSize={14}
                                    fontWeight={500}
                                    uppercase
                                    borderRadius={8} />
                                <MyCustomButton
                                    content={t('dashBoardManager.dashboard.moneyOut')}
                                    onClick={() => navigate(ROUTES.admin.dashboardStatistic.moneyOutDetail)}
                                    width="30%"
                                    variant='outlined'
                                    borderColor='#bb3bbb'
                                    backgroundColor='#bb3bbb'
                                    fontColor='#fff'
                                    height="32px"
                                    fontSize={14}
                                    fontWeight={500}
                                    uppercase
                                    borderRadius={8} />
                                <MyCustomButton
                                    content={t('dashBoardManager.dashboard.revenue')}
                                    onClick={() => navigate(ROUTES.admin.dashboardStatistic.revenueDetail)}
                                    width="30%"
                                    variant='outlined'
                                    borderColor='#42a753'
                                    backgroundColor='#42a753'
                                    fontColor='#fff'
                                    height="32px"
                                    fontSize={14}
                                    fontWeight={500}
                                    uppercase
                                    borderRadius={8} />

                            </Box>
                            <Line data={chartData} options={chartOptions} />
                        </Box>
                        <Box width={isMobile ? '100%' : '30%'}>
                            <Pie data={pieChartData} options={pieOptions} />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>

    )
}