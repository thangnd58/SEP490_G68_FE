import { MoneyFlow, RequestWithDrawal, ResponseWithDrawal, WalletHistory } from "../utils/type";
import api from "./BaseService";
import dayjs from 'dayjs';


const moneyFlow = '/MoneyFlow'
const adminBalance = '/moneyflow/balance'

const StatisticService = {
    moneyFlow: async (startDate: string, endDate: string): Promise<MoneyFlow[]> => {
        const res = await api.get(`${moneyFlow}?startDate=${startDate}&endDate=${endDate}`);
        return res.data;
    },
    adminBalance: async (): Promise<number> => {
        const res = await api.get(`${adminBalance}`);
        return res.data.balance;
    },
}

export default StatisticService