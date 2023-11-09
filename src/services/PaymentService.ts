import api from "./BaseService"

const apiCreateRequestPayment = '/payment/booking'
const apiProcessPayment = '/payment/processpaymentbookingrespone'
const apiPaymentWithWallet = '/payment/booking/wallet'


export const PaymentService = {
    createRequestBooking: async (bookingId: number, amount: number) => {
        return await api.post(`${apiCreateRequestPayment}/${amount}/${bookingId}`)
    },
    processPaymentDb: async (queryString: string) => {
        return await api.post(`${apiProcessPayment}${queryString}`);
    },
    paymentWithWallet: async (bookingId: number, amount: number) => {
        return await api.post(`${apiPaymentWithWallet}/${amount}/${bookingId}`)
    }
}