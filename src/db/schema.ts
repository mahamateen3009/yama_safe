import type { SQLiteDatabase } from 'expo-sqlite';

export const DATABASE_NAME = 'wildlife-safety.db';
export const DATABASE_VERSION = 3;

export const SURVIVAL_GUIDES_TABLE = 'SurvivalGuides';

export type ThreatLevel = 'low' | 'moderate' | 'high' | 'critical';
export type WildlifeType = 'Mammal' | 'Bird';

export type SurvivalGuide = {
  id: number;
  animalName: string;
  type: WildlifeType;
  habitat: string;
  threatLevel: ThreatLevel;
  survivalInstructions: string;
  safetyTips: string;
};

export type SurvivalGuideInput = Omit<SurvivalGuide, 'id'>;

type SurvivalGuideRow = {
  id: number;
  animal_name: string;
  type: WildlifeType;
  habitat: string;
  threat_level: ThreatLevel;
  survival_instructions: string;
  safety_tips: string;
};

export const CREATE_SURVIVAL_GUIDES_TABLE = `
CREATE TABLE IF NOT EXISTS ${SURVIVAL_GUIDES_TABLE} (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  animal_name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('Mammal', 'Bird')),
  habitat TEXT NOT NULL,
  threat_level TEXT NOT NULL CHECK (threat_level IN ('low', 'moderate', 'high', 'critical')),
  survival_instructions TEXT NOT NULL,
  safety_tips TEXT NOT NULL
);
`;

