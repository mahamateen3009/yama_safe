import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { INCIDENT_LOGS_TABLE, mapIncidentLogRow, type IncidentLog } from '@/db/schema';
import { useTheme } from '@/hooks/use-theme';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BewareBoardScreen() {
    const router = useRouter();
    const db = useSQLiteContext();
    const theme = useTheme();

    const [incidents, setIncidents] = useState<IncidentLog[]>([]);
    const [modalVisible, setModalVisible] = useState(false);

    // New report form states
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [severity, setSeverity] = useState<'low' | 'moderate' | 'high' | 'critical'>('high');

    const loadIncidents = useCallback(async () => {
        try {
            const rows = await db.getAllAsync<any>(
                `SELECT * FROM ${INCIDENT_LOGS_TABLE} ORDER BY id DESC`
            );

            // If table is empty on first launch, seed a few sample offline warnings
            if (rows.length === 0) {
                await db.runAsync(
                    `INSERT INTO ${INCIDENT_LOGS_TABLE} (title, description, location, severity, date_reported, is_synced) VALUES (?, ?, ?, ?, ?, ?)`,
                    ['Landslide Warning', 'Debris blocking lower trail path near marker 12. Proceed with extreme caution.', 'Sector 4 - Pass Trail', 'critical', '2026-07-21', 1]
                );
                await db.runAsync(
                    `INSERT INTO ${INCIDENT_LOGS_TABLE} (title, description, location, severity, date_reported, is_synced) VALUES (?, ?, ?, ?, ?, ?)`,
                    ['Aggressive Wildlife', 'Wild yak herd reported grazing near ridge campsite. Keep distance.', 'Base Camp Ridge', 'high', '2026-07-22', 1]
                );
                loadIncidents();
                return;
            }

            setIncidents(rows.map(mapIncidentLogRow));
        } catch (error) {
            console.error('Failed to load incident logs:', error);
        }
    }, [db]);

    useEffect(() => {
        loadIncidents();
    }, [loadIncidents]);

    const handleAddIncident = async () => {
        if (!title.trim() || !description.trim() || !location.trim()) return;

        try {
            await db.runAsync(
                `INSERT INTO ${INCIDENT_LOGS_TABLE} (title, description, location, severity, date_reported, is_synced) VALUES (?, ?, ?, ?, ?, ?)`,
                [title, description, location, severity, new Date().toISOString().split('T')[0], 0]
            );
            setTitle('');
            setDescription('');
            setLocation('');
            setModalVisible(false);
            loadIncidents();
        } catch (error) {
            console.error('Failed to save incident:', error);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <View>
                        <ThemedText type="subtitle" style={styles.headerTitle}>⚠️ Beware Board</ThemedText>
                        <ThemedText type="small" themeColor="textSecondary">
                            Offline regional threat logs & trail reports
                        </ThemedText>
                    </View>
                    <Pressable style={styles.addButton} onPress={() => setModalVisible(true)}>
                        <ThemedText type="smallBold" style={{ color: '#fff' }}>+ Report Hazard</ThemedText>
                    </Pressable>
                </View>

                <FlatList
                    data={incidents}
                    keyExtractor={(item) => String(item.id)}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item }) => (
                        <View style={[styles.card, { backgroundColor: theme.backgroundElement }]}>
                            <View style={styles.cardHeader}>
                                <ThemedText type="default" style={{ fontWeight: 'bold' }}>{item.title}</ThemedText>
                                <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(item.severity) }]}>
                                    <ThemedText style={styles.severityText}>{item.severity.toUpperCase()}</ThemedText>
                                </View>
                            </View>

                            <ThemedText type="small" themeColor="textSecondary" style={styles.locationText}>
                                📍 {item.location} • 📅 {item.dateReported}
                            </ThemedText>

                            <ThemedText type="default" style={styles.descriptionText}>
                                {item.description}
                            </ThemedText>

                            {!item.isSynced && (
                                <ThemedText type="small" style={styles.offlineQueueText}>
                                    🔄 Saved offline (Pending server sync)
                                </ThemedText>
                            )}
                        </View>
                    )}
                />

                {/* Modal for reporting a new hazard offline */}
                <Modal visible={modalVisible} animationType="slide" transparent={true}>
                    <View style={styles.modalOverlay}>
                        <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
                            <ThemedText type="subtitle" style={{ marginBottom: 12 }}>Report Trail Hazard</ThemedText>

                            <TextInput
                                placeholder="Incident Title (e.g., Broken Bridge)"
                                placeholderTextColor={theme.textSecondary}
                                value={title}
                                onChangeText={setTitle}
                                style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
                            />

                            <TextInput
                                placeholder="Location / Milestone"
                                placeholderTextColor={theme.textSecondary}
                                value={location}
                                onChangeText={setLocation}
                                style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
                            />

                            <TextInput
                                placeholder="Detailed Description"
                                placeholderTextColor={theme.textSecondary}
                                value={description}
                                onChangeText={setDescription}
                                multiline
                                style={[styles.input, styles.textArea, { color: theme.text, borderColor: theme.backgroundSelected }]}
                            />

                            <View style={styles.modalActions}>
                                <Pressable style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                                    <ThemedText type="smallBold">Cancel</ThemedText>
                                </Pressable>
                                <Pressable style={styles.submitBtn} onPress={handleAddIncident}>
                                    <ThemedText type="smallBold" style={{ color: '#fff' }}>Save Offline Report</ThemedText>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>

                <Pressable style={styles.backButton} onPress={() => router.back()}>
                    <ThemedText type="smallBold">&larr; Return to Dashboard</ThemedText>
                </Pressable>
            </SafeAreaView>
        </ThemedView>
    );
}

function getSeverityColor(severity: string) {
    switch (severity) {
        case 'critical': return '#B71C1C';
        case 'high': return '#E65100';
        case 'moderate': return '#F57F17';
        default: return '#1B5E20';
    }
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    safeArea: { flex: 1, padding: 16, maxWidth: 600, width: '100%', alignSelf: 'center' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    headerTitle: { fontSize: 22, fontWeight: 'bold' },
    addButton: { backgroundColor: '#0275d8', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
    listContent: { gap: 12, paddingBottom: 20 },
    card: { padding: 16, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(150,150,150,0.2)', gap: 8 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    severityBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    severityText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
    locationText: { fontSize: 12 },
    descriptionText: { fontSize: 14, marginTop: 4 },
    offlineQueueText: { color: '#D97706', fontSize: 11, marginTop: 4, fontWeight: '600' },
    modalOverlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: 20 },
    modalContent: { padding: 20, borderRadius: 16, gap: 12 },
    input: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 14 },
    textArea: { height: 80, textAlignVertical: 'top' },
    modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 8 },
    cancelBtn: { padding: 10 },
    submitBtn: { backgroundColor: '#059669', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
    backButton: { alignSelf: 'center', padding: 10 },
});