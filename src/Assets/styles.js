import {StyleSheet} from 'react-native';
import {widthToDp, heightToDp} from '../Assets/helpers/Responsive';
import {colors, fontWhite, backgroundColor} from '../Assets/color';

export const mainView = {
  flex: 1,
  backgroundColor: backgroundColor.backgroundColor,
};

export const IntroStyle = {
  styleIntroBox: {
    fontSize: widthToDp('6.8'),
    color: fontWhite.color,
    marginTop: heightToDp('4'),
  },
  styleIntro: {
    backgroundColor: backgroundColor.backgroundColor,
  },
  stylesMain: {
    color: '#6a5acd',
  },
  styleButton: {
    width: widthToDp('75'),
    height: heightToDp('5.5'),
    alignSelf: 'center',
    position:'absolute',
    bottom:heightToDp('3')
  },
  styleImage: {
    width: widthToDp('100'),
    height: heightToDp('55'),
    marginTop: heightToDp('2'),
  },
  styleImage2: {
    width: widthToDp('60'),
    height: heightToDp('60'),
    marginTop: heightToDp('1'),
  },
};

export const EditProfileStyle = {
  inputBox: {
    marginTop: heightToDp('2.5'),
    borderBottomWidth: 1,
    borderColor: 'gray',
    marginHorizontal: widthToDp('14'),
    flexDirection: 'row',
    alignItems: 'center',
  },

  input: {
    width: '100%',
    height: 43,
    borderRadius: 4,
    paddingHorizontal: 0,
    alignSelf: 'center',
    fontSize: heightToDp('1.8'),
    color: fontWhite.color,
    marginLeft: widthToDp('0'),
  },
};


