import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiEngine0, apiEngine2, isResponseOk } from '../Assets/helpers/ApiRoute';


export const getProductCategories = createAsyncThunk(
    'ecommerce/getProductCategories',
    async (_, { rejectWithValue }) => {
        const res = await apiEngine0('api/ecommerce_home', 'get');
        if (isResponseOk(res)) {
            return res;
        } else {
            return rejectWithValue(res);
        }
    }
);

export const getsearchProducts = createAsyncThunk(
    'ecommerce/getsearchProducts',
    async (keyWord, { rejectWithValue }) => {
        const res = await apiEngine2('api/searchProducts', 'post', keyWord,);
        console.log('get products',res);
        if (isResponseOk(res)) {
            return res;
        } else {
            return rejectWithValue(res);
        }
    }
);

export const getProductSubCategories = createAsyncThunk(
    'ecommerce/getProductSubCategories',
    async (categoryId, { rejectWithValue }) => {
        const res = await apiEngine0(`api/ecommerce_subcategory/${categoryId}`, 'get');
        if (isResponseOk(res)) {
            return res;
        } else {
            return rejectWithValue(res);
        }
    }
);

export const getProductsBySubCategory = createAsyncThunk(
    'ecommerce/getProductsBySubCategory',
    async (subCategoryId, { rejectWithValue }) => {
        const res = await apiEngine0(`api/ecommerce_products/${subCategoryId}`, 'get');
        console.log('get products',res);
        if (isResponseOk(res)) {
            return res;
            console.log('get products',res);
        } else {
            return rejectWithValue(res);
        }
    }
);



const initialState = {
    categories: {
        topSliders: [],
        ecommerce_category: [],
        bottomSliders: []
    },
    subCategories: [],
    products: [],
    searchedProducts:[]
}

const ecommerceSlice = createSlice({
    name: 'ecommerce',
    initialState,
    reducers: {
        clear: (state, action) => {
            state.searchedProducts = "";
          },
    },
    extraReducers: {
        [getProductCategories.fulfilled]: (state, action) => {
            state.categories = action.payload.data
        },
        [getProductSubCategories.fulfilled]: (state, action) => {
            state.subCategories = action.payload.data
        },
        [getProductsBySubCategory.fulfilled]: (state, action) => {
            state.products = action.payload.data
        },
        [getsearchProducts.fulfilled]: (state, action) => {
            state.searchedProducts = action.payload.data
        }
    },
});
export const { clear } = ecommerceSlice.actions;
export default ecommerceSlice.reducer;

