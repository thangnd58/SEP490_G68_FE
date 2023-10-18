import axios from "axios"
import { District, Province } from "../utils/type"

const baseUrl = 'https://provinces.open-api.vn/api'

const apiGetProvinces = baseUrl + '/?depth=1'
const apiGetDistrictsByProvince = baseUrl + '/p'
const apiGetWardsByDistrict = baseUrl + '/d'

export const ProvincesService = {
    getAllProvinces: async (): Promise<Province[]> => {
        const response = await axios.get(apiGetProvinces)
        return response.data
    },
    getDistrictsByProvince: async (code: number): Promise<Province> => {
        const response = await axios.get(apiGetDistrictsByProvince + '/' + code + '?depth=2')
        return response.data
    },
    getWardsByDistrict: async (code: number): Promise<District> => {
        const response = await axios.get(apiGetWardsByDistrict + '/' + code + '?depth=2')
        return response.data
    }
    
}