export const KASHMIR_SURVIVAL_GUIDE_SEED: SurvivalGuideInput[] = [
  // Major mammals
  {
    animalName: 'Hangul (Kashmir Stag)',
    type: 'Mammal',
    habitat: 'Dachigam NP — grasslands, birch forest, and upper Dagwan valley',
    threatLevel: 'moderate',
    survivalInstructions:
      'The Hangul is Kashmir’s endemic red deer and the flagship species of Dachigam National Park. Maintain at least 50 metres distance, never block escape routes, and avoid sudden movements that may panic the herd during breeding season (autumn).',
    safetyTips:
      'Stay with a guide in Dachigam; Do not approach or feed; Keep quiet during dawn and dusk viewing.',
  },
  {
    animalName: 'Snow Leopard',
    type: 'Mammal',
    habitat: 'Dachigam upper ridges and Kishtwar NP — alpine cliffs above 3,000 m',
    threatLevel: 'high',
    survivalInstructions:
      'Snow leopards are elusive but present on high ridges in Dachigam and Kishtwar. They rarely hunt humans, but a wounded or cornered cat is extremely dangerous. Travel in groups, keep children close, and never approach a kill site or den area.',
    safetyTips:
      'Travel with a local guide in Kishtwar; Do not walk alone at dawn or dusk; Report tracks or sightings to park staff immediately.',
  },
  {
    animalName: 'Himalayan Brown Bear',
    type: 'Mammal',
    habitat: 'Kishtwar NP alpine meadows and Dachigam upper slopes (3,000–4,200 m)',
    threatLevel: 'critical',
    survivalInstructions:
      'Brown bears use alpine meadows for grazing in summer and can be aggressive when surprised or when cubs are nearby. Make noise on blind trails, store food in bear-safe containers, and if charged at close range, drop to the ground and protect your head and neck.',
    safetyTips:
      'Keep food secured; Do not approach or feed; Carry bear deterrent and travel in groups in alpine zones.',
  },
  {
    animalName: 'Himalayan Black Bear',
    type: 'Mammal',
    habitat: 'Dachigam oak–conifer forest and Kashmir Valley forest–orchard edges',
    threatLevel: 'critical',
    survivalInstructions:
      'Black bears frequently enter orchards and forest margins around Dachigam and the Kashmir Valley. Do not run if encountered — back away slowly, avoid direct eye contact, and speak calmly while making yourself appear larger.',
    safetyTips:
      'Keep food secured; Do not approach or feed; Travel in groups near forest edges and village orchards.',
  },
  {
    animalName: 'Common Leopard',
    type: 'Mammal',
    habitat: 'Dachigam NP and Kishtwar NP — forest corridors and village boundaries',
    threatLevel: 'high',
    survivalInstructions:
      'Leopards are most active at dawn, dusk, and night, especially where forest meets settlements. If spotted, stay calm, do not turn your back, and retreat slowly without running. Report sightings to wildlife staff in Dachigam or Kishtwar.',
    safetyTips:
      'Do not approach or feed; Avoid walking alone at night in forest corridors; Stay with a guide in Dachigam.',
  },
  {
    animalName: 'Himalayan Wolf',
    type: 'Mammal',
    habitat: 'Kishtwar NP remote valleys and high ridges of Dachigam',
    threatLevel: 'high',
    survivalInstructions:
      'Wolves inhabit remote areas of Kishtwar and upper Dachigam and generally avoid humans, but may investigate campsites attracted by food. Never feed wolves or leave meat scraps unattended at high-altitude camps.',
    safetyTips:
      'Keep food secured at camp; Do not approach or feed; Travel in groups in remote Kishtwar valleys.',
  },
  {
    animalName: 'Wild Boar',
    type: 'Mammal',
    habitat: 'Dachigam lower forest, scrub, and valley edges near agricultural land',
    threatLevel: 'moderate',
    survivalInstructions:
      'Wild boar are common in lower Dachigam and can charge if surprised, especially sows with piglets. Give them a wide berth, climb to higher ground if possible, and never block their escape path.',
    safetyTips:
      'Do not approach or feed; Make noise on forest trails; Keep distance from groups with young.',
  },
  {
    animalName: 'Kashmir Gray Langur',
    type: 'Mammal',
    habitat: 'Dachigam NP — mixed oak, pine, and deodar forest canopy',
    threatLevel: 'low',
    survivalInstructions:
      'Kashmir gray langurs live in troops throughout Dachigam’s forest canopy. They are not aggressive but may bite if fed or cornered. Observe from the trail and never offer food.',
    safetyTips:
      'Do not approach or feed; Secure food and bags on trails; Observe from a respectful distance.',
  },
  {
    animalName: 'Rhesus Macaque',
    type: 'Mammal',
    habitat: 'Forest edges and roadsides near Dachigam entrance and valley settlements',
    threatLevel: 'moderate',
    survivalInstructions:
      'Rhesus macaques near Dachigam and valley roads can become bold when fed by tourists. They may snatch bags or scratch if provoked. Keep food out of sight and do not encourage close contact.',
    safetyTips:
      'Do not approach or feed; Keep food and bags secured; Avoid direct eye contact with aggressive individuals.',
  },

  // Mountain ungulates
  {
    animalName: 'Markhor',
    type: 'Mammal',
    habitat: 'Kishtwar NP — steep cliff faces and rocky gorges (Kiar, Nanth, and Warwan valleys)',
    threatLevel: 'moderate',
    survivalInstructions:
      'The flare-horned markhor is a key species of Kishtwar National Park, found on near-vertical cliff terrain. They are not predatory but can fall or dislodge rocks if disturbed on steep slopes below them. View from designated lookouts with a guide.',
    safetyTips:
      'Stay with a guide in Kishtwar; Do not approach or feed; Keep to marked trails on cliff viewpoints.',
  },
  {
    animalName: 'Himalayan Ibex',
    type: 'Mammal',
    habitat: 'Kishtwar NP — high rocky slopes and cliff ledges above 3,500 m',
    threatLevel: 'low',
    survivalInstructions:
      'Himalayan ibex inhabit the high rocky terrain of Kishtwar National Park. They pose little direct threat but inhabit unstable cliff zones — avoid climbing below ibex on loose scree slopes.',
    safetyTips:
      'Stay with a guide in Kishtwar; Observe from trail distance only; Avoid climbing directly beneath cliff ledges.',
  },
  {
    animalName: 'Musk Deer',
    type: 'Mammal',
    habitat: 'Dachigam NP — dense conifer and birch forest understory',
    threatLevel: 'low',
    survivalInstructions:
      'Musk deer are shy, solitary animals in Dachigam’s dense forest. They rarely pose a direct threat but are easily stressed and protected under wildlife law. Observe only from marked trails and never pursue them.',
    safetyTips:
      'Do not approach or feed; Observe from trail distance only; Stay with a guide in Dachigam.',
  },
  {
    animalName: 'Himalayan Serow',
    type: 'Mammal',
    habitat: 'Dachigam and Kishtwar NP — forested slopes and rocky ravines',
    threatLevel: 'moderate',
    survivalInstructions:
      'Serow are stocky goat-antelopes found on forested slopes in both Dachigam and Kishtwar. They can charge if cornered and have sharp horns. Give them space on narrow forest trails and do not block escape routes.',
    safetyTips:
      'Do not approach or feed; Give way on narrow forest trails; Stay with a guide in Dachigam or Kishtwar.',
  },
  {
    animalName: 'Bharal (Blue Sheep)',
    type: 'Mammal',
    habitat: 'Kishtwar NP — high alpine pastures and open mountain slopes above 4,000 m',
    threatLevel: 'low',
    survivalInstructions:
      'Bharal graze open alpine slopes in Kishtwar’s upper valleys. They are not dangerous but indicate snow leopard habitat — remain alert in bharal country and travel with an experienced local guide.',
    safetyTips:
      'Stay with a guide in Kishtwar; Observe from distance on alpine routes; Stay alert for predator activity in bharal habitat.',
  },

  // Small mammals
  {
    animalName: 'Himalayan Marmot',
    type: 'Mammal',
    habitat: 'Kishtwar NP and upper Dachigam — alpine meadows above treeline',
    threatLevel: 'low',
    survivalInstructions:
      'Himalayan marmots live in colonies on alpine meadows in Kishtwar and upper Dachigam. They are not aggressive but burrows can weaken ground near trails. Do not step on soft meadow patches near burrow entrances.',
    safetyTips:
      'Do not approach or feed; Watch footing near burrow colonies; Keep dogs leashed in alpine meadows.',
  },
  {
    animalName: "Royle's Pika",
    type: 'Mammal',
    habitat: 'Rocky alpine slopes and scree fields in Dachigam upper reaches and Kishtwar NP',
    threatLevel: 'low',
    survivalInstructions:
      'Royle’s pika are small, harmless mammals found on rocky alpine terrain. They are indicators of healthy high-altitude ecosystems and pose no safety risk to trekkers.',
    safetyTips:
      'Do not approach or feed; Observe from trail distance only; Avoid disturbing scree habitat.',
  },
  {
    animalName: 'Woolly Hare',
    type: 'Mammal',
    habitat: 'Subalpine and alpine zones of Dachigam and Kishtwar NP',
    threatLevel: 'low',
    survivalInstructions:
      'Woolly hares are common in subalpine and alpine zones of both parks. They pose no threat and are often seen at dawn on meadow edges near treeline.',
    safetyTips:
      'Do not approach or feed; Observe from trail distance only; Drive carefully on park roads at dawn.',
  },
  {
    animalName: 'Indian Porcupine',
    type: 'Mammal',
    habitat: 'Dachigam forest undergrowth and valley orchard margins',
    threatLevel: 'moderate',
    survivalInstructions:
      'Indian porcupines are nocturnal and found in Dachigam’s forest undergrowth. If threatened, they may charge backward with quills raised. Give them space at night and use a torch on forest paths after dark.',
    safetyTips:
      'Do not approach or feed; Use a torch on night trails; Keep dogs away from forest undergrowth.',
  },
  {
    animalName: 'Leopard Cat',
    type: 'Mammal',
    habitat: 'Dachigam NP — forest understory and dense shrub cover',
    threatLevel: 'low',
    survivalInstructions:
      'Leopard cats are small wild cats in Dachigam’s forest understory. They avoid humans and are rarely seen. If encountered, stand still and allow the animal to retreat — do not chase for photographs.',
    safetyTips:
      'Do not approach or feed; Allow the animal to retreat; Stay on marked trails after dark.',
  },
  {
    animalName: 'Yellow-throated Marten',
    type: 'Mammal',
    habitat: 'Dachigam NP — conifer and birch forest',
    threatLevel: 'low',
    survivalInstructions:
      'Yellow-throated martens are agile forest predators in Dachigam. They may investigate campsites for food but rarely confront humans. Store food securely at rest stops.',
    safetyTips:
      'Keep food secured; Do not approach or feed; Store food away from campsites in forest zones.',
  },
  {
    animalName: 'Kashmir Flying Squirrel',
    type: 'Mammal',
    habitat: 'Dachigam NP — oak and pine forest canopy',
    threatLevel: 'low',
    survivalInstructions:
      'Kashmir flying squirrels are nocturnal and live in Dachigam’s oak and pine forest. They are harmless and best observed quietly at dusk with a red-filter torch to avoid disturbance.',
    safetyTips:
      'Do not approach or feed; Use red-light torches for night observation; Stay on marked trails.',
  },
  {
    animalName: 'Red Fox',
    type: 'Mammal',
    habitat: 'Open valleys, forest edges, and meadows across Dachigam and Kishtwar NP',
    threatLevel: 'low',
    survivalInstructions:
      'Red foxes are widespread across both parks and generally flee from humans. Rabies is a concern with any wild canid — never attempt to handle or feed a fox, especially one behaving unusually tame.',
    safetyTips:
      'Do not approach or feed; Report unusually bold behaviour to park staff; Keep food secured at camp.',
  },
  {
    animalName: 'Eurasian Lynx',
    type: 'Mammal',
    habitat: 'Remote forested valleys of Kishtwar NP',
    threatLevel: 'moderate',
    survivalInstructions:
      'The Eurasian lynx is rare but documented in Kishtwar’s remote forests. Like other wild cats, it avoids humans but may defend itself if cornered. Maintain distance and never follow a lynx off-trail.',
    safetyTips:
      'Stay with a guide in Kishtwar; Do not approach or feed; Report sightings to park staff.',
  },

  // Notable birds
  {
    animalName: 'Himalayan Monal',
    type: 'Bird',
    habitat: 'Dachigam and Kishtwar NP — forest clearings and subalpine shrub zones',
    threatLevel: 'low',
    survivalInstructions:
      'The Himalayan monal is Jammu & Kashmir’s state bird, found in forest clearings of Dachigam and Kishtwar. It is protected and not dangerous, but flushing birds repeatedly stresses breeding pairs — observe quietly from trails.',
    safetyTips:
      'Do not approach or feed; Observe quietly from trails; Stay with a guide in Dachigam for best viewing.',
  },
  {
    animalName: 'Bearded Vulture (Lammergeier)',
    type: 'Bird',
    habitat: 'Kishtwar NP — high cliff faces and deep river gorges',
    threatLevel: 'low',
    survivalInstructions:
      'The bearded vulture soars over Kishtwar’s high cliffs and gorges, feeding on bone fragments. It poses no threat to humans but indicates exposed cliff terrain — exercise caution on loose rock at viewpoint edges.',
    safetyTips:
      'Stay behind safety barriers at cliff viewpoints; Do not approach nests on cliff faces; Stay with a guide in Kishtwar gorges.',
  },
  {
    animalName: 'Himalayan Griffon Vulture',
    type: 'Bird',
    habitat: 'Open valleys and ridgelines of Dachigam and Kishtwar NP',
    threatLevel: 'low',
    survivalInstructions:
      'Himalayan griffon vultures gather at carcass sites in open valleys. Avoid approaching carcass concentrations, as predators including leopards and bears may be nearby.',
    safetyTips:
      'Avoid carcass sites; Do not approach feeding groups; Report carcasses near trails to park staff.',
  },
  {
    animalName: 'Golden Eagle',
    type: 'Bird',
    habitat: 'Kishtwar NP — high cliffs, ridges, and open alpine basins',
    threatLevel: 'low',
    survivalInstructions:
      'Golden eagles nest on Kishtwar’s high cliffs and hunt in open alpine basins. They are not a human safety concern but nesting sites should not be disturbed during the breeding season (March–July).',
    safetyTips:
      'Do not approach cliff nests; Observe from distance with binoculars; Stay on marked trails in nesting season.',
  },
  {
    animalName: 'Himalayan Snowcock',
    type: 'Bird',
    habitat: 'Alpine meadows and rocky slopes above treeline in Kishtwar NP',
    threatLevel: 'low',
    survivalInstructions:
      'Himalayan snowcocks inhabit alpine meadows above treeline in Kishtwar. Their loud calls are a common sound on high routes. They are harmless — use their presence as a cue that you are entering high alpine terrain.',
    safetyTips:
      'Observe from trail distance only; Prepare for altitude and weather changes; Stay with a guide on alpine routes.',
  },
  {
    animalName: 'Kashmir Flycatcher',
    type: 'Bird',
    habitat: 'Dachigam NP — dense forest understory (breeding visitor, May–September)',
    threatLevel: 'low',
    survivalInstructions:
      'The Kashmir flycatcher is a range-restricted breeding visitor to Dachigam’s forest understory. It is endangered and protected — avoid trampling understory vegetation when birdwatching off-trail.',
    safetyTips:
      'Do not approach or feed; Stay on marked trails; Stay with a guide in Dachigam during breeding season.',
  },
  {
    animalName: 'Western Tragopan',
    type: 'Bird',
    habitat: 'Kishtwar NP — moist temperate forest and rhododendron understory',
    threatLevel: 'low',
    survivalInstructions:
      'The western tragopan is one of the rarest pheasants in the Himalayas and occurs in Kishtwar’s moist forest zones. It is critically endangered — never play recorded calls or flush birds for photographs.',
    safetyTips:
      'Do not approach or feed; No playback or flushing for photos; Stay with a guide in Kishtwar forest zones.',
  },
  {
    animalName: 'Chukar Partridge',
    type: 'Bird',
    habitat: 'Rocky hillsides, scrub, and forest margins across Dachigam and Kishtwar NP',
    threatLevel: 'low',
    survivalInstructions:
      'Chukar partridge are common on rocky hillsides throughout both parks. They flush noisily from scrub and can startle trekkers on narrow paths — stay alert on rocky sections but no defensive action is needed.',
    safetyTips:
      'Stay alert on rocky trails; Do not shoot or disturb; Observe from trail distance only.',
  },
  {
    animalName: 'Yellow-billed Blue Magpie',
    type: 'Bird',
    habitat: 'Dachigam NP — oak and mixed broadleaf forest',
    threatLevel: 'low',
    survivalInstructions:
      'Yellow-billed blue magpies are vocal, conspicuous birds in Dachigam’s oak forest. They may approach camps looking for scraps — do not feed them, as this encourages habituation and aggression.',
    safetyTips:
      'Do not approach or feed; Keep campsite food secured; Observe from trail distance only.',
  },
  {
    animalName: 'Markhor (Capra falconeri)',
    type: 'Mammal',
    habitat: 'Steep, rugged mountain crags and precipitous cliffs of Pir Panjal and Kazinag',
    threatLevel: 'critical',
    survivalInstructions:
      'The Markhor is the largest wild goat species, recognized by its striking corkscrew horns. They inhabit vertical, rocky terrain. They are naturally shy and flee humans, but avoid moving directly beneath them to prevent triggering dangerous rockfalls.',
    safetyTips:
      'Watch for falling rocks from cliffs above; Maintain distance on narrow mountain paths; Use binoculars for safe viewing.',
  },
  {
    animalName: 'Himalayan Musk Deer',
    type: 'Mammal',
    habitat: 'High-altitude sub-alpine oak forests, rhododendron tracts, and alpine scrubs',
    threatLevel: 'high',
    survivalInstructions:
      'Solitary and primarily active at dawn or dusk, musk deer are elusive and possess specialized scent glands. They pose no direct threat to humans, but moving quietly through their habitat requires caution to avoid startling them.',
    safetyTips:
      'Travel silently on twilight forest trails; Do not use harsh flash photography that can panic wildlife.',
  },
  {
    animalName: 'Himalayan Serow',
    type: 'Mammal',
    habitat: 'Steep forested gorges and rocky alpine slopes in upper Kashmir valleys',
    threatLevel: 'high',
    survivalInstructions:
      'A solitary, goat-antelope hybrid creature that can become unpredictable and defensive if cornered in narrow gorges or thick forest brush. Give them ample room to escape.',
    safetyTips:
      'Do not block narrow trail corridors or ridge tracks; Back away slowly if an individual stands its ground.',
  },
  {
    animalName: 'Eurasian Lynx',
    type: 'Mammal',
    habitat: 'Remote forest tracts, rocky scrublands, and higher elevation borders',
    threatLevel: 'moderate',
    survivalInstructions:
      'The lynx is an elusive, medium-sized wild cat with distinct tufted ears. They actively avoid human presence and hunt small prey at night. They will only react aggressively if handled or defending young.',
    safetyTips:
      'Secure food waste at high-altitude campsites; Do not attempt to track or corner wild cats.',
  },
  {
    animalName: 'Himalayan Monal Pheasant',
    type: 'Bird',
    habitat: 'High-altitude oak-conifer forests and alpine shrublands',
    threatLevel: 'low',
    survivalInstructions:
      'The state bird of neighboring regions, the male Monal features brilliant, multicolored plumage. They are ground-dwelling birds that forage in leaf litter. They pose zero physical threat.',
    safetyTips:
      'Minimize loud noises near breeding grounds; Keep companion dogs on a leash to protect ground nests.',
  },
  {
    animalName: 'Lammergeier (Bearded Vulture)',
    type: 'Bird',
    habitat: 'Soaring high over alpine crags, cliffs, and deep mountain gorges',
    threatLevel: 'low',
    survivalInstructions:
      'A massive bird of prey known for dropping bones from heights to crack them open. They feed exclusively on carrion and bones, meaning humans are completely safe, though nesting ledges should not be disturbed.',
    safetyTips:
      'Observe nesting cliffs from a safe distance; Do not leave trash or food scraps that attract scavenger birds to camp.',
  },
  {
    animalName: 'Golden Eagle',
    type: 'Bird',
    habitat: 'Open alpine skies, high mountain ridges, and rocky valleys',
    threatLevel: 'low',
    survivalInstructions:
      'An apex aerial hunter with an expansive wingspan. While majestic to watch, they completely avoid humans and hunt small mammals. Maintain distance from active cliff nests.',
    safetyTips:
      'Do not climb near steep rock faces during nesting seasons; Enjoy sightings entirely through a telephoto lens or binoculars.',
  },
  {
    animalName: 'Asiatic Ibex (Capra sibirica)',
    type: 'Mammal',
    habitat: 'Steep, craggy mountain ridges and alpine zones above the tree line in Kishtwar',
    threatLevel: 'moderate',
    survivalInstructions:
      'The Asiatic Ibex is a wild mountain goat with massive, ridged horns. They navigate extreme vertical precipices with ease. They are peaceful herbivores that avoid human contact, but hikers should watch out for accidental rockfalls triggered by herds grazing on cliffs above.',
    safetyTips:
      'Keep clear of steep cliff bases where rockfall is possible; Observe herds from a distance using binoculars.',
  },
  {
    animalName: 'Leopard Cat',
    type: 'Mammal',
    habitat: 'Dense forest tracts, brush, and lower-elevation wooded valleys of Dachigam',
    threatLevel: 'moderate',
    survivalInstructions:
      'A small, beautifully spotted wild cat roughly the size of a domestic cat, but completely wild and fiercely territorial. They hunt rodents and birds at night. They pose no threat to humans unless handled or cornered.',
    safetyTips:
      'Do not attempt to pet or capture wild felines; Secure small camp food items that might attract nocturnal prowlers.',
  },
  {
    animalName: 'Himalayan Weasel',
    type: 'Mammal',
    habitat: 'High-altitude rocky crevices, alpine meadows, and forest floors',
    threatLevel: 'low',
    survivalInstructions:
      'Extremely agile, slender, and curious carnivores. While they are fascinating to watch darting between rocks, they carry sharp teeth and can deliver a painful bite if grabbed or cornered in a tent.',
    safetyTips:
      'Do not leave food packaging open in tents, as weasels will chew through gear to reach scraps.',
  },
  {
    animalName: 'Koklass Pheasant',
    type: 'Bird',
    habitat: 'Dense oak and conifer forest belts across Kashmir mountain ranges',
    threatLevel: 'low',
    survivalInstructions:
      'A forest-dwelling game bird known for its distinct ringing call at dawn. They nest on the ground in thick brush. They are entirely harmless to humans.',
    safetyTips:
      'Avoid walking off-trail through thick spring undergrowth to protect ground nesting sites.',
  },
  {
    animalName: 'Himalayan Snowcock',
    type: 'Bird',
    habitat: 'High alpine slopes, windswept ridges, and snow line borders',
    threatLevel: 'low',
    survivalInstructions:
      'A large, robust game bird that thrives above the tree line. When startled, they tend to explode into flight with a loud whirring sound or run uphill. They present no danger.',
    safetyTips:
      'Stay on designated high-altitude trekking tracks to prevent disturbing their fragile alpine feeding grounds.',
  },
  {
    animalName: 'Kashmir Flying Squirrel (Eoglaucomys fimbriatus)',
    type: 'Mammal',
    habitat: 'Dense pine and conifer forest canopies across Kazinag and valley woodlands',
    threatLevel: 'low',
    survivalInstructions:
      'An arboreal, nocturnal rodent equipped with a membrane that allows it to glide between tall trees. They are entirely harmless to humans and rarely seen on the ground. Never disturb tree hollows where they nest during the day.',
    safetyTips:
      'Keep camp lighting low near forest canopy zones to avoid disrupting nocturnal foraging habits.',
  },
  {
    animalName: 'Himalayan Serow (Capricornis sumatraensis thar)',
    type: 'Mammal',
    habitat: 'Steep forested gorges, rocky ravines, and rugged upper thickets',
    threatLevel: 'high',
    survivalInstructions:
      'A solitary, goat-antelope mix with coarse dark fur and donkey-like ears. They inhabit steep, treacherous rocky gorges. They are highly defensive when cornered on narrow paths and can charge unexpectedly.',
    safetyTips:
      'Give right-of-way on narrow ledge trails; Never block a ravine or force an individual against a cliff face.',
  },
  {
    animalName: 'Kashmir Flycatcher (Ficedula subrubra)',
    type: 'Bird',
    habitat: 'Temperate deciduous forests and dense undergrowth zones of Dachigam',
    threatLevel: 'low',
    survivalInstructions:
      'A small, highly sought-after migratory songbird with striking reddish-orange underparts in males. They breed strictly in the high-altitude forests of the region. They pose no threat and rely entirely on undisturbed brush habitat.',
    safetyTips:
      'Avoid trampling thick undergrowth or ground brush where they build cup nests.',
  },
  {
    animalName: 'Chukar Partridge (Alectoris chukar)',
    type: 'Bird',
    habitat: 'Arid rocky slopes, open stony hillsides, and scrub transition zones',
    threatLevel: 'low',
    survivalInstructions:
      'A robust, ground-dwelling game bird recognized by its bold facial striping and barred flanks. When approached, they prefer to run uphill or burst into a short, noisy flight rather than attack.',
    safetyTips:
      'Enjoy tracking their calls from a distance; Keep camp dogs restrained to protect ground-foraging flocks.',
  },
  {
    animalName: 'Eurasian Eagle-Owl (Bubo bubo)',
    type: 'Bird',
    habitat: 'Steep rocky cliffs, forested ravines, and remote crags',
    threatLevel: 'moderate',
    survivalInstructions:
      'One of the largest owls in the world with piercing orange eyes and prominent ear tufts. They are apex nocturnal hunters. While they ignore humans, they will aggressively dive-bomb anyone who accidentally approaches their cliffside nests.',
    safetyTips:
      'Watch for nesting activity on rocky bluffs at dusk; Wear a hat or retreat immediately if targeted by a territorial warning flight.',
  },
  {
    animalName: 'Jungle Cat (Felis chaus)',
    type: 'Mammal',
    habitat: 'Lower dense scrub forests, reed beds, and wetland fringes around valley floors',
    threatLevel: 'moderate',
    survivalInstructions:
      'A medium-sized, long-legged wild cat that thrives in thick lower valley vegetation and near agricultural transitions. They are elusive and hunt rodents or ground birds. They will scratch or bite fiercely if cornered or handled.',
    safetyTips:
      'Avoid walking blindly through thick lowland reed beds or dense bush; Do not approach feral or wild cats in rural forest edges.',
  },
  {
    animalName: 'Alpine Accentor (Prunella collaris)',
    type: 'Bird',
    habitat: 'High-altitude rocky scree slopes, boulder fields, and windswept alpine zones',
    threatLevel: 'low',
    survivalInstructions:
      'A small, hardy songbird uniquely adapted to thrive above the tree line in extreme cold and rocky terrain. They frequently hop around mountaineering base camps looking for crumbs. They pose zero threat to humans.',
    safetyTips:
      'Do not feed human food scraps to alpine birds, as it disrupts their natural high-altitude foraging habits.',
  },
  {
    animalName: 'Himalayan Griffon Vulture (Gyps himalayensis)',
    type: 'Bird',
    habitat: 'Soaring over high mountain passes, rocky precipices, and alpine cliffs',
    threatLevel: 'low',
    survivalInstructions:
      'A massive Old World vulture with an impressive wingspan, specialized in scavenging carcasses across high-altitude crags. They are entirely harmless to living humans, though they require vast undisturbed airspace and cliff ledges for nesting.',
    safetyTips:
      'Keep clear of high-altitude ledge nesting sites during breeding periods; Never leave organic waste exposed at mountain camps.',
  },
  {
    animalName: 'Pallas’s Cat (Otocolobus manul)',
    type: 'Mammal',
    habitat: 'Remote high-altitude cold desert steppes and rocky alpine screes',
    threatLevel: 'moderate',
    survivalInstructions:
      'A small, remarkably stocky wild cat with dense fur designed for sub-zero alpine conditions. They rely on rock crevices for shelter and are intensely reclusive. They will hiss and defend themselves if trapped inside a rocky shelter.',
    safetyTips:
      'Do not insert hands into dark rock crevices or stone cavities while trekking through high-altitude scree slopes.',
  },
  {
    animalName: 'Cheer Pheasant (Catreus wallichii)',
    type: 'Bird',
    habitat: 'Steep, rugged grassy hillsides interspersed with scrub and rocky outcrops',
    threatLevel: 'low',
    survivalInstructions:
      'A threatened, vulnerable upland game bird known for its distinct pale grey-brown plumage and long tail. They inhabit steep, broken terrain and prefer running through tall grass rather than flying long distances when startled.',
    safetyTips:
      'Stay on designated trekking routes during spring nesting seasons to prevent destroying ground cover.',
  },
];

