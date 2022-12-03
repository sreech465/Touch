import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import {
  apiEngine0,
  apiEngine2,
  apiEngine4,
  isResponseOk,
} from '../Assets/helpers/ApiRoute';

export const getReels = createAsyncThunk('getreels', async (_, { rejectWithValue }) => {
  console.log('step2----------Reels');
  const res = await apiEngine0('api/reels', 'get');
  console.log('ReelData', res);
  if (isResponseOk(res)) {
    return res;
} else {
    return rejectWithValue(res);
}
});

export const reelLikeAction = createAsyncThunk('reellike', async body => {
  console.log('reelLikeAction', body);
  const res = await apiEngine2('api/reelLike','post', body);
  console.log('reelLikeAction', res);
  return res;
});

export const reelCommentAction = createAsyncThunk('reelComment', async data => {
  const res = await apiEngine2('api/reelComment','post', body);
  return res;
});

const reelsAdapter = createEntityAdapter({selectId:(item)=>item.reels_id});

// export const reportAction = createAsyncThunk(
//   'feed/report',
//   async (body, { rejectWithValue }) => {
//     const res = await apiEngine2('api/report', 'post', body);
//     if (isResponseOk(res)) {
//       return res;
//     } else {
//       return rejectWithValue(res);
//     }
//   },
// );

const reelSlice = createSlice({
  name: 'reels',
  initialState: reelsAdapter.getInitialState(),
  reducers: {
    datadetsucces: (state, action) => {
      state.loading = false;
    },
    setAllReels:reelsAdapter.setAll,
    updateReel:reelsAdapter.updateOne
  },
  extraReducers: {
    [getReels.fulfilled]: (state, { payload }) => {
      console.log('Reeldata--new', payload);
    },
    [getReels.pending]: (state, { payload }) => {
      // console.log('feeddatapending', payload);
      state.loading = true;
    },
  },
});

export const { datadetsucces, addNewPost,setAllReels,updateReel } = reelSlice.actions;
export default reelSlice.reducer;
export const { selectAll: selectAllReels, selectTotal: totalReels } = reelsAdapter.getSelectors((state) => state.reels);
