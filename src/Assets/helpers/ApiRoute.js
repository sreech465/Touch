import AsyncStorage from '@react-native-async-storage/async-storage';

const baseUrl = 'https://test.touchapp.in/';
console.log('token', AsyncStorage.getItem('token'));

const createFormData = (data) => {

  let formData = new FormData()
  for (let item in data) {
    formData.append(item, data[item])
  }

  return formData;
}

export const isResponseOk = (res) => {
  if (res.status === 200) {
    return true;
  }
  else {
    return false;
  }
}

export const apiEngine0 = async (api, type) => {
  const res = await fetch(baseUrl + api, {
    method: type,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + (await AsyncStorage.getItem('token')),
    },
  });
  return await res.json();
};

export const apiEngine1 = async (api, body) => {
  console.log('step3');
  const res = await fetch(baseUrl + api, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return await res.json();
};

export const apiEngine2 = async (api, type, body = {}) => {
  const res = await fetch(baseUrl + api, {
    method: type,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + (await AsyncStorage.getItem('token')),
    },
    body: JSON.stringify(body),
  });
  return await res.json();
};

export const apiEngine3 = async (api, body) => {
  console.log('step3', body, api);
  const res = await fetch(baseUrl + api, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: body,
  });
  return await res.json();
};

export const apiEngine4 = async (api, body) => {
  console.log('tokenBeforeFeed', await AsyncStorage.getItem('token'));
  const res = await fetch(baseUrl + api, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + (await AsyncStorage.getItem('token')),
    },
    body: body,
  });
  return await res.json();
};

export const apiEngine5 = async (api, body) => {
  console.log('tokenBeforeFeed', await AsyncStorage.getItem('token'), createFormData(body));
  const res = await fetch(baseUrl + api, {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + (await AsyncStorage.getItem('token')),
    },
    body: createFormData(body),
  });
  console.log('resForPOst', res);
  return await res.json();
};
