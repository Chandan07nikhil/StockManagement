import { Image, Keyboard, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Animated, { FadeInDown, FadeInUp, } from 'react-native-reanimated';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ToastifyModal } from '../Modal/StatusModal';
import { Ionicons } from '@expo/vector-icons';
import { Authcontext } from '../context/AuthProvider';

export default function SignupScreen() {

    const [showModal, setShowModal] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [isSuccessful, setIsSuccessful] = useState<boolean>(false);

    const [name, setName] = useState('');
    const [nameError, setNameError] = useState<boolean>(false);
    const [nameTouched, setNameTouched] = useState<boolean>(false);
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState<boolean>(false);
    const [emailTouched, setEmailTouched] = useState<boolean>(false);
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState<boolean>(false);
    const [passwordTouched, setPasswordTouched] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const navigation = useNavigation<any>();
    const { signUp, signupStatus, setSignupStatus } = useContext<any>(Authcontext);

    useFocusEffect(
        React.useCallback(() => {
            setSignupStatus(null);
        }, [])
    );

    useEffect(() => {
        if (signupStatus !== null) {
            if (signupStatus) {
                setMessage('Registration Successful. Please login.');
                setIsSuccessful(true);
            } else {
                setMessage('Registration Failed. Please try again.');
                setIsSuccessful(false);
            }
            setShowModal(true);

            setTimeout(() => {
                setSignupStatus(null);
            }, 3000);
        }
    }, [signupStatus]);

    const onSubmit = () => {
        let hasError = false;

        if (name === '') {
            setNameError(true);
            setNameTouched(true);
            hasError = true;
        }
        if (email === '' || !isValidEmail(email)) {
            setEmailError(true);
            setEmailTouched(true);
            hasError = true;
        }
        if (!isValidPassword(password)) {
            setPasswordError(true);
            setPasswordTouched(true);
            hasError = true;
        }

        if (hasError) {
            setMessage('Please correct the highlighted errors.');
            setIsSuccessful(false);
            setShowModal(true);
            return;
        }

        Keyboard.dismiss();

        setTimeout(() => {
            setName('');
            setEmail('');
            setPassword('');
        }, 100);

        signUp(name, email, password);
    };


    const handleLoginClick = () => {
        navigation.replace('Login');
        setSignupStatus(null);
    }

    function isValidEmail(email: string) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    function isValidPassword(password: string) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View className='bg-white h-full w-full'>
                <Image className='h-full w-full absolute' source={require('../assets/images/background.png')} />

                <View className='flex-row justify-around w-full absolute'>
                    <Animated.Image entering={FadeInUp.delay(200).duration(1000).springify()} className='h-[225] w-[90]' source={require('../assets/images/light.png')} />
                    <Animated.Image entering={FadeInUp.delay(400).duration(1000).springify()} className='h-[160] w-[65]' source={require('../assets/images/light.png')} />
                </View>

                <View className='h-full w-full flex justify-around pt-48'>
                    <View className='flex items-center'>
                        <Animated.Text entering={FadeInUp.duration(1000).springify()} className='text-white font-bold tracking-wider text-5xl'>
                            Sign Up
                        </Animated.Text>
                    </View>

                    <View className='flex items-center mx-4 gap-5'>
                        <Animated.View entering={FadeInDown.duration(1000).springify()} className='bg-black/5 p-4 rounded-2xl w-full'>
                            <TextInput
                                placeholder='Name'
                                placeholderTextColor={'gray'}
                                value={name}
                                autoCorrect={false}
                                onFocus={() => setNameTouched(true)}
                                onBlur={() => {
                                    if (name === '') setNameError(true);
                                }}
                                onChangeText={(name) => {
                                    setName(name);
                                    if (name !== '') setNameError(false);
                                }}
                            />
                            {nameError && nameTouched && (
                                <Text className='text-[#FF362E] text-[12px] mt-1'>Name is required</Text>
                            )}
                        </Animated.View>
                        <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} className='bg-black/5 p-4 rounded-2xl w-full'>
                            <TextInput
                                placeholder='Email'
                                placeholderTextColor={'gray'}
                                inputMode='email'
                                autoCapitalize='none'
                                value={email}
                                onFocus={() => setEmailTouched(true)}
                                onBlur={() => {
                                    if (email === '' || !isValidEmail(email)) setEmailError(true);
                                }}
                                onChangeText={(email) => {
                                    setEmail(email);
                                    if (email !== '' && isValidEmail(email)) setEmailError(false);
                                }}
                            />
                            {emailError && emailTouched && (
                                <Text className='text-[#FF362E] text-[12px] mt-1'>
                                    {email === '' ? 'Email is required' : 'Please provide a valid email id'}
                                </Text>
                            )}
                        </Animated.View>
                        <Animated.View entering={FadeInDown.delay(400).duration(1000).springify()} className='bg-black/5 p-4 rounded-2xl w-full'>
                            <View className='flex-row items-center'>
                                <TextInput
                                    placeholder='Password'
                                    secureTextEntry={!showPassword}
                                    placeholderTextColor={'gray'}
                                    value={password}
                                    onFocus={() => setPasswordTouched(true)}
                                    onBlur={() => {
                                        if (!isValidPassword(password)) setPasswordError(true);
                                    }}
                                    onChangeText={(password) => {
                                        setPassword(password);
                                        if (!isValidPassword(password)) setPasswordError(false);
                                    }}
                                    className='w-full'
                                />
                                <Ionicons
                                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                                    size={22}
                                    color="black"
                                    onPress={() => setShowPassword(!showPassword)}
                                    className='absolute right-3'
                                />
                            </View>
                            {passwordError && passwordTouched && (
                                <Text numberOfLines={3} className='text-[#FF362E] text-[12px] mt-1'>
                                    {'Password must contain at least one uppercase letter (A-Z), one lowercase letter (a-z), one digit (0-9), one special character (@, $, !, %, *, ?, &) and Minimum of 8 characters in length.'}
                                </Text>)}
                        </Animated.View>
                        <Animated.View entering={FadeInDown.delay(600).duration(1000).springify()} className='w-full '>
                            <TouchableOpacity
                                className='w-full bg-sky-400 p-3 rounded-2xl mb-3' onPress={onSubmit}>
                                <Text className='text-xl font-bold text-white text-center'>SignUp</Text>
                            </TouchableOpacity>
                        </Animated.View>
                        <Animated.View entering={FadeInDown.delay(800).duration(1000).springify()} className='flex-row justify-center'>
                            <Text>Already have an account? </Text>
                            <TouchableOpacity onPress={handleLoginClick}>
                                <Text className='text-sky-400'>Login</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </View >
                <ToastifyModal visible={showModal} onClose={() => setShowModal(false)} message={message} isSuccessful={isSuccessful} />
            </View >
        </TouchableWithoutFeedback>
    )
}
