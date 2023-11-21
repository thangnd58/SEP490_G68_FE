import { createSlice } from "@reduxjs/toolkit";
import { UserFavourite } from "../../utils/type";
import { AppDispatch, RootState } from "../store";
import UserService from "../../services/UserService";


export interface UserFavouriteInfo {
  userFavourite: UserFavourite[]
}

const initialState: UserFavouriteInfo = { userFavourite: [] }

export const userFavouriteReducer = createSlice({
  name: "userFavouriteInfo",
  initialState,
  reducers: {
    updateFavourite: (state, action) => {
      state.userFavourite = action.payload
    }
  },
});

export const getUserFavouriteInfo = (): any => {
  return async (dispatch: AppDispatch, getState: RootState) => {
    try {
      const userFavouriteInfo = await UserService.getUserFavourite();
      //@ts-ignore
      dispatch(updateFavourite(userFavouriteInfo.data))
    } catch (err) { }
  };
};

export const { updateFavourite } = userFavouriteReducer.actions;
export default userFavouriteReducer.reducer;
