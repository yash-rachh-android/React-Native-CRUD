import React, {useRef, useState} from 'react';
import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {dynamicWeight, showToast} from '../utils/DynamicStyle';
import SQLite from 'react-native-sqlite-storage';
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

export default function LoginScreen({navigation}) {
  const [isEmailError, setEmailError] = useState(null);
  const [isPasswordError, setPasswordError] = useState(null);
  const email = useRef('');
  const password = useRef('');

  const onSubmitClick = async () => {
    if (isEmailError === false && isPasswordError === false) {
      try {
        await db.transaction(async tx => {
          tx.executeSql(
            "SELECT * FROM users WHERE email='" +
              email.current +
              "' AND password='" +
              password.current +
              "';",
            [],
            (tx, results) => {
              if (results.rows.length > 0) {
                const id = results.rows.item(0).id;
                const uname = results.rows.item(0).name;
                const mob = results.rows.item(0).mobile;
                let userData = {
                  userId: id,
                  username: uname,
                  mobile: mob,
                  email: email.current,
                };
                AsyncStorage.setItem('userData', JSON.stringify(userData));
                showToast('Login Success');
                navigation.replace('Home_Screen');
              } else {
                showToast('Invalid email or password');
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

  function validate(field, type) {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (type === 'email') {
      if (field === '' || reg.test(field) === false) {
        return false;
      } else {
        return true;
      }
    } else if (type === 'password') {
      if (field === '' || field.length < 6) {
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

  return (
    <ScrollView style={styles.body} keyboardShouldPersistTaps="handled">
      <SafeAreaView
        style={[{alignItems: 'center', paddingStart: 25, paddingEnd: 25}]}>
        <Image
          style={styles.image}
          source={require('../../assets/joker.jpeg')}
        />
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
            onChangeText={value => {
              if (validate(value, 'email')) {
                email.current = value;
                // isEmailError.current = false;
                setEmailError(false);
              } else {
                // isEmailError.current = true;
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
            source={require('../../assets/password.png')}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Password"
            placeholderTextColor={'#516691'}
            keyboardType="default"
            secureTextEntry={true}
            onChangeText={value => {
              if (validate(value, 'password')) {
                password.current = value;
                setPasswordError(false);
              } else {
                setPasswordError(true);
              }
            }}
          />
        </View>
        {isPasswordError ? (
          <Text style={styles.formErrorText}>
            Please enter a valid password.
          </Text>
        ) : null}
        <TouchableOpacity style={styles.submitButton} onPress={onSubmitClick}>
          <Text style={styles.submitText}>Login</Text>
        </TouchableOpacity>
        <Text
          style={styles.loginText}
          onPress={() => {
            navigation.replace('Register_Screen');
          }}>
          Not have an account?Register
        </Text>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginTop: 10,
    elevation: 0.5,
    borderRadius: 5,
    flexDirection: 'column',
  },
  image: {
    width: 150,
    height: 150,
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
