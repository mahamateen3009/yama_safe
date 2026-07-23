export interface FirstAidTopic {
    id: string;
    title: string;
    severity: 'Low' | 'Moderate' | 'High' | 'Critical';
    category: string;
    keywords: string[];
    steps: string[];
    herbalAlternative: {
        plantName: string;
        appearance: string;
        usage: string;
    };
}

export const FIRST_AID_TOPICS: FirstAidTopic[] = [
    {
        id: 'unknown',
        title: 'Unrecognized Specimen or Injury Pattern',
        severity: 'Moderate',
        category: 'Uncertain',
        keywords: ['unknown', 'unidentified', 'unclear'],
        steps: [
            'AI confidence score is below safe operational threshold.',
            'Do not apply unverified remedies, ingest unknown flora, or guess medical treatments.',
            'Select category manually from the verified offline database to view accurate protocols.'
        ],
        herbalAlternative: {
            plantName: 'None (Verify Locally)',
            appearance: 'Do not rely on unverified botanical matching.',
            usage: 'Always cross-reference with manual offline categories if optical recognition confidence is low.'
        }
    },
    {
        id: '1',
        title: 'Snakebite (Venomous)',
        severity: 'Critical',
        category: 'Wildlife & Insects',
        keywords: ['snake', 'bite', 'fang', 'venom', 'puncture'],
        steps: [
            'Keep the victim calm, still, and immobilized to slow venom circulation.',
            'Do NOT cut the wound, attempt to suck out venom, or apply a tourniquet.',
            'Keep the bitten limb at or below heart level and evacuate immediately.'
        ],
        herbalAlternative: {
            plantName: 'Sansevieria / Snake Plant or Wild Turmeric (Haldi)',
            appearance: 'Wild turmeric has broad green leaves with yellow flowers and a knobby underground root; Snake plant has stiff, upright sword-like leaves.',
            usage: 'If anti-venom is hours away, raw wild turmeric root paste can be crushed and applied topically around (not directly inside) the bite to reduce localized inflammation while awaiting rescue.'
        }
    },
    {
        id: '2',
        title: 'High-Altitude Sickness (AMS)',
        severity: 'Critical',
        category: 'Altitude & Exposure',
        keywords: ['altitude', 'ams', 'mountain', 'headache', 'breathless', 'oxymeter'],
        steps: [
            'Stop ascending immediately; rest and stay calm.',
            'Administer supplemental oxygen if available.',
            'If severe symptoms appear, descend by 500-1000 meters immediately.'
        ],
        herbalAlternative: {
            plantName: 'Sea Buckthorn (Chharma) or Rhododendron (Burans)',
            appearance: 'Sea buckthorn is a thorny shrub with bright orange-yellow berries; Rhododendron has large bell-shaped bright red flowers.',
            usage: 'Boil Rhododendron petals or consume Sea Buckthorn berries. They are rich in Vitamin C and antioxidants, which help combat altitude fatigue and support oxygen intake.'
        }
    },
    {
        id: '3',
        title: 'Sprains, Strains & Inflammation',
        severity: 'Moderate',
        category: 'Trauma & Physical',
        keywords: ['sprain', 'strain', 'ankle', 'swelling', 'joint', 'pain'],
        steps: [
            'Apply R.I.C.E method: Rest, Ice/Cold water, Compression, and Elevation.',
            'Splint the limb in the position it was found.'
        ],
        herbalAlternative: {
            plantName: 'Wild Garlic (Bichhu Booti / Stinging Nettle roots or Comfrey leaves)',
            appearance: 'Stinging nettle has serrated heart-shaped leaves covered in tiny stinging hairs (use caution/gloves).',
            usage: 'Crushed wild mint or nettle leaves can be made into a poultice and bound over a sprain to reduce swelling and numb localized pain.'
        }
    },
    {
        id: '4',
        title: 'Cuts, Scrapes & Minor Bleeding',
        severity: 'Moderate',
        category: 'Trauma & Physical',
        keywords: ['cut', 'scrape', 'bleeding', 'scratch', 'wound', 'abrasion'],
        steps: [
            'Clean the wound with clean water.',
            'Apply direct pressure with a clean cloth to stop bleeding.'
        ],
        herbalAlternative: {
            plantName: 'Yarrow (Gandana) or Pine Resin',
            appearance: 'Yarrow features feathery, fern-like leaves and small flat-topped clusters of white/pink flowers.',
            usage: 'Crush fresh yarrow leaves directly into an open scrape to help stop bleeding naturally, or apply natural pine tree resin as a temporary antiseptic seal.'
        }
    },
    {
        id: '5',
        title: 'Frostbite',
        severity: 'Critical',
        category: 'Altitude & Exposure',
        keywords: ['frostbite', 'freeze', 'cold', 'numb', 'fingers', 'toes'],
        steps: [
            'Move the victim to a warm shelter immediately and remove wet clothing/jewelry.',
            'Gradually warm the affected area using warm (never hot) water immersion for 20-30 minutes.',
            'Do NOT rub or massage the frostbitten skin, and do not let it refreeze once thawed.'
        ],
        herbalAlternative: {
            plantName: 'Wild Juniper (Shugpa) & Ginger Root',
            appearance: 'Juniper is an evergreen shrub/tree with needle-like leaves and dark blue-black seed cones (berries).',
            usage: 'Boil crushed juniper needles and wild ginger roots to create a warm infusion. Drinking this improves peripheral circulation and warms the core body.'
        }
    },
    {
        id: '6',
        title: 'Hypothermia',
        severity: 'Critical',
        category: 'Altitude & Exposure',
        keywords: ['hypothermia', 'shivering', 'freezing', 'core', 'confusion'],
        steps: [
            'Get the person out of the wind and cold; replace wet clothes with dry layers or sleeping bags.',
            'Provide warm, sweet liquids if conscious. Avoid alcohol or caffeine.',
            'Handle gently; sudden rough movement can trigger fatal cardiac arrhythmias.'
        ],
        herbalAlternative: {
            plantName: 'Wild Thyme (Jangli Ajwain)',
            appearance: 'Wild thyme is a low-growing mat-forming aromatic subshrub with tiny purple-pink flowers and small oval leaves.',
            usage: 'Brew wild thyme into a hot, strong tea to help stimulate internal body heat, soothe shivering, and relax constricted blood vessels.'
        }
    },
    {
        id: '7',
        title: 'Snow Blindness (Photokeratitis)',
        severity: 'Moderate',
        category: 'Altitude & Exposure',
        keywords: ['snow', 'blindness', 'eyes', 'glare', 'uv', 'pain'],
        steps: [
            'Move into a dark room or blindfold eyes with a clean, cool, damp cloth to block light.',
            'Do not rub eyes, and remove contact lenses if worn.',
            'Allow eyes to rest completely for 24-48 hours until corneal epithelium heals.'
        ],
        herbalAlternative: {
            plantName: 'Wild Rose Petals (Gulab)',
            appearance: 'Wild roses feature thorny stems, compound leaves, and fragrant pink/light-red flowers.',
            usage: 'Steep wild rose petals in clean boiled water, let it cool completely, and use it as a soothing eye compress to ease pain and inflammation.'
        }
    },
    {
        id: '8',
        title: 'Dehydration & Electrolyte Imbalance',
        severity: 'High',
        category: 'Environmental & Survival',
        keywords: ['dehydration', 'thirst', 'water', 'electrolyte', 'dizzy'],
        steps: [
            'Stop physical activity and rest in the shade or shelter out of the wind.',
            'Sip water mixed with a balance of salt and sugar (ORS packets) slowly and consistently.',
            'Monitor urine output and watch for signs of confusion, dizziness, or dark urine.'
        ],
        herbalAlternative: {
            plantName: 'Berberis / Barberry (Kirmoh / Daruhaldi)',
            appearance: 'A spiny deciduous shrub with yellow inner bark, bright yellow flowers, and tart red oblong berries.',
            usage: 'Boil the root bark or steep the tart berries in water. Rich in berberine and natural acids, it acts as a refreshing tonic that helps replenish energy and digestion.'
        }
    },
    {
        id: '9',
        title: 'Severe Burns & Sunburn',
        severity: 'Moderate',
        category: 'Environmental & Survival',
        keywords: ['burn', 'sunburn', 'blister', 'thermal', 'fire'],
        steps: [
            'Cool the burn immediately with clean, cool (not ice-cold) running water for at least 10–20 minutes.',
            'Cover loosely with a clean, non-stick sterile dressing or cloth.',
            'Do NOT pop blisters, apply butter, or use greasy ointments.'
        ],
        herbalAlternative: {
            plantName: 'Wild Aloe Vera or Himalayan Stonecrop (Sedum)',
            appearance: 'Succulent plants featuring thick, fleshy, water-storing leaves filled with clear cooling gel.',
            usage: 'Slice open the thick leaves and apply the raw mucilage gel directly onto the sunburnt or minor thermal burn area to cool skin and accelerate healing.'
        }
    },
    {
        id: '10',
        title: 'Insect Stings & Allergic Reactions',
        severity: 'Moderate',
        category: 'Wildlife & Insects',
        keywords: ['sting', 'bee', 'insect', 'allergic', 'itch', 'swelling'],
        steps: [
            'Scrape away any remaining stinger using a flat edge; do not squeeze with tweezers.',
            'Wash the area with soap and water, then apply a cold compress to reduce swelling.',
            'Monitor closely for signs of anaphylaxis (difficulty breathing, throat swelling).'
        ],
        herbalAlternative: {
            plantName: 'Plantain Weed (Bishlangi / Broadleaf Plantain)',
            appearance: 'Low-growing weed with broad, oval, ribbed leaves running parallel along the surface, close to the ground.',
            usage: 'Chew or crush fresh plantain leaves into a green paste (spit poultice) and apply directly to the insect sting to draw out venom and stop itching instantly.'
        }
    }
];