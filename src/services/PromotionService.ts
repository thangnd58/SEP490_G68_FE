import { Promotion } from "../utils/type"
import api from "./BaseService"

const apiGetAllPromotion = '/promotions'

export const PromotionService = {
    getAllPromotion: async (): Promise<Promotion[]> => {
        const response = await api.get(apiGetAllPromotion)
        return response.data
    },
}