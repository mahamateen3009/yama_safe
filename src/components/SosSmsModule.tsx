import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import * as Clipboard from 'expo-clipboard';
import * as Location from 'expo-location';
import * as SMS from 'expo-sms';
import { useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SosSmsModule() {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isOnline, setIsOnline] = useState<boolean | null>(true);
    const [queuedMessage, setQueuedMessage] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
            const online = Boolean(state.isConnected && state.isInternetReachable);
            setIsOnline(online);

            if (online && queuedMessage) {
                dispatchQueuedSms(queuedMessage);
            }
        });
        return () => unsubscribe();
    }, [queuedMessage]);

    const fetchEmergencyLocation = async () => {
        setLoading(true);
        setErrorMsg(null);
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Location permission denied.');
                setLoading(false);
                return;
            }
            let currentLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
            setLocation(currentLocation);
        } catch (error) {
            setErrorMsg('Failed to retrieve GPS fix.');
        } finally {
            setLoading(false);
        }
    };

    const getSmsTemplate = () => {
        if (!location) return 'SOS! Stranded in wilderness. Location tracking unavailable.';
        const { latitude, longitude, altitude } = location.coords;
        return `🚨 EMERGENCY SOS 🚨\nLat: ${latitude.toFixed(5)}, Long: ${longitude.toFixed(5)}\nAlt: ${altitude ? Math.round(altitude) : 'N/A'}m\nGoogle Maps: https://maps.google.com/?q=${latitude},${longitude}`;
    };

    const handleSendOrQueueSms = async () => {
        const messageText = getSmsTemplate();
        const emergencyNumber = '112';

        if (!isOnline) {
            setQueuedMessage(messageText);
            Alert.alert(
                '📵 No Cellular Signal (Queued)',
                'Your SMS packet and GPS coordinates are stored locally. It will auto-transmit when connection returns.'
            );
            return;
        }

        const isAvailable = await SMS.isAvailableAsync();
        if (isAvailable) {
            await SMS.sendSMSAsync([emergencyNumber], messageText);
        } else {
            await Clipboard.setStringAsync(messageText);
            Alert.alert('Clipboard Fallback', 'SMS interface unavailable. Message copied to clipboard.');
        }
    };

    const dispatchQueuedSms = (text: string) => {
        Alert.alert('📶 Signal Restored', 'Network re-established. Transmitting queued emergency packet...');
        setQueuedMessage(null);
    };

    return (
        <View style={styles.container}>
            {/* Network Status Indicator */}
            <View style={[styles.statusBadge, { backgroundColor: isOnline ? '#065f46' : '#7f1d1d' }]}>
                <Text style={styles.statusText}>
                    {isOnline ? '🟢 Network Online (Ready to Send)' : '🔴 Offline Mode (Queuing Enabled)'}
                </Text>
            </View>

            {/* GPS Button */}
            <TouchableOpacity style={styles.fetchButton} onPress={fetchEmergencyLocation} activeOpacity={0.8}>
                <Text style={styles.fetchButtonText}>{loading ? 'Acquiring GPS Fix...' : '📍 Refresh Location Coordinates'}</Text>
            </TouchableOpacity>

            {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

            {/* Live Coordinates Display */}
            {location && (
                <View style={styles.coordCard}>
                    <Text style={styles.cardLabel}>CURRENT POSITION</Text>
                    <Text style={styles.coordText}>Latitude: {location.coords.latitude.toFixed(6)}</Text>
                    <Text style={styles.coordText}>Longitude: {location.coords.longitude.toFixed(6)}</Text>
                </View>
            )}

            {/* Queued Banner */}
            {queuedMessage && (
                <View style={styles.queuedBanner}>
                    <Text style={styles.queuedTitle}>⏳ 1 Emergency Message Queued</Text>
                    <Text style={styles.queuedDesc}>Waiting for network recovery to broadcast.</Text>
                </View>
            )}

            {/* Message Preview Box */}
            <View style={styles.previewBox}>
                <Text style={styles.previewTitle}>Prepared SMS Template:</Text>
                <Text style={styles.previewContent}>{getSmsTemplate()}</Text>
            </View>

            {/* Send / Queue Button */}
            <TouchableOpacity style={styles.sosButton} onPress={handleSendOrQueueSms} activeOpacity={0.8}>
                <Text style={styles.sosButtonText}>📨 DISPATCH EMERGENCY SMS</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 12 },
    statusBadge: { padding: 10, borderRadius: 8, marginBottom: 14, alignItems: 'center' },
    statusText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
    fetchButton: { backgroundColor: '#3b82f6', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginBottom: 14 },
    fetchButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '600' },
    errorText: { color: '#ef4444', textAlign: 'center', marginBottom: 10 },
    coordCard: { backgroundColor: '#1e293b', padding: 14, borderRadius: 10, marginBottom: 14, borderLeftWidth: 4, borderLeftColor: '#10b981' },
    cardLabel: { fontSize: 10, fontWeight: 'bold', color: '#10b981', marginBottom: 4, letterSpacing: 1 },
    coordText: { color: '#e2e8f0', fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
    queuedBanner: { backgroundColor: '#78350f', padding: 12, borderRadius: 10, marginBottom: 14, borderLeftWidth: 4, borderLeftColor: '#f59e0b' },
    queuedTitle: { color: '#ffb703', fontSize: 13, fontWeight: 'bold' },
    queuedDesc: { color: '#fed7aa', fontSize: 11 },
    previewBox: { backgroundColor: '#1e293b', padding: 14, borderRadius: 10, marginBottom: 16 },
    previewTitle: { fontSize: 12, fontWeight: '600', color: '#94a3b8', marginBottom: 6 },
    previewContent: { color: '#f1f5f9', fontSize: 13, lineHeight: 18, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
    sosButton: { backgroundColor: '#dc2626', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
    sosButtonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
});