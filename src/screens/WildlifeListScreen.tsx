import { router, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import {
  FlatList,
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
import {
  mapSurvivalGuideRow,
  SURVIVAL_GUIDES_TABLE,
  type SurvivalGuide,
  type ThreatLevel,
} from '@/db/schema';
import { useAdaptiveLocation, type PowerMode } from '@/hooks/use-adaptive-location';
import { useTheme } from '@/hooks/use-theme';

const THREAT_LEVEL_LABELS: Record<ThreatLevel, string> = {
  low: 'Low',
  moderate: 'Moderate',
  high: 'High',
  critical: 'Critical',
};

const THREAT_LEVEL_COLORS: Record<ThreatLevel, string> = {
  low: '#1B5E20',
  moderate: '#F57F17',
  high: '#E65100',
  critical: '#B71C1C',
};

function ThreatBadge({ level }: { level: ThreatLevel }) {
  return (
    <View style={[styles.threatBadge, { backgroundColor: THREAT_LEVEL_COLORS[level] }]}>
      <ThemedText style={styles.threatBadgeText}>{THREAT_LEVEL_LABELS[level]}</ThemedText>
    </View>
  );
}

export default function WildlifeListScreen() {
  const db = useSQLiteContext();
  const theme = useTheme();
  const { powerMode, setPowerMode } = useAdaptiveLocation();

  const [guides, setGuides] = useState<SurvivalGuide[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'All' | 'Mammal' | 'Bird'>('All');
  const [selectedThreatFilter, setSelectedThreatFilter] = useState<string>('All');

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      const loadGuides = async () => {
        try {
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
                   ORDER BY animal_name ASC`,
          );

          if (!isMounted) return;
          setGuides(rows.map(mapSurvivalGuideRow));
        } catch (error) {
          console.error('Failed to load wildlife guides:', error);
        }
      };

      loadGuides();

      return () => {
        isMounted = false;
      };
    }, [db])
  );

  const filteredGuides = guides.filter((item) => {
    const matchesSearch =
      item.animalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.habitat.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      selectedType === 'All' ||
      item.type?.toLowerCase() === selectedType.toLowerCase();

    const matchesThreat =
      selectedThreatFilter === 'All' ||
      item.threatLevel?.toLowerCase() === selectedThreatFilter.toLowerCase();

    return matchesSearch && matchesType && matchesThreat;
  });

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <FlatList
          data={filteredGuides}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.headerContainer}>
              {/* Line 1 & 2: App Name and Tagline Stacked Cleanly */}
              <View style={styles.headerTextContainer}>
                <ThemedText type="subtitle" style={styles.title}>
                  Yama Safe !
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
                  Your offline guardian in the high Himalayas
                </ThemedText>
              </View>

              {/* Line 3: Action Buttons Row (Map, Compass, AI, Aid, SOS) */}
              <View style={styles.headerActionsRow}>
                <Pressable
                  onPress={() => router.push('/map' as any)}
                  style={styles.mapSmallButton}
                >
                  <ThemedText type="smallBold" style={styles.smallButtonText}>🗺️ Map</ThemedText>
                </Pressable>

                <Pressable
                  onPress={() => router.push('/trail-navigator' as any)}
                  style={styles.compassSmallButton}
                >
                  <ThemedText type="smallBold" style={styles.smallButtonText}>🧭 Compass</ThemedText>
                </Pressable>

                <Pressable
                  onPress={() => router.push('/audio-detector' as any)}
                  style={styles.audioAiButton}
                >
                  <ThemedText type="smallBold" style={styles.smallButtonText}>🎙️ AI</ThemedText>
                </Pressable>

                <Pressable
                  onPress={() => router.push('/first-aid' as any)}
                  style={styles.firstAidSmallButton}
                >
                  <ThemedText type="smallBold" style={styles.smallButtonText}>🩹 Aid</ThemedText>
                </Pressable>

                <Pressable
                  onPress={() => router.push('/sos' as any)}
                  style={styles.sosButton}
                >
                  <ThemedText type="smallBold" style={styles.smallButtonText}>🚨 SOS</ThemedText>
                </Pressable>
              </View>

              {/* Battery & Power Mode Selector Bar */}
              <View style={[styles.powerCard, { backgroundColor: theme.backgroundElement }]}>
                <View style={styles.powerHeaderRow}>
                  <ThemedText type="smallBold">🔋 GPS Battery Optimization</ThemedText>
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
                          isActive ? styles.activeModeButton : { backgroundColor: theme.backgroundSelected },
                        ]}
                      >
                        <ThemedText
                          type="smallBold"
                          style={{ color: isActive ? '#fff' : theme.textSecondary, fontSize: 11 }}
                        >
                          {mode === 'high' ? '⚡ High' : mode === 'standard' ? '⚖️ Balanced' : '🌱 Eco (-85%)'}
                        </ThemedText>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* Search Bar */}
              <View style={styles.searchContainer}>
                <TextInput
                  placeholder="Search wildlife or habitat..."
                  placeholderTextColor={theme.textSecondary}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  style={[
                    styles.searchInput,
                    {
                      backgroundColor: theme.backgroundElement,
                      color: theme.text,
                      borderColor: theme.backgroundSelected,
                    },
                  ]}
                />
              </View>

              {/* Wildlife Type Filter Chips */}
              <View style={styles.filtersWrapper}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.filtersContainer}
                >
                  {(['All', 'Mammal', 'Bird'] as const).map((type) => {
                    const isActive = selectedType === type;
                    return (
                      <Pressable
                        key={type}
                        onPress={() => setSelectedType(type)}
                        style={[
                          styles.chip,
                          {
                            backgroundColor: isActive
                              ? theme.backgroundSelected
                              : theme.backgroundElement,
                          },
                        ]}
                      >
                        <ThemedText
                          type="smallBold"
                          themeColor={isActive ? 'text' : 'textSecondary'}
                        >
                          {type === 'All' ? 'All Species' : type === 'Mammal' ? 'Mammals' : 'Birds'}
                        </ThemedText>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Threat Level Filter Pills */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScrollContainer}>
                {(['All', 'critical', 'high', 'moderate', 'low'] as const).map((level) => (
                  <Pressable
                    key={level}
                    style={[
                      styles.filterPill,
                      selectedThreatFilter === level && styles.activePill,
                    ]}
                    onPress={() => setSelectedThreatFilter(level)}
                  >
                    <ThemedText style={[
                      styles.pillText,
                      selectedThreatFilter === level && styles.activePillText
                    ]}>
                      {level.toUpperCase()}
                    </ThemedText>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <ThemedText type="default" themeColor="textSecondary" style={styles.emptyText}>
                No species found matching the criteria.
              </ThemedText>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                router.push({
                  pathname: '/details',
                  params: { id: String(item.id) },
                });
              }}
              style={({ pressed }) => [
                styles.cardPressable,
                { opacity: pressed ? 0.9 : 1 },
              ]}
            >
              <ThemedView type="backgroundElement" style={styles.card}>
                <View style={styles.cardHeader}>
                  <ThemedText type="smallBold" style={styles.animalName}>
                    {item.animalName}
                  </ThemedText>
                  <ThreatBadge level={item.threatLevel} />
                </View>

                <View style={styles.cardMeta}>
                  <View style={[styles.typeBadge, { backgroundColor: theme.backgroundSelected }]}>
                    <ThemedText type="code" themeColor="text">
                      {item.type.toUpperCase()}
                    </ThemedText>
                  </View>
                </View>

                <View style={styles.habitatRow}>
                  <ThemedText type="small" themeColor="textSecondary" numberOfLines={2}>
                    📍 {item.habitat}
                  </ThemedText>
                </View>

                <View style={styles.cardFooter}>
                  <ThemedText type="linkPrimary" style={styles.viewDetailsText}>
                    View Safety Instructions &rarr;
                  </ThemedText>
                </View>
              </ThemedView>
            </Pressable>
          )}
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
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  headerContainer: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    marginBottom: Spacing.two,
  },
  headerTextContainer: {
    width: '100%',
    marginBottom: Spacing.two, // Separates title/tagline clearly from line 3 actions
  },
  title: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: Spacing.half,
  },
  headerActionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Allows buttons to fit nicely on narrow mobile screens without breaking bounds
    gap: 6,
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  sosButton: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  firstAidSmallButton: {
    backgroundColor: '#0275d8',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  audioAiButton: {
    backgroundColor: '#7c3aed',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  compassSmallButton: {
    backgroundColor: '#059669',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  mapSmallButton: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  smallButtonText: {
    color: '#fff',
    fontSize: 11,
  },
  powerCard: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(150, 150, 150, 0.2)',
    gap: 8,
    marginBottom: Spacing.two,
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
    alignItems: 'center',
  },
  activeModeButton: {
    backgroundColor: '#0275d8',
  },
  searchContainer: {
    marginVertical: Spacing.one,
  },
  searchInput: {
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
    borderWidth: 1,
  },
  filtersWrapper: {
    marginVertical: Spacing.two,
  },
  filtersContainer: {
    gap: Spacing.two,
  },
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.five,
  },
  filterScrollContainer: {
    marginVertical: Spacing.one,
    maxHeight: 50,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginRight: 8,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(150,150,150,0.2)',
  },
  activePill: {
    backgroundColor: '#007AFF',
  },
  pillText: {
    fontSize: 12,
    fontWeight: 'bold',
    opacity: 0.7,
  },
  activePillText: {
    opacity: 1,
    color: '#fff',
  },
  listContent: {
    paddingBottom: BottomTabInset + Spacing.six,
  },
  cardPressable: {
    marginBottom: 16,
    alignSelf: 'center',
    width: '90%',
    maxWidth: 600,
  },
  card: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.two,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  animalName: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
  },
  threatBadge: {
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
  },
  threatBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  cardMeta: {
    flexDirection: 'row',
  },
  typeBadge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half / 2,
    borderRadius: Spacing.one,
  },
  habitatRow: {
    marginTop: Spacing.one,
  },
  cardFooter: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(150, 150, 150, 0.2)',
    paddingTop: Spacing.two,
    marginTop: Spacing.one,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    paddingVertical: Spacing.six,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
  },
});