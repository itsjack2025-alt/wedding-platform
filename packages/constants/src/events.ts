export const EVENT_TYPE_LABELS: Record<string, string> = {
  reception: 'Reception',
  haldi: 'Haldi Ceremony',
  mehendi: 'Mehendi Ceremony',
  sangeet: 'Sangeet Night',
  wedding: 'Wedding Ceremony',
  ceremony: 'Ceremony',
  engagement: 'Engagement',
  'pre-wedding': 'Pre-Wedding',
  other: 'Event',
};

export const EVENT_TYPE_ICONS: Record<string, string> = {
  reception: '🍽️',
  haldi: '💛',
  mehendi: '🌿',
  sangeet: '🎵',
  wedding: '💍',
  ceremony: '🪔',
  engagement: '💍',
  'pre-wedding': '✨',
  other: '🎉',
};

export const VIDEO_TYPE_LABELS: Record<string, string> = {
  teaser: 'Wedding Teaser',
  full_film: 'Full Wedding Film',
  reel: 'Reels & Shorts',
  drone: 'Drone Footage',
  ceremony: 'Ceremony Film',
  sangeet: 'Sangeet Highlights',
  highlights: 'Highlights Reel',
  behind_scenes: 'Behind The Scenes',
};

export const AI_CATEGORY_LABELS: Record<string, string> = {
  portrait: 'Portrait',
  group: 'Group Photo',
  candid: 'Candid Moment',
  detail: 'Detail Shot',
  venue: 'Venue',
  decor: 'Decor',
  food: 'Food & Catering',
  other: 'Other',
};

export const REACTION_CONFIG = {
  thumbs_up: { label: 'Love it', emoji: '👍' },
  heart: { label: 'Heart', emoji: '❤️' },
  clapping: { label: 'Applause', emoji: '👏' },
  temple: { label: 'Blessings', emoji: '🙏' },
  fire: { label: 'Fire', emoji: '🔥' },
  ring: { label: 'Perfect', emoji: '💍' },
  couple: { label: 'Goals', emoji: '👫' },
} as const;
