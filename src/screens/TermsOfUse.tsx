import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';

export default function TermOfUse() {
    return (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.imageContainer}>
                <Image source={require('../assets/images/Terms.jpg')} style={styles.image} />
            </View>
            <Text style={styles.heading}>Terms of Use</Text>
            <Text style={styles.paragraph}>
                The Terms of Use for the app outline the rules and guidelines users must follow while using the app. By accessing 
                or using the app, users agree to abide by these terms. The app provides services and content for personal, 
                non-commercial use only, unless explicitly stated otherwise.
            </Text>
            <Text style={styles.paragraph}>
                Users must not misuse the app, such as engaging in unlawful activities, infringing on intellectual property, or 
                causing disruptions to the app’s operation. The app reserves the right to suspend or terminate accounts for 
                violations of these terms.
            </Text>
            <Text style={styles.paragraph}>
                The app may collect and use personal data as described in the Privacy Policy, and users are responsible for 
                maintaining the confidentiality of their account information. Third-party links and services within the app are 
                not controlled by the app, and the app is not responsible for their content or privacy practices.
            </Text>
            <Text style={styles.paragraph}>
                The app is provided "as is" without warranties of any kind, and the developers are not liable for damages arising 
                from its use. Users agree to indemnify the app from any claims arising out of their use. By using the app, users 
                confirm they have read and understood these terms.
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
        height: 250,
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
