import { RequestWithDrawal, WalletHistory } from "../utils/type";
import api from "./BaseService";


const deposite = '/payment/deposite'
const updateMoney = '/payment/updatebalanceforuser'
const historyDeposite = '/payment/history/deposit'
const historyWithdrawal = '/payment/history/withdraw'
const requestWithdrawal = '/payment/requestwithdraw'

const WalletService = {
    depositeMoney: async (amount: string) => {
        return await api.post(`${deposite}/${amount}`);
    },
    updateMoneyToDb: async (queryString: string) => {
        return await api.post(`${updateMoney}${queryString}`);
    },
    depositeList: async (): Promise<WalletHistory[]> => {
        return await api.get(historyDeposite)
    },
    withdrawList: async (): Promise<WalletHistory[]> => {
        return await api.get(historyWithdrawal)
    },
    requesWithdrawal: async (requestData: RequestWithDrawal) => {
        return await api.post(requestWithdrawal, requestData)
    }
}

export default WalletService