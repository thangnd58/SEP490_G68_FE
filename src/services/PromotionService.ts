import { Promotion, PromotionRequest } from "../utils/type"
import api from "./BaseService"

const apiGetAllPromotionValid = '/promotion/current'
const apiGetAllPromotion = '/promotions'
const apiDeletePromotion = '/promotion'

export const PromotionService = {
    getAllPromotionValid: async (): Promise<Promotion[]> => {
        const response = await api.get(apiGetAllPromotionValid)
        return response.data
    },
    getAllPromotion: async (): Promise<Promotion[]> => {
        const response = await api.get(apiGetAllPromotion)
        return response.data
    },
    deletePromotion: async (id: string) => {
        const response = await api.delete(`${apiDeletePromotion}/${id}`)
        return response.data
    },
    getPromotionById: async (id: string): Promise<Promotion> => {
        return (await api.get(`${apiDeletePromotion}/${id}`)).data;
    },
    postPromotion: async (promotion: PromotionRequest) => {
        return (await api.post(`${apiDeletePromotion}`, promotion)).data;
    },
    putPromotion: async (id: string, promotion: PromotionRequest) => {
        return (await api.put(`${apiDeletePromotion}?id=${id}`, promotion)).data;
    },
}