import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedId: null,
    selectedName: null,
    friends: null,
}

export const friendsSlice = createSlice({
    name: 'friends',
    initialState,
    reducers: {
        setSelected: (state, action) => {
            state.selectedId = action.payload.user;
            state.selectedName = action.payload.firstName;
        },
        setFriends: (state, action) => {
            state.friends = action.payload.friends;
        },
        removeFriends: (state, action) => {
            state.friends = state.friends.filter(friend => {
                return friend._id !== action.payload.user;
            })
        },
    }
})

export const { setFriends, setSelected, removeFriends } = friendsSlice.actions;
export default friendsSlice.reducer;