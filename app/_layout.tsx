import 'react-native-get-random-values';
import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { configureNotificationsAsync, scheduleDailyReminder } from '../src/services/notifications';
import { initDatabase } from '../src/services/database';

export default function RootLayout() {
    const router = useRouter();

    useEffect(() => {
        initDatabase();
        configureNotificationsAsync();
        scheduleDailyReminder();
    }, []);

    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: 'Wet My Plants 🌿',
                    headerRight: () => (
                        <TouchableOpacity
                            onPress={() => router.push('/add-plant')}
                            style={styles.addButton}
                        >
                            <Text style={styles.addButtonText}>+</Text>
                        </TouchableOpacity>
                    ),
                }}
            />
            <Stack.Screen name="add-plant" options={{ title: 'Ajouter une plante' }} />
        </Stack>
    );
}

const styles = StyleSheet.create({
    addButton: {
        backgroundColor: '#e8f5e9',
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    addButtonText: {
        fontSize: 24,
        color: '#4CAF50',
        fontWeight: 'bold',
        marginTop: -2, // Visual center adjustment
    },
});
