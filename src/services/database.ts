import * as SQLite from 'expo-sqlite';
import { Plant } from '../types/plant';

let db: SQLite.SQLiteDatabase | null = null;

const getDb = async () => {
    if (!db) {
        db = await SQLite.openDatabaseAsync('wetmyplants.db');
    }
    return db;
};

export const initDatabase = async () => {
    const database = await getDb();
    // Migrations could be handled better but for now we try to ensure column exists
    await database.execAsync(`
    CREATE TABLE IF NOT EXISTS plants (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      frequency INTEGER NOT NULL,
      lastWateredDate TEXT NOT NULL,
      imageUri TEXT,
      notificationId TEXT
    );
  `);
    // Attempt to add column if it doesn't exist (for existing installs)
    try {
        await database.execAsync('ALTER TABLE plants ADD COLUMN notificationId TEXT;');
    } catch (e) {
        // Ignore error if column already exists
    }
};

export const addPlant = async (plant: Plant) => {
    const database = await getDb();
    try {
        await database.runAsync(
            'INSERT INTO plants (id, name, frequency, lastWateredDate, imageUri, notificationId) VALUES (?, ?, ?, ?, ?, ?)',
            plant.id,
            plant.name,
            Number(plant.frequency) || 7, // Fallback to 7 if NaN
            plant.lastWateredDate,
            plant.imageUri ?? null, // Use nullish coalescing for strict null
            plant.notificationId ?? null
        );
    } catch (e) {
        console.error("SQLite Error in addPlant:", e);
        throw e;
    }
};

export const getPlants = async (): Promise<Plant[]> => {
    const database = await getDb();
    const allRows = await database.getAllAsync('SELECT * FROM plants');
    return allRows as Plant[];
};

export const updatePlantWatering = async (id: string, date: string, notificationId?: string) => {
    const database = await getDb();
    if (notificationId) {
        await database.runAsync(
            'UPDATE plants SET lastWateredDate = ?, notificationId = ? WHERE id = ?',
            date,
            notificationId,
            id
        );
    } else {
        await database.runAsync(
            'UPDATE plants SET lastWateredDate = ? WHERE id = ?',
            date,
            id
        );
    }
};

export const deletePlant = async (id: string) => {
    const database = await getDb();
    await database.runAsync('DELETE FROM plants WHERE id = ?', id);
};
