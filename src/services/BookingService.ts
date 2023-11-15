import { Booking, BookingRequest, BookingResponse } from "../utils/type"
import api from "./BaseService"

const apiGetPreviewBooking = '/preview-booking'
const apiPostBooking = '/booking'
const apiGetListBooking = '/user/booking'
const apiCancelBooking = '/booking'


export const BookingService = {
    getPreviewBooking: async (bookPreview: BookingRequest): Promise<BookingResponse> => {
        const response = await api.post(apiGetPreviewBooking, bookPreview)
        return response.data
    },
    postBooking: async (bookData: BookingRequest) => {
        const response = await api.post(apiPostBooking, bookData)
        return response.data
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
    }
}

