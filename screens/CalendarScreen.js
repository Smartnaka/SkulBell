// screens/CalendarScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const colors = {
  primary: '#1e3a8a',
  primaryLight: '#3b82f6',
  background: '#f8fafc',
  surface: '#ffffff',
  surfaceElevated: '#f1f5f9',
  text: '#0f172a',
  textSecondary: '#475569',
  textMuted: '#64748b',
  border: '#e2e8f0',
  success: '#065f46',
  warning: '#d97706',
  error: '#dc2626',
};

const CalendarScreen = ({ lectures }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Get current month and year
  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();
  
  // Get first day of the month and number of days in month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Generate calendar days
  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // Check if a day has lectures
  const getDayLectures = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    const dayName = daysOfWeek[date.getDay()];
    return lectures.filter(lecture => lecture.day === dayName);
  };

  // Navigate months
  const goToPreviousMonth = () => {
    setSelectedDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setSelectedDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  const renderCalendarDay = (day, index) => {
    if (day === null) {
      return <View key={index} style={styles.emptyDay} />;
    }

    const dayLectures = getDayLectures(day);
    const hasLectures = dayLectures.length > 0;
    const today = isToday(day);

    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.calendarDay,
          today && styles.todayDay,
          hasLectures && styles.dayWithLectures
        ]}
        onPress={() => {
          // You could implement day selection logic here
        }}
      >
        <Text style={[
          styles.dayText,
          today && styles.todayText,
          hasLectures && styles.dayWithLecturesText
        ]}>
          {day}
        </Text>
        {hasLectures && (
          <View style={styles.lectureIndicator}>
            <Text style={styles.lectureCount}>{dayLectures.length}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // Get lectures for selected day (for now, show today's lectures)
  const today = new Date();
  const todayName = daysOfWeek[today.getDay()];
  const todayLectures = lectures.filter(lecture => lecture.day === todayName);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calendar</Text>
        <Text style={styles.headerSubtitle}>Track your weekly schedule</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Month Navigation */}
        <View style={styles.monthNavigation}>
          <TouchableOpacity onPress={goToPreviousMonth} style={styles.navButton}>
            <MaterialIcons name="chevron-left" size={24} color={colors.primary} />
          </TouchableOpacity>
          
          <Text style={styles.monthTitle}>
            {monthNames[currentMonth]} {currentYear}
          </Text>
          
          <TouchableOpacity onPress={goToNextMonth} style={styles.navButton}>
            <MaterialIcons name="chevron-right" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Days of Week Header */}
        <View style={styles.weekHeader}>
          {daysOfWeek.map(day => (
            <Text key={day} style={styles.weekDayText}>
              {day.substring(0, 3)}
            </Text>
          ))}
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendarGrid}>
          {calendarDays.map((day, index) => renderCalendarDay(day, index))}
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <Text style={styles.legendTitle}>Legend</Text>
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <View style={[styles.legendIndicator, { backgroundColor: colors.primary }]} />
              <Text style={styles.legendText}>Today</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendIndicator, { backgroundColor: colors.success }]} />
              <Text style={styles.legendText}>Has Lectures</Text>
            </View>
          </View>
        </View>

        {/* Today's Lectures */}
        <View style={styles.todaySection}>
          <Text style={styles.sectionTitle}>Today's Lectures ({todayName})</Text>
          {todayLectures.length > 0 ? (
            todayLectures.map(lecture => (
              <View key={lecture.id} style={styles.lectureCard}>
                <View style={styles.lectureHeader}>
                  <Text style={styles.courseText}>{lecture.course}</Text>
                  <View style={styles.timeContainer}>
                    <MaterialIcons name="access-time" size={16} color="white" />
                    <Text style={styles.timeText}>{lecture.time}</Text>
                  </View>
                </View>
                <View style={styles.lectureDetails}>
                  <MaterialIcons name="location-on" size={16} color={colors.textMuted} />
                  <Text style={styles.locationText}>{lecture.location}</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.noLecturesContainer}>
              <MaterialIcons name="event-available" size={32} color={colors.textMuted} />
              <Text style={styles.noLecturesText}>No lectures scheduled for today</Text>
            </View>
          )}
        </View>

        {/* Weekly Overview */}
        <View style={styles.weeklyOverview}>
          <Text style={styles.sectionTitle}>Weekly Overview</Text>
          {daysOfWeek.map(day => {
            const dayLectures = lectures.filter(lecture => lecture.day === day);
            return (
              <View key={day} style={styles.weeklyDay}>
                <Text style={styles.weeklyDayName}>{day}</Text>
                <Text style={styles.weeklyDayCount}>
                  {dayLectures.length} lecture{dayLectures.length !== 1 ? 's' : ''}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
  },
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.surface,
    marginBottom: 1,
  },
  navButton: {
    padding: 8,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  weekHeader: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    paddingVertical: 12,
    marginBottom: 1,
  },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: colors.surface,
    marginBottom: 16,
  },
  emptyDay: {
    width: '14.28%',
    height: 50,
  },
  calendarDay: {
    width: '14.28%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: colors.border,
    position: 'relative',
  },
  todayDay: {
    backgroundColor: colors.primary,
  },
  dayWithLectures: {
    backgroundColor: colors.success,
  },
  dayText: {
    fontSize: 16,
    color: colors.text,
  },
  todayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  dayWithLecturesText: {
    color: 'white',
    fontWeight: '500',
  },
  lectureIndicator: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: colors.warning,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lectureCount: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  legend: {
    padding: 16,
    backgroundColor: colors.surface,
    marginBottom: 16,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  legendItems: {
    flexDirection: 'row',
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  todaySection: {
    padding: 16,
    backgroundColor: colors.surface,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  lectureCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  lectureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  courseText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    flex: 1,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  timeText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
    marginLeft: 4,
  },
  lectureDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: colors.textMuted,
    marginLeft: 4,
  },
  noLecturesContainer: {
    alignItems: 'center',
    padding: 20,
  },
  noLecturesText: {
    fontSize: 16,
    color: colors.textMuted,
    marginTop: 8,
    textAlign: 'center',
  },
  weeklyOverview: {
    padding: 16,
    backgroundColor: colors.surface,
    marginBottom: 16,
  },
  weeklyDay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  weeklyDayName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  weeklyDayCount: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});

export default CalendarScreen;