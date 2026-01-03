# Custom Avatar Setup Instructions

## Overview
Your Dsaai app is now configured to use custom avatar images instead of the Dicebear API. This guide will help you complete the setup.

## What's Been Done
✅ Created `/assets/avatars/` folder structure
✅ Created `/utils/avatars.ts` with centralized avatar configuration
✅ Updated `EditProfileScreen.tsx` to display all 10 custom avatars
✅ Updated `AuthModal.tsx` to use the first custom avatar as default for new signups
✅ All avatar logic is centralized and easy to maintain

## What You Need to Do

### Step 1: Upload Your Avatar Images to GitHub

1. Go to your GitHub repository
2. Navigate to the `/assets/avatars/` folder
3. Upload your 10 PNG avatar images with these **exact** names:
   - `1.png`
   - `2.png`
   - `3.png`
   - `4.png`
   - `5.png`
   - `6.png`
   - `7.png`
   - `8.png`
   - `9.png`
   - `10.png`

**Important:** The file names MUST match exactly (including lowercase and the `.png` extension).

### Step 2: Verify the Setup

Once you've uploaded the images:
1. Open your app
2. Go to Settings → Edit Profile
3. You should see all 10 avatars displayed in a grid
4. Click on any avatar to select it
5. Click "Save" to update your profile

### Step 3: Test New User Signup

1. Sign out or use an incognito window
2. Create a new account
3. The new user should automatically get avatar `1.png` as their default
4. They can then change it in Edit Profile

## How It Works

### Avatar Configuration (`/utils/avatars.ts`)
- **PREDEFINED_AVATARS**: Array of all 10 avatar paths
- **DEFAULT_AVATAR**: The first avatar (1.png) used for new signups
- **Helper functions**: For getting random avatars and validation

### Image Paths
All avatars are referenced as: `/assets/avatars/{number}.png`

Example:
```typescript
'/assets/avatars/1.png'
'/assets/avatars/2.png'
// ... etc
```

### Where Avatars Are Used
1. **EditProfileScreen**: Shows all 10 avatars in a 5×2 grid for selection
2. **AuthModal**: Assigns `1.png` to new users by default
3. **ProfileScreen**: Displays the user's selected avatar
4. **TopBar**: Shows the user's avatar in the navigation
5. **Leaderboard**: Shows avatars next to usernames

## Image Specifications

### Recommended Specs:
- **Format**: PNG (with transparency recommended)
- **Size**: 256×256 pixels or 512×512 pixels
- **File Size**: Keep under 100KB each for fast loading
- **Style**: Consistent art style across all avatars
- **Background**: Transparent or solid color

### Display Contexts:
Your avatars will be shown at various sizes:
- **Large**: 80px - 120px (Profile screen)
- **Medium**: 40px - 60px (Edit profile grid)
- **Small**: 32px - 40px (TopBar, Leaderboard)

## Customization Options

### Add More Avatars
To add more than 10 avatars:

1. Add more PNG files (11.png, 12.png, etc.) to `/assets/avatars/`
2. Update `/utils/avatars.ts`:
   ```typescript
   export const AVATAR_COUNT = 15; // or however many you have
   ```

### Change Default Avatar
To use a different avatar as default for new users, edit `/utils/avatars.ts`:
```typescript
export const DEFAULT_AVATAR = PREDEFINED_AVATARS[4]; // Use 5.png as default
```

### Grid Layout
The avatars display in a 5-column grid. To change this, edit `/components/EditProfileScreen.tsx`:
```typescript
<div className="grid grid-cols-5 gap-3 mb-4">  // Change grid-cols-5 to grid-cols-3 for 3 columns
```

## Troubleshooting

### Avatars Not Showing
1. ✅ Check file names are exactly `1.png`, `2.png`, etc. (lowercase, no spaces)
2. ✅ Verify files are in `/assets/avatars/` folder
3. ✅ Make sure files are PNG format
4. ✅ Check browser console for 404 errors

### Wrong Avatar Displayed
1. Clear browser cache
2. Check the `avatar_url` in user profile matches one of the predefined paths
3. Verify the fallback is working (shows `1.png` if avatar fails to load)

### Performance Issues
1. Optimize PNG files (use tools like TinyPNG)
2. Consider using WebP format for better compression
3. Ensure all images are under 100KB

## Future Enhancements

### Possible Improvements:
- Add avatar categories (animals, people, abstract, etc.)
- Implement avatar search/filter
- Add user-uploaded custom avatars
- Create avatar customization options
- Add seasonal/themed avatar sets

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify all file paths are correct
3. Test with different browsers
4. Check that images load directly at `/assets/avatars/1.png`

---

**Ready to go!** Upload your 10 avatar images (1.png through 10.png) to the `/assets/avatars/` folder in your GitHub repository, and your custom avatars will be live! 🎨
