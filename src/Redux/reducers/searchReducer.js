import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {get} from 'react-native/Libraries/Utilities/PixelRatio';
import {apiEngine1, apiEngine2, apiEngine3, apiEngine4} from '../../Assets/helpers/ApiRoute';

const initialState = {
    searchData:null,
  message: null,
  loading: false,
  error: '',
};

export const Search = createAsyncThunk('search', async(body)  => {
  console.log('step2');
  const result = await apiEngine2('api/search','post',body);
  console.log('WhatHappend3', result);
  return result;
});

const searchReducer = createSlice({
  name: 'SearchData',
  initialState,
  reducers: {
    datasetsucces: (state, action) => {
      state.loading = false;
    },
    reset: () => initialState
  },
  extraReducers: {
    [Search.pending]: (state, {payload}) => {
        console.log('Searchdatapending', payload);
        state.loading = true;
      },
    [Search.fulfilled]: (state, {payload}) => {
      console.log('Search', payload);
      if(payload.status == 200) {
        state.loading = false
        state.searchData = payload.data
        state.message = payload.message
      }
    },
    [Search.rejected]: (state, {payload}) => {
        console.log('Searchdatapending', payload);
        state.loading = false;
        state.message = payload.message
      },
  },
});

export const {datasetsucces,reset} = searchReducer.actions;
export default searchReducer.reducer;