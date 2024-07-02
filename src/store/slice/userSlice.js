import {createSlice} from "@reduxjs/toolkit"

const initialState = {
 loggedIn : false,
 loading : true,
 userData : null,
} 

export const userSlice = createSlice({
name : "userSlice",
initialState,
reducers:{
 userData : (state,action) =>{
  state.userData = action.payload;
  state.loading = false
  state.loggedIn = true
 }
}
})

export const {userData} = userSlice.actions

export default userSlice.reducer;