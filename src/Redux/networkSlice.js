import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiEngine2, isResponseOk } from '../Assets/helpers/ApiRoute';


export const getNetworkUsersAction = createAsyncThunk(
    'network/getNetworkUsersAction',
    async (body, { rejectWithValue }) => {
        const res = await apiEngine2('api/getNetworkUsers', 'post', body);
        if (isResponseOk(res)) {
            return res;
        } else {
            return rejectWithValue(res);
        }
    }
);

export const sendRequestToNetworkUserAction = createAsyncThunk(
    'network/sendRequestToNetworkUser',
    async (body, { rejectWithValue }) => {
        const res = await apiEngine2('api/sendRequestToNetworkUser', 'post', body);
        if (isResponseOk(res)) {
            console.log('fhgfhddhf',res)
            return res;
        } else {
            return rejectWithValue(res);
        }
    }
);

export const undoNetworkUserAction = createAsyncThunk(
    'network/undoNetworkUserAction',
    async (body, { rejectWithValue }) => {
        const res = await apiEngine2('api/undoNetworkUser', 'post', body);
        if (isResponseOk(res)) {
            return res;
        } else {
            return rejectWithValue(res);
        }
    }
);

export const uploadInterestsAction = createAsyncThunk(
    'network/uploadInterestsAction',
    async (body, { rejectWithValue }) => {
        const res = await apiEngine2('api/interests', 'post', body);
        if (isResponseOk(res)) {
            return res;
        } else {
            return rejectWithValue(res);
        }
    }
);



const initialState = {
    networkUsers: [],
    requestMsg: '',
}

const networkSlice = createSlice({
    name: 'network',
    initialState,
    reducers: {
        clearRequestMessage: (state) => {
            state.requestMsg = '';
        }
    },
    extraReducers: {
        [getNetworkUsersAction.fulfilled]: (state, action) => {
            state.networkUsers = action.payload.message.data
        },
        [getNetworkUsersAction.rejected]: (state, action) => {
            state.networkUsers = [];
            state.requestMsg = action.payload.message;
        },
        [sendRequestToNetworkUserAction.fulfilled]: (state, action) => {
            state.requestMsg = action.payload.message
        },
        [undoNetworkUserAction.fulfilled]: (state, action) => {
            state.requestMsg = action.payload.message
        }
    }
});

export const { clearRequestMessage } = networkSlice.actions;

export default networkSlice.reducer;

