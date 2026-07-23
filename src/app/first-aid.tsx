import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface MountainInjury {
    id: string;
    injuryName: string;
    category: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    appearance: string;
    howToIdentify: string;
    whatToDo: string;
    whatMedsToTake: string;
    whatHerbsToUse: string;
    howToUseHerbs: string;
}

const MOUNTAIN_INJURIES: MountainInjury[] = [
    {
        id: '1',
        injuryName: 'Acute Mountain Sickness (AMS)',
        category: 'Altitude & Environmental',
        severity: 'High',
        appearance: 'Patient looks fatigued, pale, or distressed, showing visible discomfort and lethargy at high elevations.',
        howToIdentify: 'Throbbing headache accompanied by dizziness, loss of appetite, nausea, and shortness of breath upon minimal exertion.',
        whatToDo: 'Stop ascending immediately. Rest, hydrate thoroughly with water, and monitor symptoms. Descend if condition fails to improve.',
        whatMedsToTake: 'Acetazolamide (Diamox) for acclimatization; Ibuprofen or Paracetamol for headaches.',
        whatHerbsToUse: 'Rhodiola Rosea or Ginkgo Biloba.',
        howToUseHerbs: 'Brew Rhodiola root powder or Ginkgo leaves into a warm herbal tea to improve oxygen utilization and reduce fatigue.'
    },
    {
        id: '2',
        injuryName: 'High Altitude Pulmonary Edema (HAPE)',
        category: 'Altitude & Environmental',
        severity: 'Critical',
        appearance: 'Cyanotic (bluish) lips and nail beds, distressed breathing, coughing up pink or frothy sputum.',
        howToIdentify: 'Extreme breathlessness even while resting, gurgling or rattling sounds in the chest, persistent cough, and rapid heart rate.',
        whatToDo: 'Immediate emergency descent of at least 500-1000 meters. Administer portable hyperbaric chamber treatment or supplemental oxygen if available.',
        whatMedsToTake: 'Nifedipine to reduce pulmonary artery pressure; Dexamethasone as an emergency adjunct.',
        whatHerbsToUse: 'Cordyceps or Garlic.',
        howToUseHerbs: 'Chew raw mountain garlic cloves or consume Cordyceps extract supplements to support lung capacity and oxygen intake during emergency stabilization.'
    },
    {
        id: '3',
        injuryName: 'High Altitude Cerebral Edema (HACE)',
        category: 'Altitude & Environmental',
        severity: 'Critical',
        appearance: 'Disoriented or confused expression, staggering gait, uncoordinated physical movements, or complete loss of consciousness.',
        howToIdentify: 'Severe confusion, hallucination, ataxia (inability to walk in a straight line), slurred speech, and extreme apathy.',
        whatToDo: 'Evacuate downward immediately by any means possible. Do not wait; HACE is fatal without rapid descent and oxygen.',
        whatMedsToTake: 'Dexamethasone immediately to reduce brain swelling.',
        whatHerbsToUse: 'Ginkgo Biloba (preventative only).',
        howToUseHerbs: 'Brew concentrated ginkgo leaf extract tea during early trekking phases to support cerebral micro-circulation.'
    },
    {
        id: '4',
        injuryName: 'Snakebite (Viper / Pit Viper)',
        category: 'Wildlife & Envenomation',
        severity: 'Critical',
        appearance: 'Two distinct puncture wounds surrounded by rapidly spreading local swelling, intense redness, and dark bruising.',
        howToIdentify: 'Severe localized pain, bleeding from punctures, numbness in the limb, blurred vision, dizziness, and nausea.',
        whatToDo: 'Keep the victim calm and still to slow venom spread. Position the affected limb below heart level. Evacuate immediately.',
        whatMedsToTake: 'Polyvalent snake antivenom administered strictly in a hospital setting.',
        whatHerbsToUse: 'Echinacea root or Black Snake Root.',
        howToUseHerbs: 'Crush fresh Echinacea root into a paste and apply topically around the wound borders to manage local inflammation while seeking transport.'
    },
    {
        id: '5',
        injuryName: 'Severe Hypothermia',
        category: 'Cold Exposure',
        severity: 'Critical',
        appearance: 'Skin is pale, waxy, or blue-gray. The person may shiver violently or become completely unresponsive with stiff joints.',
        howToIdentify: 'Slurred speech, uncontrollable shivering followed by cessation of shivering, confusion, clumsiness, and extreme drowsiness.',
        whatToDo: 'Move the person out of the wind and cold. Remove wet clothing and wrap them in dry insulating layers or thermal blankets.',
        whatMedsToTake: 'None orally if unconscious. Warm IV fluids administered by medical personnel.',
        whatHerbsToUse: 'Ginger or Cayenne Pepper.',
        howToUseHerbs: 'Steep fresh ginger root in hot water to create a warming tea, stimulating internal circulation once the person is conscious.'
    },
    {
        id: '6',
        injuryName: 'Frostbite (Peripheral Tissue Freezing)',
        category: 'Cold Exposure',
        severity: 'High',
        appearance: 'Skin turns stark white, greyish-yellow, or mottled blue. Texture feels hard, frozen, and completely numb to touch.',
        howToIdentify: 'Complete loss of sensation, prickling feeling followed by numbness, and stiffness in fingers, toes, nose, or ears.',
        whatToDo: 'Move to a warm shelter. Remove constrictive wet gear. Immerse affected tissues in warm (37-39°C) water.',
        whatMedsToTake: 'Ibuprofen to reduce tissue inflammation during rewarming.',
        whatHerbsToUse: 'Yarrow or Arnica.',
        howToUseHerbs: 'Prepare an infusion of dried yarrow leaves to drink warm, supporting peripheral blood flow to recovering tissues.'
    },
    {
        id: '7',
        injuryName: 'Snow Blindness (Photokeratitis)',
        category: 'Environmental & Eye',
        severity: 'Medium',
        appearance: 'Eyes appear red, bloodshot, and watery with noticeable swelling around the eyelids.',
        howToIdentify: 'Intense gritty pain in the eyes, severe sensitivity to light (photophobia), headache, and a feeling like sand in the eyes.',
        whatToDo: 'Move into a dark room or shaded tent. Remove contact lenses and place cool, damp compresses over closed eyes.',
        whatMedsToTake: 'Ibuprofen for pain; doctor-prescribed soothing eye drops or antibiotic ointment.',
        whatHerbsToUse: 'Chamomile or Eyebright.',
        howToUseHerbs: 'Brew weak chamomile or eyebright tea, cool completely, soak clean cloth pads, and place over closed eyes to relieve inflammation.'
    },
    {
        id: '8',
        injuryName: 'Ankle Sprain & Ligament Tear',
        category: 'Musculoskeletal',
        severity: 'Medium',
        appearance: 'Rapid swelling, localized discoloration or black-and-blue bruising around the ankle joint, awkward foot positioning.',
        howToIdentify: 'Sharp pain upon weight-bearing, tenderness to touch over lateral ligaments, restricted range of joint movement.',
        whatToDo: 'Apply RICE protocol: Rest the joint, apply cold packs, compress gently with an elastic bandage, and elevate the leg.',
        whatMedsToTake: 'Ibuprofen or Naproxen sodium to manage pain and swelling.',
        whatHerbsToUse: 'Arnica Montana or Comfrey.',
        howToUseHerbs: 'Apply arnica-based ointment or comfrey leaf poultice topically over the bruised area to soothe joint swelling.'
    },
    {
        id: '9',
        injuryName: 'Altitude Dehydration & Electrolyte Imbalance',
        category: 'Metabolic & Environmental',
        severity: 'Medium',
        appearance: 'Dry, cracked lips, sunken eyes, dry mouth membranes, and dark-colored concentrated urine.',
        howToIdentify: 'Excessive thirst, dry mouth, dizziness, headache, fatigue, decreased frequency of urination.',
        whatToDo: 'Move to a cool or sheltered spot, rest, and drink small, steady sips of water or an oral rehydration solution (ORS).',
        whatMedsToTake: 'Oral Rehydration Salts (ORS) mixed in water to restore mineral balance.',
        whatHerbsToUse: 'Peppermint or Lemon Balm.',
        howToUseHerbs: 'Steep peppermint leaves in water to create a refreshing drink that eases nausea and encourages fluid consumption.'
    },
    {
        id: '10',
        injuryName: 'Alpine Lacerations & Deep Scrapes',
        category: 'Wounds & Trauma',
        severity: 'Low',
        appearance: 'Open bleeding cut on skin surface, often accompanied by embedded dirt, gravel, or alpine debris.',
        howToIdentify: 'Visible break in skin layers, steady bleeding, stinging localized pain.',
        whatToDo: 'Wash hands, flush wound thoroughly with clean water to remove debris, apply direct pressure with a clean cloth, bandage.',
        whatMedsToTake: 'Topical antibiotic ointment (Bacitracin) and Acetaminophen for pain.',
        whatHerbsToUse: 'Plantain leaf or Calendula.',
        howToUseHerbs: 'Crush clean fresh plantain leaves into a poultice or apply calendula salve directly onto clean wound edges to accelerate healing.'
    },
    {
        id: '11',
        injuryName: 'Avalanche Trauma & Crush Injury',
        category: 'Trauma & Rescue',
        severity: 'Critical',
        appearance: 'Major surface bruising, contusions, visible fractures, bleeding, or structural deformation of limbs.',
        howToIdentify: 'Severe localized pain, inability to move limbs, respiratory restriction due to chest compression, signs of internal shock.',
        whatToDo: 'Ensure avalanche scene is safe. Clear airway immediately, stabilize the cervical spine, control severe bleeding, and treat for shock.',
        whatMedsToTake: 'Pain relievers administered only if patient is conscious and vital signs are stable; emergency trauma kits required.',
        whatHerbsToUse: 'St. John’s Wort or Arnica.',
        howToUseHerbs: 'Administer Arnica herbal tincture drops under the tongue or in water to help mitigate post-trauma shock and soft-tissue bruise pain during evacuation.'
    },
    {
        id: '12',
        injuryName: 'Crevasse Fall Fracture & Dislocation',
        category: 'Trauma & Rescue',
        severity: 'Critical',
        appearance: 'Deformed limb alignment, unnatural bone angles, severe swelling, or exposed bone fractures.',
        howToIdentify: 'Inability to bear weight or move the joint, intense localized pain, grinding sensation (crepitus), and rapid swelling.',
        whatToDo: 'Immobilize the fracture using improvised splints (trekking poles, ice axes). Do not attempt to reset bones. Keep warm and evacuate.',
        whatMedsToTake: 'Strong analgesics (if available in expedition medical kit) and broad-spectrum antibiotics if open fracture.',
        whatHerbsToUse: 'Boswellia (Frankincense) or Turmeric.',
        howToUseHerbs: 'Consume powdered Boswellia resin or turmeric root tea to help suppress severe inflammatory responses around joint trauma and broken bones.'
    },
    {
        id: '13',
        injuryName: 'Lightning Strike & Electrical Shock',
        category: 'Environmental & Weather',
        severity: 'Critical',
        appearance: 'Lichtenberg figures (fern-like red branching patterns on skin), singed hair, thermal burns, or cardiac arrest.',
        howToIdentify: 'Unresponsiveness, absence of breathing or pulse, entry/exit burn wounds, temporary paralysis or confusion.',
        whatToDo: 'Check breathing and pulse immediately. Initiate CPR without delay if pulse is absent. Move away from ridges to safe shelter.',
        whatMedsToTake: 'Emergency cardiac medications or burn treatments administered by medical staff upon rescue.',
        whatHerbsToUse: 'Hawthorn Berry.',
        howToUseHerbs: 'Brew hawthorn berry tea for conscious survivors experiencing erratic heart rhythms or shock to support cardiovascular recovery.'
    },
    {
        id: '14',
        injuryName: 'Severe Sunburn & UV Radiation Burn',
        category: 'Environmental & Skin',
        severity: 'Medium',
        appearance: 'Bright red, inflamed skin tightening across face or neck, accompanied by fluid-filled blisters and skin warmth.',
        howToIdentify: 'Intense skin tenderness, burning sensation, blistering, chills, fever, and headache caused by high-altitude UV exposure.',
        whatToDo: 'Move out of direct sunlight, apply cool damp compresses, hydrate aggressively, and avoid popping any blisters.',
        whatMedsToTake: 'Ibuprofen to reduce inflammation and pain; topical hydrocortisone or soothing aloe vera gel.',
        whatHerbsToUse: 'Aloe Vera or Lavender Essential Oil.',
        howToUseHerbs: 'Extract fresh gel from an aloe leaf or dilute lavender oil in a carrier oil and apply gently over unruptured sunburned skin to cool and heal tissues.'
    },
    {
        id: '15',
        injuryName: 'Heat Exhaustion & Alpine Dehydration',
        category: 'Metabolic & Environmental',
        severity: 'Medium',
        appearance: 'Heavy sweating, pale or flushed skin, rapid weak pulse, dizziness, and muscle cramps during strenuous climbs.',
        howToIdentify: 'Excessive fatigue, headache, nausea, lightheadedness, and cold, clammy skin despite high physical exertion.',
        whatToDo: 'Move to shade, loosen heavy outer clothing, rest, and sip cool water or electrolyte drinks slowly.',
        whatMedsToTake: 'Oral Rehydration Salts (ORS) dissolved in water.',
        whatHerbsToUse: 'Spearmint or Hibiscus.',
        howToUseHerbs: 'Steep hibiscus flowers or spearmint leaves into a cool herbal beverage to replenish body temperature balance and soothe nausea.'
    },
    {
        id: '16',
        injuryName: 'Tick Bite & Lyme / Mountain Tick Fever',
        category: 'Wildlife & Envenomation',
        severity: 'Medium',
        appearance: 'Small embedded insect visible on skin, surrounded by a localized red welt or classic expanding "bull-eye" rash.',
        howToIdentify: 'Itching or localized irritation at bite site, persistent low-grade fever, muscle aches, fatigue, and joint stiffness.',
        whatToDo: 'Remove tick cleanly using fine-tipped tweezers by pulling straight up without twisting. Disinfect the bite zone thoroughly.',
        whatMedsToTake: 'Doxycycline (prescription antibiotic required for tick-borne infection prevention if endemic); Antihistamines for itching.',
        whatHerbsToUse: 'Andrographis or Garlic.',
        howToUseHerbs: 'Prepare an infusion of Andrographis leaves or ingest crushed raw garlic to support immune defense against tick-borne vector pathogens.'
    },
    {
        id: '17',
        injuryName: 'Trench Foot / Immersion Foot Syndrome',
        category: 'Cold & Moisture Exposure',
        severity: 'High',
        appearance: 'Feet appear pale, mottled, greyish-white, or blotchy, turning red and swollen later with foul-smelling damp skin.',
        howToIdentify: 'Numbness followed by heavy burning pain, tingling, heavy foot swelling, and blisters when exposed to damp, cold conditions.',
        whatToDo: 'Remove wet socks and boots immediately. Wash and gently dry feet, elevate them, and allow them to warm naturally. Do not massage hard.',
        whatMedsToTake: 'Ibuprofen for pain and inflammation; topical antifungal or antibacterial creams if skin breaks down.',
        whatHerbsToUse: 'Calendula or Tea Tree Oil.',
        howToUseHerbs: 'Dilute a few drops of tea tree oil in a carrier oil or apply calendula salve to dry skin to prevent secondary fungal and bacterial infections.'
    },
    {
        id: '18',
        injuryName: 'Rockfall Head Trauma & Concussion',
        category: 'Trauma & Rescue',
        severity: 'Critical',
        appearance: 'Lacerations on the scalp, bruising or swelling on the skull, and potential blood or clear fluid from ears/nose.',
        howToIdentify: 'Temporary loss of consciousness, confusion, dizziness, amnesia regarding the event, severe headache, and vomiting.',
        whatToDo: 'Stabilize the head and neck immediately. Check responsiveness and airway. Control scalp bleeding with direct pressure around skull fractures.',
        whatMedsToTake: 'Acetaminophen for headache only after ruling out severe cranial hemorrhage; strictly monitor neurological status.',
        whatHerbsToUse: 'Gotu Kola or Rosemary.',
        howToUseHerbs: 'Brew a mild rosemary or gotu kola tea once conscious to support cognitive recovery, mental clarity, and cerebral blood circulation.'
    },
    {
        id: '19',
        injuryName: 'Altitude Migraine & Severe Exertional Headache',
        category: 'Altitude & Environmental',
        severity: 'Medium',
        appearance: 'Patient appears squinted, holding their temples or head, avoiding bright light and looking exhausted.',
        howToIdentify: 'Unilateral or bilateral throbbing head pain, sensitivity to light and sound, nausea, and visual aura triggered by thin air.',
        whatToDo: 'Stop physical exertion immediately, move to a shaded and quiet rest area, apply a cold cloth to the forehead, and hydrate.',
        whatMedsToTake: 'Sumatriptan or standard analgesics like Ibuprofen / Acetaminophen combined with caffeine.',
        whatHerbsToUse: 'Feverfew or Willow Bark.',
        howToUseHerbs: 'Chew fresh feverfew leaves or steep dried white willow bark (natural salicylate source) into a tea to alleviate vascular head pain.'
    },
    {
        id: '20',
        injuryName: 'Poisonous Plant Dermatitis (Stinging Nettle / Poison Ivy)',
        category: 'Environmental & Flora',
        severity: 'Low',
        appearance: 'Red, angry rash patches, tiny raised hives, or microscopic stinging hairs embedded directly in skin pores.',
        howToIdentify: 'Immediate intense stinging, burning sensation, itching, and spreading localized skin redness after brushing against foliage.',
        whatToDo: 'Wash skin immediately with soap and cold water or wipe down with clean cloth to remove plant oils and microscopic silica hairs.',
        whatMedsToTake: 'Oral antihistamines (Cetirizine or Diphenhydramine); topical calamine lotion or hydrocortisone cream.',
        whatHerbsToUse: 'Jewelweed or Plantain.',
        howToUseHerbs: 'Crush fresh jewelweed stalks or crushed plantain leaves and rub the extracted juice directly onto the rash to neutralize plant irritants and stop itching.'
    }
];

