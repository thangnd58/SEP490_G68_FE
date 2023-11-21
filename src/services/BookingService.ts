import api from "./BaseService"
import {
    Booking,
    BookingRequest,
    BookingResponse,
    CartInforResponse,
    ShoppingCart,
} from "../utils/type";

const apiGetPreviewBooking = "/preview-booking";
const apiPostBooking = "/booking";
const apiGetListBooking = "/user/booking";
const apiGetListCart = "/booking-cart";
const apiCancelBooking = '/booking';
const apiGetListRentalBooking = '/rental-history';

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
}