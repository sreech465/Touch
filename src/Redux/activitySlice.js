import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiEngine0, apiEngine2, isResponseOk } from '../Assets/helpers/ApiRoute';


export const getUserActivity = createAsyncThunk(
    'activity/getUserActivity',
    async (_, { rejectWithValue }) => {
        const res = await apiEngine0('api/activity', 'get');
        if (isResponseOk(res)) {
            return res;
        } else {
            return rejectWithValue(res);
        }
    }
);

export const getUserPoints = createAsyncThunk(
    'activity/getUserPoints',
    async (_, { rejectWithValue }) => {
        const res = await apiEngine0('api/points', 'get');
        if (isResponseOk(res)) {
            return res;
        } else {
            return rejectWithValue(res);
        }
    }
);

export const confirmFollowReqAction = createAsyncThunk(
    'activity/confirmFollowReqAction',
    async (body, { rejectWithValue }) => {
        const res = await apiEngine2('api/confirmFollReq', 'post', body);
        if (isResponseOk(res)) {
            return res;
        } else {
            return rejectWithValue(res);
        }
    }
);

export const cancelFollowReqAction = createAsyncThunk(
    'activity/cancelFollowReqAction',
    async (body, { rejectWithValue }) => {
        const res = await apiEngine2('api/cancelFollReq', 'post', body);
        if (isResponseOk(res)) {
            return res;
        } else {
            return rejectWithValue(res);
        }
    }
);

const initialState = {
    activeUsers: [],
    followRequests: [],
    notifications: [],
    points: { total_points: 0, detailedPoints: [] }
}

const activitySlice = createSlice({
    name: 'activity',
    initialState,
    reducers: {
        removeFollowRequest: (state, action) => {
            state.followRequests = state.followRequests.filter(req => req.follow_id !== action.payload.follow_id)
        }
    },
    extraReducers: {
        [getUserActivity.fulfilled]: (state, action) => {
            return { ...state, ...action.payload.data };
        },
        [getUserPoints.fulfilled]: (state, action) => {
            state.points = action.payload.data;
        },
    },
});

export const { removeFollowRequest } = activitySlice.actions;

export default activitySlice.reducer;

