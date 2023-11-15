import { Motorbike, SearchMotorbikeRequest } from "../utils/type"
import api from "./BaseService"

const apiGetMotorbikesByPlaceAndTime = '/motorbike-rental?'


export const SearchMotorbikeServices = {
    getMotorbikesByFilter: async (searchMotorbikeRequest: SearchMotorbikeRequest): Promise<Motorbike[]> => {
        const addressURL = searchMotorbikeRequest.address ? 'Address=' + searchMotorbikeRequest.address : ''
        const startDateURL = searchMotorbikeRequest.startDate ? '&StartDatetime=' + searchMotorbikeRequest.startDate : ''
        const endDateURL = searchMotorbikeRequest.endDate ? '&EndDatetime=' + searchMotorbikeRequest.endDate : ''
        const minPriceURL = searchMotorbikeRequest.minPrice ? '&PriceRentFrom=' + searchMotorbikeRequest.minPrice : ''
        const maxPriceURL = searchMotorbikeRequest.maxPrice ? '&PriceRentTo=' + searchMotorbikeRequest.maxPrice : ''
        const typeURL = searchMotorbikeRequest.type ? '&Type=' + searchMotorbikeRequest.type : ''
        const brandIdURL = searchMotorbikeRequest.brandId ? '&BrandId=' + searchMotorbikeRequest.brandId : ''
        const releaseYearURL = searchMotorbikeRequest.minReleaseYear && searchMotorbikeRequest.maxReleaseYear ? '&ReleaseYearFrom=' + searchMotorbikeRequest.minReleaseYear + '&ReleaseYearTo=' + searchMotorbikeRequest.maxReleaseYear : ''
        const fuelConsumptionURL = searchMotorbikeRequest.minFuelConsumption && searchMotorbikeRequest.maxFuelConsumption ? '&FuelConsumptionFrom=' + searchMotorbikeRequest.minFuelConsumption + '&FuelConsumptionTo=' + searchMotorbikeRequest.maxFuelConsumption : ''
        const equipmentURL = searchMotorbikeRequest.equipments ? '&Equipments=' + searchMotorbikeRequest.equipments : ''
        const mindistanceURL = searchMotorbikeRequest.minDistance ? '&MinDeliveryDistance=' + searchMotorbikeRequest.minDistance : ''
        const maxdistanceURL = searchMotorbikeRequest.maxDistance ? '&MaxDeliveryDistance=' + searchMotorbikeRequest.maxDistance : ''
        const maximumRatingURL = searchMotorbikeRequest.maximumRating ? '&MaximumRating=' + searchMotorbikeRequest.maximumRating : ''
        const orderByURL = searchMotorbikeRequest.orderBy ? '&OrderBy=' + searchMotorbikeRequest.orderBy : ''
        const response = await api.get(
            apiGetMotorbikesByPlaceAndTime
            + addressURL
            + startDateURL
            + endDateURL
            + minPriceURL
            + maxPriceURL
            + typeURL
            + brandIdURL
            + releaseYearURL
            + fuelConsumptionURL
            + equipmentURL
            + mindistanceURL
            + maxdistanceURL
            + maximumRatingURL
            + orderByURL
        )
        return response.data
    }

}
