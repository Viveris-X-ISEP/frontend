// ===========================================
// DESIGN TOKENS - Color Palette
// ===========================================

// Shared colors (same in both themes)
const sharedColors = {
  primary: "#4D996B", // Primary green (buttons, links)
  error: "#E82908", // Error/Cancel/Logout
  reward: "#DDC35C", // Reward/Achievement
};

// Light Theme Colors
export const lightColors = {
  ...sharedColors,
  text: "#000000", // Text/Icons/Active-Tab-Icon
  inputBackground: "#E8F2ED", // Input fields, secondary buttons, slider bg
  outline: "#CFE8D9", // Borders, outlines
  background: "#FFFFFF", // Screen background
};

// Dark Theme Colors
export const darkColors = {
  ...sharedColors,
  text: "#FFFFFF", // Text/Icons/Active-Tab-Icon
  inputBackground: "#3C4540", // Input fields, secondary buttons, slider bg
  outline: "#5B6B61", // Borders, outlines
  background: "#373737", // Screen background
};

// ===========================================
// DESIGN TOKENS - Typography
// ===========================================
export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 28,
};

// ===========================================
// DESIGN TOKENS - Icon Sizes
// ===========================================
export const iconSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 28,
};

// ===========================================
// DESIGN TOKENS - Spacing
// ===========================================
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

// ===========================================
// DESIGN TOKENS - Border Radius
// ===========================================
export const borderRadius = {
  sm: 8,
  md: 16,
  lg: 24,
  full: 9999,
};

export type ThemeColors = typeof lightColors;
