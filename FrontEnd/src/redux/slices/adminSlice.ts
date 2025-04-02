import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AdminState {
  selected: string;
}

const initialState: AdminState = {
  selected: "Dashboard",
};

const navDatas = createSlice({
  name: "navData",
  initialState,
  reducers: {
    handleNavClick: (state, action: PayloadAction<{ item: string }>) => {
      state.selected = action.payload.item;
    },
  },
});

export const { handleNavClick } = navDatas.actions;
export default navDatas.reducer;
