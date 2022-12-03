import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiEngine0, isResponseOk,apiEngine2 } from '../Assets/helpers/ApiRoute';


export const getInvestmentCategories = createAsyncThunk(
    'investment/getInvestmentCategories',
    async (_, { rejectWithValue }) => {
        const res = await apiEngine0('api/investments_home', 'get');
        if (isResponseOk(res)) {
            return res;
        } else {
            return rejectWithValue(res);
        }
    }
);

export const getsearchInvestments = createAsyncThunk(
    'investment/getsearchInvestments',
    async (keyWord, { rejectWithValue }) => {
        const res = await apiEngine2('api/searchInvestments', 'post', keyWord,);
        console.log('get Investments',res);
        if (isResponseOk(res)) {
            return res;
        } else {
            return rejectWithValue(res);
        }
    }
);

export const getInvestmentByCategories = createAsyncThunk(
    'investment/getInvestmentByCategories',
    async (categoryId, { rejectWithValue }) => {
        const res = await apiEngine0(`api/investments/${categoryId}`, 'get');
        if (isResponseOk(res)) {
            return res;
        } else {
            return rejectWithValue(res);
        }
    }
);


const initialState = {
    popularFunds: [],
    collections: [],
    quickAccess: [],
    categorySearch: [],
    searchInvestments: [],
}

const investmentSlice = createSlice({
    name: 'investment',
    initialState,
    reducers: {
        clear: (state, action) => {
            state.searchInvestments = "";
          },
    },
    extraReducers: {
        [getInvestmentCategories.fulfilled]: (state, action) => {
            const { collections, popular_funds, quick_access } = action.payload.data
            state.popularFunds = popular_funds
            state.collections = collections
            state.quickAccess = quick_access
        },
        [getInvestmentByCategories.fulfilled]: (state, action) => {
            state.categorySearch = action.payload.data
        },
        [getsearchInvestments.fulfilled]: (state, action) => {
            console.log('action.payload.data',action.payload.data)
            state.searchInvestments = action.payload.data
        }
    },
});
export const { clear } = investmentSlice.actions;
export default investmentSlice.reducer;

