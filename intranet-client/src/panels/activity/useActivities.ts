import { useCallback, useEffect, useState } from 'react';
import useFetch from '../../helpers/useFetch';
import { useInterval } from '../../helpers/useInterval';

export interface Activity {
    id: number;
    title: string;
    details: string;
}

async function handleResponse(res: Response): Promise<Activity[]> {
    const { activities } = await res.json();
    return activities.map((activity: any) => ({
        id: activity.id,
        title: activity.title,
        details: activity.details,
    }));
}
export default function useActivities(): Activity[] {
    const [version, setVersion] = useState(0);
    const activities = useFetch<Activity[]>(
        { version, url: 'http://localhost:3030/api/activities' },
        [],
        handleResponse,
    );

    // Request the activities again every 10 minutes
    useInterval(() => {
        setVersion((version) => version + 1);
    }, 10 * 60 * 1000);

    return activities;
}