export function mapSurvivalGuideRow(row: SurvivalGuideRow): SurvivalGuide {
  return {
    id: row.id,
    animalName: row.animal_name,
    type: row.type,
    habitat: row.habitat,
    threatLevel: row.threat_level,
    survivalInstructions: row.survival_instructions,
    safetyTips: row.safety_tips,
  };
}

async function columnExists(db: SQLiteDatabase, column: string): Promise<boolean> {
  const columns = await db.getAllAsync<{ name: string }>(
    `PRAGMA table_info(${SURVIVAL_GUIDES_TABLE})`,
  );

  return columns.some((entry) => entry.name === column);
}

async function addColumnIfMissing(
  db: SQLiteDatabase,
  column: string,
  definition: string,
): Promise<void> {
  if (!(await columnExists(db, column))) {
    await db.execAsync(`ALTER TABLE ${SURVIVAL_GUIDES_TABLE} ADD COLUMN ${column} ${definition}`);
  }
}

async function refreshSurvivalGuideSeed(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`DELETE FROM ${SURVIVAL_GUIDES_TABLE}`);

  for (const guide of KASHMIR_SURVIVAL_GUIDE_SEED) {
    await db.runAsync(
      `INSERT INTO ${SURVIVAL_GUIDES_TABLE} (animal_name, type, habitat, threat_level, survival_instructions, safety_tips) VALUES (?, ?, ?, ?, ?, ?)`,
      guide.animalName,
      guide.type,
      guide.habitat,
      guide.threatLevel,
      guide.survivalInstructions,
      guide.safetyTips,
    );
  }
}

