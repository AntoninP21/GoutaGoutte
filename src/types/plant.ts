export interface Plant {
    id: string;
    name: string;
    frequency: number; // Interval in days
    lastWateredDate: string; // ISO 8601 format
    imageUri?: string; // For bonus
    notificationId?: string;
}

export enum PlantStatus {
    CRITICAL = 'CRITICAL',
    WARNING = 'WARNING',
    OK = 'OK',
}
