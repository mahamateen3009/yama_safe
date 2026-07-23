import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import {
  mapSurvivalGuideRow,
  SURVIVAL_GUIDES_TABLE,
  type SurvivalGuide,
  type ThreatLevel,
} from '@/db/schema';

const THREAT_LEVEL_LABELS: Record<ThreatLevel, string> = {
  low: 'Low',
  moderate: 'Moderate',
  high: 'High',
  critical: 'Critical',
};

const THREAT_LEVEL_COLORS: Record<ThreatLevel, string> = {
  low: '#2E7D32',
  moderate: '#F9A825',
  high: '#EF6C00',
  critical: '#C62828',
};

function ThreatBadge({ level }: { level: ThreatLevel }) {
  return (
    <View style={[styles.threatBadge, { backgroundColor: THREAT_LEVEL_COLORS[level] }]}>
      <ThemedText style={styles.threatBadgeText}>{THREAT_LEVEL_LABELS[level]}</ThemedText>
    </View>
  );
}

function WildlifeCard({ guide }: { guide: SurvivalGuide }) {
  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <View style={styles.cardHeader}>
        <ThemedText type="smallBold" style={styles.animalName}>
          {guide.animalName}
        </ThemedText>
        <ThreatBadge level={guide.threatLevel} />
      </View>
      <View style={styles.metaRow}>
        <ThemedText type="code" themeColor="textSecondary">
          {guide.type}
        </ThemedText>
      </View>
      <ThemedText type="small" themeColor="textSecondary" style={styles.habitat}>
        {guide.habitat}
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary" style={styles.safetyTips}>
        {guide.safetyTips}
      </ThemedText>
    </ThemedView>
  );
}

export default function HomeScreen() {
  const db = useSQLiteContext();
  const [guides, setGuides] = useState<SurvivalGuide[]>([]);

  const loadGuides = useCallback(async () => {
    const rows = await db.getAllAsync<{
      id: number;
      animal_name: string;
      type: SurvivalGuide['type'];
      habitat: string;
      threat_level: ThreatLevel;
      survival_instructions: string;
      safety_tips: string;
    }>(
      `SELECT id, animal_name, type, habitat, threat_level, survival_instructions, safety_tips
       FROM ${SURVIVAL_GUIDES_TABLE}
       ORDER BY
         CASE threat_level
           WHEN 'critical' THEN 4
           WHEN 'high' THEN 3
           WHEN 'moderate' THEN 2
           ELSE 1
         END DESC,
         type ASC,
         animal_name ASC`,
    );

    setGuides(rows.map(mapSurvivalGuideRow));
  }, [db]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadGuides();
  }, [loadGuides]);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="subtitle" style={styles.title}>
          Kashmir Wildlife Safety
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
          Offline survival guides for the Western Himalayas
        </ThemedText>

        <FlatList
          data={guides}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <WildlifeCard guide={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
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
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    marginTop: Spacing.three,
  },
  subtitle: {
    marginTop: Spacing.one,
    marginBottom: Spacing.three,
  },
  listContent: {
    gap: Spacing.two,
    paddingBottom: Spacing.three,
  },
  card: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  animalName: {
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  habitat: {
    lineHeight: 20,
  },
  threatBadge: {
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
  },
  threatBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  safetyTips: {
    lineHeight: 20,
  },
});
