import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationContainer, useIsFocused} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {Image, View, TouchableOpacity} from 'react-native';
import {Divider, Menu, Provider} from 'react-native-paper';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import SplashScreen from './src/screens/SplashScreen';
import 'react-native-gesture-handler';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

const Stack = createStackNavigator();

function App() {
  /* const CustomMenu = ({nav}) => {
    const [showMenu, setShowMenu] = React.useState(false);

    return (
      <View style={{}}>
        <Menu
          visible={showMenu}
          onDismiss={() => setShowMenu(false)}
          anchor={
            <TouchableOpacity onPress={() => setShowMenu(true)}>
              <Image
                style={{width: 25, height: 25, tintColor: '#ffffff'}}
                source={require('./assets/menu.png')}
              />
            </TouchableOpacity>
          }>
          <Menu.Item
            onPress={() => {
              setShowMenu(false);
            }}
            title="Remove Account"
            leadingIcon={require('./assets/delete.png')}
          />
          <Divider />
          <Menu.Item
            onPress={async () => {
              await AsyncStorage.removeItem('userData');
              nav.replace('Login_Screen');
            }}
            title="Logout"
            leadingIcon={require('./assets/logout.png')}
          />
        </Menu>
      </View>
    );
  }; */

  return (
    <SafeAreaView style={{flex: 1}}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={'Splash_Screen'}
          screenOptions={{
            header: () => null,
          }}>
          <Stack.Screen name="Register_Screen" component={RegisterScreen} />
          <Stack.Screen name="Login_Screen" component={LoginScreen} />
          <Stack.Screen name="Splash_Screen" component={SplashScreen} />
          <Stack.Screen name="Home_Screen" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

export default App;
