import authReducer  from "./authReducer";
import notificationReducer from "./notificationReducer";
import userFavouriteReducer  from "./userFavouriteReducer";
import cartReducer from "./cartReducer";

export const rootReducer = {
    userFavouriteInfo: userFavouriteReducer,
    userInfo: authReducer,
    userNotificationInfo: notificationReducer,
    shoppingCartInfo: cartReducer,
};