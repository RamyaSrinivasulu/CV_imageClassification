// src/screens/HomeScreen.tsx
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const HomeScreen = ({ navigation }) => {
    const handleGetStarted = () => {
        navigation.navigate('Uploader');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Home</Text>
            </View>
            <View style={styles.content}>
                <Text style={styles.welcomeText}>Welcome to CV App !!</Text>
                <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        backgroundColor: '#FFA500', // orangish yellow
        padding: 20,
        alignItems: 'center',
    },
    headerText: {
        color: '#fff', // white text
        fontSize: 24,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: 'bold'
    },
    button: {
        backgroundColor: '#FFA500', // orangish yellow button
        padding: 15,
        borderRadius: 5,
    },
    buttonText: {
        color: '#000000', // black text
        fontSize: 18,
        textAlign: 'center',
        fontWeight: "bold"
    },
});

export default HomeScreen;