import { BookingRequest, BookingResponse } from "../utils/type"
import api from "./BaseService"

const apiGetPreviewBooking = '/preview-booking'


export const BookingService = {
    getPreviewBooking: async (bookPreview: BookingRequest) : Promise<BookingResponse> => {
        const response = await api.post(apiGetPreviewBooking, bookPreview)
        return response.data
    },
}

