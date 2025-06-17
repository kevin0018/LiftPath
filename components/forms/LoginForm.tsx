import {View, TextInput, Button, StyleSheet} from 'react-native';

// Define the type of props expected by the LoginForm component
interface LoginFormProps {
    onLoginSuccess: () => void; // Callback to indicate successful login
}

const LoginForm = ({onLoginSuccess}: LoginFormProps) => {
    const handleLogin = async () => {
        // Simulate a successful login
        onLoginSuccess();
    };

    return (
        <View style = {styles.container}>
            <TextInput style = {styles.input} placeholder = 'Correo electrónico' keyboardType = 'email-address'/>
            <TextInput style = {styles.input} placeholder = 'Contraseña' secureTextEntry/>
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
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
});

export default LoginForm;