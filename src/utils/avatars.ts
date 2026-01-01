/**
 * Centralized avatar configuration for the Dsaai app
 * 
 * Custom avatars are stored in /assets/avatars/ as 1.png through 10.png
 * Upload your PNG files to GitHub in that folder.
 */

// Import all custom avatar images
// Note: Replace these imports with actual image files once uploaded to GitHub
// The images should be named 1.png, 2.png, 3.png, etc. in /assets/avatars/

// For now, we'll use a dynamic approach that will work once images are uploaded
export const AVATAR_COUNT = 10;

// Generate avatar URLs - these will work once you upload the images to GitHub
// In a production environment with a build system, you'd import them directly
export const PREDEFINED_AVATARS = Array.from({ length: AVATAR_COUNT }, (_, i) => {
  const avatarNumber = i + 1;
  // This path will work once images are uploaded to the assets folder
  return `/assets/avatars/${avatarNumber}.png`;
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
  return PREDEFINED_AVATARS.includes(url);
}
