import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { Feather, Ionicons } from '@expo/vector-icons';

const NoInternetModal = () => {
    const [isInternetConnected, setIsInternetConnected] = useState<boolean | null>(null);
    const [isCheckingConnection, setIsCheckingConnection] = useState<boolean>(true);
    const [showLoader, setShowLoader] = useState<boolean>(false);

    useEffect(() => {
        checkConnectivity();

        const unsubscribe = NetInfo.addEventListener(state => {
            setIsInternetConnected(state.isConnected ?? false);
        });

        return () => unsubscribe();
    }, []);

    const checkConnectivity = async () => {
        setIsCheckingConnection(true);

        const state = await NetInfo.fetch();
        const isConnected = state.isConnected ?? false;

        if (!isConnected) {
            setShowLoader(true);
            setTimeout(() => {
                setShowLoader(false);
            }, 5000);
        }

        setIsInternetConnected(isConnected);
        setIsCheckingConnection(false);
    };

    const handleRefresh = () => {
        checkConnectivity();
    };

    const handleCloseModal = () => {
        if (!isInternetConnected) {
            setIsInternetConnected(true);
        }
    };

    if (isInternetConnected === null) {
        return null;
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={!isInternetConnected}
            onRequestClose={handleCloseModal}
        >
            {
                ((showLoader && !isInternetConnected))
                    ? <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color="#007BFF" />
                    </View>
                    : <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Ionicons
                                name="close-circle"
                                size={28}
                                color="#FF3031"
                                onPress={handleCloseModal}
                                style={styles.closeIcon}
                            />
                            <Feather name="wifi-off" size={30} color="#f44336" style={styles.icon} />
                            <Text style={styles.text}>No internet connection</Text>

                            {isCheckingConnection ? (
                                <ActivityIndicator size="large" color="#007BFF" />
                            ) : (
                                <Text style={styles.subText}>Please connect to the internet.</Text>
                            )}

                            <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
                                <Text style={styles.refreshButtonText}>Refresh</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
            }
        </Modal>
    );
};

const styles = StyleSheet.create({
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 15,
        width: '80%',
        maxWidth: 350,
        alignItems: 'center',
        elevation: 8,
    },
    closeIcon: {
        position: "absolute",
        top: 10,
        right: 5,
        padding: 5,
        borderRadius: 15,
        backgroundColor: "#f1f1f1",
    },
    icon: {
        marginBottom: 10,
    },
    text: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    subText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
    },
    refreshButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 10,
        marginTop: 10,
    },
    refreshButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default NoInternetModal;
