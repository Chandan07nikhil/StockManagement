import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';

export default function PrivacyPolicy() {
    return (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.imageContainer}>
                <Image source={require('../assets/images/privacy.jpg')} style={styles.image} />
            </View>
            <Text style={styles.heading}>Privacy Policy</Text>
            <Text style={styles.paragraph}>
                The privacy policy of an app is a crucial document that outlines how the app collects, uses, and protects user 
                information. It is designed to ensure transparency and build trust between the app's developers and its users. The 
                policy typically begins with an introduction explaining the purpose of data collection and how it enhances the 
                app's functionality and user experience.
            </Text>
            <Text style={styles.paragraph}>
                It details the types of personal information the app may collect, such as name, email, location, and usage data, and 
                how this data is used for specific purposes, like providing services, improving features, or personalizing content. 
                Additionally, the privacy policy addresses third-party services that may have access to user data, such as advertisers, 
                analytics tools, or payment processors.
            </Text>
            <Text style={styles.paragraph}>
                Users are encouraged to review the policy regularly for updates and are provided with instructions on how to contact 
                the app's support team for privacy-related concerns. Importantly, the privacy policy should comply with applicable laws 
                and regulations, such as GDPR or CCPA, and ensure that users' privacy rights are respected.
            </Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 55,
        backgroundColor: '#f9f9f9',
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 15,
    },
    image: {
        width: '100%',
        height: 280,
        borderRadius: 20,
        resizeMode: 'cover',
    },
    heading: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 15,
    },
    paragraph: {
        fontSize: 16,
        lineHeight: 24,
        color: '#444',
        textAlign: 'justify',
        marginBottom: 12,
    },
});
