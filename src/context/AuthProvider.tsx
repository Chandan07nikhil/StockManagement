import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../constants/config';

type AuthContextType = null | {};

export const Authcontext = createContext<AuthContextType>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [userToken, setUserToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [userInfo, setUserInfo] = useState<any>(null);
    const [loginStatus, setLoginStatus] = useState<boolean | null>(null);
    const [signupStatus, setSignupStatus] = useState<boolean | null>(null);

    const navigation = useNavigation<any>();

    const isTokenExpired = (token: string) => {
        try {
            const decoded: any = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            return decoded.exp < currentTime;
        } catch (error) {
            return true;
        }
    };

    const refreshAccessToken = async (refreshToken: any) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/auth/refresh-token`, { refreshToken });

            if (response.data && response.data.accessToken) {
                const newAccessToken = response.data.accessToken;
                setUserToken(newAccessToken);
                await AsyncStorage.setItem('userToken', newAccessToken);

                return newAccessToken;
            } else {
                throw new Error('Unable to refresh token');
            }
        } catch (error) {
            logout();
            throw error;
        }
    };

    const login = async (email: string, password: string) => {
        try {
            setIsLoading(true);
            const response = await axios.post(`${BASE_URL}/api/auth/login`, { email, password });

            if (response.data && response.data.accessToken && response.data.refreshToken) {
                const { accessToken, refreshToken } = response.data;
                const decoded = jwtDecode(accessToken);

                setLoginStatus(true);

                setTimeout(async () => {
                    setUserToken(accessToken);
                    setRefreshToken(refreshToken);
                    setUserInfo(decoded);
                    await AsyncStorage.setItem('userToken', accessToken);
                    await AsyncStorage.setItem('refreshToken', refreshToken);
                    await AsyncStorage.setItem('userInfo', JSON.stringify(decoded));
    
                    setLoginStatus(null);
                    
                }, 3000);

            } else {
                throw new Error('Invalid response from login');
            }
        } catch (err) {
            setLoginStatus(false);
        } finally {
            setIsLoading(false);
        }
    };

    const signUp = async (name: string, email: string, password: string) => {
        try {
            setIsLoading(true);

            const response = await axios.post(`${BASE_URL}/api/auth/register`, { name, email, password });

            if (response.data && response.data.message === 'User registered successfully.') {
                setSignupStatus(true);

                setTimeout(() => {
                    navigation.replace('Login');
                    setSignupStatus(null);
                }, 3000);
            } else {
                throw new Error('Failed to register user');
            }
        } catch (err: any) {
            setSignupStatus(false);

        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            setIsLoading(true);

            setUserToken(null);
            setRefreshToken(null);
            setUserInfo(null);

            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('refreshToken');
            await AsyncStorage.removeItem('userInfo');

            setLoginStatus(null);
        } catch (error) {
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };

    const isLoggedIn = async () => {
        try {
            setIsLoading(true);

            let userToken = await AsyncStorage.getItem('userToken');
            let refreshToken = await AsyncStorage.getItem('refreshToken');
            let userInfoString = await AsyncStorage.getItem('userInfo');
            let userInfo = userInfoString ? JSON.parse(userInfoString) : null;

            if (userToken && userInfo) {
                if (isTokenExpired(userToken)) {
                    try {
                        const newAccessToken = await refreshAccessToken(refreshToken);
                        setUserToken(newAccessToken);
                        setUserInfo(userInfo);
                    } catch (error) {
                        logout();
                    }
                } else {
                    setUserToken(userToken);
                    setUserInfo(userInfo);
                }
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        isLoggedIn();
    }, []);

    return (
        <Authcontext.Provider value={{ login, logout, signUp, isLoading, userToken, userInfo, loginStatus, signupStatus, setSignupStatus, setLoginStatus }}>
            {children}
        </Authcontext.Provider>
    );
};
