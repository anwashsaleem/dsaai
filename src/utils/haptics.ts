/**
 * Haptic feedback utility
 * Provides different vibration patterns for various actions
 */

export const haptics = {
  /**
   * Light tap feedback for simple interactions
   */
  light: () => {
    const enabled = localStorage.getItem('hapticsEnabled') !== 'false';
    if (enabled && navigator.vibrate) {
      navigator.vibrate(10);
    }
  },

  /**
   * Medium feedback for important actions
   */
  medium: () => {
    const enabled = localStorage.getItem('hapticsEnabled') !== 'false';
    if (enabled && navigator.vibrate) {
      navigator.vibrate(30);
    }
  },

  /**
   * Heavy feedback for significant actions
   */
  heavy: () => {
    const enabled = localStorage.getItem('hapticsEnabled') !== 'false';
    if (enabled && navigator.vibrate) {
      navigator.vibrate(50);
    }
  },

  /**
   * Success pattern for positive actions (login, account creation)
   */
  success: () => {
    const enabled = localStorage.getItem('hapticsEnabled') !== 'false';
    if (enabled && navigator.vibrate) {
      navigator.vibrate([30, 50, 30]);
    }
  },

  /**
   * Error pattern for negative actions
   */
  error: () => {
    const enabled = localStorage.getItem('hapticsEnabled') !== 'false';
    if (enabled && navigator.vibrate) {
      navigator.vibrate([50, 100, 50]);
    }
  },

  /**
   * Warning pattern for dangerous actions (logout, delete)
   */
  warning: () => {
    const enabled = localStorage.getItem('hapticsEnabled') !== 'false';
    if (enabled && navigator.vibrate) {
      navigator.vibrate([30, 30, 30, 30, 30]);
    }
  }
};
