import { Animated, Dimensions } from 'react-native';
let animatedValue = new Animated.Value(-80)
export const callToast = () => {
    
    Animated.timing(
      animatedValue,
      {
        toValue: 0,
        duration: 550
      }).start(closeToast)
  }

export const closeToast = () => {
    setTimeout(() => {
      Animated.timing(
        animatedValue,
        {
          toValue: -80,
          duration: 350
        }).start()
    }, 2000)
  }