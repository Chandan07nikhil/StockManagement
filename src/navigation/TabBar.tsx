import { StyleSheet } from 'react-native'
import React, { useContext } from 'react'
import { Ionicons } from '@expo/vector-icons';
import Products from '../screens/Products';
import Analytics from '../screens/Analytics';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AccountNav from './AccountNav';
import { Authcontext } from '../context/AuthProvider';

export default function TabBar() {
    const Tab = createBottomTabNavigator();
    const { userInfo } = useContext<any>(Authcontext);

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color }) => {
                    let iconName;
                    if (route.name === 'Products') {
                        iconName = focused ? 'home' : 'home-outline'
                    }
                    else if (route.name === 'Analytics') {
                        iconName = focused ? 'stats-chart-sharp' : 'stats-chart-outline'
                    }
                    else if (route.name === 'Account') {
                        iconName = focused ? 'person' : 'person-outline'
                    }

                    return <Ionicons name={iconName || 'home'} size={22} color={color} />
                },
                tabBarLabelStyle: {
                    fontSize: 14,
                    fontFamily: 'Georgia',
                    fontWeight: 400,
                },
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 0,
                    left: 20,
                    right: 20,
                    elevation: 0,
                    backgroundColor: '#fff',
                    borderRadius: 15,
                    height: 60
                },
                tabBarActiveTintColor: '#FF4C4C',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Products" component={Products} />
            {userInfo?.isAdmin && <Tab.Screen name="Analytics" component={Analytics} />}
            <Tab.Screen name="Account" component={AccountNav} />
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({})