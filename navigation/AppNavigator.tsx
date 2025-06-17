import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../app/auth/LoginScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName = 'Login'>
                <Stack.Screen name = 'Login' component = {LoginScreen} options = {{headerShown: false}}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;