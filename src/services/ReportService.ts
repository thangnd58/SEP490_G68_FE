import { Promotion, PromotionRequest, ReportCategory } from "../utils/type"
import api from "./BaseService"

const apiGetReportCaetgory = '/report-category'

export const ReportService = {
    getAllReportCategory: async (): Promise<ReportCategory[]> => {
        const response = await api.get(apiGetReportCaetgory)
        return response.data
    },
}