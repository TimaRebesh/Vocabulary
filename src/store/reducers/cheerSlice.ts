import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cheer: ''
}

export const CheerSlice = createSlice({
    name: 'cheer',
    initialState,
    reducers: {
        changeCheer: (state, action) => {
            const cheers = ['good job', 'well done', 'excellent', 'very good', 'perferct', 'congrats'];
            const getCheer = () => cheers[Math.floor(Math.random() * cheers.length)];
            let cheer = '';
            if (action.payload === 'stydied')
                cheer = 'you learned this word';
            if (action.payload === 'nextWord')
                cheer = '';
            if (action.payload === 'cheer') 
                cheer = getCheer();
            state.cheer = cheer;
        }
    }
})

export const { changeCheer } = CheerSlice.actions;

export default CheerSlice.reducer; 