import React, {useEffect, useRef, useState} from 'react';
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
import {useIsFocused} from '@react-navigation/native';

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

export default function RegisterScreen({navigation}) {
  const [isUserNameError, setUserNameError] = useState(null);
  const [isEmailError, setEmailError] = useState(null);
  const [isPasswordError, setPasswordError] = useState(null);
  const [isConfirmPasswordError, setConfirmPasswordError] = useState(null);
  const [isMobileError, setMobileError] = useState(null);
  const userName = useRef('');
  const email = useRef('');
  const password = useRef('');
  const confirmPassword = useRef('');
  const mobile = useRef('');
  const [checked, setChecked] = useState(0);
  var gender = ['Male', 'Female'];
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      createTable();
    }
  }, [isFocused]);

  const createTable = () => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS Users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, password TEXT, mobile TEXT);',
      );
    });
  };

  const Radio = () => {
    return (
      <View style={styles.radio}>
        <View style={styles.btn}>
          {gender.map((gender, key) => {
            return (
              <View key={gender}>
                {checked === key ? (
                  <TouchableOpacity style={styles.btn}>
                    <Image
                      style={styles.img}
                      source={require('../../assets/radio_check.png')}
                    />
                    <Text>{gender}</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      setChecked(key);
                    }}
                    style={styles.btn}>
                    <Image
                      style={styles.img}
                      source={require('../../assets/radio_uncheck.png')}
                    />
                    <Text>{gender}</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const addDataToDatabase = async () => {
    await db.transaction(async tx => {
      await tx.executeSql(
        "INSERT INTO Users (name, email, password, mobile) VALUES ('" +
          userName.current +
          "', '" +
          email.current +
          "', '" +
          password.current +
          "', '" +
          mobile.current +
          "');",
      );
      this.nameTextInput.clear();
      this.nameTextInput.clear();
      this.emailTextInput.clear();
      this.passwordTextInput.clear();
      this.confirmPasswordTextInput.clear();
      this.mobileTextInput.clear();
      showToast('User Registered successfully.');
    });
  };

  const onSubmitClick = async () => {
    console.log('check1');
    if (
      isUserNameError === false &&
      isEmailError === false &&
      isPasswordError === false &&
      isConfirmPasswordError === false &&
      isMobileError === false
    ) {
      try {
        db.transaction(tx => {
          tx.executeSql(
            "SELECT * FROM users WHERE email = '" + email.current + "';",
            [],
            (txObj, results) => {
              if (results.rows.length > 0) {
                showToast('The email is already registered with us.');
              } else {
                addDataToDatabase();
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
    } else if (type === 'password') {
      if (field === '' || field.length < 6) {
        return false;
      } else {
        return true;
      }
    } else if (type === 'confirm_password') {
      if (field === '' || field !== password.current) {
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
            source={require('../../assets/user.png')}
          />
          <TextInput
            style={[styles.textInput]}
            placeholder="Username"
            placeholderTextColor={'#516691'}
            keyboardType="default"
            ref={input => {
              this.nameTextInput = input;
            }}
            onChangeText={value => {
              if (validate(value)) {
                userName.current = value;
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
            ref={input => {
              this.emailTextInput = input;
            }}
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
            ref={input => {
              this.passwordTextInput = input;
            }}
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
        <View style={styles.textInputBody}>
          <Image
            style={styles.icon}
            source={require('../../assets/confirm_password.png')}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Confirm Password"
            placeholderTextColor={'#516691'}
            keyboardType="default"
            secureTextEntry={true}
            ref={input => {
              this.confirmPasswordTextInput = input;
            }}
            onChangeText={value => {
              if (validate(value, 'confirm_password')) {
                confirmPassword.current = value;
                setConfirmPasswordError(false);
              } else {
                setConfirmPasswordError(true);
              }
            }}
          />
        </View>
        {isConfirmPasswordError ? (
          <Text style={styles.formErrorText}>Password does not matches.</Text>
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
            ref={input => {
              this.mobileTextInput = input;
            }}
            onChangeText={value => {
              if (validate(value, 'mobile')) {
                mobile.current = value;
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
        <Radio />
        <TouchableOpacity style={styles.submitButton} onPress={onSubmitClick}>
          <Text style={styles.submitText}>Register</Text>
        </TouchableOpacity>
        <Text
          style={styles.loginText}
          onPress={() => {
            navigation.replace('Login_Screen');
          }}>
          Already have an account?Login
        </Text>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: '#fff',
    marginStart: 10,
    marginEnd: 10,
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
