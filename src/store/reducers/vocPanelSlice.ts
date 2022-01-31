import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface VocPanelState {
    search: string;
    sort: 'off' | 'asc' | 'desc';
}

const initialState: VocPanelState = {
    search: '',
    sort: 'off',
}

export const vocPanelSlice = createSlice({
    name: 'vocpanel',
    initialState,
    reducers: {
        setSearch: (state, action) => {
          state.search = action.payload;
        },
        setSort: (state, action: PayloadAction<'off' | 'asc' | 'desc'>) => {
          state.sort = action.payload;
        },
    }
})

export const { setSearch, setSort } = vocPanelSlice.actions;

export default vocPanelSlice.reducer; 