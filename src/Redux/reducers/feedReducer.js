import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  apiEngine0,
  apiEngine2,
  apiEngine4,
  isResponseOk,
} from '../../Assets/helpers/ApiRoute';

const initialState = {
  feedData: null,
  reelData: null,
  loading: false,
  storyData: null,
  error: '',
  feedOffset: 0,
};

export const getFeedData = createAsyncThunk('getfeeddata', async data => {
  console.log('step2--------------');
  const result = await apiEngine4('api/getFeeds', data);
  return { result: result, offset: data };
});

export const getReels = createAsyncThunk('getreels', async () => {
  console.log('step2----------Reels');
  const result = await apiEngine0('api/reels', 'get');
  return result;
});

export const postlikeFuction = createAsyncThunk('postlike', async data => {
  console.log('likeaction:', data);
  const result = await apiEngine4('api/postLike', data);
  console.log('WhatHappend4', result);
  // return { 'result': result, 'data': JSON.parse(data) };

});

export const likeFuction = createAsyncThunk('like', async data => {
  // console.log('likeaction:', data);
  // const result = await apiEngine4('api/postLike', data);
  // console.log('WhatHappend4', result);
  // return { 'result': result, 'data': JSON.parse(data) };
  return { data: data };
});


export const reportAction = createAsyncThunk(
  'feed/report',
  async (body, { rejectWithValue }) => {
    const res = await apiEngine2('api/report', 'post', body);
    if (isResponseOk(res)) {
      return res;
    } else {
      return rejectWithValue(res);
    }
  },
);

const feedReducer = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    datadetsucces: (state, action) => {
      state.loading = false;
    },
    addNewPost: (state, action) => {
      state.feedData.unshift(action.payload);
    },
  },
  extraReducers: {
    [getFeedData.fulfilled]: (state, { payload }) => {
      if (payload.result.status == 200) {
        var x = JSON.parse(payload.offset);
        console.log('---feeddata2', x.offset);
        state.feedData =
          x.offset > 0
            ? [...state.feedData, ...payload.result.data]
            : payload.result.data;
        state.feedOffset = x.offset + 10;
        state.loading = false;
      }
    },
    [getFeedData.pending]: (state, { payload }) => {
      // console.log('feeddatapending', payload);
      state.loading = true;
    },
    [getReels.fulfilled]: (state, { payload }) => {
      //console.log('feeddata2', payload);
      if (payload.status == 200) {
        state.reelData = payload.data;
        state.loading = false;
      }
    },
    [getReels.pending]: (state, { payload }) => {
      // console.log('feeddatapending', payload);
      state.loading = true;
    },

    [likeFuction.fulfilled]: (state, { payload }) => {
      // console.log('yttfc',payload.data, payload.data.reaction_id)
        if(payload.data.isForm==''){
          state.feedData[payload.data.index] = { ...state.feedData[payload.data.index],
            isLiked: payload.data.reaction_id,
            like_count: payload.data.reaction_id
              ? payload.data.like_count + 1
              : payload.data.like_count - 1,
          };
        }
        else{
          state.feedData = state.feedData.map(item => {
            if (payload.data.post_id === item.postid) {
              // console.log('gsgsgsgs--------',payload.data.post_id,item.postid)
              return {
                ...item,
                isLiked: item.isLiked ? 0 : 1,
                like_count: item.isLiked
                  ? item.like_count - 1
                  : item.like_count + 1,
              };
            }
    
            console.log('postDetails--------', state.posts)
    
            return item;
          });
        }


      console.log('postDetails--------', state.posts);


      // if (state.posts?.postDetails)
      //   state.posts.postDetails = {
      //     ...state.posts.postDetails,
      //     isLiked: item.isLiked ? 0 : 1,
      //     like_count: item.isLiked
      //       ? item.like_count - 1
      //       : item.like_count + 1,
      //   };
    },
    [likeFuction.pending]: (state, { payload }) => {
      console.log('likeFuction.pending', payload);
    },
  },
});

export const { datadetsucces, addNewPost } = feedReducer.actions;
export default feedReducer.reducer;
