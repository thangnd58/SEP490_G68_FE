import api from "./BaseService"
import {
    Booking,
    BookingRequest,
    BookingResponse,
    CartInforResponse,
    IncomeFromMotorbike,
    ShoppingCart,
} from "../utils/type";

const apiGetPreviewBooking = "/preview-booking";
const apiPostBooking = "/booking";
const apiGetListBooking = "/user/booking";
const apiGetListCart = "/booking-cart";
const apiGetListRentalBooking = '/rental-history';
const apiGetLatLng = '/location/get-lat-lng-by-address';
const apiGetAllBooking = '/bookings';

export const BookingService = {
    getPreviewBooking: async (
        bookPreview: BookingRequest
    ): Promise<BookingResponse> => {
        const response = await api.post(apiGetPreviewBooking, bookPreview);
        return response.data;
    },
    postBooking: async (bookData: BookingRequest) => {
        const response = await api.post(apiPostBooking, bookData);
        return response.data;
    },
    getListBookingCurrentUser: async (): Promise<Booking[]> => {
        const response = await api.get(apiGetListBooking)
        return response.data
    },
    getListBooking: async (): Promise<Booking[]> => {
        const response = await api.get(apiGetAllBooking)
        return response.data
    },
    getBookingById: async (id: string): Promise<Booking> => {
        const response = await api.get(`${apiPostBooking}/${id}`)
        return response.data
    },
    cancelBooking: async (id: number) => {
        const response = await api.put(`${apiPostBooking}/${id}/cancel`)
        return response.data
    },
    getListShoppingCart: async (): Promise<CartInforResponse[]> => {
        const response = await api.get(apiGetListCart);
        return response.data;
    },
    deleteMotorbikeInCart: async (motorbikeId: number, bookingCartId: number) => {
        return await api.delete(`/booking-cart/${bookingCartId}/${motorbikeId}`);
    },
    addCart: async (motorbikeId: number, startDatetime: string, endDatetime: string, address?: string) => {
        return await api.post("/booking-cart", { motorbikeId, startDatetime, endDatetime, address });
    },
    getListRentalBooking: async (): Promise<Booking[]> => {
        const response = await api.get(apiGetListRentalBooking)
        return response.data
    },
    getRentalBookingDetail: async (id: string): Promise<Booking> => {
        const response = await api.get(`${apiGetListRentalBooking}/${id}`)
        return response.data
    },
    updateStatusBookingDetail: async (bookingId: number | undefined, motorbikeid: string | undefined, status: string | undefined) => { // status: 'accept' | 'reject' | 'cancel' | 'return'
        return await api.put(`${apiPostBooking}/${bookingId}/${status}/${motorbikeid}`)
    },
    getLatLngByAddress: async (address: string) => {
        const res = await api.get(`${apiGetLatLng}/${encodeURIComponent(address)}`)
        return res.data
    },
    updateReturnInfo: async (bookingId: number, info: { returnAddress: string, returnDatetime: string }) => {
        const res = await api.put(`${apiPostBooking}/${bookingId}/return`, info);
        return res.data
    },
    updateStatusReturn: async (bookingId: number, info: { returnStatus: string, returnStatusComment: string }) => {
        const res = await api.put(`${apiPostBooking}/${bookingId}/approve-return`, info);
        return res.data;
    },
    getIncomeFromMotorbike: async (motorbikeId?: number, fromDate?: string, toDate?: string): Promise<IncomeFromMotorbike[]> => {
        const res = await api.get(`/motorbikes/booking-statistic?MotorbikeId=${motorbikeId || ""}&From=${fromDate || ""}&To=${toDate || ""}`);
        return res.data;
    }
}