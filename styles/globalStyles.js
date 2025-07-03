import { StyleSheet, Platform, StatusBar } from 'react-native';

// Academic Color Palette - Professional and Educational
export const colors = {
  // Primary academic blues
  primary: '#1e3a8a',        // Deep academic blue
  primaryLight: '#3b82f6',   // Bright blue for accents
  primaryDark: '#1e40af',    // Darker blue for depth
  
  // Secondary scholarly greens
  secondary: '#047857',      // Deep forest green
  secondaryLight: '#10b981', // Emerald green for success
  accent: '#dc2626',         // Deep red for important items
  
  // Neutral academic tones
  background: '#f8fafc',     // Light gray-blue background
  surface: '#ffffff',        // Pure white for cards
  surfaceElevated: '#f1f5f9', // Slightly elevated surface
  
  // Text hierarchy
  text: '#0f172a',           // Dark slate for primary text
  textSecondary: '#475569',  // Medium slate for secondary text
  textMuted: '#64748b',      // Light slate for muted text
  textLight: '#94a3b8',      // Very light for subtle elements
  
  // Functional colors
  success: '#065f46',        // Dark green
  warning: '#d97706',        // Warm orange
  error: '#dc2626',          // Academic red
  info: '#0284c7',           // Info blue
  
  // Borders and dividers
  border: '#e2e8f0',         // Light border
  borderDark: '#cbd5e1',     // Darker border for emphasis
  
  // Academic status colors
  statusActive: '#059669',    // Active green
  statusPending: '#0891b2',   // Pending cyan
  statusCompleted: '#6b7280', // Completed gray
  statusUrgent: '#dc2626',    // Urgent red
};

export const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  
  simpleHeader: {
    paddingHorizontal: 24,
    paddingVertical: 28,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  simpleHeaderTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginLeft: 12,
    letterSpacing: -0.5,
  },
  simpleHeaderSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  
  // Enhanced Content Styles
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  
  // Redesigned Card Styles
  lectureCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    marginBottom: 16,
    padding: 20,
    shadowColor: colors.primary,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  todayCard: {
    borderLeftWidth: 5,
    borderLeftColor: colors.primaryLight,
    backgroundColor: `${colors.primaryLight}02`,
  },
  cardContent: {
    flex: 1,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  courseTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    letterSpacing: -0.3,
  },
  lectureDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 15,
    color: colors.textSecondary,
    marginLeft: 8,
    fontWeight: '500',
  },
  
  // Day Section Enhancements
  daySection: {
    marginBottom: 28,
  },
  dayHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingLeft: 4,
  },
  dayHeader: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.3,
  },
  dayBadge: {
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    minWidth: 28,
    alignItems: 'center',
  },
  dayBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Enhanced Calendar Styles
  calendarDayCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    marginBottom: 16,
    padding: 20,
    shadowColor: colors.primary,
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  calendarDayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dayTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarDayTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.3,
  },
  todayTitle: {
    color: colors.primaryLight,
  },
  todayDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primaryLight,
    marginLeft: 8,
  },
  lectureCount: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 28,
    alignItems: 'center',
  },
  lectureCountEmpty: {
    backgroundColor: colors.surfaceElevated,
  },
  lectureCountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  lectureCountTextEmpty: {
    color: colors.textMuted,
  },
  calendarLectureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  lastLectureItem: {
    borderBottomWidth: 0,
  },
  calendarTimeBox: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 16,
    minWidth: 85,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  calendarTime: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  calendarLectureInfo: {
    flex: 1,
  },
  calendarCourse: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  calendarLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarLocation: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
    fontWeight: '500',
  },
  calendarEmptyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  calendarEmptyDay: {
    fontSize: 14,
    color: colors.textLight,
    fontStyle: 'italic',
    marginLeft: 8,
  },
  
  // Enhanced Settings Styles
  settingsSection: {
    marginBottom: 32,
  },
  settingsSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    paddingLeft: 4,
    letterSpacing: -0.2,
  },
  settingsItem: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.primary,
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  settingsItemText: {
    flex: 1,
  },
  settingsItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 3,
    letterSpacing: -0.2,
  },
  settingsItemSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  
  // Enhanced Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: `${colors.primaryLight}10`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  
  // Enhanced Tab Bar
  tabBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
    paddingHorizontal: 8,
    shadowColor: colors.primary,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 8,
    elevation: 8,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
});