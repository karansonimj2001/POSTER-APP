export const Colors = {
  background: '#0D0D1A',
  cardBackground: '#13132B',
  inputSurface: '#1A1A35',

  primaryAccent: '#7B2FFF',
  secondaryAccent: '#A855F7',
  selectionTint: '#2E1F6E',

  highlightUrgent: '#F59E0B',

  textPrimary: '#F5F5FF',
  textSecondary: '#8888AA',
  textDisabled: '#4A4A6A',

  successGreen: '#22C55E',
  dangerRed: '#EF4444',

  overlay: 'rgba(13, 13, 26, 0.85)',
  primaryAccentFaded: 'rgba(123, 47, 255, 0.15)',
  successFaded: 'rgba(34, 197, 94, 0.15)',
  dangerFaded: 'rgba(239, 68, 68, 0.15)',
} as const

export const Typography = {
  fontSizeXs: 11,
  fontSizeSm: 13,
  fontSizeMd: 15,
  fontSizeLg: 18,
  fontSizeXl: 22,
  fontSize2xl: 28,
  fontSize3xl: 36,

  fontWeightLight: '300' as const,
  fontWeightRegular: '400' as const,
  fontWeightMedium: '500' as const,
  fontWeightSemiBold: '600' as const,
  fontWeightBold: '700' as const,
  fontWeightExtraBold: '800' as const,

  lineHeightTight: 1.2,
  lineHeightNormal: 1.5,
  lineHeightRelaxed: 1.75,
}

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
}

export const Radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
}

export const Shadows = {
  card: {
    shadowColor: Colors.primaryAccent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  subtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
}

export const Gradients = {
  primaryAccent: [Colors.primaryAccent, Colors.secondaryAccent],
  backgroundDeep: [Colors.background, Colors.cardBackground],
  urgentGold: [Colors.highlightUrgent, '#D97706'],
  successGreen: [Colors.successGreen, '#16A34A'],
  dangerRed: [Colors.dangerRed, '#B91C1C'],
}

const Theme = {
  Colors,
  Typography,
  Spacing,
  Radius,
  Shadows,
  Gradients,
}

export default Theme
