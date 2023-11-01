import { RequestWithDrawal, ResponseWithDrawal, WalletHistory } from "../utils/type";
import api from "./BaseService";
import dayjs from 'dayjs';


const deposite = '/payment/deposite'
const updateMoney = '/payment/updatebalanceforuser'
const historyDeposite = '/payment/history/deposit'
const historyWithdrawal = '/payment/history/withdraw'
const requestWithdrawal = '/payment/requestwithdraw'
const listRequestWithdrawal = '/payment/list/requestwithdraw'
const changeStatusRequestWithdrawal = '/payment/approverequestwithdraw'

const WalletService = {
    depositeMoney: async (amount: string) => {
        return await api.post(`${deposite}/${amount}`);
    },
    updateMoneyToDb: async (queryString: string) => {
        return await api.post(`${updateMoney}${queryString}`);
    },
    depositeList: async (selectedDate: dayjs.Dayjs): Promise<WalletHistory[]> => {
        return await api.get(`${historyDeposite}/${selectedDate.month() + 1}/${selectedDate.year()}`)
    },
    withdrawList: async (selectedDate: dayjs.Dayjs): Promise<WalletHistory[]> => {
        return await api.get(`${historyWithdrawal}/${selectedDate.month() + 1}/${selectedDate.year()}`)
    },
    requesWithdrawal: async (requestData: RequestWithDrawal) => {
        return await api.post(requestWithdrawal, requestData)
    },
    getAllRequestWithdrawal: async () => {
        return await api.get(listRequestWithdrawal);
    },
    changeStatusRequestWithdrawal: async (id: number) => {
        return await api.post(`${changeStatusRequestWithdrawal}/${id}`)
    }
}

export default WalletService