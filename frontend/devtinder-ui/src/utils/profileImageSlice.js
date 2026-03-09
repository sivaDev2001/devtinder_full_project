import {createSlice} from '@reduxjs/toolkit'

const profileImageSlice = createSlice(
    {
        name:'profileImage',
        initialState:null,
        reducers:{
            addImage:(state,action)=>{
                return action.payload
            },
            removeImage:(state,action)=>{
                return null
            }
        }
    }
)

export const {addImage,removeImage} = profileImageSlice.actions

export default profileImageSlice.reducer