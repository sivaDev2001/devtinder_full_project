import { createSlice } from "@reduxjs/toolkit";

const paginationSlice = createSlice({
    name: 'paginationSlice',
    initialState: 1,
    reducers: {
        setPage: (state) => {
            return state + 1
        },
        resetPage: (state) => {
            return 1
        }
    }
})

export const { setPage, resetPage } = paginationSlice.actions
export default paginationSlice.reducer