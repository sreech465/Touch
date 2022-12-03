import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiEngine4, apiEngine5 } from '../Assets/helpers/ApiRoute';

export const uploadPost = createAsyncThunk('posts/uploadPost', async body => {
    console.log('bodyPOst', body);
    const res = await apiEngine5('api/createPost', body);
    console.log('resPOst', res);
    return res;
});

export const getPostDetails = createAsyncThunk(
    'posts/getPostDetails',
    async body => {
        const res = await apiEngine4('api/getPostDetails', body);
        return res;
    },
);

const postSlice = createSlice({
    name: 'post',
    initialState: {},
    reducers: {
        likePost: (state) => {
console.log('fghfgh')
            state.postDetails =
            {
                ...state.postDetails,
                isLiked: state.postDetails.isLiked ? 0 : 1,
                like_count: state.postDetails.isLiked
                    ? state.postDetails.like_count - 1
                    : state.postDetails.like_count + 1,
            };
        }
    },
    extraReducers: {
        [getPostDetails.fulfilled]: (state, action) => {
            state.postDetails = action.payload?.message[0].postData;
        },
    },
});


export const { likePost } = postSlice.actions;


export default postSlice.reducer;

