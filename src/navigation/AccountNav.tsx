import { StyleSheet } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import Account from '../screens/Account';
import Profile from '../screens/Profile';
import PrivacyPolicy from '../screens/PrivacyPolicy';
import TermOfUse from '../screens/TermsOfUse';

const Stack = createStackNavigator();

export default function AccountNav() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="AccountMain"
                component={Account}
                options={{
                    headerShown: true,
                    headerTitleAlign: 'center',
                    title: 'Account'
                }}
            />
            <Stack.Screen
                name="Profile"
                component={Profile}
                options={{
                    headerShown: true,
                    headerTitleAlign: 'center'
                }}
            />
             <Stack.Screen
                name="Privacy"
                component={PrivacyPolicy}
                options={{
                    headerShown: true,
                    headerTitleAlign: 'center'
                }}
            />
            <Stack.Screen
                name="Terms"
                component={TermOfUse}
                options={{
                    headerShown: true,
                    headerTitleAlign: 'center'
                }}
            />
        </Stack.Navigator>
    )
}

const styles = StyleSheet.create({})