import { createSlice} from "@reduxjs/toolkit";

const initialState = null

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    //set actions
    setUser:(state,{payload})=>payload,
    unsetUser:()=>initialState,
    //call actions
    checkUser(){},
    logOutUser(state,action){},
    signUpUser(state,action){},
    logInUser(state,action){}
  },
});

// Action creators are generated for each case reducer function
export const { setUser,logOutUser,signUpUser,logInUser,checkUser,unsetUser } = userSlice.actions;

export const userReducer =  userSlice.reducer;