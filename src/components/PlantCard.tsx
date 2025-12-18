import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { Plant, PlantStatus } from '../types/plant';
import { getDaysRemaining, getPlantStatus } from '../utils/date';

interface PlantCardProps {
    plant: Plant;
    onWater: (id: string) => void;
    onDelete: (id: string) => void;
}

export const PlantCard: React.FC<PlantCardProps> = ({ plant, onWater, onDelete }) => {
    const status = getPlantStatus(plant);
    const daysRemaining = getDaysRemaining(plant);
    // User requested "Once per frequency cycle" -> Only allow watering if cycle is complete (0 or less days remaining)
    const canWater = daysRemaining <= 0;

    const handleDelete = () => {
        Alert.alert(
            "Supprimer",
            `Voulez-vous vraiment supprimer ${plant.name} ?`,
            [
                { text: "Annuler", style: "cancel" },
                { text: "Supprimer", style: "destructive", onPress: () => onDelete(plant.id) }
            ]
        );
    };

    const getStatusColor = () => {
        switch (status) {
            case PlantStatus.CRITICAL: return '#ffebee'; // Light Red
            case PlantStatus.WARNING: return '#fff3e0'; // Light Orange
            case PlantStatus.OK: return '#e8f5e9'; // Light Green
            default: return '#fff';
        }
    };

    const statusBorderColor = () => {
        switch (status) {
            case PlantStatus.CRITICAL: return '#e57373';
            case PlantStatus.WARNING: return '#ffb74d';
            case PlantStatus.OK: return '#81c784';
            default: return '#ccc';
        }
    };

    return (
        <View style={[styles.card, { backgroundColor: getStatusColor(), borderColor: statusBorderColor() }]}>
            {/* Image Section */}
            <View style={styles.imageContainer}>
                {plant.imageUri ? (
                    <Image source={{ uri: plant.imageUri }} style={styles.plantImage} />
                ) : (
                    <View style={styles.placeholderImage}>
                        <Text style={styles.placeholderText}>🌿</Text>
                    </View>
                )}
            </View>

            <View style={styles.info}>
                <Text style={styles.name}>{plant.name}</Text>
                <Text style={styles.details}>
                    Fréquence: {plant.frequency} jours
                </Text>
                <Text style={[styles.details, { fontWeight: 'bold', marginTop: 2 }]}>
                    {daysRemaining < 0
                        ? `Retard: ${Math.abs(daysRemaining)} j`
                        : `Reste: ${daysRemaining} j`}
                </Text>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity
                    style={[styles.waterButton, !canWater && styles.waterButtonDisabled]}
                    onPress={() => onWater(plant.id)}
                    disabled={!canWater}
                >
                    <Text style={styles.waterButtonText}>{canWater ? '💧' : '✅'}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                    <Text style={styles.deleteButtonText}>🗑️</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: 10, // Reduced padding to fit image
        marginVertical: 8,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    imageContainer: {
        marginRight: 12,
    },
    plantImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    placeholderImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    placeholderText: {
        fontSize: 24,
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    details: {
        fontSize: 13, // Slightly smaller
        color: '#444',
    },
    actions: {
        flexDirection: 'row',
        gap: 8, // Reduced gap
    },
    waterButton: {
        padding: 8,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 20,
    },
    waterButtonDisabled: {
        backgroundColor: 'rgba(0,255,0,0.1)',
        opacity: 0.6,
    },
    waterButtonText: {
        fontSize: 18,
    },
    deleteButton: {
        padding: 8,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 20,
    },
    deleteButtonText: {
        fontSize: 18,
    },
});
