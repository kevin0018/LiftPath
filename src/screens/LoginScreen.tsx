import {View, StyleSheet} from 'react-native';
import LoginForm from '@/components/forms/LoginForm';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {RootStackParamList} from '@/types/RootStackParamList';
import {FC} from "react";

const LoginScreen: FC = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const handleLoginSuccess = () => {
        navigation.navigate('Home');
    };

    return (
        <View style = {styles.container}>
            <LoginForm onLoginSuccess = {handleLoginSuccess}/>
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