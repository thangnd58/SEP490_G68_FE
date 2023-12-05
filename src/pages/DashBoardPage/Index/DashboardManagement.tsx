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
import { Box, Typography } from "@mui/material"
import theme from '../../../utils/theme';
import usei18next from '../../../hooks/usei18next';
import useThemePage from '../../../hooks/useThemePage';
import RegisterMotorbikeItem from '../../PostMotorbike/components/RegisterMotorbike/RegisterMotorbikeItem';
import dayjs from 'dayjs';
import { DatePicker } from 'antd';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { formatMoney } from '../../../utils/helper';

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
                text: `Tổng tiền giao dịch: ${formatMoney(moneyFlow.reduce((total, m) => total + m.moneyIn, 0) + moneyFlow.reduce((total, m) => total + m.moneyOut, 0))}`,
                font: {
                    size: 24,
                    weight: 'bold',
                },
            },
            subtitle: {
                display: true,
                text: `Tổng tiền vào: ${formatMoney(moneyFlow.reduce((total, m) => total + m.moneyIn, 0))}    Tổng tiền ra: ${formatMoney(moneyFlow.reduce((total, m) => total + m.moneyOut, 0))}    Doanh thu: ${formatMoney(moneyFlow.reduce((total, m) => total + m.moneyIn, 0) - moneyFlow.reduce((total, m) => total + m.moneyOut, 0))}`,
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
                text: 'Loại hình giao dịch',
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
                'rgba(255, 99, 132, 0.8)',
                'rgba(54, 162, 235, 0.8)',
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
                    <Box display={'flex'} flexDirection={isMobile ? 'column' : 'row'} gap={'8px'} justifyContent={'space-between'} color={'common.black'} alignItems={'start'}>
                        <Typography width={isMobile ? '100%' : '50%'} fontWeight={'bold'} fontSize={isMobile ? '20px' : '24px'}>Thống kê giao dịch</Typography>
                        <Box width={isMobile ? '100%' : '50%'}>
                            <Box display={'flex'} width={'100%'} pb={'8px'} >
                                <Typography width={'50%'} fontWeight={'bold'} >Thời gian bắt đầu</Typography>
                                <Typography width={'50%'} fontWeight={'bold'} >Thời gian kết thúc</Typography>
                            </Box>
                            <RangePicker
                                className="custom-range-picker custom-table"
                                style={{
                                    fontFamily: 'Inter',
                                    fontStyle: 'normal',
                                    fontSize: '20px',
                                }}
                                size='large'
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
                                allowClear={false}
                            />
                        </Box>
                    </Box>
                    <Box width={'100%'} marginTop={'32px'} sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
                        <Box width={isMobile ? '100%' : '70%'} >
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