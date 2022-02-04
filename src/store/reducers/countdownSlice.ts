import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    countdown: 0
}

export const CountdownSlice = createSlice({
    name: 'countdown',
    initialState,
    reducers: {
        changeCountDown: (state, action) => {
            state.countdown = action.payload
        }
    }
})

export const { changeCountDown } = CountdownSlice.actions;

export default CountdownSlice.reducer; 