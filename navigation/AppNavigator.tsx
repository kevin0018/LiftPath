import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../app/auth/LoginScreen';
import HomeScreen from '../app/home/HomeScreen';
import {RootStackParamList} from "@/types/RootStackParamList";

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName = 'Login'>
                <Stack.Screen name = 'Login' component = {LoginScreen} options = {{headerShown: false}}/>
                <Stack.Screen name = 'Home' component = {HomeScreen} options = {{title: 'Inicio'}}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;