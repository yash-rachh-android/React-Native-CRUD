import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {dynamicWeight, showToast} from '../utils/DynamicStyle';
import SQLite from 'react-native-sqlite-storage';
import {useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const db = SQLite.openDatabase(
  {
    name: 'UsersDB',
    location: 'default',
  },
  () => {},
  error => {
    console.log(error);
  },
);

export default function UpdateProfileScreen({navigation}) {
  const [isUserNameError, setUserNameError] = useState(null);
  const [isEmailError, setEmailError] = useState(null);
  const [isMobileError, setMobileError] = useState(null);
  const userName = useRef('');
  const email = useRef('');
  const mobile = useRef('');
  const [dynamicData, setDynamicData] = useState({});
  const isFocused = useIsFocused();

  function validate(field, type) {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    console.log('check2');
    if (type === 'email') {
      if (field === '' || reg.test(field) === false) {
        return false;
      } else {
        return true;
      }
    } else if (type === 'mobile') {
      if (field === '' || field.length !== 10) {
        return false;
      } else {
        return true;
      }
    } else {
      if (field === '') {
        return false;
      } else {
        return true;
      }
    }
  }

  useEffect(() => {
    if (isFocused) {
      getData();
    }
  }, [isFocused]);

  const getData = async () => {
    const value = await AsyncStorage.getItem('userData');
    if (value != null) {
      var dataObj = JSON.parse(value);
      setDynamicData(dataObj);
      setUserNameError(false);
      setEmailError(false);
      setMobileError(false);
    } else {
      setDynamicData({});
    }
  };

  const onSubmitClick = async () => {
    if (
      isUserNameError === false &&
      isEmailError === false &&
      isMobileError === false
    ) {
      try {
        await db.transaction(async tx => {
          await tx.executeSql(
            'UPDATE Users SET name = ?, email = ?, mobile = ? WHERE id = ?',
            [
              dynamicData.username,
              dynamicData.email,
              dynamicData.mobile,
              dynamicData.userId,
            ],
            (txObj, results) => {
              console.log('updateQuery==>' + JSON.stringify(dynamicData));
              console.log('updateQuery==>' + JSON.stringify(results));
              if (results.rowsAffected === 1) {
                AsyncStorage.setItem('userData', JSON.stringify(dynamicData));
                showToast('Profile Updated');
              } else {
                showToast('Something went wrong!');
              }
            },
          );
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      showToast('Please enter the details correctly.');
    }
  };

  const openImagePicker = () => {
    console.log('openImagePicker');
  };

  return (
    <ScrollView style={styles.body} keyboardShouldPersistTaps="handled">
      <SafeAreaView
        style={[{alignItems: 'center', paddingStart: 25, paddingEnd: 25}]}>
        <TouchableOpacity onPress={openImagePicker}>
          <Image
            style={styles.image}
            source={require('../../assets/joker.jpeg')}
          />
        </TouchableOpacity>
        <View style={styles.textInputBody}>
          <Image
            style={styles.icon}
            source={require('../../assets/user.png')}
          />
          <TextInput
            style={[styles.textInput]}
            placeholder="Username"
            placeholderTextColor={'#516691'}
            keyboardType="default"
            value={dynamicData.username}
            ref={input => {
              this.nameTextInput = input;
            }}
            onChangeText={value => {
              setDynamicData({
                userId: dynamicData.userId,
                username: value,
                email: dynamicData.email,
                mobile: dynamicData.mobile,
              });
              if (validate(value)) {
                // userName.current = value;
                setUserNameError(false);
              } else {
                setUserNameError(true);
              }
            }}
          />
        </View>
        {isUserNameError ? (
          <Text style={styles.formErrorText}>
            Please enter a valid username.
          </Text>
        ) : null}
        <View style={styles.textInputBody}>
          <Image
            style={styles.icon}
            source={require('../../assets/email.png')}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Email ID"
            placeholderTextColor={'#516691'}
            keyboardType="default"
            value={dynamicData.email}
            ref={input => {
              this.emailTextInput = input;
            }}
            onChangeText={value => {
              setDynamicData({
                userId: dynamicData.userId,
                username: dynamicData.username,
                email: value,
                mobile: dynamicData.mobile,
              });
              if (validate(value, 'email')) {
                // email.current = value;
                setEmailError(false);
              } else {
                setEmailError(true);
              }
            }}
          />
        </View>
        {isEmailError ? (
          <Text style={styles.formErrorText}>Please enter a valid email.</Text>
        ) : null}
        <View style={styles.textInputBody}>
          <Image
            style={styles.icon}
            source={require('../../assets/mobile.png')}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Enter Mobile"
            placeholderTextColor={'#516691'}
            keyboardType="phone-pad"
            maxLength={10}
            value={dynamicData.mobile}
            ref={input => {
              this.mobileTextInput = input;
            }}
            onChangeText={value => {
              setDynamicData({
                userId: dynamicData.userId,
                username: dynamicData.username,
                email: dynamicData.email,
                mobile: value,
              });
              if (validate(value, 'mobile')) {
                // mobile.current = value;
                setMobileError(false);
              } else {
                setMobileError(true);
              }
            }}
          />
        </View>
        {isMobileError ? (
          <Text style={styles.formErrorText}>
            Please enter a valid mobile number.
          </Text>
        ) : null}
        <TouchableOpacity style={styles.submitButton} onPress={onSubmitClick}>
          <Text style={styles.submitText}>Update</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    borderRadius: 5,
    flexDirection: 'column',
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'stretch',
    borderRadius: 75,
    marginVertical: 15,
  },
  textInputBody: {
    flex: 1,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingStart: 10,
    backgroundColor: '#EEF4F7',
    marginTop: 15,
  },
  textInput: {
    flex: 1,
    marginStart: 10,
    color: '#516691',
    fontWeight: dynamicWeight('600', 'semi-bold'),
  },
  icon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    tintColor: '#516691',
  },
  radio: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  img: {
    height: 25,
    width: 25,
    marginHorizontal: 5,
    tintColor: '#516691',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  submitText: {
    color: '#ffffff',
    fontSize: 18,
  },
  formErrorText: {
    width: '100%',
    color: '#ff0000',
    fontSize: 12,
    fontWeight: 'normal',
  },
  loginText: {
    color: '#00A8E2',
    fontSize: 14,
    marginTop: 10,
    fontWeight: dynamicWeight('600', 'semi-bold'),
  },
  submitButton: {
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: '#00A8E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});
