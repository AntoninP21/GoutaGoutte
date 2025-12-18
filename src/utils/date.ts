import { differenceInDays, parseISO, startOfDay } from 'date-fns';
import { Plant, PlantStatus } from '../types/plant';

export const getDaysSinceWatered = (lastWateredDate: string): number => {
    const last = startOfDay(parseISO(lastWateredDate));
    const today = startOfDay(new Date());
    return differenceInDays(today, last);
};

export const getDaysRemaining = (plant: Plant): number => {
    const daysSince = getDaysSinceWatered(plant.lastWateredDate);
    return plant.frequency - daysSince;
};

export const getPlantStatus = (plant: Plant): PlantStatus => {
    const daysRemaining = getDaysRemaining(plant);

    if (daysRemaining <= 0) {
        return PlantStatus.CRITICAL;
    }
    if (daysRemaining <= 1) {
        return PlantStatus.WARNING;
    }
    return PlantStatus.OK;
};

export const sortPlantsByUrgency = (plants: Plant[]): Plant[] => {
    return [...plants].sort((a, b) => {
        // Lower days remaining = higher urgency
        const remainingA = getDaysRemaining(a);
        const remainingB = getDaysRemaining(b);
        return remainingA - remainingB;
    });
};
