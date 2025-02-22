import { Image, Keyboard, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Animated, { FadeInDown, FadeInUp, } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ToastifyModal } from '../Modal/StatusModal';
import { Ionicons } from '@expo/vector-icons';
import { Authcontext } from '../context/AuthProvider';

export default function LoginScreen() {

    const [showModal, setShowModal] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [isSuccessful, setIsSuccessful] = useState<boolean>(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [rememberMe, setRememberMe] = useState(false);

    const navigation = useNavigation<any>();
    const { login, loginStatus, setLoginStatus } = useContext<any>(Authcontext);

    //----------------------------------------- Initial remember me functionality -------------------------------------------------------

    useEffect(() => {
        const loadCredentials = async () => {
            const storedEmail = await AsyncStorage.getItem('email');
            const storedPassword = await AsyncStorage.getItem('password');
            const rememberStatus = await AsyncStorage.getItem('rememberMe');
            if (storedEmail && storedPassword && rememberStatus === 'true') {
                setEmail(storedEmail);
                setPassword(storedPassword);
                setRememberMe(true);
            }
        };
        loadCredentials();
    }, []);

    //------------------------------------------------- On login button Submit ---------------------------------------------------------- 

    const onSubmit = () => {
        if (rememberMe) {
            AsyncStorage.setItem('email', email);
            AsyncStorage.setItem('password', password);
            AsyncStorage.setItem('rememberMe', 'true');
        } else {
            AsyncStorage.removeItem('email');
            AsyncStorage.removeItem('password');
            AsyncStorage.setItem('rememberMe', 'false');
        }

        Keyboard.dismiss();

        setTimeout(() => {
            setEmail('');
            setPassword('');
        }, 100);

        login(email, password);
    };

    useEffect(() => {
        if (loginStatus !== null) {
            if (!loginStatus) {
                setMessage('Login Failed. Please try again.');
                setIsSuccessful(false);
                setShowModal(true);
            } else {
                setMessage('Login Successful. Welcome back!');
                setIsSuccessful(true);
                setShowModal(true);
            }

            setTimeout(() => {
                setLoginStatus(null);
            }, 3000);
        }
    }, [loginStatus]);


    const handleSignupClick = () => {
        setLoginStatus(null);
        navigation.navigate('Signup');
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View className='bg-white h-full w-full'>
                <Image className='h-full w-full absolute' source={require('../assets/images/background.png')} />

                <View className='flex-row justify-around w-full absolute'>
                    <Animated.Image entering={FadeInUp.delay(200).duration(1000).springify()} className='h-[225] w-[90]' source={require('../assets/images/light.png')} />
                    <Animated.Image entering={FadeInUp.delay(400).duration(1000).springify()} className='h-[160] w-[65]' source={require('../assets/images/light.png')} />
                </View>

                <View className='h-full w-full flex justify-around pt-40 pb-10 '>
                    <View className='flex items-center'>
                        <Animated.Text entering={FadeInUp.duration(1000).springify()} className='text-white font-bold tracking-wider text-5xl'>
                            Login
                        </Animated.Text>
                    </View>

                    <View className='flex items-center mx-4 gap-5'>
                        <Animated.View entering={FadeInDown.duration(1000).springify()} className='bg-black/5 p-4 rounded-2xl w-full'>
                            <TextInput placeholder='Email' autoCapitalize='none' autoCorrect={false} placeholderTextColor={'gray'} inputMode='email' value={email} onChangeText={(value) => setEmail(value)} />
                        </Animated.View>
                        <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} className='bg-black/5 p-4 rounded-2xl w-full'>
                            <View className='flex-row items-center'>
                                <TextInput
                                    placeholder='Password'
                                    secureTextEntry={!showPassword}
                                    autoCapitalize='none'
                                    placeholderTextColor={'gray'}
                                    value={password}
                                    onChangeText={(value) => setPassword(value)}
                                    className='w-full'
                                    autoCorrect={false}
                                />
                                <Ionicons
                                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                                    size={22}
                                    color="black"
                                    onPress={() => setShowPassword(!showPassword)}
                                    className='absolute right-3'
                                />
                            </View>
                        </Animated.View>
                        <Animated.View entering={FadeInDown.delay(400).duration(1000).springify()} className='w-full '>
                            <TouchableOpacity className='w-full bg-sky-400 p-3 rounded-2xl mb-3' onPress={onSubmit}>
                                <Text className='text-xl font-bold text-white text-center'>Login</Text>
                            </TouchableOpacity>
                        </Animated.View>
                        <View className={loginStatus === false ? 'flex m-auto' : 'hidden'}>
                            <Text className='text-md font-semibold text-red-600 '>
                                Invalid credentials, Try Again!
                            </Text>
                        </View>
                        <Animated.View entering={FadeInDown.delay(600).duration(1000).springify()} className='flex flex-row items-center'>
                            <View>
                                <BouncyCheckbox
                                    size={17}
                                    fillColor="#43BE31"
                                    unFillColor="#FFFFFF"
                                    innerIconStyle={{ borderWidth: 2 }}
                                    isChecked={rememberMe}
                                    onPress={() => setRememberMe((prev) => !prev)}
                                />
                            </View>
                            <Text className='text-md'>Remember Me</Text>
                        </Animated.View>
                        <Animated.View entering={FadeInDown.delay(800).duration(1000).springify()} className='flex-row justify-center'>
                            <Text>Don't have an account? </Text>
                            <TouchableOpacity onPress={handleSignupClick}>
                                <Text className='text-sky-400'>SignUp</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </View>
                <ToastifyModal visible={showModal} onClose={() => setShowModal(false)} message={message} isSuccessful={isSuccessful} />
            </View>
        </TouchableWithoutFeedback>

    )
}
