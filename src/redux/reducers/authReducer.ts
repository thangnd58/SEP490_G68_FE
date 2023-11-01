import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction, ThunkAction } from "@reduxjs/toolkit";
import axios from "axios";
import { User } from "../../utils/type";
import { AppDispatch, RootState } from "../store";
import UserService from "../../services/UserService";

export interface UserInfo {
  user: null | User
}

const storedUserInfo = localStorage.getItem("userInfo");
const initialState: UserInfo = {
  user: UserService.isLoggedIn() ? (storedUserInfo ? JSON.parse(storedUserInfo) : null) : null,
};

export const authReducer = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      state.user = action.payload
    }
  },
});

export const getUserInfo = (): any => {
  return async (dispatch: AppDispatch, getState: RootState) => {
    try {
      if (UserService.isLoggedIn()) {
        const userInfo = await UserService.getUserInfo();
        console.log(userInfo);
        //@ts-ignore
        dispatch(updateUser(userInfo.data))
        //@ts-ignore
        localStorage.setItem("userInfo", JSON.stringify(userInfo.data));
      } else {
        localStorage.removeItem("userInfo");
      }
    } catch (err) { }
  };
};

export const { updateUser } = authReducer.actions;
export default authReducer.reducer;
