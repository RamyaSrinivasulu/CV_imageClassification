// src/screens/OutputScreen.tsx
import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Button, Alert } from 'react-native';
import RNFS from 'react-native-fs';

import InferenceTurboModule from '../specs/NativeClassifyImageModule';


const OutputScreen = ({ route, navigation }) => {
    // Initialise the required paths
    const { imageUri } = route.params; // Get the image URI from the route parameters
    const modelPath = "mobilenetv2-7.ort";
    const labelPath = "imagenet_labels.txt";

    // Initialise state values
    const [isModelLoaded, setModelLoaded] = React.useState(null); // State to model loading
    const [label, setLabel] = React.useState(null); // State to control label
    const [loading, setLoading] = React.useState(false); //State for inference visibility
    const [showOutput, setShowOutput] = React.useState(false); //State for output box visibility

    // Function to handle the inference
    const handleInference = async () => {
        setLoading(true); // Set the loading

        // Copy the model from assets to local storage
        const writeModelPath = `${RNFS.DocumentDirectoryPath}/${modelPath}`;
        try {
            const fileExists = await RNFS.exists(writeModelPath);
            if (!fileExists){
                const assetData = await RNFS.readFileAssets(modelPath, 'base64');
                await RNFS.writeFile(writeModelPath, assetData, 'base64');

            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to read/write model file');
        }
        // Copy the label file from assets to local storage
        const writeLabelPath = `${RNFS.DocumentDirectoryPath}/${labelPath}`;
        try {
            const fileExists = await RNFS.exists(writeLabelPath);
            if (!fileExists){
                const assetData = await RNFS.readFileAssets(labelPath, 'base64');
                await RNFS.writeFile(writeLabelPath, assetData, 'base64');

            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to read/write labelfile');
        }
        // Load the model if not loaded
        if (!isModelLoaded){
            try{
                const result = await InferenceTurboModule.loadModel(writeModelPath, writeLabelPath);
                setModelLoaded(true);
            }catch(error){
                console.error("Failed to load Model/Label File");
            }
        }
        // Run the inference
        try {
            const result = await InferenceTurboModule.runInference(imageUri);
            setLabel(result); // Set the JSON data
            setShowOutput(true); // Show the output box after setting data
        }catch (error) {
            console.error('Inference error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Output</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.content}>
                <Image
                    source={{ uri: imageUri }} style={styles.image}/>
                {showOutput && label ? ( // Show output box if showOutput is true and class label is available
                    <View style={styles.outputBox}>
                        <Text style={styles.outputTitle}>Classification Output</Text>
                        <Text style={styles.outputText}>Class_Label: {label}</Text>
                    </View>
                ) : (
                    <View style={styles.outputBox}>
                        <Text style={styles.outputText}>Click the button to run inference.</Text>
                        <Button title="View Results" onPress={handleInference} disabled={loading} />
                    </View>
                )}
            </ScrollView>
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
        paddingBottom: 30, // Add some padding at the bottom
    },
    image: {
        width: '100%', // Full width of the container
        height: 500, // Fixed height for the image
        marginBottom: 30, // Space below the image
        resizeMode: 'contain', // Maintain aspect ratio
    },
    outputBox: {
        backgroundColor: '#f0f0f0', // Light gray background for the output box
        padding: 20,
        borderRadius: 10,
        width: '80%', // Width of the output box
        marginBottom: 20,
    },
    outputTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center'
    },
    outputText: {
        fontSize: 18,
        marginBottom: 5,
        textAlign: 'center'
    },
    backButton: {
        position: 'absolute',
        left: 20,
        top: 15,
        padding: 10,
    },
    backButtonText: {
        color: '#fff', // white color for the back button text
        fontSize: 16,
    },
});

export default OutputScreen;