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
  user: storedUserInfo ? JSON.parse(storedUserInfo) : null,
};

export const authReducer = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    updateUser: (state, action)=> {
      state.user = action.payload
    }
  },
});

export const getUserInfo = (): any => {
  return async (dispatch: AppDispatch, getState: RootState) => {
    try {
      const userInfo = await UserService.getUserInfo();
      //@ts-ignore
      dispatch(updateUser(userInfo.data))
      //@ts-ignore
      localStorage.setItem("userInfo", JSON.stringify(userInfo.data));
    } catch (err) {}
  };
};

export const { updateUser } = authReducer.actions;
export default authReducer.reducer;
