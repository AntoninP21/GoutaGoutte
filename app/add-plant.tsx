import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { v4 as uuidv4 } from 'uuid';
import * as ImagePicker from 'expo-image-picker';
import { addPlant } from '../src/services/database';
import { schedulePlantWateringNotification } from '../src/services/notifications';

export default function AddPlantScreen() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [frequency, setFrequency] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Ensure frequency is a valid number strictly
    const isFrequencyValid = frequency.length > 0 && parseInt(frequency) > 0;
    const isValid = name.trim().length > 0 && isFrequencyValid;

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission refusée', 'Nous avons besoin de la caméra pour prendre une photo.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };


    const handleSave = async () => {
        if (!isValid) return;

        try {
            setLoading(true);

            let date = new Date();


            const newPlant = {
                id: uuidv4(),
                name: name.trim(),
                frequency: parseInt(frequency),
                lastWateredDate: date.toISOString(),
                imageUri: imageUri || undefined,
            };

            const notifId = await schedulePlantWateringNotification(newPlant);

            await addPlant({
                ...newPlant,
                notificationId: notifId
            });

            router.back();
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de sauvegarder la plante');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleFrequencyChange = (text: string) => {
        const numericValue = text.replace(/[^0-9]/g, '');
        setFrequency(numericValue);
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.label}>Photo de la plante (Optionnel)</Text>
            <View style={styles.imageContainer}>
                {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.previewImage} />
                ) : (
                    <View style={styles.placeholderImage}>
                        <Text style={styles.placeholderText}>🌿</Text>
                    </View>
                )}
                <View style={styles.imageButtons}>
                    <TouchableOpacity style={styles.iconButton} onPress={pickImage}>
                        <Text style={styles.iconButtonText}>🖼️ Galerie</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton} onPress={takePhoto}>
                        <Text style={styles.iconButtonText}>📸 Caméra</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Text style={styles.label}>Nom de la plante</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="ex: Ficus"
            />

            <Text style={styles.label}>Fréquence d'arrosage (jours)</Text>
            <TextInput
                style={styles.input}
                value={frequency}
                onChangeText={handleFrequencyChange}
                placeholder="ex: 7"
                keyboardType="numeric"
            />



            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[
                        styles.button,
                        isValid ? styles.buttonEnabled : styles.buttonDisabled
                    ]}
                    onPress={handleSave}
                    disabled={!isValid || loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? "Sauvegarde..." : "Sauvegarder"}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 10,
    },
    buttonContainer: {
        marginTop: 20,
        marginBottom: 40,
    },
    button: {
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonEnabled: {
        backgroundColor: '#4CAF50',
    },
    buttonDisabled: {
        backgroundColor: '#e0e0e0',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 10,
    },
    previewImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 10,
    },
    placeholderImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    placeholderText: {
        fontSize: 50,
    },
    imageButtons: {
        flexDirection: 'row',
        gap: 15,
    },
    iconButton: {
        backgroundColor: '#e8f5e9',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    iconButtonText: {
        color: '#2E7D32',
        fontWeight: '600',
    },
});
