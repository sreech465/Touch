/* eslint-disable prettier/prettier */
import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { apiEngine0, apiEngine1, apiEngine2, apiEngine4, apiEngine5 } from '../../Assets/helpers/ApiRoute';


export const getStoriesAction = createAsyncThunk(
    'story/getStories', async _ => {
        const res = await apiEngine0('api/stories', 'get');
        console.log('FromStorySlice', res);
        return res;
    });

export const uploadNewStoryAction = createAsyncThunk(
    'story/uploadStory', async body => {
        const res = await apiEngine5('api/postStory', body);
        return res;
    });

export const GetStoryView = createAsyncThunk('getstoryview', async body => {
    const storyid = body.id
    const res = await apiEngine0('api/storyViews/' + storyid, 'get');
    return res;
});

export const InsertStoryView = createAsyncThunk('insertstoryview', async body => {
    const res = await apiEngine2('api/storyView', 'post', body);
    return res;
});

export const likeStoryAction = createAsyncThunk(
    'story/likeStory', async ({
        story_id,
        reaction_id,
    }) => {
    const res = await apiEngine4('api/storyLike', JSON.stringify({
        story_id,
        reaction_id,
    })
    );
    return res;
});

export const deleteStoryAction = createAsyncThunk(
    'story/deleteStory', async id => {
        const res = await apiEngine0(`api/story/${id}`, 'delete');
        return res;
    });




const storiesAdapter = createEntityAdapter();

const storiesSlice = createSlice({
    name: 'stories',
    initialState: storiesAdapter.getInitialState({ currentUserIndex: 0 }),
    reducers: {
        setAllStories: storiesAdapter.setAll,
        updateStory: storiesAdapter.updateOne,
        removeStory: storiesAdapter.removeOne,
        updateCurrentUserIndex: (state, action) => {
            state.currentUserIndex = action.payload;
        }
    },
});

export const { setAllStories, updateStory, removeStory, updateCurrentUserIndex } = storiesSlice.actions;

export default storiesSlice.reducer;

export const { selectAll: selectAllStories, selectById: selectStoryById, selectEntities } = storiesAdapter.getSelectors((state) => state.stories);

