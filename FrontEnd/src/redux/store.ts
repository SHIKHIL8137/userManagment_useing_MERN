import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import dynamicReducer from "./slices/dynamicSlice";
import adminNavReducer from "./slices/adminSlice";
import adminAuthReducer from './slices/adminAuthSlice'
const store = configureStore({
  reducer: {
    auth: authReducer,
    dynamic: dynamicReducer,
    adminNav: adminNavReducer,
    adminAuth : adminAuthReducer 
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
