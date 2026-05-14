const WEAR = [
  { label: 'Factory New', short: 'FN', mult: 1.5 },
  { label: 'Minimal Wear', short: 'MW', mult: 1.2 },
  { label: 'Field-Tested', short: 'FT', mult: 1.0 },
  { label: 'Well-Worn', short: 'WW', mult: 0.8 },
  { label: 'Battle-Scarred', short: 'BS', mult: 0.65 },
];
const WEAR_WEIGHTS = [5, 15, 40, 25, 15]; // probabilities

const RARITIES = [
  { id: 'blue', label: 'Mil-Spec', color: '#4a90d9', chance: 0.7992, cls: 'r-blue' },
  { id: 'purple', label: 'Restricted', color: '#9b59b6', chance: 0.1598, cls: 'r-purple' },
  { id: 'pink', label: 'Classified', color: '#e91e8c', chance: 0.032, cls: 'r-pink' },
  { id: 'red', label: 'Covert', color: '#eb4b4b', chance: 0.0064, cls: 'r-red' },
  { id: 'gold', label: 'Rare Special', color: '#e4b000', chance: 0.0026, cls: 'r-gold' },
];

const CASES = [
  {
    img: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsUFJ5KBFZv668FFUznaCaJWVDvozlzdONwvKjYLiBk24IsZEl0uuYrNjw0A3n80JpZWzwIYWLMlhpLvhcskA', id: 'weapon', name: 'Weapon Case', icon: '📦', price: 50,
    items: {
      blue: [
        { name: 'FAMAS | Djinn', icon: '🔫', img: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsUFJ5KBFZv668FFUznaCaJWVDvozlzdONwvKjYLiBk24IsZEl0uuYrNjw0A3n80JpZWzwIYWLMlhpLvhcskA', base: 20 },
        { name: 'MP5-SD | Phosphor', icon: '🔫', base: 18 },
        { name: 'Nova | Ranger', icon: '🔫', base: 15 },
        { name: 'PP-Bizon | Chemical G.', icon: '🔫', base: 17 },
        { name: 'Sawed-Off | Serenity', icon: '🔫', base: 14 },
        { name: 'Tec-9 | Avalanche', icon: '🔫', base: 16 },
      ],
      purple: [
        { name: 'AK-47 | Safety Net', icon: '🔫', base: 60 },
        { name: 'M4A4 | Converter', icon: '🔫', base: 65 },
        { name: 'Desert Eagle | Code Red', icon: '🔫', base: 75 },
        { name: 'USP-S | Monster Mashup', icon: '🔫', base: 55 },
      ],
      pink: [
        { name: 'AK-47 | Phantom Disrup.', icon: '🔫', base: 200 },
        { name: 'M4A1-S | Decimator', icon: '🔫', base: 180 },
        { name: 'Glock-18 | Moonrise', icon: '🔫', base: 160 },
      ],
      red: [
        { name: 'AK-47 | The Empress', icon: '🔫', img: 'https://www.steamanalyst.com/_next/image?url=https%3A%2F%2Fcache.steamanalyst.com%2Fc8eb0c7226c7d12725ceea06bcdab26b152c542a.webp&w=1080&q=75', base: 600 },
        { name: 'M4A4 | Desolate Space', icon: '🔫', base: 550 },
      ],
      gold: [
        { name: "Karambit | Fade", icon: '🔪', base: 2800 },
        { name: 'M9 Bayonet | Doppler', icon: '🔪', base: 2200 },
        { name: 'Butterfly | Tiger Tooth', icon: '🔪', base: 3000 },
        { name: 'Stiletto | Crimson Web', icon: '🔪', base: 1800 },
        { name: 'Talon | Marble Fade', icon: '🔪', base: 2600 },
      ]
    }
  },
  {
    id: 'dreams', name: 'Dreams & Nightmares', icon: '🌙', price: 75,
    items: {
      blue: [
        { name: 'MAC-10 | Ensnared', icon: '🔫', base: 22 },
        { name: 'MP9 | Starlight Protector', icon: '🔫', base: 19 },
        { name: 'FAMAS | Rapid Eye Mvmt', icon: '🔫', base: 16 },
        { name: 'XM1014 | Zombie Offensive', icon: '🔫', base: 15 },
        { name: 'Sawed-Off | Spirit Board', icon: '🔫', base: 13 },
      ],
      purple: [
        { name: 'MP5-SD | Necro Jr.', icon: '🔫', base: 70 },
        { name: 'AUG | Plague', icon: '🔫', base: 80 },
        { name: 'P90 | Vent Rush', icon: '🔫', base: 65 },
        { name: 'USP-S | Ticket to Hell', icon: '🔫', base: 90 },
      ],
      pink: [
        { name: 'AWP | Chromatic Aberration', icon: '🔫', base: 220 },
        { name: 'MP7 | Abyssal Apparition', icon: '🔫', base: 195 },
        { name: 'AK-47 | Nightwish', icon: '🔫', base: 250 },
      ],
      red: [
        { name: 'M4A4 | In Living Color', icon: '🔫', base: 700 },
        { name: 'Glock-18 | Dreaming Aloud', icon: '🔫', base: 620 },
      ],
      gold: [
        { name: 'Skeleton | Fade', icon: '🔪', base: 3200 },
        { name: 'Navaja | Damascus Steel', icon: '🔪', base: 1600 },
        { name: 'Paracord | Crimson Web', icon: '🔪', base: 1900 },
        { name: 'Huntsman | Marble Fade', icon: '🔪', base: 2400 },
        { name: 'Falchion | Autotronic', icon: '🔪', base: 2100 },
      ]
    }
  },
  {
    id: 'recoil', name: 'Recoil Case', icon: '💥', price: 65,
    items: {
      blue: [
        { name: 'Nova | Toy Soldier', icon: '🔫', base: 15 },
        { name: 'P250 | Vortex', icon: '🔫', base: 18 },
        { name: 'Dual Berettas | Flora C.', icon: '🔫', base: 16 },
        { name: 'MP9 | Hydra', icon: '🔫', base: 14 },
        { name: 'XM1014 | Entombed', icon: '🔫', base: 12 },
      ],
      purple: [
        { name: 'AK-47 | Ice Coaled', icon: '🔫', base: 85 },
        { name: 'M4A1-S | Night Terror', icon: '🔫', base: 78 },
        { name: 'FAMAS | Eye of Athena', icon: '🔫', base: 60 },
        { name: 'AWP | Coral Viper', icon: '🔫', base: 100 },
      ],
      pink: [
        { name: 'M4A4 | Temukau', icon: '🔫', base: 280 },
        { name: 'AK-47 | Lightningpike', icon: '🔫', base: 240 },
        { name: 'Desert Eagle | Blue Etch', icon: '🔫', base: 210 },
      ],
      red: [
        { name: 'AK-47 | Calm', icon: '🔫', base: 800 },
        { name: 'M4A1-S | Noise Suppressor', icon: '🔫', base: 720 },
      ],
      gold: [
        { name: 'Bayonet | Lore', icon: '🔪', base: 2500 },
        { name: 'Flip Knife | Doppler', icon: '🔪', base: 1700 },
        { name: 'Gut Knife | Fade', icon: '🔪', base: 1500 },
        { name: 'Shadow Daggers | Slaughter', icon: '🔪', base: 1400 },
        { name: 'Bowie | Tiger Tooth', icon: '🔪', base: 1900 },
      ]
    }
  }
];
