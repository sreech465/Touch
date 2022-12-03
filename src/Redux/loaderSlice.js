import { createSlice } from "@reduxjs/toolkit";

// export const handleLoading = (action, (state) => {
//     state.loading = action.type.endsWith('/pending');
// });

function isPendingAction(action) {
    return action.type.endsWith('/pending')
}
function isFulfilledAction(action) {
    return action.type.endsWith('/fulfilled')
}
function isRejectedAction(action) {
    return action.type.endsWith('/rejected')
}

const initialState = {
    loading: false,
    error: ""
}

const loaderSlice = createSlice({
    name: 'loader',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addMatcher(isPendingAction, (state, action) => {
            state.loading = true
        })
        builder.addMatcher(isFulfilledAction, (state, action) => {
            state.loading = false
        })
        builder.addMatcher(isRejectedAction, (state, action) => {
            state.loading = false,
                state.error = action.payload
        })
    }
})

export default loaderSlice.reducer;