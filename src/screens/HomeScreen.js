import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import UserListScreen from './UserListScreen';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UpdateProfileScreen from './UpdateProfile';
import {Alert, Image, StyleSheet, View} from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import {useSafeAreaInsets, SafeAreaView} from 'react-native-safe-area-context';

const Drawer = createDrawerNavigator();
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

export default function HomeScreen({navigation}) {
  const insets = useSafeAreaInsets();
  const removeAccountAlert = () => {
    Alert.alert(
      'Remove Account',
      'Are you sure you want to remove the account?',
      [
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
        },
        {text: 'Yes', onPress: () => removeAccountFromDatabase()},
      ],
    );
  };

  const removeAccountFromDatabase = async () => {
    const value = await AsyncStorage.getItem('userData');
    if (value != null) {
      var dataObj = JSON.parse(value);
      await db.transaction(async tx => {
        await tx.executeSql(
          'DELETE FROM Users WHERE id = ?',
          [dataObj.userId],
          (txObj, results) => {
            console.log('deleteQuery==>' + JSON.stringify(results));
            if (results.rowsAffected === 1) {
              AsyncStorage.removeItem('userData');
              navigation.replace('Login_Screen');
            }
          },
        );
      });
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <NavigationContainer independent={true}>
        <Drawer.Navigator
          initialRouteName="User_List"
          screenOptions={{
            headerShown: true,
          }}
          drawerContent={props => {
            return (
              <DrawerContentScrollView
                contentContainerStyle={{
                  paddingTop: 0,
                }}
                {...props}>
                <View style={styles.headerImageView}>
                  <Image
                    source={require('../../assets/wallpaper.jpeg')}
                    style={styles.headerImage}
                  />
                </View>
                <DrawerItemList {...props} />
                <DrawerItem
                  label="Remove Account"
                  onPress={() => {
                    removeAccountAlert();
                  }}
                  icon={({color, size}) => (
                    <Image
                      style={{height: size, width: size}}
                      source={require('../../assets/delete.png')}
                      color={color}
                    />
                  )}
                />
                <DrawerItem
                  label="Logout"
                  onPress={async () => {
                    await AsyncStorage.removeItem('userData');
                    navigation.replace('Login_Screen');
                  }}
                  icon={({color, size}) => (
                    <Image
                      style={{height: size, width: size}}
                      source={require('../../assets/logout.png')}
                      color={color}
                    />
                  )}
                />
              </DrawerContentScrollView>
            );
          }}>
          <Drawer.Screen
            name="User_List"
            component={UserListScreen}
            options={{
              title: 'Users',
              drawerIcon: ({focused, size}) => (
                <Image
                  style={{
                    height: size,
                    width: size,
                    tintColor: focused ? '#7cc' : '#ccc',
                  }}
                  source={require('../../assets/user.png')}
                />
              ),
            }}
          />
          <Drawer.Screen
            name="Update_Profile"
            component={UpdateProfileScreen}
            options={{
              title: 'Update Profile',
              drawerIcon: ({focused, size}) => (
                <Image
                  style={{height: size, width: size}}
                  source={require('../../assets/user.png')}
                  color={focused ? '#7cc' : '#ccc'}
                />
              ),
            }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerImageView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingStart: 10,
    paddingEnd: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
  headerImage: {
    height: 70,
    width: 70,
    borderRadius: 35,
  },
});
