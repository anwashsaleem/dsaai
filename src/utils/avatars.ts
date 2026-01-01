/**
 * Centralized avatar configuration for the Dsaai app
 * 
 * Avatars are loaded directly from GitHub repository
 */

// Base URL for avatars from GitHub raw content
const GITHUB_AVATAR_BASE = 'https://raw.githubusercontent.com/anwashsaleem/dsaai/main/src/assets/avatars';

// Avatar configuration
export const AVATAR_COUNT = 10;

// Predefined avatars - loading from GitHub repository
export const PREDEFINED_AVATARS = Array.from({ length: AVATAR_COUNT }, (_, i) => {
  const avatarNumber = i + 1;
  return `${GITHUB_AVATAR_BASE}/${avatarNumber}.png`;
});

// Default avatar (will be avatar #1)
export const DEFAULT_AVATAR = PREDEFINED_AVATARS[0];

// Helper function to get a random avatar
export function getRandomAvatar(): string {
  const randomIndex = Math.floor(Math.random() * PREDEFINED_AVATARS.length);
  return PREDEFINED_AVATARS[randomIndex];
}

// Helper function to validate if a URL is one of our predefined avatars
export function isPredefinedAvatar(url: string): boolean {
  return PREDEFINED_AVATARS.some(avatar => url.includes(avatar) || avatar.includes(url));
}
