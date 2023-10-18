import { Brand, Model } from "../utils/type"
import api from "./BaseService"

const apiGetAllBrand = '/brands'
const apiGetAllMotorbike = '/api/models'

export const PostMotorbikeService = {
    getAllBrand: async (): Promise<Brand[]> => {
        const response = await api.get(apiGetAllBrand)
        return response.data
    },
    getAllModel: async (brandId: number): Promise<Model[]> => {
        const response = await api.get(apiGetAllMotorbike + '/' + brandId)
        return response.data
    }
}

