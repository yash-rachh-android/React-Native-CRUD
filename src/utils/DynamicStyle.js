import {Platform, ToastAndroid} from 'react-native';
import Snackbar from 'react-native-snackbar';

export function dynamicWeight(ios, android) {
  return Platform.OS === 'android' ? android : ios;
}

export function showToast(message) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else if (Platform.OS === 'ios') {
    Snackbar.show({
      text: message,
      duration: Snackbar.LENGTH_SHORT,
    });
  }
}
