import { router, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { SymbolView } from 'expo-symbols';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import {
  mapSurvivalGuideRow,
  type SurvivalGuide,
  type ThreatLevel
} from '@/db/schema';
import { useTheme } from '@/hooks/use-theme';

const THREAT_LEVEL_LABELS: Record<ThreatLevel, string> = {
  low: 'Low Threat Level',
  moderate: 'Moderate Threat Level',
  high: 'High Threat Level',
  critical: 'Critical Threat Level',
};

const THREAT_LEVEL_COLORS: Record<ThreatLevel, string> = {
  low: '#1B5E20',
  moderate: '#F57F17',
  high: '#E65100',
  critical: '#B71C1C',
};

const THREAT_LEVEL_DESCRIPTIONS: Record<ThreatLevel, string> = {
  low: 'Observe from a safe distance. Generally harmless unless provoked.',
  moderate: 'Exercise caution. Avoid sudden movements or blocking escape paths.',
  high: 'Dangerous species. Den/nesting area approaches are highly hazardous.',
  critical: 'Extremely dangerous. Strict adherence to safety protocols required.',
};

type SurvivalGuideRow = {
  id: number;
  animal_name: string;
  type: SurvivalGuide['type'];
  habitat: string;
  threat_level: ThreatLevel;
  survival_instructions: string;
  safety_tips: string;
};

export default function DetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  console.log("DETAILS PAGE REACHED. ID received:", id);
  const db = useSQLiteContext();
  const theme = useTheme();
  const [guide, setGuide] = useState<SurvivalGuide | null>(null);
  console.log("Navigated with ID:", id);
  const [isLoading, setIsLoading] = useState(true);


  const loadGuide = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const row = await db.getFirstAsync<SurvivalGuideRow>(
        `SELECT id, animal_name, type, habitat, threat_level, survival_instructions, safety_tips
         FROM SurvivalGuides
         WHERE id = ?`,
        Number(id),
      );

      if (row) {
        setGuide(mapSurvivalGuideRow(row));
      }
    } catch (error) {
      console.error('Failed to load guide detail:', error);
    } finally {
      setIsLoading(false);
    }
  }, [db, id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadGuide();
  }, [loadGuide]);

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.text} />
        <ThemedText style={styles.loadingText} themeColor="textSecondary">
          Loading guide...
        </ThemedText>
      </ThemedView>
    );
  }

  if (!guide) {
    return (
      <ThemedView style={styles.errorContainer}>
        <ThemedText type="subtitle" style={styles.errorTitle}>
          Guide Not Found
        </ThemedText>
        <ThemedText style={styles.errorSubtitle} themeColor="textSecondary">
          The requested survival guide details could not be retrieved.
        </ThemedText>
        <Pressable
          style={({ pressed }) => [
            styles.backButtonLarge,
            { backgroundColor: theme.backgroundSelected, opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={() => router.back()}
        >
          <ThemedText type="smallBold">Go Back</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  const threatColor = THREAT_LEVEL_COLORS[guide.threatLevel];

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Custom Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backButton,
              { backgroundColor: theme.backgroundElement, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <SymbolView
              tintColor={theme.text}
              name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_left' }}
              size={18}
            />
            <ThemedText type="smallBold" style={styles.backButtonText}>
              Back
            </ThemedText>
          </Pressable>
          <ThemedText type="smallBold" themeColor="textSecondary" style={styles.headerTitle}>
            Survival Guide
          </ThemedText>
          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Hero / Title Section */}
          <View style={styles.heroSection}>
            <ThemedText type="title" style={styles.animalName}>
              {guide.animalName}
            </ThemedText>

            <View style={styles.metaRow}>
              <View style={[styles.metaBadge, { backgroundColor: theme.backgroundElement }]}>
                <SymbolView
                  tintColor={theme.text}
                  name={{ ios: 'leaf.fill', android: 'eco', web: 'eco' }}
                  size={12}
                />
                <ThemedText type="code" style={styles.metaBadgeText}>
                  {guide.type}
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Threat Level Banner */}
          <View style={[styles.threatBanner, { backgroundColor: threatColor }]}>
            <View style={styles.threatBannerHeader}>
              <SymbolView
                tintColor="#FFFFFF"
                name={{ ios: 'exclamationmark.triangle.fill', android: 'warning', web: 'warning' }}
                size={18}
              />
              <ThemedText style={styles.threatBannerTitle}>
                {THREAT_LEVEL_LABELS[guide.threatLevel].toUpperCase()}
              </ThemedText>
            </View>
            <ThemedText style={styles.threatBannerDescription}>
              {THREAT_LEVEL_DESCRIPTIONS[guide.threatLevel]}
            </ThemedText>
          </View>

          {/* Habitat Card */}
          <ThemedView type="backgroundElement" style={styles.infoCard}>
            <View style={styles.cardHeader}>
              <SymbolView
                tintColor={theme.text}
                name={{ ios: 'mappin.and.ellipse', android: 'location_on', web: 'location_on' }}
                size={16}
              />
              <ThemedText type="smallBold" style={styles.sectionTitle}>
                Primary Habitat & Range
              </ThemedText>
            </View>
            <ThemedText style={styles.sectionBody}>
              {guide.habitat}
            </ThemedText>
          </ThemedView>

          {/* Safety Tips Card */}
          <View style={[styles.safetyCard, { borderColor: threatColor }]}>
            <View style={styles.cardHeader}>
              <SymbolView
                tintColor={threatColor}
                name={{ ios: 'shield.fill', android: 'shield', web: 'shield' }}
                size={16}
              />
              <ThemedText type="smallBold" style={[styles.sectionTitle, { color: threatColor }]}>
                Safety & Encounter Tips
              </ThemedText>
            </View>
            <ThemedText type="small" style={styles.sectionBody}>
              {guide.safetyTips}
            </ThemedText>
          </View>

          {/* Survival Instructions Card */}
          <ThemedView type="backgroundElement" style={styles.infoCard}>
            <View style={styles.cardHeader}>
              <SymbolView
                tintColor={theme.text}
                name={{ ios: 'doc.text.fill', android: 'description', web: 'description' }}
                size={16}
              />
              <ThemedText type="smallBold" style={styles.sectionTitle}>
                Detailed Survival Instructions
              </ThemedText>
            </View>
            <ThemedText type="small" style={[styles.sectionBody, styles.instructionsText]}>
              {guide.survivalInstructions}
            </ThemedText>
          </ThemedView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.two,
  },
  loadingText: {
    marginTop: Spacing.two,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
    gap: Spacing.three,
  },
  errorTitle: {
    textAlign: 'center',
  },
  errorSubtitle: {
    textAlign: 'center',
    marginBottom: Spacing.two,
  },
  backButtonLarge: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.three,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(150, 150, 150, 0.2)',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.five,
    gap: Spacing.half,
  },
  backButtonText: {
    fontSize: 14,
  },
  headerTitle: {
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  headerPlaceholder: {
    width: 60, // approximate width to balance header layout
  },
  scrollContent: {
    padding: Spacing.four,
    gap: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.six,
  },
  heroSection: {
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  animalName: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '800',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Spacing.two,
    gap: Spacing.one,
  },
  metaBadgeText: {
    fontSize: 11,
    textTransform: 'uppercase',
  },
  threatBanner: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  threatBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  threatBannerTitle: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
  threatBannerDescription: {
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.9,
    marginTop: Spacing.half,
  },
  infoCard: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  safetyCard: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.two,
    borderWidth: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  sectionBody: {
    lineHeight: 22,
  },
  instructionsText: {
    lineHeight: 22,
  },
});