export const AdddetailsStyle = {
  inputBox: {
    widthToDp:widthToDp('90'),
    marginBottom: heightToDp('2.5'),
    borderWidth: 1,
    borderColor: '#FF5F6D',
    borderRadius:12,
    marginHorizontal: widthToDp('6'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    width: widthToDp('80'),
    height: heightToDp('6.5'),
    borderRadius: 4,
    paddingHorizontal: 0,
    alignSelf: 'center',
    fontSize: heightToDp('1.8'),
    color: fontWhite.color,
    marginLeft: widthToDp('3'),
    fontFamily:'Poppins-Regular'
  },
}

export const PersonalInfoStyle = {
  inputBox: {
    marginTop: heightToDp('4.2'),
    borderBottomWidth: 1,
    borderColor: 'white',
    marginHorizontal: widthToDp('14'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  input: {
    width: '70%',
    height: 40,
    borderRadius: 4,
    paddingHorizontal: 0,
    alignSelf: 'center',
    fontSize: heightToDp('1.8'),
    color: fontWhite.color,
    marginLeft: widthToDp('0'),
    fontFamily:'Poppins-Regular'
  },
};

export const SettingStyle = {
  TitleText: {
    color: 'white',
    fontSize: heightToDp('2'),
    marginLeft: widthToDp('3'),
    fontFamily:'Poppins-Regular'
  },

  TitleTextt: {
    color: 'gray',
    fontSize: heightToDp('1.5'),
    marginLeft: widthToDp('3'),
    fontFamily:'Poppins-Regular'
  },

  optionBox: {
    flexDirection: 'row',
    marginTop: heightToDp('2.5'),
    alignItems: 'center',
  },

  Image: {
    width: widthToDp('4'),
    height: heightToDp('2.2'),
    resizeMode: 'contain',
    borderRadius: 10,
    marginTop: heightToDp('0.5'),
  },
  Imagee: {
    width: widthToDp('5'),
    height: heightToDp('3'),
    resizeMode: 'contain',
    borderRadius: 10,
    marginTop: heightToDp('0.5'),
  },
};

export const loginStyle = {
  styleLoginText: {
    fontSize: widthToDp('8.4'),
    color: fontWhite.color,
    marginTop: heightToDp('2'),
    fontFamily:'Poppins-ExtraLight'
  },

  styleLoginText2: {
    marginTop:heightToDp('-2'),
    fontSize: widthToDp('8'),
    color: fontWhite.color,
    
  },
  styleLoginBox: {
    height: heightToDp('59'),
    width: widthToDp('80'),
    borderRadius: 10,
    position: 'absolute',
    top: heightToDp('24'),
    bottom: 0,
    alignSelf: 'center',
  },
  inputBox: {
    marginTop: heightToDp('5'),
    borderBottomWidth: 1,
    borderColor: fontWhite.color,
    marginHorizontal: widthToDp('5'),
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 18,
    marginBottom: 6,
    marginLeft: widthToDp('5'),
    fontWeight: 'bold',
    color: 'gray',
  },
  input: {
    width: '90%',
    height: 45,
    borderRadius: 4,
    paddingHorizontal: 10,
    alignSelf: 'center',
    fontSize: heightToDp('1.7'),
    color: fontWhite.color,
    marginLeft: widthToDp('1'),
    fontFamily:'Poppins-SemiBold'
  },

  buttonStyleOuterCircle: {
    height: 73,
    width: 73,
    alignSelf: 'flex-end',
    marginRight: widthToDp('3'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#F5F5F5',
    marginTop: heightToDp('4.5'),
  },
  buttonStyleOuterrRctangle: {
    height: 103,
    width: 48,
    alignSelf: 'flex-end',
    marginRight: widthToDp('3'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#F5F5F5',
    marginTop: heightToDp('0'),
  },
  buttonStyleInnerCircle: {
    height: heightToDp('7.5'),
    width: widthToDp('16'),
    backgroundColor: '#FF5F6D',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
  buttonStyleInnerRectangle: {
    height: heightToDp('7.5'),
    width: widthToDp('12'),
    backgroundColor: '#FF5F6D',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
};

export const UploadsoftcopyStyle = {
  buttonStyleOuterCircle: {
    height: heightToDp('8'),
    width: widthToDp('16.6'),
    alignSelf: 'flex-end',
    marginRight: widthToDp('3'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#F5F5F5',
    marginTop: heightToDp('4'),
  },

  buttonStyleInnerCircle: {
    height: heightToDp('6.5'),
    width: widthToDp('14'),
    backgroundColor: '#FF5F6D',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
}

export const SignUpStyle = {
  styleLoginText: {
    fontSize: widthToDp('8'),
    color: fontWhite.color,
    marginTop: heightToDp('4'),
    marginRight: widthToDp('12'),
  },
  styleLoginBox: {
    height: heightToDp('69'),
    width: widthToDp('80'),
    borderRadius: 20,
    position: 'absolute',
    top: heightToDp('15'),
    bottom: 0,
    alignSelf: 'center',
    opacity: 0.98,
  },
  inputBox: {
    marginTop: heightToDp('3'),
    borderBottomWidth: 1,
    borderColor: fontWhite.color,
    marginHorizontal: widthToDp('5'),
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 18,
    marginBottom: 6,
    marginLeft: widthToDp('5'),
    fontWeight: 'bold',
    color: 'red',
  },
  input: {
    width: '90%',
    height: 45,
    borderRadius: 4,
    paddingHorizontal: 10,
    alignSelf: 'center',
    fontSize: heightToDp('1.5'),
    color: fontWhite.color,
    marginLeft: widthToDp('3'),
    fontFamily:'Poppins-Regular'
  },

  buttonStyleOuterCircle: {
    height: heightToDp('8.8'),
    width: widthToDp('19'),
    alignSelf: 'flex-end',
    marginRight: widthToDp('3'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#F5F5F5',
    marginTop: heightToDp('4'),
  },

  buttonStyleInnerCircle: {
    height: heightToDp('7.5'),
    width: widthToDp('16'),
    backgroundColor: '#FF5F6D',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },

  cameraOuterBox: {
    width: widthToDp('18'),
    height: heightToDp('8'),
    borderColor: '#FF5F6D',
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: heightToDp('2'),
    paddingBottom: heightToDp('0.4'),
  },
};

export const forgotPasswordStyle = {
  styleLoginText: {
    fontSize: widthToDp('8'),
    color: fontWhite.color,
    marginTop: heightToDp('4'),
    textAlign: 'center',
  },
  inputBox: {
    marginTop: heightToDp('2'),
    borderBottomWidth: 1,
    borderColor: 'gray',
    marginHorizontal: widthToDp('5'),
    alignItems: 'center',
  },

  input: {
    width: widthToDp('90'),
    height: heightToDp('7'),
    alignSelf: 'center',
    fontSize: heightToDp('1.8'),
    color: fontWhite.color,
    fontFamily:'Poppins-Regular'
  },

  styleLoginBox: {
    height: heightToDp('69'),
    width: widthToDp('100'),
    borderRadius: 20,
    position: 'absolute',
    top: heightToDp('40'),
    bottom: 0,
    alignSelf: 'center',
    opacity: 0.98,
  },
  styleLoginBox2: {
    height: heightToDp('30'),
    width: widthToDp('100'),
    borderRadius: 20,
    position: 'absolute',
    top: heightToDp('15'),
    bottom: 0,
    alignSelf: 'center',
    opacity: 0.98,
  },

  styleButton: {
    width: widthToDp('75'),
    height: heightToDp('5.5'),
    alignSelf: 'center',
    marginTop: heightToDp('3'),
    borderRadius: 15,
  },
};

export const VerifyCodeStyle = {
  styleLoginText: {
    fontSize: widthToDp('8'),
    color: fontWhite.color,
    marginTop: heightToDp('4'),
    textAlign: 'center',
  },
  inputBox: {
    marginTop: heightToDp('2'),
    width: widthToDp('60'),
    borderWidth: 1,
    borderColor: 'white',
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: widthToDp('1.5'),
  },

  input: {
    width: widthToDp('50'),
    height: 50,
    borderRadius: 4,
    paddingHorizontal: 0,
    alignSelf: 'center',
    fontSize: heightToDp('5'),
    color: fontWhite.color,
    marginLeft: widthToDp('0'),
    fontWeight: '500',
  },

  styleLoginBox: {
    height: heightToDp('69'),
    width: widthToDp('100'),
    borderRadius: 20,
    position: 'absolute',
    top: heightToDp('40'),
    bottom: 0,
    alignSelf: 'center',
    opacity: 0.98,
  },

  styleButton: {
    width: widthToDp('75'),
    height: heightToDp('5.5'),
    alignSelf: 'center',
    marginTop: heightToDp('3'),
  },
};
