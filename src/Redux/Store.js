import { configureStore } from '@reduxjs/toolkit';
import authReducer, { addToken } from './reducers/authReducer';
import feedReducer from './reducers/feedReducer';
import userReducer from './reducers/userReducer';
import searchReducer from './reducers/searchReducer';
import commentReducer from './commentSlice';
import postReducer from './postSlice';
import storiesReducer from '../screens/stories/storiesSlice';
import activityReducer from "./activitySlice";
import ecommerceReducer from "./ecommerceSlice";
import investmentReducer from "./investmentsSlice";
import networkReducer from "./networkSlice";
import reelReducer from "./reelSlice";
// import loaderReducer from "./loaderSlice";
const store = configureStore({
  reducer: {
    user: authReducer,
    feed: feedReducer,
    userData: userReducer,
    searchData: searchReducer,
    comments: commentReducer,
    posts: postReducer,
    stories: storiesReducer,
    activity: activityReducer,
    ecommerce: ecommerceReducer,
    investment: investmentReducer,
    network: networkReducer,
    // loader: loaderReducer
    reels: reelReducer
  },
});

export default store;
