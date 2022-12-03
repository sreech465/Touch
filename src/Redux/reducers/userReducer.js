/* eslint-disable prettier/prettier */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiEngine0, apiEngine2, apiEngine5, isResponseOk } from '../../Assets/helpers/ApiRoute';

const initialState = {
  message: null,
  loading: false,
  error: '',
  follower: null,
  following: null,
  profileInfo: ''
};

export const Updateuser = createAsyncThunk('user/updateuser', async (body) => {
  console.log('updateuser');
  const result = await apiEngine5('api/updateProfile', body);
  console.log('WhatHappend3', result);
  return result;
});

export const getProfileInfo = createAsyncThunk('user/profileInfo', async (body) => {
  const result = await apiEngine2('api/profileInfo', 'post', body);
  return { 'result': result, 'offset': body.offset };
});


export const followUser = createAsyncThunk('user/followUser', async (body, { rejectWithValue }) => {
  const res = await apiEngine2('api/followUser', 'post', body);
  if (isResponseOk(res)) {
    return res;
  } else {
    return rejectWithValue(res);
  }
}
);

export const updateAccountType = createAsyncThunk('user/updateaccount', async (body) => {
  console.log('update account type',body)
  const result = await apiEngine2('api/updatePersonalInfo', 'post', body);
  return result;
});

export const getFollower = createAsyncThunk('getfollower', async (id) => {
  console.log("getFollower.....step2", id.profile_id)
  const result = await apiEngine0('api/followerList/' + id.profile_id, 'get')
  return result;
});

export const getFollowing = createAsyncThunk('getfollowing', async (id) => {
  console.log("getFollowing.....step2", id.profile_id)
  const result = await apiEngine0('api/followingUserList/' + id.profile_id, 'get')
  return result;
});

const userReducer = createSlice({
  name: 'userData',
  initialState,
  reducers: {
    datasetsucces: (state, action) => {
      state.loading = false;
    },
  },
  extraReducers: {
    [getFollower.fulfilled]: (state, { payload }) => {
      state.follower = null;
      console.log('feeddata', payload);
      if (payload.status == 200) {
        state.follower = payload.data;
        state.loading = false;
      }
    },
    [getFollower.pending]: (state, { payload }) => {
      console.log('feeddata', payload);
      state.follower = null;
      state.loading = true;

    },
    [getFollower.rejected]: (state, { payload }) => {
      console.log('feeddata', payload);
      state.follower = null;
      state.loading = false;

    },
    // the upper code is for Get follower
    [getFollowing.fulfilled]: (state, { payload }) => {
      state.following = null;
      if (payload.status == 200) {
        state.following = payload.data;
        state.loading = false;
      }
    },
    [getFollowing.pending]: (state, { payload }) => {
      console.log('feeddata', payload);
      state.following = null;
      state.loading = true;

    },
    [getFollowing.rejected]: (state, { payload }) => {
      console.log('feeddata', payload);
      state.following = null;
      state.loading = false;

    },
    // the upper code is for Get following
    [Updateuser.fulfilled]: (state, { payload }) => {
      console.log('feeddata', payload);
      if (payload.status == 200) {
        state.feedData = payload.message;
        state.loading = false;
      }
    },
    [Updateuser.pending]: (state, { payload }) => {
      console.log('feeddatapending', payload);
      state.loading = true;
    },
    [Updateuser.rejected]: (state, { payload }) => {
      console.log('feeddatapending', payload);
      state.feedData = payload.message;
      state.loading = false;
    },
    [getProfileInfo.fulfilled]: (state, { payload }) => {
      const data = payload.result.message[0];
      data.userInfo[0].profile_social_details = JSON.parse(data.userInfo[0].profile_social_details)
      //  console.log('coming :- ', payload.offset,  data.postInfo)
      state.profileInfo = payload.offset > 0 ? {
        ...state.profileInfo,
        postInfo: [...state.profileInfo.postInfo, ...data.postInfo]
      } : data
    },
    [updateAccountType.fulfilled]:(state,{payload})=>{
      console.log(payload,"haiii")
    },
    [followUser.fulfilled]: (state, { payload }) => {
      if (payload?.data) {
        state.profileInfo.userInfo[0].follow_status = payload?.data[0]?.follow_status;
        if (payload?.message == 'User followed successfully.') {
          state.profileInfo.userInfo[0].profile_social_details.followers_count++;
        }
        else if (payload?.message == 'User UnFollowed successfully.') {
          state.profileInfo.userInfo[0].profile_social_details.followers_count--;
        }
      }
    },
  },
});

export const { datasetsucces } = userReducer.actions;
export default userReducer.reducer;
