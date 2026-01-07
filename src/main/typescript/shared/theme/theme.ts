import {
  type ThemeColors,
  borderRadius,
  darkColors,
  fontSizes,
  lightColors,
  spacing,
} from "./variables";

// Theme builder function
const createTheme = (colors: ThemeColors) => ({
  colors,
  fontSizes,
  spacing,
  borderRadius,

  // Component-specific tokens
  input: {
    background: colors.inputBackground,
    text: colors.text,
    placeholder: `${colors.text}99`, // 60% opacity
    borderRadius: borderRadius.full,
    height: 56,
    paddingHorizontal: spacing.md,
  },

  button: {
    primary: {
      background: colors.primary,
      text: colors.text,
    },
    secondary: {
      background: colors.inputBackground,
      text: colors.text,
    },
    danger: {
      text: colors.error,
    },
  },
});

// Pre-built themes
export const lightTheme = createTheme(lightColors);
export const darkTheme = createTheme(darkColors);

// Default export (light)
export const theme = lightTheme;

export type Theme = typeof lightTheme;
