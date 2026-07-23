import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { EMERGENCY_CONTACTS, SURVIVAL_PROTOCOLS } from '@/constants/emergencyData';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import * as SMS from 'expo-sms';
import { useState } from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SOSScreen() {
    const router = useRouter();
    const [loadingLocation, setLoadingLocation] = useState(false);

    // Function to handle regular voice calls with robust error catching
    const handleCall = async (title: string, phoneNumber: string) => {
        const url = `tel:${phoneNumber}`;

        try {
            const supported = await Linking.canOpenURL(url);

            if (supported) {
                Alert.alert(
                    'Confirm Emergency Call',
                    `Do you want to call ${title} (${phoneNumber})?`,
                    [
                        { text: 'Cancel', style: 'cancel' },
                        {
                            text: 'Call Now',
                            style: 'destructive',
                            onPress: async () => {
                                await Linking.openURL(url);
                            },
                        },
                    ]
                );
            } else {
                Alert.alert('Error', `Your device does not support direct calling to ${phoneNumber}.`);
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred while trying to place the call.');
        }
    };

    // Function to fetch offline GPS coordinates with a fallback timeout
    const handleSendEmergencySMS = async () => {
        try {
            setLoadingLocation(true);

            // 1. Request location permissions
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Location permission is required to send your GPS coordinates.');
                setLoadingLocation(false);
                return;
            }

            // 2. Fetch current GPS position with a 6-second timeout so it never hangs indefinitely
            const locationPromise = Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });

            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('GPS timeout')), 6000)
            );

            let latitude = 34.0837; // Default fallback (Srinagar region center)
            let longitude = 74.7973;
            let hasGPS = false;

            try {
                const location: any = await Promise.race([locationPromise, timeoutPromise]);
                latitude = location.coords.latitude;
                longitude = location.coords.longitude;
                hasGPS = true;
            } catch (err) {
                // If GPS takes too long or fails, we continue with fallback/approximate note
            }

            setLoadingLocation(false);

            const googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
            const messageBody = hasGPS
                ? `EMERGENCY! I am stranded in the terrain and need help. My exact GPS coordinates are: Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)}. Map link: ${googleMapsLink}`
                : `EMERGENCY! I am stranded in the terrain and need help. GPS fix timed out, check last known area.`;

            // 3. Check SMS availability and prompt user
            const isAvailable = await SMS.isAvailableAsync();
            if (isAvailable) {
                Alert.alert(
                    'Send Emergency SMS',
                    '112 is a voice-only helpline and cannot receive texts. Do you want to send your location text to the wildlife/emergency contact number (01942452254)?',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        {
                            text: 'Send SMS',
                            style: 'destructive',
                            onPress: async () => {
                                await SMS.sendSMSAsync(['01942452254'], messageBody);
                            },
                        },
                    ]
                );
            } else {
                Alert.alert('Error', 'SMS service is not available on this device.');
            }
        } catch (error) {
            setLoadingLocation(false);
            Alert.alert('GPS Error', 'Could not fetch current location. Ensure GPS/Location services are toggled on.');
        } finally {
            setLoadingLocation(false);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <View style={styles.header}>
                        <ThemedText type="subtitle" style={styles.alertTitle}>
                            🚨 EMERGENCY SOS
                        </ThemedText>
                        <ThemedText type="small" themeColor="textSecondary">
                            Wildlife Encounter & GPS Distress Beacon
                        </ThemedText>
                    </View>

                    {/* GPS SMS Distress Beacon Button */}
                    <View style={styles.section}>
                        <Pressable
                            style={({ pressed }) => [styles.smsButton, pressed && { opacity: 0.8 }]}
                            onPress={handleSendEmergencySMS}
                            disabled={loadingLocation}
                        >
                            <ThemedText type="default" style={[styles.buttonText, { fontWeight: 'bold' }]}>
                                {loadingLocation ? 'Fetching GPS Coordinates...' : '📍 Text Location & SOS via SMS'}
                            </ThemedText>
                        </Pressable>
                        <ThemedText type="small" themeColor="textSecondary" style={styles.smsHint}>
                            Grabs offline satellite GPS and queues an emergency text. It will dispatch the moment your phone regains cellular network signal.
                        </ThemedText>
                    </View>

                    {/* Quick Dial Section */}
                    <View style={styles.section}>
                        <ThemedText type="smallBold" style={styles.sectionHeader}>
                            Emergency Helplines (J&K)
                        </ThemedText>

                        {EMERGENCY_CONTACTS.map((item) => (
                            <Pressable
                                key={item.id}
                                style={({ pressed }) => [
                                    styles.emergencyButton,
                                    { backgroundColor: item.number === '112' ? '#d9534f' : '#f0ad4e' },
                                    pressed && { opacity: 0.7 }
                                ]}
                                onPress={() => handleCall(item.title, item.number)}
                            >
                                <ThemedText type="default" style={styles.buttonText}>
                                    {item.title} ({item.number})
                                </ThemedText>
                            </Pressable>
                        ))}
                    </View>

                    {/* Immediate Survival Rules */}
                    <View style={styles.protocolsBox}>
                        <ThemedText type="smallBold" style={styles.protocolTitle}>
                            Immediate Rules of Survival:
                        </ThemedText>
                        {SURVIVAL_PROTOCOLS.map((protocol, index) => (
                            <ThemedText key={protocol.id} type="small" style={styles.protocolText}>
                                {index + 1}. {protocol.rule}: {protocol.detail}
                            </ThemedText>
                        ))}
                    </View>

                    {/* Close / Back Button */}
                    <Pressable
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <ThemedText type="smallBold" themeColor="text">
                            &larr; Return to Directory
                        </ThemedText>
                    </Pressable>
                </ScrollView>
            </SafeAreaView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    safeArea: { flex: 1 },
    scrollContent: {
        padding: 20,
        maxWidth: 600,
        width: '100%',
        alignSelf: 'center'
    },
    header: { marginBottom: 20, alignItems: 'center' },
    alertTitle: { color: '#d9534f', fontSize: 22, fontWeight: 'bold' },
    section: { marginBottom: 20 },
    sectionHeader: { marginBottom: 10 },
    smsButton: {
        backgroundColor: '#0275d8',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 6,
        alignSelf: 'center',
        width: '100%',
        maxWidth: 450,
    },
    smsHint: { textAlign: 'center', fontSize: 12, paddingHorizontal: 4 },
    emergencyButton: {
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
        alignSelf: 'center',
        width: '100%',
        maxWidth: 450,
    },
    buttonText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
    protocolsBox: {
        backgroundColor: 'rgba(217, 83, 79, 0.1)',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#d9534f',
        marginBottom: 20,
    },
    protocolTitle: { marginBottom: 8, color: '#d9534f' },
    protocolText: { marginBottom: 8, lineHeight: 20 },
    backButton: { alignSelf: 'center', padding: 10 },
});