import { createSlice } from "@reduxjs/toolkit";

const initialState = false

export const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    //set actions
    onLoad:()=>true,
    onComplete:()=>false,
    //call actions
    setLoading(){},
    unsetLoading(){},
  },
});

// Action creators are generated for each case reducer function
export const { setLoading, unsetLoading, onLoad ,onComplete} = loadingSlice.actions;

export const loadingReducer =  loadingSlice.reducer;