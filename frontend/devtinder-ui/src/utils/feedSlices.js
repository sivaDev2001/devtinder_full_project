import { createSlice } from "@reduxjs/toolkit"

const feedSlice = createSlice({
    name:'feedSlice',
    initialState:null,
    reducers:{
        addFeed:(state,action)=>{
            return action.payload
        },
        removeFeed:()=>{
            return null
        },
        filterFeed:(state,action)=>{
            return state.filter(user=>user._id!==action.payload) 
        }
    }
})

export const {addFeed,removeFeed,filterFeed} = feedSlice.actions
export default feedSlice.reducer