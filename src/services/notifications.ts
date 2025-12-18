import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export const configureNotificationsAsync = async () => {
    try {
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            // asking for permission might fail on some Android emulators or restricted envs
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            console.log('Permission de notification refusée !');
            return;
        }
    } catch (error) {
        console.warn("Erreur lors de la configuration des notifications:", error);
    }
};

export const scheduleDailyReminder = async () => {
    try {
        // Cancel existing to avoid duplicates if called multiple times
        await Notifications.cancelAllScheduledNotificationsAsync();

        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Wet My Plants 🌿",
                body: "Vérifiez vos plantes, elles ont peut-être soif ! 💧",
                sound: true,
            },
            // Trigger daily at 9am
            trigger: {
                hour: 9,
                minute: 0,
                repeats: true
            } as any,
        });
        console.log("Notification quotidienne programmée pour 09h00.");
    } catch (error) {
        console.warn("Impossible de planifier la notification:", error);
    }
};

import { Plant } from '../types/plant';

export const schedulePlantWateringNotification = async (plant: Plant): Promise<string | undefined> => {
    try {
        const lastWatered = new Date(plant.lastWateredDate);
        const nextWateringDate = new Date(lastWatered);
        nextWateringDate.setDate(lastWatered.getDate() + plant.frequency);

        // Set to 9:00 AM
        nextWateringDate.setHours(9, 0, 0, 0);

        // If date is in past, schedule for tomorrow 9 AM (fallback) or just don't schedule?
        // Let's schedule for nextWateringDate. If it's in the past, Expo runs it immediately or fails? 
        // Expo docs say if trigger date is in past, it fires immediately. That's fine.

        // However, we probably want a specific date trigger, not a daily recurring one for this specific plant cycle?
        // User asked: "notification quand une plante à besoin d'etre arrosée"
        // Yes, one-off notification for that specific date.

        // But if user ignores it, maybe remind next day? For now let's do one-off.

        const identifier = await Notifications.scheduleNotificationAsync({
            content: {
                title: `Soif ! 🌿 ${plant.name}`,
                body: `${plant.name} a besoin d'eau aujourd'hui !`,
                sound: true,
            },
            trigger: nextWateringDate as any,
        });

        console.log(`Notification programmée pour ${plant.name} le ${nextWateringDate.toLocaleString()}`);
        return identifier;
    } catch (error) {
        console.warn(`Erreur programmation notif pour ${plant.name}:`, error);
        return undefined;
    }
}

export const cancelNotification = async (notificationId: string) => {
    try {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
        console.log(`Notification ${notificationId} annulée`);
    } catch (error) {
        console.warn(`Erreur annulation notif ${notificationId}:`, error);
    }
}
