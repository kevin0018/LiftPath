import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import {signIn} from '@/services/authService';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            await signIn(email, password);
            console.log('Usuario autenticado correctamente');
        } catch (err) {
            setError('Error al iniciar sesión: ' + (err instanceof Error ? err.message : String(err)));
        }
    };

    return (
        <View style = {styles.container}>
            <Text style = {styles.title}>Iniciar Sesión</Text>
            {error ? <Text style = {styles.error}>{error}</Text> : null}
            <TextInput
                style = {styles.input}
                placeholder = 'Correo electrónico'
                value = {email}
                onChangeText = {setEmail}
                keyboardType = 'email-address'
            />
            <TextInput
                style = {styles.input}
                placeholder = 'Contraseña'
                value = {password}
                onChangeText = {setPassword}
                secureTextEntry
            />
            <Button title = 'Entrar' onPress = {handleLogin}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    error: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    },
});

export default LoginForm;