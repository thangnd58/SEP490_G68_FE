import { createSlice } from "@reduxjs/toolkit";
import { CartInforResponse } from "../../utils/type";
import { AppDispatch, RootState } from "../store";
import { BookingService } from "../../services/BookingService";
import UserService from "../../services/UserService";
import { useSelector } from "react-redux";

export interface ShoppingCartInfo {
    shoppingCart: CartInforResponse[];
}

const initialState: ShoppingCartInfo = { shoppingCart: [] };

export const shoppingCartReducer = createSlice({
    name: "shoppingCartInfo",
    initialState,
    reducers: {
        updateCart: (state, action) => {
            state.shoppingCart = action.payload;
        },
    },
});

export const getCartInfo = (): any => {

    // const { user } = useSelector((state: RootState) => state.userInfo);
    return async (dispatch: AppDispatch, getState: RootState) => {
        try {
            // check if user is logged in
            if (!UserService.isLoggedIn()) return;
            const shoppingCartInfo = await BookingService.getListShoppingCart();
            dispatch(updateCart(shoppingCartInfo));
            //@ts-ignore
        } catch (err) { }
    };
};

export const { updateCart } = shoppingCartReducer.actions;
export default shoppingCartReducer.reducer;
