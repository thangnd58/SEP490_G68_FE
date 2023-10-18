import { Brand, Model } from "../utils/type"
import api from "./BaseService"

const apiGetAllBrand = '/Brand/GetAllBrand'
const apiGetAllMotorbike = '/Model/GetModelByBrandId'

export const PostMotorbikeService = {
    getAllBrand: async (): Promise<Brand[]> => {
        const response = await api.get(apiGetAllBrand)
        return response.data
    },
    getAllModel: async (brandId: number): Promise<Model[]> => {
        const response = await api.get(apiGetAllMotorbike + '?id=' + brandId)
        return response.data
    }
}

