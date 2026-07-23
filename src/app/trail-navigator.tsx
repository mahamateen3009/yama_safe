import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAdaptiveLocation, type PowerMode } from '@/hooks/use-adaptive-location';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TrailNavigatorScreen() {
    const router = useRouter();
    const { location, powerMode, setPowerMode, errorMsg: locationError } = useAdaptiveLocation();

    const [heading, setHeading] = useState<number | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        let headingSubscription: Location.LocationSubscription | null = null;

        async function setupHeading() {
            try {
                headingSubscription = await Location.watchHeadingAsync((head) => {
                    setHeading(head.trueHeading >= 0 ? head.trueHeading : head.magHeading);
                });
            } catch (err) {
                console.error('Heading Error:', err);
                setErrorMsg('Compass heading sensor unavailable.');
            }
        }

        setupHeading();

        return () => {
            if (headingSubscription) headingSubscription.remove();
        };
    }, []);

    const displayError = locationError || errorMsg;

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <ThemedText type="subtitle" style={styles.title}>🧭 Offline Vector Compass</ThemedText>
                        <ThemedText type="small" themeColor="textSecondary" style={{ textAlign: 'center' }}>
                            Direct hardware sensor tracking. Works completely offline.
                        </ThemedText>
                    </View>

                    {/* Battery & Power Mode Selector Bar */}
                    <View style={styles.powerCard}>
                        <View style={styles.powerHeaderRow}>
                            <ThemedText type="smallBold">🔋 GPS Power Mode</ThemedText>
                            <ThemedText type="small" style={{ color: powerMode === 'eco' ? '#059669' : '#D97706', fontWeight: 'bold' }}>
                                {powerMode.toUpperCase()}
                            </ThemedText>
                        </View>
                        <View style={styles.buttonGroup}>
                            {(['high', 'standard', 'eco'] as PowerMode[]).map((mode) => {
                                const isActive = powerMode === mode;
                                return (
                                    <Pressable
                                        key={mode}
                                        onPress={() => setPowerMode(mode)}
                                        style={[
                                            styles.modeButton,
                                            isActive && styles.activeModeButton,
                                        ]}
                                    >
                                        <ThemedText
                                            type="smallBold"
                                            style={{ color: isActive ? '#fff' : '#888', fontSize: 11 }}
                                        >
                                            {mode === 'high' ? '⚡ High' : mode === 'standard' ? '⚖️ Balanced' : '🌱 Eco (-85%)'}
                                        </ThemedText>
                                    </Pressable>
                                );
                            })}
                        </View>
                    </View>

                    {/* Compass Display Box */}
                    <View style={styles.compassCard}>
                        <ThemedText type="subtitle" style={{ color: '#0275d8', marginBottom: 8 }}>
                            {heading !== null ? `${Math.round(heading)}°` : '---°'}
                        </ThemedText>
                        <ThemedText type="default" style={styles.boldText}>
                            {heading !== null ? getCardinalDirection(heading) : 'Calibrating Sensor...'}
                        </ThemedText>
                    </View>

                    {/* Telemetry Metrics Box */}
                    <View style={styles.metricsGrid}>
                        <View style={styles.metricBox}>
                            <ThemedText type="small" themeColor="textSecondary">Altitude</ThemedText>
                            <ThemedText type="default" style={styles.boldText}>
                                {location?.coords.altitude ? `${Math.round(location.coords.altitude)} meters` : 'Acquiring...'}
                            </ThemedText>
                        </View>

                        <View style={styles.metricBox}>
                            <ThemedText type="small" themeColor="textSecondary">GPS Accuracy</ThemedText>
                            <ThemedText type="default" style={styles.boldText}>
                                {location?.coords.accuracy ? `±${Math.round(location.coords.accuracy)}m` : 'Searching...'}
                            </ThemedText>
                        </View>

                        <View style={styles.metricBox}>
                            <ThemedText type="small" themeColor="textSecondary">Latitude</ThemedText>
                            <ThemedText type="smallBold">
                                {location?.coords.latitude ? location.coords.latitude.toFixed(5) : '---'}
                            </ThemedText>
                        </View>

                        <View style={styles.metricBox}>
                            <ThemedText type="small" themeColor="textSecondary">Longitude</ThemedText>
                            <ThemedText type="smallBold">
                                {location?.coords.longitude ? location.coords.longitude.toFixed(5) : '---'}
                            </ThemedText>
                        </View>
                    </View>

                    {displayError && (
                        <ThemedText type="small" style={{ color: '#B71C1C', textAlign: 'center', marginBottom: 16 }}>
                            {displayError}
                        </ThemedText>
                    )}

                    <Pressable style={styles.backButton} onPress={() => router.back()}>
                        <ThemedText type="smallBold" themeColor="text">&larr; Return to Dashboard</ThemedText>
                    </Pressable>
                </ScrollView>
            </SafeAreaView>
        </ThemedView>
    );
}

function getCardinalDirection(angle: number): string {
    const directions = ['North (N)', 'North-East (NE)', 'East (E)', 'South-East (SE)', 'South (S)', 'South-West (SW)', 'West (W)', 'North-West (NW)'];
    return directions[Math.round(angle / 45) % 8];
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    safeArea: { flex: 1 },
    scrollContent: { padding: 20, maxWidth: 600, width: '100%', alignSelf: 'center' },
    header: { marginBottom: 16, alignItems: 'center' },
    title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
    boldText: { fontWeight: 'bold' },
    powerCard: {
        padding: 12,
        borderRadius: 12,
        backgroundColor: 'rgba(150, 150, 150, 0.08leukin || 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(150, 150, 150, 0.2)',
        gap: 8,
        marginBottom: 16,
    },
    powerHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    buttonGroup: {
        flexDirection: 'row',
        gap: 8,
    },
    modeButton: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: 'rgba(150, 150, 150, 0.15)',
        alignItems: 'center',
    },
    activeModeButton: {
        backgroundColor: '#0275d8',
    },
    compassCard: {
        backgroundColor: 'rgba(2, 117, 216, 0.05)',
        borderWidth: 2,
        borderColor: '#0275d8',
        padding: 30,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 20,
    },
    metricsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 20,
    },
    metricBox: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#dee2e6',
        alignItems: 'center',
    },
    backButton: { alignSelf: 'center', padding: 10, marginTop: 10 },
});