import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    activePanelName: 'menu'
}

export const PanelsSlice = createSlice({
    name: 'panels',
    initialState,
    reducers: {
        changePanel: (state, action) => {
            state.activePanelName = action.payload
        }
    }
})

export const { changePanel } = PanelsSlice.actions;

export default PanelsSlice.reducer; 