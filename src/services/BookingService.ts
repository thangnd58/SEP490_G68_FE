import { Booking, BookingRequest, BookingResponse } from "../utils/type"
import api from "./BaseService"

const apiGetPreviewBooking = '/preview-booking'
const apiPostBooking = '/booking'
const apiGetListBooking = '/user/booking'


export const BookingService = {
    getPreviewBooking: async (bookPreview: BookingRequest): Promise<BookingResponse> => {
        const response = await api.post(apiGetPreviewBooking, bookPreview)
        return response.data
    },
    postBooking: async (bookData: BookingRequest) => {
        const response = await api.post(apiPostBooking, bookData)
        return response.data
    },
    getListBookingCurrentUser: async () : Promise<Booking[]>=> {
        const response = await api.get(apiGetListBooking)
        return response.data
    }
}

