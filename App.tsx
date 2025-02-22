import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import "./global.css";
import { NavigationContainer } from '@react-navigation/native';
import NoInternetModal from './src/Modal/NoInternetModal';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from './src/context/AuthProvider';
import AppNav from './src/navigation/AppNav';

SplashScreen.preventAutoHideAsync();

export default function App() {

  useEffect(() => {
    async function prepare() {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await SplashScreen.hideAsync();
    }
    prepare();
  }, []);

  return (
    <NavigationContainer>
      <AuthProvider>
        <StatusBar style='dark' />
        <NoInternetModal />
        <AppNav />
      </AuthProvider>
    </NavigationContainer>
  );
}
