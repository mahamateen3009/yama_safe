import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAdaptiveLocation } from '@/hooks/use-adaptive-location';
import { useTheme } from '@/hooks/use-theme';

type MapLayer = 'topo' | 'contours' | 'satellite';
type Waypoint = {
    id: number;
    name: string;
    type: 'camp' | 'hazard' | 'water';
    lat: number;
    lng: number;
    alt: number;
    description: string;
    top: string;
    left: string;
};

const WAYPOINTS_TABLE = 'waypoints';

export default function OfflineMapScreen() {
    const theme = useTheme();
    const db = useSQLiteContext();
    const { location, powerMode } = useAdaptiveLocation();

    const [activeLayer, setActiveLayer] = useState<MapLayer>('topo');
    const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
    const [selectedWaypoint, setSelectedWaypoint] = useState<Waypoint | null>(null);

    // New custom waypoint modal / inputs state
    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState('');
    const [newType, setNewType] = useState<'camp' | 'hazard' | 'water'>('camp');
    const [newDesc, setNewDesc] = useState('');

    const latitude = location?.coords.latitude?.toFixed(4) ?? '34.1000';
    const longitude = location?.coords.longitude?.toFixed(4) ?? '74.8000';
    const altitude = location?.coords.altitude ? Math.round(location.coords.altitude) : 3450;

    // Initialize table and seed default offline waypoints if empty
    const loadWaypoints = useCallback(async () => {
        try {
            await db.execAsync(`
                CREATE TABLE IF NOT EXISTS ${WAYPOINTS_TABLE} (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    type TEXT NOT NULL,
                    lat REAL NOT NULL,
                    lng REAL NOT NULL,
                    alt REAL NOT NULL,
                    description TEXT NOT NULL,
                    top TEXT NOT NULL,
                    left TEXT NOT NULL
                );
            `);

            const rows = await db.getAllAsync<any>(`SELECT * FROM ${WAYPOINTS_TABLE}`);

            if (rows.length === 0) {
                // Seed initial offline cached waypoints if table is empty
                const defaults = [
                    { name: 'Base Camp Alpha', type: 'camp', lat: 34.1021, lng: 74.8023, alt: 3400, description: 'Safe local waypoint loaded in offline cache. Bearings calibrated for alpine transit.', top: '28%', left: '22%' },
                    { name: 'Ridge Hazard / Rockfall Zone', type: 'hazard', lat: 34.1045, lng: 74.8011, alt: 3620, description: 'Unstable scree slope. Exercise extreme caution during afternoon wind gusts.', top: '42%', left: '48%' },
                    { name: 'Glacial Stream Crossing', type: 'water', lat: 34.0982, lng: 74.8050, alt: 3280, description: 'Potable water source after filtration. Fast-flowing snowmelt.', top: '68%', left: '70%' },
                ];

                for (const d of defaults) {
                    await db.runAsync(
                        `INSERT INTO ${WAYPOINTS_TABLE} (name, type, lat, lng, alt, description, top, left) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                        [d.name, d.type, d.lat, d.lng, d.alt, d.description, d.top, d.left]
                    );
                }

                const reloaded = await db.getAllAsync<any>(`SELECT * FROM ${WAYPOINTS_TABLE}`);
                setWaypoints(reloaded);
                if (reloaded.length > 0) setSelectedWaypoint(reloaded[0]);
            } else {
                setWaypoints(rows);
                setSelectedWaypoint(rows[0]);
            }
        } catch (error) {
            console.error('Failed to load waypoints from SQLite:', error);
        }
    }, [db]);

    useEffect(() => {
        loadWaypoints();
    }, [loadWaypoints]);

    const handleAddWaypoint = async () => {
        if (!newName.trim()) {
            Alert.alert('Error', 'Please enter a checkpoint name.');
            return;
        }

        try {
            const currentLat = location?.coords.latitude ?? 34.1000;
            const currentLng = location?.coords.longitude ?? 74.8000;
            const currentAlt = location?.coords.altitude ? Math.round(location.coords.altitude) : 3450;

            // Randomize relative placement within viewport for visual testing if adding custom pin
            const randomTop = `${Math.floor(Math.random() * 50) + 20}%`;
            const randomLeft = `${Math.floor(Math.random() * 60) + 20}%`;

            await db.runAsync(
                `INSERT INTO ${WAYPOINTS_TABLE} (name, type, lat, lng, alt, description, top, left) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    newName,
                    newType,
                    currentLat,
                    currentLng,
                    currentAlt,
                    newDesc || 'Custom user-dropped offline pin.',
                    randomTop,
                    randomLeft
                ]
            );

            setNewName('');
            setNewDesc('');
            setIsAdding(false);
            loadWaypoints();
            Alert.alert('Success', 'Waypoint securely stored in local offline SQLite DB.');
        } catch (error) {
            console.error('Failed to insert waypoint:', error);
            Alert.alert('Error', 'Could not save waypoint locally.');
        }
    };

    // Distinct backgrounds for each active map layer
    const getViewportStyle = () => {
        switch (activeLayer) {
            case 'contours':
                return { backgroundColor: '#020617', borderColor: '#10b981' };
            case 'satellite':
                return { backgroundColor: '#334155', borderColor: '#64748b' };
            case 'topo':
            default:
                return { backgroundColor: '#0f172a', borderColor: 'rgba(16, 185, 129, 0.3)' };
        }
    };

    const getContourColor = () => {
        if (activeLayer === 'contours') return 'rgba(52, 211, 153, 0.75)';
        if (activeLayer === 'satellite') return 'rgba(125, 211, 252, 0.4)';
        return 'rgba(16, 185, 129, 0.25)';
    };

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View style={styles.headerContainer}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                            <ThemedText type="subtitle" style={styles.title}>
                                🗺️ Offline Topo Map
                            </ThemedText>
                            <Pressable
                                onPress={() => setIsAdding(!isAdding)}
                                style={[styles.addButtonHeader, { backgroundColor: '#0284c7' }]}
                            >
                                <ThemedText style={{ color: '#fff', fontSize: 11, fontWeight: 'bold' }}>
                                    {isAdding ? 'Cancel' : '+ Drop Pin'}
                                </ThemedText>
                            </Pressable>
                        </View>
                        <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
                            Himalayan vector contour grid (Powered by local SQLite)
                        </ThemedText>
                    </View>

                    {/* Add Custom Waypoint Inline Form */}
                    {isAdding && (
                        <View style={[styles.formCard, { backgroundColor: theme.backgroundElement }]}>
                            <ThemedText type="smallBold">Drop New Offline Checkpoint</ThemedText>
                            <TextInput
                                placeholder="Checkpoint Name (e.g. Ridge Shelter)"
                                placeholderTextColor={theme.textSecondary}
                                value={newName}
                                onChangeText={setNewName}
                                style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
                            />
                            <View style={styles.typeRow}>
                                {(['camp', 'hazard', 'water'] as const).map((t) => (
                                    <Pressable
                                        key={t}
                                        onPress={() => setNewType(t)}
                                        style={[
                                            styles.typeChip,
                                            { backgroundColor: newType === t ? '#0284c7' : theme.backgroundSelected }
                                        ]}
                                    >
                                        <ThemedText style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>
                                            {t.toUpperCase()}
                                        </ThemedText>
                                    </Pressable>
                                ))}
                            </View>
                            <TextInput
                                placeholder="Notes / Description"
                                placeholderTextColor={theme.textSecondary}
                                value={newDesc}
                                onChangeText={setNewDesc}
                                style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
                            />
                            <Pressable style={styles.savePinButton} onPress={handleAddWaypoint}>
                                <ThemedText type="smallBold" style={{ color: '#fff' }}>Save to SQLite Database</ThemedText>
                            </Pressable>
                        </View>
                    )}

                    {/* Realistic Topo Canvas Viewport */}
                    <ThemedView type="backgroundElement" style={[styles.mapViewport, getViewportStyle()]}>
                        {/* Topographic Elevation Contour Lines Background */}
                        <View style={styles.contourLinesContainer} pointerEvents="none">
                            <View style={[styles.contourRing, styles.ring1, { borderColor: getContourColor() }]} />
                            <View style={[styles.contourRing, styles.ring2, { borderColor: getContourColor() }]} />
                            <View style={[styles.contourRing, styles.ring3, { borderColor: getContourColor() }]} />
                            <View style={[styles.contourRing, styles.ring4, { borderColor: getContourColor() }]} />
                            <View style={[styles.elevationCrosshairH, { backgroundColor: getContourColor() }]} />
                            <View style={[styles.elevationCrosshairV, { backgroundColor: getContourColor() }]} />
                        </View>

                        {/* Map Layer Switcher Tabs */}
                        <View style={styles.layerSwitcher}>
                            {(['topo', 'contours', 'satellite'] as MapLayer[]).map((layer) => {
                                const isActive = activeLayer === layer;
                                return (
                                    <Pressable
                                        key={layer}
                                        onPress={() => setActiveLayer(layer)}
                                        style={[
                                            styles.layerButton,
                                            isActive ? styles.layerButtonActive : { backgroundColor: 'rgba(15, 23, 42, 0.7)' },
                                        ]}
                                    >
                                        <ThemedText
                                            style={[
                                                styles.layerButtonText,
                                                { color: isActive ? '#fff' : '#94a3b8' },
                                            ]}
                                        >
                                            {layer.toUpperCase()}
                                        </ThemedText>
                                    </Pressable>
                                );
                            })}
                        </View>

                        {/* Interactive Waypoint Pins from SQLite */}
                        {waypoints.map((wp) => {
                            const isSelected = selectedWaypoint?.id === wp.id;
                            let icon = '⛺';
                            let badgeBg = '#059669';
                            if (wp.type === 'hazard') {
                                icon = '⚠️';
                                badgeBg = '#D97706';
                            } else if (wp.type === 'water') {
                                icon = '💧';
                                badgeBg = '#0284c7';
                            }

                            return (
                                <Pressable
                                    key={wp.id}
                                    onPress={() => setSelectedWaypoint(wp)}
                                    style={[
                                        styles.pinButton,
                                        { top: wp.top, left: wp.left } as any,
                                        isSelected && { borderColor: '#fff', borderWidth: 2, transform: [{ scale: 1.1 }] },
                                    ]}
                                >
                                    <View style={[styles.pinIconContainer, { backgroundColor: badgeBg }]}>
                                        <ThemedText style={styles.pinEmoji}>{icon}</ThemedText>
                                    </View>
                                </Pressable>
                            );
                        })}

                        {/* User Location Marker */}
                        <View style={styles.userMarkerContainer}>
                            <View style={styles.userPulseRing} />
                            <View style={styles.userDot} />
                            <View style={styles.userLabelBadge}>
                                <ThemedText style={styles.userLabelText}>📍 You ({altitude}m)</ThemedText>
                            </View>
                        </View>

                        {/* Map Legend / Scale Footer inside Viewport */}
                        <View style={styles.mapFooterOverlay}>
                            <ThemedText style={styles.scaleText}>
                                Mode: {activeLayer.toUpperCase()} | SQLite Cache Active
                            </ThemedText>
                            <View style={styles.scaleBar}>
                                <View style={styles.scaleBarLine} />
                                <ThemedText style={styles.scaleBarLabel}>500m</ThemedText>
                            </View>
                        </View>
                    </ThemedView>

                    {/* Telemetry Summary Cards */}
                    <View style={[styles.telemetryCard, { backgroundColor: theme.backgroundElement }]}>
                        <View style={styles.telemetryItem}>
                            <ThemedText type="small" themeColor="textSecondary">LAT / LNG</ThemedText>
                            <ThemedText type="smallBold" style={styles.telemetryValue}>
                                {latitude}°, {longitude}°
                            </ThemedText>
                        </View>
                        <View style={[styles.verticalDivider, { backgroundColor: theme.backgroundSelected }]} />
                        <View style={styles.telemetryItem}>
                            <ThemedText type="small" themeColor="textSecondary">ELEVATION</ThemedText>
                            <ThemedText type="smallBold" style={{ color: '#059669' }}>
                                {altitude} MASL
                            </ThemedText>
                        </View>
                        <View style={[styles.verticalDivider, { backgroundColor: theme.backgroundSelected }]} />
                        <View style={styles.telemetryItem}>
                            <ThemedText type="small" themeColor="textSecondary">GPS MODE</ThemedText>
                            <ThemedText type="smallBold" style={{ color: '#D97706' }}>
                                {powerMode.toUpperCase()}
                            </ThemedText>
                        </View>
                    </View>

                    {/* Selected Waypoint Details Card */}
                    {selectedWaypoint && (
                        <View style={[styles.waypointCard, { backgroundColor: theme.backgroundElement }]}>
                            <View style={styles.waypointHeader}>
                                <ThemedText type="smallBold" style={{ color: '#0284c7' }}>
                                    📍 Selected Waypoint: {selectedWaypoint.name}
                                </ThemedText>
                            </View>
                            <ThemedText type="small" style={styles.waypointSubtext}>
                                Altitude: {selectedWaypoint.alt}m | Lat/Lng: {selectedWaypoint.lat.toFixed(4)}, {selectedWaypoint.lng.toFixed(4)}
                            </ThemedText>
                            <ThemedText type="small" themeColor="textSecondary" style={styles.waypointDescription}>
                                {selectedWaypoint.description}
                            </ThemedText>
                        </View>
                    )}

                    {/* Return Button */}
                    <Pressable
                        onPress={() => router.back()}
                        style={[styles.returnButton, { backgroundColor: theme.backgroundSelected }]}
                    >
                        <ThemedText type="smallBold">← Return to Dashboard</ThemedText>
                    </Pressable>
                </ScrollView>
            </SafeAreaView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        maxWidth: MaxContentWidth,
        alignSelf: 'center',
        width: '100%',
    },
    scrollContent: {
        paddingHorizontal: Spacing.four,
        paddingTop: Spacing.three,
        paddingBottom: BottomTabInset + Spacing.six,
        gap: Spacing.three,
    },
    headerContainer: {
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
    },
    subtitle: {
        marginTop: Spacing.half,
    },
    addButtonHeader: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    formCard: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(2, 132, 199, 0.3)',
        gap: 10,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        fontSize: 13,
    },
    typeRow: {
        flexDirection: 'row',
        gap: 8,
    },
    typeChip: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 6,
        alignItems: 'center',
    },
    savePinButton: {
        backgroundColor: '#059669',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    mapViewport: {
        height: 360,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 2,
        position: 'relative',
    },
    contourLinesContainer: {
        ...StyleSheet.absoluteFill,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contourRing: {
        position: 'absolute',
        borderRadius: 1000,
        borderWidth: 1,
    },
    ring1: { width: 140, height: 140 },
    ring2: { width: 220, height: 220 },
    ring3: { width: 300, height: 300 },
    ring4: { width: 380, height: 380 },
    elevationCrosshairH: {
        position: 'absolute',
        width: '100%',
        height: 1,
    },
    elevationCrosshairV: {
        position: 'absolute',
        width: 1,
        height: '100%',
    },
    layerSwitcher: {
        position: 'absolute',
        top: 12,
        right: 12,
        gap: 6,
        zIndex: 10,
    },
    layerButton: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        alignItems: 'center',
    },
    layerButtonActive: {
        backgroundColor: '#0284c7',
    },
    layerButtonText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    pinButton: {
        position: 'absolute',
        zIndex: 5,
        borderRadius: 16,
    },
    pinIconContainer: {
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 4,
    },
    pinEmoji: {
        fontSize: 14,
    },
    userMarkerContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -35 }, { translateY: -25 }],
        alignItems: 'center',
        zIndex: 6,
    },
    userPulseRing: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(2, 132, 199, 0.3)',
        top: -10,
    },
    userDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#0284c7',
        borderWidth: 2,
        borderColor: '#fff',
        marginBottom: 4,
    },
    userLabelBadge: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(2, 132, 199, 0.5)',
    },
    userLabelText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    mapFooterOverlay: {
        position: 'absolute',
        bottom: 10,
        left: 12,
        right: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
    },
    scaleText: {
        color: '#9ca3af',
        fontSize: 9,
        fontWeight: '600',
    },
    scaleBar: {
        position: 'relative',
        alignItems: 'center',
        gap: 2,
    },
    scaleBarLine: {
        width: 60,
        height: 2,
        backgroundColor: '#9ca3af',
    },
    scaleBarLabel: {
        color: '#9ca3af',
        fontSize: 8,
    },
    telemetryCard: {
        flexDirection: 'row',
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: 'rgba(150, 150, 150, 0.2)',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    telemetryItem: {
        flex: 1,
        alignItems: 'center',
        gap: 2,
    },
    telemetryValue: {
        fontSize: 12,
    },
    verticalDivider: {
        width: 1,
        height: 28,
    },
    waypointCard: {
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: 'rgba(2, 132, 199, 0.3)',
        gap: 6,
    },
    waypointHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    waypointSubtext: {
        fontSize: 12,
        fontWeight: '600',
    },
    waypointDescription: {
        fontSize: 11,
        lineHeight: 16,
    },
    returnButton: {
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Spacing.one,
    },
});