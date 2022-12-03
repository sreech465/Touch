/* eslint-disable prettier/prettier */
import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { apiEngine2, apiEngine4,isResponseOk } from '../Assets/helpers/ApiRoute';

// Post Comment Thunks

export const getComments = createAsyncThunk(
    'getComments', async (body, { rejectWithValue }) => {
        console.log("getting id or not",body)
        const res = await apiEngine2('api/getComments','post', body)
        console.log("in Api call",res)
        if (isResponseOk(res)) {
            return res;
        } else {
            return rejectWithValue(res);
        }
    }
)

export const getCommentReplies = createAsyncThunk(
    'getCommentReplies', async body => {
        const res = await apiEngine2('api/getCommentReplies','post', body)
        console.log("in Api call",res)
        if (isResponseOk(res)) {
            return res;
        } else {
            return rejectWithValue(res);
        }
    }
)

export const postCommentAction = createAsyncThunk(
    'postComment', async body => {
        const res = await apiEngine4('api/postComment', body);
        return res;
    });


export const editUserCommentAction = createAsyncThunk(
    'editComment',
    async body => {
        const res = await apiEngine4('api/editPostComment', body);
        return res;
    },
);

export const postCommentLikeAction = createAsyncThunk(
    'likeComment',
    async body => {
        const res = await apiEngine4('api/insertPostCommentLike', body);
        return res;
    },
);

export const deleteUserCommentAction = createAsyncThunk(
    'deleteComment',
    async body => {
        const res = await apiEngine4('api/deletePostComment', body);
        return res;
    },
);

// Post Comment Replies Thunks

export const postCommentRepliesAction = createAsyncThunk(
    'postCommentReplies',
    async body => {
        const res = await apiEngine4('api/postCommentReplies', body);
        return res;
    },
);

export const updateCommentReplyAction = createAsyncThunk(
    'deleteComment',
    async body => {
        const res = await apiEngine2('api/updateCommentReply', 'put', body);
        return res;
    },
);

export const postCommentReplyLikeAction = createAsyncThunk(
    'likeComment',
    async body => {
        const res = await apiEngine4('api/insertPostCommentReplyLike', body);
        return res;
    },
);

export const deleteCommentReplyAction = createAsyncThunk(
    'deleteComment',
    async ({ id, body }) => {
        console.log('deleteReplyAction', id, body);
        const res = await apiEngine2(`api/CommentReply/${id}`, 'delete');
        return res;
    },
);

const commentsAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.id - a.id
});

const commentsSlice = createSlice({
    name: 'comments',
    initialState: commentsAdapter.getInitialState(),
    reducers: {
        setAllComments: commentsAdapter.setAll,
        addComment: commentsAdapter.addOne,
        addManyComments: commentsAdapter.addMany,
        updateComment: commentsAdapter.updateOne,
        removeComment: commentsAdapter.removeOne,
        removeAllComments: commentsAdapter.removeAll,
    },
});

export const { setAllComments, addComment, updateComment, removeComment, removeAllComments,addManyComments } = commentsSlice.actions;

export default commentsSlice.reducer;

export const { selectAll: selectAllComments, selectTotal: totalComments } = commentsAdapter.getSelectors((state) => state.comments);

