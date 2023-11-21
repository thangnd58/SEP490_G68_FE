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
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { MoneyFlow } from '../../../utils/type';
import StatisticService from '../../../services/StatisticService';
import { Box, Typography } from "@mui/material"
import theme from '../../../utils/theme';
import usei18next from '../../../hooks/usei18next';
import useThemePage from '../../../hooks/useThemePage';

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
    const { t } = usei18next()
    const { isMobile } = useThemePage();
    useEffect(() => {
        StatisticService.moneyFlow().then((data) => {
            setMoneyFlow(data)
        })
    }, [])

    // Grouping data by month
    const groupDataByMonth = (data: any) => {
        return data.reduce((acc: any, item: any) => {
            const monthYear = item.createDate.slice(0, 7);
            if (!acc[monthYear]) {
                acc[monthYear] = { moneyIn: 0, moneyOut: 0 };
            }
            acc[monthYear].moneyIn += item.moneyIn || 0;
            acc[monthYear].moneyOut += item.moneyOut || 0;
            return acc;
        }, {});
    };

    const aggregatedData = groupDataByMonth(moneyFlow);

    const dataEntries = Object.entries(aggregatedData);

    dataEntries.sort(([monthYearA], [monthYearB]) => {
        const dateA : any = new Date(`${monthYearA}-01`);
        const dateB : any = new Date(`${monthYearB}-01`);
        return dateA - dateB;
    });

    const labels = dataEntries.map(([monthYear]) => monthYear);
    const sortedMoneyInValues = dataEntries.map(([_, data] : any) => data.moneyIn);
    const sortedMoneyOutValues = dataEntries.map(([_, data] : any) => data.moneyOut);

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Money Out',
                data: sortedMoneyOutValues,
                fill: false,
                borderColor: 'rgba(75,192,192,1)',
                lineTension: 0.1,
            },
            {
                label: 'Money In',
                data: sortedMoneyInValues,
                fill: false,
                borderColor: 'rgba(192,75,192,1)',
                lineTension: 0.1,
            },
        ],
    };

    const chartOptions: any = {
        responsive: true,
        scales: {
            xAxes: [{
                type: 'time',
                scaleLabel: {
                    display: true,
                    labelString: 'Date',
                },
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Money',
                },
            }],
        },
    };

    return (
        <Box >
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
                flexDirection: isMobile ? 'column' : 'row'
            }}>
                <Box width={'100%'}>
                    <Line data={chartData} options={chartOptions} />
                </Box>
            </Box>
        </Box>

    )
}