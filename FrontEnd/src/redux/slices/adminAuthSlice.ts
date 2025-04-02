import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const storedToken = localStorage.getItem("atoken");
const storedUser = localStorage.getItem("admin");

interface adminAuthState {
  isAuthenticated: boolean;
  user: { name: string; email: string; image: string; userID: string } | null;
  token: string | null;
}

const initialState: adminAuthState = {
  isAuthenticated: !!storedToken,
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken,
};

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: adminAuthState["user"]; token: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;

      localStorage.setItem("atoken", action.payload.token);
      localStorage.setItem("admin", JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;

      localStorage.removeItem("atoken");
      localStorage.removeItem("admin");
    },
    updateUser: (state, action: PayloadAction<{ userData: adminAuthState["user"] }>) => {
      state.user = action.payload.userData;
      localStorage.setItem("admin", JSON.stringify(action.payload.userData)); 
    },
  },
});

export const { login, logout, updateUser } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
