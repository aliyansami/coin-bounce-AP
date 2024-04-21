

import { createSlice } from "@reduxjs/toolkit";
/*This is a*/
/*initaial state of user*/
const initialState={
_id:"",
email:"",
username:"",
auth:false
}       

/*Reducers are responsible for specifying how the application's state changes in response to dispatched actions.
 When an action is dispatched, it contains information about the type of action and any additional data needed to update the state.
 The reducer takes this information and returns a new state based on the action's type and payload*/

/*the data from backend will be in action.payload */
export const userSlice=createSlice({
    name:"user",
    initialState,
    reducers:{
        setUser:(state,action)=>{
            const{_id,email,username,auth}=action.payload;
            state._id=_id;
            state.email=email;
            state.username=username;
            state.auth=auth;
        },
        resetUser:(state)=>{
            state._id="";
            state.email="";
            state.username="";
            state.auth=false;
        }
    }
})

export const {setUser,resetUser}=userSlice.actions;
export default userSlice.reducer;