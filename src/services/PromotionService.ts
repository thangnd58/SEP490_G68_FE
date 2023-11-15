import { Promotion } from "../utils/type"
import api from "./BaseService"

const apiGetAllPromotionValid = '/promotion/current'

export const PromotionService = {
    getAllPromotionValid: async (): Promise<Promotion[]> => {
        const response = await api.get(apiGetAllPromotionValid)
        return response.data
    },
}