export default function FirstAidScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null);
    const [activeInjury, setActiveInjury] = useState<MountainInjury | null>(null);

    const filteredInjuries = MOUNTAIN_INJURIES.filter(item => {
        const query = searchQuery.toLowerCase();
        const matchesQuery =
            item.injuryName.toLowerCase().includes(query) ||
            item.appearance.toLowerCase().includes(query) ||
            item.howToIdentify.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query) ||
            item.whatToDo.toLowerCase().includes(query);

        const matchesSeverity = selectedSeverity ? item.severity === selectedSeverity : true;

        return matchesQuery && matchesSeverity;
    });

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Text style={styles.headerTitle}>Mountain First Aid Triage</Text>
            <Text style={styles.headerSubtitle}>
                Comprehensive offline survival reference guide for mountain injuries, symptoms, and natural remedies.
            </Text>

            {/* Expanded Search Bar Container */}
            <View style={styles.searchBarWrapper}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={18} color="#8e8e93" style={{ marginRight: 6 }} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search symptoms, injuries..."
                        placeholderTextColor="#8e8e93"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={16} color="#8e8e93" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Severity Filter Chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
                <TouchableOpacity
                    style={[styles.chip, selectedSeverity === null && styles.activeChip]}
                    onPress={() => setSelectedSeverity(null)}
                >
                    <Text style={[styles.chipText, selectedSeverity === null && styles.activeChipText]}>All</Text>
                </TouchableOpacity>
                {['Low', 'Medium', 'High', 'Critical'].map((sev) => (
                    <TouchableOpacity
                        key={sev}
                        style={[styles.chip, selectedSeverity === sev && styles.activeChip]}
                        onPress={() => setSelectedSeverity(selectedSeverity === sev ? null : sev)}
                    >
                        <Text style={[styles.chipText, selectedSeverity === sev && styles.activeChipText]}>{sev}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Detailed Injury Card with Expanded Width Layout */}
            {activeInjury ? (
                <View style={styles.centeredContainer}>
                    <View style={styles.resultCard}>
                        <TouchableOpacity style={styles.backButton} onPress={() => setActiveInjury(null)}>
                            <Ionicons name="arrow-back" size={16} color="#007AFF" />
                            <Text style={styles.backButtonText}>Back to List</Text>
                        </TouchableOpacity>

                        <View style={styles.resultHeader}>
                            <Text style={styles.resultCategory}>{activeInjury.category}</Text>
                            <View style={[styles.severityBadge,
                            activeInjury.severity === 'Critical' ? styles.sevCritical :
                                activeInjury.severity === 'High' ? styles.sevHigh : styles.sevMedium
                            ]}>
                                <Text style={styles.severityText}>{activeInjury.severity}</Text>
                            </View>
                        </View>

                        <Text style={styles.resultTitle}>{activeInjury.injuryName}</Text>

                        <View style={styles.detailBlock}>
                            <Text style={styles.fieldLabel}>How It Appears:</Text>
                            <Text style={styles.fieldText}>{activeInjury.appearance}</Text>
                        </View>

                        <View style={styles.detailBlock}>
                            <Text style={styles.fieldLabel}>How to Identify:</Text>
                            <Text style={styles.fieldText}>{activeInjury.howToIdentify}</Text>
                        </View>

                        <View style={styles.detailBlock}>
                            <Text style={styles.fieldLabel}>What to Do:</Text>
                            <Text style={styles.fieldText}>{activeInjury.whatToDo}</Text>
                        </View>

                        <View style={styles.detailBlock}>
                            <Text style={styles.fieldLabel}>What Meds to Take:</Text>
                            <Text style={styles.fieldText}>{activeInjury.whatMedsToTake}</Text>
                        </View>

                        <View style={styles.detailBlock}>
                            <Text style={styles.fieldLabel}>What Herbs to Use:</Text>
                            <Text style={styles.fieldText}>{activeInjury.whatHerbsToUse}</Text>
                        </View>

                        <View style={styles.detailBlock}>
                            <Text style={styles.fieldLabel}>How to Use Them:</Text>
                            <Text style={styles.fieldText}>{activeInjury.howToUseHerbs}</Text>
                        </View>
                    </View>
                </View>
            ) : (
                <View style={styles.centeredContainer}>
                    <Text style={styles.libraryHeader}>Known Mountain Injuries ({filteredInjuries.length})</Text>
                    {filteredInjuries.length === 0 ? (
                        <Text style={styles.noResultsText}>No matching mountain injuries found offline.</Text>
                    ) : (
                        filteredInjuries.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.topicCard}
                                onPress={() => setActiveInjury(item)}
                            >
                                <View style={{ flex: 1, paddingRight: 6 }}>
                                    <View style={styles.cardHeaderRow}>
                                        <Text style={styles.topicCategory}>{item.category}</Text>
                                        <Text style={[styles.miniSeverity,
                                        item.severity === 'Critical' ? { color: '#ff3b30' } :
                                            item.severity === 'High' ? { color: '#ff9500' } : { color: '#34c759' }
                                        ]}>{item.severity}</Text>
                                    </View>
                                    <Text style={styles.topicTitle}>{item.injuryName}</Text>
                                    <Text style={styles.topicSnippet} numberOfLines={2}>{item.appearance}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={18} color="#8e8e93" />
                            </TouchableOpacity>
                        ))
                    )}
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f7',
    },
    contentContainer: {
        padding: 16,
        paddingBottom: 40,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1c1c1e',
        marginBottom: 4,
        textAlign: 'center',
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#3a3a3c',
        marginBottom: 14,
        textAlign: 'center',
        paddingHorizontal: 10,
        lineHeight: 18,
    },
    searchBarWrapper: {
        width: '100%',
        maxWidth: 720, // Increased from 420 to make search bar much wider
        marginBottom: 12,
    },
    searchBar: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#c7c7cc',
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#1c1c1e',
    },
    chipRow: {
        flexDirection: 'row',
        marginBottom: 16,
        maxHeight: 36,
    },
    chip: {
        backgroundColor: '#e5e5ea',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 14,
        marginRight: 6,
        height: 28,
        justifyContent: 'center',
    },
    activeChip: {
        backgroundColor: '#007AFF',
    },
    chipText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#3a3a3c',
    },
    activeChipText: {
        color: '#fff',
    },
    centeredContainer: {
        width: '100%',
        maxWidth: 720, // Increased from 420 to match cards to a wider view
        alignItems: 'center',
    },
    libraryHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1c1c1e',
        marginBottom: 8,
        alignSelf: 'flex-start',
    },
    noResultsText: {
        textAlign: 'center',
        color: '#8e8e93',
        marginTop: 20,
        fontSize: 14,
    },
    topicCard: {
        backgroundColor: '#fff',
        padding: 14,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e5e5ea',
        width: '100%',
    },
    cardHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    topicCategory: {
        fontSize: 10,
        fontWeight: '600',
        color: '#8e8e93',
        textTransform: 'uppercase',
    },
    miniSeverity: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    topicTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1c1c1e',
        marginTop: 2,
    },
    topicSnippet: {
        fontSize: 12,
        color: '#636366',
        marginTop: 3,
        lineHeight: 16,
    },
    resultCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#c7c7cc',
        width: '100%',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap: 4,
    },
    backButtonText: {
        color: '#007AFF',
        fontSize: 13,
        fontWeight: '600',
    },
    resultHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    resultCategory: {
        fontSize: 10,
        fontWeight: '700',
        color: '#8e8e93',
        textTransform: 'uppercase',
    },
    severityBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    sevCritical: {
        backgroundColor: '#ff3b30',
    },
    sevHigh: {
        backgroundColor: '#ff9500',
    },
    sevMedium: {
        backgroundColor: '#ffcc00',
    },
    severityText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    resultTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1c1c1e',
        marginBottom: 10,
    },
    detailBlock: {
        marginBottom: 10,
        backgroundColor: '#f8f8fa',
        padding: 10,
        borderRadius: 8,
    },
    fieldLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#007AFF',
        marginBottom: 2,
    },
    fieldText: {
        fontSize: 13,
        color: '#3a3a3c',
        lineHeight: 18,
    },
});