export async function initializeDatabase(db: SQLiteDatabase) {
  // 1. Ensure the survival guides table exists
  await db.execAsync(CREATE_SURVIVAL_GUIDES_TABLE);

  // 2. Ensure the incident logs table exists
  await db.execAsync(CREATE_INCIDENT_LOGS_TABLE);

  // 3. Loop through every animal in your seed array and insert it if it doesn't already exist
  for (const item of KASHMIR_SURVIVAL_GUIDE_SEED) {
    await db.runAsync(
      `INSERT OR IGNORE INTO ${SURVIVAL_GUIDES_TABLE} 
       (animal_name, type, habitat, threat_level, survival_instructions, safety_tips) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        item.animalName,
        item.type,
        item.habitat,
        item.threatLevel,
        item.survivalInstructions,
        item.safetyTips,
      ]
    );
  }
}
// ==========================================
// Beware Board (Incident Logs) Schema Additions
// ==========================================

export const INCIDENT_LOGS_TABLE = 'incident_logs';

export type IncidentSeverity = 'low' | 'moderate' | 'high' | 'critical';

export interface IncidentLog {
  id: number;
  title: string;
  description: string;
  location: string;
  severity: IncidentSeverity;
  dateReported: string;
  isSynced: boolean; // false if submitted offline and waiting to sync
}

export type IncidentLogInput = Omit<IncidentLog, 'id' | 'isSynced'>;

type IncidentLogRow = {
  id: number;
  title: string;
  description: string;
  location: string;
  severity: IncidentSeverity;
  date_reported: string;
  is_synced: number;
};

export const CREATE_INCIDENT_LOGS_TABLE = `
CREATE TABLE IF NOT EXISTS ${INCIDENT_LOGS_TABLE} (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'moderate', 'high', 'critical')),
  date_reported TEXT NOT NULL,
  is_synced INTEGER DEFAULT 1 NOT NULL
);
`;

export function mapIncidentLogRow(row: IncidentLogRow): IncidentLog {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    location: row.location,
    severity: row.severity,
    dateReported: row.date_reported,
    isSynced: Boolean(row.is_synced),
  };
}
export async function initIncidentLogsTable(db: any) {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS incident_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      location TEXT NOT NULL,
      severity TEXT NOT NULL,
      date_reported TEXT NOT NULL,
      is_synced INTEGER DEFAULT 1
    );
  `);
}
