import { Promotion, PromotionRequest, Report, ReportCategory, ReportRequest } from "../utils/type"
import api from "./BaseService"

const apiGetReportCaetgory = '/report-category'
const apiReport = '/report'
const apiReportManagement = '/report-management'

export const ReportService = {
    getAllReportCategory: async (): Promise<ReportCategory[]> => {
        const response = await api.get(apiGetReportCaetgory)
        return response.data
    },
    postReport: async (dataReport: ReportRequest) => {
        const response = await api.post(apiReport, dataReport)
        return response.data
    },
    getAllReportManagement: async (): Promise<Report[]> => {
        const response = await api.get(apiReportManagement)
        return response.data
    },
    getReportById: async (id: string): Promise<Report> => {
        const response = await api.get(`${apiReport}/${id}`)
        return response.data
    },
    responseReport: async (id: string, dataResponse: any) => {
        const response = await api.put(`${apiReport}/${id}/reponse`, dataResponse)
        return response.data
    }
}