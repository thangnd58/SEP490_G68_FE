import { MoneyFlow, RequestWithDrawal, ResponseWithDrawal, WalletHistory } from "../utils/type";
import api from "./BaseService";
import dayjs from 'dayjs';


const moneyFlow = '/MoneyFlow'

const StatisticService = {
    moneyFlow: async (startDate: string, endDate: string): Promise<MoneyFlow[]> => {
        const res = await api.get(`${moneyFlow}?startDate=${startDate}&endDate=${endDate}`);
        return res.data;
    },
}

export default StatisticService