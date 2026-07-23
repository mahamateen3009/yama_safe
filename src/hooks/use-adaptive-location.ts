import * as Location from 'expo-location';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export type PowerMode = 'high' | 'standard' | 'eco';

interface LocationConfig {
    accuracy: Location.Accuracy;
    timeInterval: number;
    distanceInterval: number;
}

const POWER_CONFIGS: Record<PowerMode, LocationConfig> = {
    high: {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,      // Every 5 seconds
        distanceInterval: 5,     // Every 5 meters
    },
    standard: {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 30000,     // Every 30 seconds
        distanceInterval: 25,    // Every 25 meters
    },
    eco: {
        accuracy: Location.Accuracy.Low,
        timeInterval: 120000,    // Every 2 minutes
        distanceInterval: 100,   // Every 100 meters
    },
};

export function useAdaptiveLocation() {
    const [powerMode, setPowerMode] = useState<PowerMode>('standard');
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const subscriptionRef = useRef<Location.LocationSubscription | null>(null);
    const appStateRef = useRef<AppStateStatus>(AppState.currentState);
    const lastCoordRef = useRef<{ latitude: number; longitude: number } | null>(null);
    const idleCountRef = useRef<number>(0);

    const stopTracking = useCallback(() => {
        if (subscriptionRef.current) {
            subscriptionRef.current.remove();
            subscriptionRef.current = null;
        }
    }, []);

    const startTracking = useCallback(async () => {
        try {
            stopTracking();

            // Do not poll GPS if app is backgrounded
            if (appStateRef.current !== 'active') return;

            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Location permission denied.');
                return;
            }

            const config = POWER_CONFIGS[powerMode];

            // Get immediate fix
            const currentLoc = await Location.getCurrentPositionAsync({
                accuracy: config.accuracy,
            });
            setLocation(currentLoc);
            lastCoordRef.current = {
                latitude: currentLoc.coords.latitude,
                longitude: currentLoc.coords.longitude,
            };

            // Watch position with adaptive parameters
            subscriptionRef.current = await Location.watchPositionAsync(
                {
                    accuracy: config.accuracy,
                    timeInterval: config.timeInterval,
                    distanceInterval: config.distanceInterval,
                },
                (newLoc) => {
                    const { latitude, longitude } = newLoc.coords;

                    // Stationary Backoff Check: If user hasn't moved significantly, increment idle count
                    if (lastCoordRef.current) {
                        const deltaLat = Math.abs(lastCoordRef.current.latitude - latitude);
                        const deltaLng = Math.abs(lastCoordRef.current.longitude - longitude);

                        // Roughly ~5-10 meters threshold
                        if (deltaLat < 0.00005 && deltaLng < 0.00005) {
                            idleCountRef.current += 1;
                            // If idle for multiple consecutive readings and currently on 'high', step down to 'standard' to save battery
                            if (idleCountRef.current > 5 && powerMode === 'high') {
                                setPowerMode('standard');
                                idleCountRef.current = 0;
                            }
                        } else {
                            // Movement detected, reset idle count
                            idleCountRef.current = 0;
                            lastCoordRef.current = { latitude, longitude };
                        }
                    }

                    setLocation(newLoc);
                }
            );
        } catch (err) {
            console.error('Adaptive Location Error:', err);
            setErrorMsg('Failed to fetch location.');
        }
    }, [powerMode, stopTracking]);

    // Handle App Lifecycle States (Pause GPS when backgrounded)
    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextAppState) => {
            if (appStateRef.current.match(/active/) && nextAppState.match(/inactive|background/)) {
                // App went background -> Stop GPS to preserve battery
                stopTracking();
            } else if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
                // App returned foreground -> Resume tracking
                startTracking();
            }
            appStateRef.current = nextAppState;
        });

        return () => {
            subscription.remove();
        };
    }, [startTracking, stopTracking]);

    // Restart tracking when powerMode changes
    useEffect(() => {
        startTracking();
        return () => {
            stopTracking();
        };
    }, [powerMode, startTracking, stopTracking]);

    return {
        location,
        powerMode,
        setPowerMode,
        errorMsg,
    };
}