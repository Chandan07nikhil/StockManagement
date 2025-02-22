import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { Authcontext } from '../context/AuthProvider';
import { BASE_URL } from '../constants/config';
import { ToastifyModal } from '../Modal/StatusModal';

export default function Profile() {
    const { userInfo, userToken } = useContext<any>(Authcontext);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [isSuccessful, setIsSuccessful] = useState<boolean>(false);
    const [userData, setUserData] = useState<any>();

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/auth/user/${userInfo.id}`, {
                method: "GET",
                headers: new Headers({
                    Authorization: userToken,
                    "Content-Type": "application/json",
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch user data: ${response.statusText}`);
            }

            const data = await response.json();
            if (data) {
                setUserData(data);
            }
        } catch (err) {
            setMessage('Failed to fetch user data. Please try again.');
            setIsSuccessful(false);
            setShowModal(true);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.profileContainer}>
                <Image 
                    source={require('../assets/images/profile.jpg')} 
                    style={styles.profileImage}
                />
                <Text style={styles.username}>{userData?.username}</Text>
                <Text style={styles.email}>{userData?.email}</Text>
            </View>

            <View style={styles.aboutContainer}>
                <Text style={styles.aboutTitle}>About Mahabir Enterprises</Text>
                <Text style={styles.aboutText}>
                    Mahabir Enterprises is a trusted name in safety and water purification solutions. 
                    We specialize in high-quality firefighting equipment to protect lives and property, 
                    offering a wide range of fire extinguishers, alarms, hydrants, and suppression systems.
                </Text>
                <Text style={styles.aboutText}>
                    With a commitment to reliability and innovation, we provide certified products 
                    that meet industry standards. Our expert team ensures seamless installation, maintenance, 
                    and customer support, making safety and water purity hassle-free.
                </Text>
                <Text style={styles.aboutText}>
                    At Mahabir Enterprises, we prioritize quality, trust, and efficiency, delivering solutions 
                    that safeguard both people and the environment. Explore our range of products and services to 
                    enhance your safety and water quality today.
                </Text>
            </View>

            <ToastifyModal 
                visible={showModal} 
                onClose={() => setShowModal(false)} 
                message={message} 
                isSuccessful={isSuccessful} 
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingBottom: 30,
        backgroundColor: '#f9f9f9',
    },
    profileContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 3,
        borderColor: '#00BFFF',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 3 },
    },
    username: {
        marginTop: 10,
        fontSize: 22,
        fontWeight: 'bold',
        color: '#00BFFF',
    },
    email: {
        fontSize: 16,
        color: '#555',
        fontWeight: '500',
    },
    aboutContainer: {
        marginTop: 20,
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
    aboutTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#00BFFF',
        textAlign: 'center',
        marginBottom: 10,
    },
    aboutText: {
        fontSize: 15,
        lineHeight: 22,
        textAlign: 'justify',
        color: '#333',
    },
});
