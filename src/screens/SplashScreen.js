import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';

export default function SplashScreen({navigation}) {
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('userData');
      if (value != null) {
        var dataObj = JSON.parse(value);
        console.log('Data==>' + dataObj);
        navigation.replace('Home_Screen');
      } else {
        console.log('<== No Data ==>');
        navigation.replace('Register_Screen');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.body}>
      <LottieView
        style={styles.animation}
        source={require('../../assets/splash_screen.json')}
        autoPlay={true}
        loop={false}
        onAnimationFinish={getData}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5A623',
  },
  animation: {
    width: '100%',
    height: '100%',
  },
});
