import { News, NewsRequest } from "../utils/type"
import api from "./BaseService"

const urlNews = '/news'

const NewsManagementService = {
    getAllNews: async (): Promise<News[]> => {
        return (await api.get(urlNews)).data;
    },
    getNewsById: async (id: string):Promise<News> => {
        return (await api.get(`${urlNews}/${id}`)).data;
    },
    editNews: async (id: string, newsReq: NewsRequest) => {
        return await api.put(`${urlNews}/${id}`, newsReq)
    },
    addNews: async (newsReq: NewsRequest) => {
        return await api.post(`${urlNews}`, newsReq)
    }
}
export default NewsManagementService