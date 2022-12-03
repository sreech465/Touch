import {StyleSheet} from 'react-native';
import COLOR from './Color';

export default StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingHorizontal: 20,
  },
  textButton: {
    color: COLOR.BUTTON,
    fontSize: 16,
    alignSelf: 'center',
    paddingTop: 20,
    textAlign: 'center',
  },
  button: {
    width: 220,
    alignSelf: 'center',
  },
  forminput: {
    padding: 5,
    marginBottom: 10,
    color: COLOR.ACCENT,
    height: 40,
    borderColor: COLOR.ACCENT,
    borderWidth: 1,
    borderRadius: 4,
  },
  selfview: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 100,
    height: 120,
  },
  remotevideo: {
    height:"100%"
  },
  videoPanel: {
    flex: 1,

  },
  margin: {
    margin: 10,
  },
  callConnectingLabel: {
    fontSize: 18,
    alignSelf: 'center',
  },
  callControls: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  callControlsVideo: {
    height: 100,
  },
  incomingCallText: {
    justifyContent: 'center',
    alignSelf: 'center',
    fontSize: 22,
  },
  incomingCallButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 90,
  },
  buttonsContainer: {
    position:"absolute",
    backgroundColor: '#333333',
    width:"100%",
    padding: 20,
    paddingBottom: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    bottom: 0,
  },
  iconButton: {
    backgroundColor: '#4a4a4a',
    padding: 15,
    borderRadius: 50,
  },
  safearea: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
},
aligncenter: {
    flexDirection: 'column',
    justifyContent: 'center',
},
container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
},
modalBackground: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
},
innerContainer: {
    borderRadius: 10,
},
innerContainerTransparent: {
    backgroundColor: COLOR.WHITE,
    padding: 20,
},
appheader: {
    resizeMode: 'contain',
    height: 60,
    alignSelf: 'center',
},
loginform: {
    paddingHorizontal: 20,
    alignItems: 'stretch',
},
loginbutton: {
    color: COLOR.BUTTON,
    fontSize: 16,
    alignSelf: 'center',
    paddingTop: 20,
    textAlign: 'center',
},
forminput: {
    padding: 5,
    marginBottom: 10,
    color: COLOR.ACCENT,
    height: 40,
    borderColor: COLOR.ACCENT,
    borderWidth: 1,
    borderRadius: 4,
},
useragent: {
    
    flexDirection: 'column',
    backgroundColor:"black",
    height:'93%'
},
selfview: {
    position: 'absolute',
    right: 20,
    bottom: 60,
    width: 100,
    height: 120,
},
remotevideo: {
    flex: 1,
},
videoPanel: {
    flex: 1,
    position: 'relative',
},
call_controls: {
    height: 70,
},
margin: {
    margin: 10,
},
call_connecting_label: {
    fontSize: 18,
    alignSelf: 'center',
    fontWeight:"bold",
    marginTop:10,
    color:"white"
},
call_connecting_name: {
  fontSize: 32,
  alignSelf: 'center',
  fontWeight:"bold",
  color:"white"

},
headerButton: {
    color: COLOR.WHITE,
    fontSize: 16,
    alignSelf: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 5,
    textAlign: 'center',
},
incoming_call: {
    justifyContent: 'center',
    alignSelf: 'center',
    fontSize: 22,
},
});
