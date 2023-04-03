import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    _id: null,
    token: null,
    firstName: null,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLogin: (state, action) => {
            state._id = action.payload._id;
            state.token = action.payload.token;
            state.firstName = action.payload.firstName;
        },
        setLogout: state => {
            state._id = null;
            state.token = null;
            state.firstName = null;
        }
    }
})



export const { setLogin, setLogout } = authSlice.actions;
export default authSlice.reducer;