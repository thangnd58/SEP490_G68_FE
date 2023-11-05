import { Motorbike, SearchMotorbikeRequest } from "../utils/type"
import api from "./BaseService"

const apiGetMotorbikesByPlaceAndTime = '/motorbike-rental'


export const SearchMotorbikeServices = {
    getMotorbikesByPlaceAndTime: async (searchMotorbikeRequest: SearchMotorbikeRequest): Promise<Motorbike[]> => {
        const response = await api.get(apiGetMotorbikesByPlaceAndTime + '?Address=' + searchMotorbikeRequest.address + '&StartDatetime=' + searchMotorbikeRequest.startDate + '&EndDatetime=' + searchMotorbikeRequest.endDate)
        return response.data
    }
}
