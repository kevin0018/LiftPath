import React from 'react';
import {View, StyleSheet} from 'react-native';
import LoginForm from '@/components/forms/LoginForm';

const LoginScreen = () => {
    return (
        <View style = {styles.container}>
            <LoginForm/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#f9f9f9',
    },
});

export default LoginScreen;