import {
    Booking,
    BookingRequest,
    BookingResponse,
    ShoppingCart,
} from "../utils/type";
import api from "./BaseService";

const apiGetPreviewBooking = "/preview-booking";
const apiPostBooking = "/booking";
const apiGetListBooking = "/user/booking";
const apiGetListCart = "/booking-cart";

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
        const response = await api.get(apiGetListBooking);
        return response.data;
    },
    getListShoppingCart: async (
        address: string,
        startDatetime: string,
        endDatetime: string,
        couponCode: string
    ): Promise<ShoppingCart[]> => {
        return await api.get(
            apiGetListCart +
                "?Address=" +
                address +
                "&StartDatetime=" +
                startDatetime +
                "&EndDatetime=" +
                endDatetime +
                "&CouponCode=" +
                couponCode
        );
    },
    deleteCart: async (Id: number) => {
        return await api.delete(`/booking-cart/${Id}`);
    },
    addCart: async (Id: number) => {
        return await api.post("/booking-cart", { motorbikeId: Id });
    },
};
