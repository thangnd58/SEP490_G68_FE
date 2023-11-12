import api from "./BaseService"

const apiNotification = '/notification'


export const NotificationService = {
    getAllUserNotification: async (): Promise<Notification> => {
        return await api.get(`${apiNotification}`)
    },
    getNotification: async (id: number): Promise<Notification> => {
        return await api.get(`${apiNotification}/${id}`)
    }
}