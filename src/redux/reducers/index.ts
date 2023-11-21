import authReducer from "./authReducer";
import notificationReducer from "./notificationReducer";
import userFavouriteReducer from "./userFavouriteReducer";
import cartReducer from "./cartReducer";
import bookingReducer from "./bookingReducer";

export const rootReducer = {
    userFavouriteInfo: userFavouriteReducer,
    userInfo: authReducer,
    userNotificationInfo: notificationReducer,
    shoppingCartInfo: cartReducer,
    bookingInfo: bookingReducer,
};