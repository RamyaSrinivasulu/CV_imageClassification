// src/screens/UploaderScreen.tsx
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

const UploaderScreen = ({ navigation }) => {
    const [image, setImage] = useState(null);

    const pickImage = () => {
        const options = {
            mediaType: 'photo',
            includeBase64: false,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                Alert.alert('User  cancelled image picker');
            } else if (response.error) {
                Alert.alert('ImagePicker Error: ', response.error);
            } else {
                setImage(response.assets[0].uri);
                navigation.navigate('Output', { imageUri: response.assets[0].uri });
            }
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Uploader</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.content}>
                <Text style={styles.uploadText}>Upload an image</Text>
                <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                    <Text style={styles.buttonText}>Browse</Text>
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
    uploadText: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: 'bold'
    },
    uploadButton: {
        backgroundColor: '#FFA500', // orangish yellow button
        padding: 15,
        borderRadius: 5,
    },
    buttonText: {
        color: '#000000', // white text
        fontSize: 18,
        textAlign: 'center',
        fontWeight: "bold"
    },
    backButton: {
        position: 'absolute',
        left: 20,
        top: 15,
        padding: 10,
    },
    backButtonText: {
        color: '#fff', // White color for the back button text
        fontSize: 16,
        fontWeight: 'bold'
    },
});

export default UploaderScreen;