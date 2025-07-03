import React from 'react';
import { StyleSheet, View, Text, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

function TodayScreen({ lectures = [] }) {
  const { colors } = useTheme();
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayLectures = lectures.filter(l => l.day === today);
  const currentTime = new Date();

  const getTimeStatus = (timeString) => {
    if (!timeString || typeof timeString !== 'string') {
      return { status: 'unknown', text: 'N/A', color: colors.statusCompleted };
    }
    try {
      const [time, period] = timeString.split(' ');
      if (!time || !period) {
        return { status: 'unknown', text: 'N/A', color: colors.statusCompleted };
      }
      const [hours, minutes] = time.split(':');
      if (!hours || minutes === undefined) {
        return { status: 'unknown', text: 'N/A', color: colors.statusCompleted };
      }
      let hour24 = parseInt(hours);
      if (period === 'PM' && hour24 !== 12) hour24 += 12;
      if (period === 'AM' && hour24 === 12) hour24 = 0;
      const lectureTime = new Date();
      lectureTime.setHours(hour24, parseInt(minutes), 0, 0);
      const diff = lectureTime - currentTime;
      const diffMinutes = Math.floor(diff / (1000 * 60));
      if (diffMinutes < 0) return { status: 'past', text: 'Completed', color: colors.statusCompleted };
      if (diffMinutes <= 15) return { status: 'soon', text: `${diffMinutes}m`, color: colors.statusUrgent };
      if (diffMinutes <= 60) return { status: 'upcoming', text: `${Math.floor(diffMinutes/60)}h ${diffMinutes%60}m`, color: colors.statusPending };
      return { status: 'later', text: 'Scheduled', color: colors.statusActive };
    } catch (error) {
      console.error('Error parsing time:', error);
      return { status: 'unknown', text: 'N/A', color: colors.statusCompleted };
    }
  };

  const formatTimeRange = (startTime, endTime) => {
    if (!startTime || !endTime) return 'Time TBD';
    return `${startTime} - ${endTime}`;
  };

  return (
    <SafeAreaView style={[styles.screenContainer, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.headerGradient}
      >
        <View style={styles.headerTop}>
          <MaterialIcons name="school" size={28} color="white" />
          <Text style={styles.headerDate}>{new Date().toLocaleDateString()}</Text>
        </View>
        <Text style={styles.headerTitle}>Today's Lectures</Text>
        <Text style={styles.headerSubtitle}>{today}</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{todayLectures.length}</Text>
            <Text style={styles.statLabel}>Lectures</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {todayLectures.filter(l => getTimeStatus(l.startTime).status !== 'past').length}
            </Text>
            <Text style={styles.statLabel}>Remaining</Text>
          </View>
        </View>
      </LinearGradient>
      
      <View style={styles.contentContainer}>
        {todayLectures.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconContainer, { backgroundColor: `${colors.primaryLight}10` }]}>
              <MaterialIcons name="today" size={48} color={colors.primaryLight} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No lectures scheduled</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>Take a well-deserved break today!</Text>
          </View>
        ) : (
          <FlatList
            data={todayLectures}
            keyExtractor={(item) => item.id || Math.random().toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const timeStatus = getTimeStatus(item.startTime);
              return (
                <TouchableOpacity style={[styles.lectureCard, styles.todayCard, { borderLeftColor: colors.primaryLight, backgroundColor: `${colors.primaryLight}02`, borderColor: colors.border, backgroundColor: colors.surface }]}>
                  <View style={styles.cardHeader}>
                    <View style={styles.courseInfo}>
                      <View style={styles.courseTitleRow}>
                        <Text style={[styles.courseTitle, { color: colors.text }]}>
                          {item.title || item.course || 'Untitled Lecture'}
                        </Text>
                        <View style={[styles.statusBadge, { backgroundColor: `${timeStatus.color}15` }]}>
                          <View style={[styles.statusDot, { backgroundColor: timeStatus.color }]} />
                          <Text style={[styles.statusText, { color: timeStatus.color }]}>
                            {timeStatus.text}
                          </Text>
                        </View>
                      </View>
                      
                      {/* Show instructor if available */}
                      {item.instructor && (
                        <View style={styles.instructorRow}>
                          <MaterialIcons name="person" size={16} color={colors.textSecondary} />
                          <Text style={[styles.instructorText, { color: colors.textSecondary }]}>{item.instructor}</Text>
                        </View>
                      )}
                      
                      <View style={styles.lectureDetails}>
                        <View style={styles.detailRow}>
                          <MaterialIcons name="access-time" size={16} color={colors.textSecondary} />
                          <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                            {formatTimeRange(item.startTime, item.endTime)}
                          </Text>
                        </View>
                        <View style={styles.detailRow}>
                          <MaterialIcons name="location-on" size={16} color={colors.textSecondary} />
                          <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                            {item.location || 'Location TBD'}
                          </Text>
                        </View>
                        
                        {/* Show description if available */}
                        {item.description && (
                          <View style={styles.detailRow}>
                            <MaterialIcons name="description" size={16} color={colors.textSecondary} />
                            <Text style={[styles.detailText, { color: colors.textSecondary }]} numberOfLines={2}>
                              {item.description}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                  
                  {/* Color indicator from lecture theme */}
                  {item.color && (
                    <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
                  )}
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  
  // Enhanced Header Styles
  headerGradient: {
    paddingHorizontal: 24,
    paddingVertical: 28,
    paddingBottom: 36,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerDate: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: 'white',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 20,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 20,
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
    position: 'relative',
  },
  todayCard: {
    borderLeftWidth: 5,
    borderLeftColor: colors.primaryLight,
    backgroundColor: `${colors.primaryLight}02`,
  },
  cardHeader: {
    marginBottom: 4,
  },
  courseInfo: {
    flex: 1,
  },
  courseTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  courseTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    letterSpacing: -0.3,
  },
  instructorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  instructorText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
    fontWeight: '600',
    fontStyle: 'italic',
  },
  lectureDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  detailText: {
    fontSize: 15,
    color: colors.textSecondary,
    marginLeft: 8,
    fontWeight: '500',
    flex: 1,
  },
  
  // Enhanced Status Badge
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Color indicator for lecture theme
  colorIndicator: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 12,
    height: 12,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
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
});

export default TodayScreen;