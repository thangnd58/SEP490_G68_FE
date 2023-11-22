import api from "./BaseService"
import {
    Booking,
    BookingRequest,
    BookingResponse,
    CartInforResponse,
    FeedbackRequest,
    ShoppingCart,
} from "../utils/type";

const apiFeedback = "/feedback";


export const FeedbackService = {
    postFeedback: async (req: FeedbackRequest) => {
        const response = await api.post(apiFeedback, req);
        return response.data;
    },
    putFeedback: async (id: string, req: FeedbackRequest) => {
        const response = await api.put(`${apiFeedback}/${id}`, req);
        return response.data;
    },
}