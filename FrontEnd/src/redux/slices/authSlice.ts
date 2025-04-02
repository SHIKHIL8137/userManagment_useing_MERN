import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const storedToken = localStorage.getItem("token");
const storedUser = localStorage.getItem("user");

interface authState {
  isAuthenticated: boolean;
  user: { name: string; email: string; image: string; userID: string } | null;
  token: string | null;
}

const initialState: authState = {
  isAuthenticated: !!storedToken,
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: authState["user"]; token: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;

      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    updateUser: (state, action: PayloadAction<{ userData: authState["user"] }>) => {
      state.user = action.payload.userData;
      localStorage.setItem("user", JSON.stringify(action.payload.userData)); 
    },
  },
});

export const { login, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
