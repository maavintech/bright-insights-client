// Cosmetic tagline/emoji per known seeded category slug. Any category the
// admin creates later that isn't in this map still renders fine with the
// generic fallback below.
export const CATEGORY_META = {
  'personal-finance': { emoji: '💰', tagline: 'Smart Money' },
  parenting: { emoji: '👨‍👩‍👧', tagline: 'Bright Beginnings' },
  'lifestyle-hacks': { emoji: '✨', tagline: 'Life Upgraded' },
  'ai-basics': { emoji: '🤖', tagline: 'Demystifying AI' },
};

export function getCategoryMeta(slug) {
  return CATEGORY_META[slug] || { emoji: '📚', tagline: '' };
}
