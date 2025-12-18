import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Vibration, LayoutAnimation, Platform, UIManager } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Plant } from '../src/types/plant';
import { getPlants, updatePlantWatering, deletePlant } from '../src/services/database';
import { sortPlantsByUrgency } from '../src/utils/date';
import { PlantCard } from '../src/components/PlantCard';
import { schedulePlantWateringNotification, cancelNotification } from '../src/services/notifications';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function index() {
    const [plants, setPlants] = useState<Plant[]>([]);

    const loadData = async () => {
        const data = await getPlants();
        setPlants(sortPlantsByUrgency(data));
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );


    const handleWater = async (id: string) => {
        // Haptic feedback
        Vibration.vibrate(100);

        const now = new Date().toISOString();
        const plantToUpdate = plants.find(p => p.id === id);

        // Cancel old notification if exists
        if (plantToUpdate?.notificationId) {
            await cancelNotification(plantToUpdate.notificationId);
        }

        // Schedule new one
        let newNotifId: string | undefined;
        if (plantToUpdate) {
            // We need to simulate the updated plant state for the scheduler
            // Ideally we should have a helper but constructing object is fine
            const updatedPlantSim = { ...plantToUpdate, lastWateredDate: now };
            newNotifId = await schedulePlantWateringNotification(updatedPlantSim);
        }

        // Optimistic update for instant feedback
        const updated = plants.map(p => {
            if (p.id === id) {
                return { ...p, lastWateredDate: now, notificationId: newNotifId };
            }
            return p;
        });

        // Animate the reordering
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setPlants(sortPlantsByUrgency(updated));

        // Persist to DB in background
        await updatePlantWatering(id, now, newNotifId);
    };

    const handleDelete = async (id: string) => {
        // Cancel notification logic
        const plantToDelete = plants.find(p => p.id === id);
        if (plantToDelete?.notificationId) {
            await cancelNotification(plantToDelete.notificationId);
        }

        // Animate deletion
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

        const updated = plants.filter(p => p.id !== id);
        setPlants(updated);
        await deletePlant(id);
    };

    return (
        <View style={styles.container}>
            {plants.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Aucune plante pour le moment.</Text>
                    <Text style={styles.emptySubText}>Ajoutez-en une ! 🌿</Text>
                </View>
            ) : (
                <FlatList
                    data={plants}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <PlantCard
                            plant={item}
                            onWater={handleWater}
                            onDelete={handleDelete}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    listContent: {
        padding: 20,
        paddingBottom: 100, // Space for easier scrolling
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    emptySubText: {
        fontSize: 16,
        color: '#666',
    },
});
