import axios from "axios"
import { Motorbike, SearchMotorbikeRequest } from "../utils/type"

const baseUrl = 'https://provinces.open-api.vn/api'

const apiGetMotorbikesByPlaceAndTime = baseUrl + '/?depth=1'


export const SearchMotorbikeServices = {
    getMotorbikesByPlaceAndTime: async (searchMotorbikeRequest: SearchMotorbikeRequest): Promise<Motorbike[]> => {
        const response = await axios.get(apiGetMotorbikesByPlaceAndTime)
        return response.data
    }
}
