export type TimePeriod = 
  | 'ancient'
  | 'medieval' 
  | 'renaissance'
  | 'victorian'
  | 'modern'
  | 'futuristic'
  | 'steampunk'
  | 'cyberpunk';

export type MagicLevel = 0 | 1 | 2 | 3 | 4 | 5;

export interface StorySettings {
  timePeriod: TimePeriod;
  magicLevel: MagicLevel;
}

// Creative unconventional emotion names for the "spicy meter"
export const CREATIVE_EMOTIONS = [
  "Vanilla Bean", // Neutral
  "Sunshine Burst", // Happy
  "Midnight Rain", // Sad  
  "Dragon's Breath", // Angry
  "Butterfly Wings", // Anxious
  "Lightning Strike", // Excited
  "Cat's Curiosity", // Intrigued
  "Silver Tongue", // Sarcastic
  "Autumn Leaves", // Whispering
  "Thunder Clap", // Shouting
  "Shadow Whisper", // Fearful
  "Pixie Dust", // Amused
  "Stone Cold", // Serious
  "Carnival Chaos", // Playful
  "Velvet Dreams", // New: Dreamy/Ethereal
  "Poison Ivy", // New: Sinister
  "Honey Drip", // New: Sweet/Alluring
  "Electric Storm", // New: Intense/Energetic
];

export const TIME_PERIOD_OPTIONS = [
  { value: 'ancient', label: 'Ancient Times', description: 'Epic tales of gods and heroes' },
  { value: 'medieval', label: 'Medieval Era', description: 'Knights, castles, and chivalry' },
  { value: 'renaissance', label: 'Renaissance', description: 'Art, science, and discovery' },
  { value: 'victorian', label: 'Victorian Age', description: 'Industrial revolution elegance' },
  { value: 'modern', label: 'Modern Day', description: 'Contemporary setting' },
  { value: 'futuristic', label: 'Far Future', description: 'Space age technology' },
  { value: 'steampunk', label: 'Steampunk', description: 'Victorian tech meets fantasy' },
  { value: 'cyberpunk', label: 'Cyberpunk', description: 'High tech, low life' },
] as const;

export const MAGIC_LEVEL_DESCRIPTIONS = [
  'Mundane Reality',
  'Subtle Hints',
  'Magical Realism', 
  'Fantasy Elements',
  'High Fantasy',
  'Pure Magic'
] as const;