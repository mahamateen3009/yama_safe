import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AudioDetectorScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <ThemedText type="subtitle" style={styles.title}>🎙️ Cloud Acoustic Sentinel</ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={{ textAlign: 'center', marginTop: 4 }}>
              Acoustic threat identification module is currently offline for maintenance.
            </ThemedText>
          </View>

          {/* Status Display Box */}
          <View style={styles.monitorBox}>
            <ThemedText type="default" style={styles.boldText}>
              🔒 Feature Temporarily Disabled
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={{ textAlign: 'center', marginTop: 6 }}>
              Cloud neural network integration is paused. Check back in a future update!
            </ThemedText>
          </View>

          {/* Back Button */}
          <Pressable style={styles.backButton} onPress={() => router.replace('/')}>
            <ThemedText type="smallBold" themeColor="text">
              &larr; Return to Dashboard
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
  scrollContent: { padding: 20, maxWidth: 600, width: '100%', alignSelf: 'center' },
  header: { marginBottom: 20, alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  boldText: { fontWeight: 'bold' },
  monitorBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dee2e6',
    marginBottom: 20,
    alignItems: 'center',
  },
  backButton: { alignSelf: 'center', padding: 10, marginTop: 10 },
});