import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: { error: null | string } = {
    error: null
}

export const errorSlice = createSlice({
    name: 'error',
    initialState,
    reducers: {
        setError: (state, action: PayloadAction<null | string>) => {
            state.error = action.payload;
        }
    }
})

export const { setError } = errorSlice.actions;

export default errorSlice.reducer; 