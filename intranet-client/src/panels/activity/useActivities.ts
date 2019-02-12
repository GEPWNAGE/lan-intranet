import { useCallback, useEffect, useState } from 'react';
import useFetch from '../../helpers/useFetch';
import { useInterval } from '../../helpers/useInterval';

export interface Activity {
    id: number;
    title: string;
    details: string;
    canSubscribe: boolean;
    startDate: Date;
}

async function handleResponse(res: Response): Promise<Activity[]> {
    const { activities } = await res.json();
    return activities.map((activity: any) => ({
        id: activity.id,
        title: activity.title,
        details: activity.details,
        canSubscribe: activity.can_subscribe === 1,
        startDate: new Date(Date.parse(activity.starts_at)),
    }));
}

function filterActivities(activities: Activity[]): Activity[] {
    // Threshold date, one hour in the past to also include the current activity
    const threshDate = new Date(new Date().getTime() - 60 * 60 * 1000);

    return activities
        .filter((act) => act.startDate.getTime() > threshDate.getTime())
        .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
}

export default function useActivities(): Activity[] {
    const allActivities = useFetch<Activity[]>(
        'http://localhost:3030/api/activities',
        [],
        handleResponse,
    );

    const [activities, setActivities] = useState<Activity[]>(() =>
        filterActivities(allActivities),
    );

    // Remove finished activities
    const updateFilteredActivities = useCallback(() => {
        setActivities((activities) => {
            const filtered = filterActivities(allActivities);
            return filtered.length === activities.length
                ? activities
                : filtered;
        });
    }, [allActivities]);

    // Update the filtered activities
    // 1. when the array of all activities changes
    // 2. every 10 minutes (to discard activities that finished while the beamer was running)
    useEffect(updateFilteredActivities, [allActivities]);
    useInterval(updateFilteredActivities, 10 * 60 * 1000);

    return activities;
}
