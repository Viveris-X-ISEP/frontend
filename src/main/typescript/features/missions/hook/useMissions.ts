import { useState, useEffect } from 'react';
import { getAllMissions, getMissionById } from '../services/missions.service';
import { Mission } from '../types';

export const useMissions = () => {
    const [missions, setMissions] = useState<Mission[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchMissions = async () => {
            setLoading(true);
            try {
                const data = await getAllMissions();
                setMissions(data);
            } catch (error) {
                console.error('Failed to fetch missions', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMissions();
    }, []);

    return { missions, loading };
};

export const useMission = (id: number) => {
    const [mission, setMission] = useState<Mission | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchMission = async () => {
            setLoading(true);
            try {
                const data = await getMissionById(id);
                setMission(data);
                console.log(`Fetched mission with id ${id}:`, data);
            } catch (error) {
                console.error(`Failed to fetch mission with id ${id}`, error);
            } finally {
                setLoading(false);
            }
        };

        fetchMission();
    }, [id]);

    return { mission, loading };
};