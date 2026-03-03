import { createSlice } from "@reduxjs/toolkit";

const requestsSlice = createSlice({
    name:'requestsSlice',
    initialState:null,
    reducers:{
        setRequests:(state,action)=>{
            return action.payload
        },
        removeRequests:()=>{
            return null
        },
        filterRequest:(state,action)=>{
            const filteredRequests = state.filter(req=>req._id!==action.payload)
            return filteredRequests
        }
    }
})

export const {setRequests,removeRequests,filterRequest} = requestsSlice.actions
export default requestsSlice.reducer