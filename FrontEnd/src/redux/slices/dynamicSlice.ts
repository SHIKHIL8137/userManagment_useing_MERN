import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface dynamicTypes{
  navText1 : string,
}

const initialState:dynamicTypes = {
  navText1 :""
}
const dynamicData = createSlice({
  name:"dynamic",
  initialState,
  reducers:{
    changeData :(state,action:PayloadAction<{navText1:string}>)=>{
      state.navText1 = action.payload.navText1
    }
  }
})

export const{changeData}=dynamicData.actions;
export default dynamicData.reducer;
