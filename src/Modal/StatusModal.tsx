import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { View, Text, Modal, Animated, StyleSheet } from 'react-native';

export const ToastifyModal = ({ visible, onClose, message, isSuccessful }:
    {
        visible: boolean,
        onClose: any,
        message: string,
        isSuccessful: boolean
    }) => {
    const animatedValue = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (visible) {
            animatedValue.setValue(1);

            Animated.timing(animatedValue, {
                toValue: 0,
                duration: 4000,
                useNativeDriver: false,
            }).start(() => {
                onClose();
            });
        }
    }, [visible]);

    const animatedWidth = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    if (!visible) return null;

    const color = isSuccessful ? '#43BE31' : '#EC4849';

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.toastContainer}>
                    <Ionicons name="close-outline" size={22} color="black" onPress={onClose} style={{ position: 'absolute', top: 5, right: 5 }} />
                    <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 8 }}>
                        <Ionicons name="checkmark-circle-sharp" size={22} color={color} />
                        <Text style={styles.toastText}>{message}</Text>
                    </View>
                    <View style={styles.borderContainer}>
                        <Animated.View style={[styles.animatedBorder, { width: animatedWidth, backgroundColor: color }]} />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    toastContainer: {
        margin: 20,
        paddingHorizontal: 15,
        paddingVertical: 22,
        backgroundColor: 'white',
        borderRadius: 5,
        position: 'relative',
        width: 'auto',
    },
    toastText: {
        fontSize: 16,
        color: 'black',
    },
    borderContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 5,
        overflow: 'hidden',
    },
    animatedBorder: {
        height: '100%',
    },
});
