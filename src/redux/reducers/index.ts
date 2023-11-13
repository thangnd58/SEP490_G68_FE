import authReducer  from "./authReducer";
import notificationReducer from "./notificationReducer";
import userFavouriteReducer  from "./userFavouriteReducer";

export const rootReducer = {
    userFavouriteInfo : userFavouriteReducer,
    userInfo: authReducer,
    userNotificationInfo: notificationReducer
    
}