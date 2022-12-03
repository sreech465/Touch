import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiEngine1, apiEngine3, apiEngine5 } from '../../Assets/helpers/ApiRoute';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VerifyCodeScreen from '../../screens/VerifyCodeScreen';

const initialState = {
  userdata: null,
  token: null,
  tokenn: null,
  loading: false,
  error: '',
  voxData: ''
};

export const signupUser = createAsyncThunk('signupuser', async body => {
  console.log('Signup_step2', body);
  const result = await apiEngine5('auth/register', body);
  console.log('signup', result);
  return result;
});

export const signinUser = createAsyncThunk('signinuser', async body => {
  console.log('step2', body);
  const result = await apiEngine1('auth/login', body);
  console.log('WhatHappend2====', result);
  return result;
});

export const ForgotPassword = createAsyncThunk('forgotpassword', async body => {
  console.log('step2', body);
  const result = await apiEngine1('auth/forgotPassword', body);
  console.log('WhatHappend2', result);
  return result;
});
export const ConfirmPassword = createAsyncThunk('confirmpassword', async body => {
  console.log('step2', body);
  const result = await apiEngine1('auth/confirmPassword', body);
  console.log('WhatHappend2', result);
  return result;
});
export const addToken = createAsyncThunk('addtoken', async () => {
  const user = JSON.parse(await AsyncStorage.getItem('touchUserData'));
  const token = await AsyncStorage.getItem('token');
  console.log('nikhil', user);
  return { user, token };
});

export const addVoxData = createAsyncThunk('addVoxData', async data => {

  return data;

});

export const addSignUpToken = createAsyncThunk('addSignUpToken', async sucess => {
  const result = JSON.parse(await AsyncStorage.getItem('signUpUserData'));

  if (result) {
    console.log('nikhil', result);
    sucess(result.user.mobile + ' ' + result.user.username);
    return result;
  }

});

export const verifyCode = createAsyncThunk('verifycode', async body => {
  console.log('Verify_Step3', body);
  const result = await apiEngine1('auth/verifyOtp', body);
  console.log('Verify_Step3', result);
  return result;
});

export const getVerifyed = createAsyncThunk('getverifyed', async body => {
  console.log('GETVerifyed_Step3', body);
  const result = await apiEngine1('auth/resendOtp', body);
  console.log('GETVerifyed', result)
  return result;
})

const authReducer = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state, action) => {
      state.token = "";
      state.userdata = "";
      AsyncStorage.removeItem('token');
      AsyncStorage.removeItem('touchUserData');
    },

    login: (state, action) => {
      state.token = null;
      AsyncStorage.setItem('token');
    },
    updateUserData: (state, action) => {
      console.log('Ud',action.payload);
      state.userdata = { ...state.userdata, ...action.payload };
      AsyncStorage.setItem("touchUserData", JSON.stringify({ ...state.userdata, ...action.payload }))
    }

  },
  extraReducers: {
    [signupUser.fulfilled]: (state, { payload }) => {
      state.loading = false;
      if (payload.status == 200) {
        console.log('true', payload);
        state.userdata = payload.data.user;
        state.tokenn = payload.data.token;
        var data = JSON.stringify(payload.data.user);
        AsyncStorage.setItem('touchUserData', data);
      } else {
        // state.error = error;
        // alert(error);
      }
    },
    [signupUser.pending]: (state, action) => {
      // state.loading = true;
    },
    [signupUser.rejected]: (state, action) => {
      state.loading = false;
    },
    [verifyCode.fulfilled]: (state, { payload }) => {
      state.loading = false;
      console.log('VerifyCodeSucess', payload);
    },
    [verifyCode.fulfilled]: (state, { payload }) => {
      state.loading = false;
    },
    [verifyCode.rejected]: (state, action) => {
      state.loading = false;
    },
    [addToken.fulfilled]: (state, { payload }) => {
      state.token = payload.token;
      state.userdata = payload.user;
    },
    [addVoxData.fulfilled]: (state, action) => {
      if (action.payload) {
        state.voxData = action.payload;

      }
    },
    [signinUser.pending]: (state, action) => {
      state.loading = true;
    },
    [signinUser.fulfilled]: (state, { payload }) => {
      state.loading = false;
      console.log('----------step4 fulfilled', payload);
      if (payload.status === 200) {
        state.token = payload.data.token;
        state.userdata = payload.data.user;
        var data = JSON.stringify(payload.data.user);
        // console.log('userData---------',data)
        AsyncStorage.setItem('touchUserData', data);
        AsyncStorage.setItem('token', payload.data.token);
      }
    },
    [signinUser.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.data.message;
    },
    [getVerifyed.fulfilled]: (state, { payload }) => {
      console.log('step4 fulfilled', payload);
      state.loading = false;
    },
    [getVerifyed.pending]: (state, action) => {
      state.loading = true;
    },
    [getVerifyed.rejected]: (state, action) => {
      state.loading = false;
    },
    [addSignUpToken.fulfilled]: (state, payload) => {
      state.token = state.tokenn;
    }
  },
});

export const { logout, login, updateUserData } = authReducer.actions;
export default authReducer.reducer;
