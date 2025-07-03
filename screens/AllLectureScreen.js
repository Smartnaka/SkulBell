// screens/AllLecturesScreen.js
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
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

const AllLecturesScreen = ({ lectures = [] }) => { // Default to empty array
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDay, setSelectedDay] = useState('All');

  const days = ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Filter lectures based on search and selected day
  const filteredLectures = lectures.filter(lecture => {
    // Add null/undefined checks for lecture properties
    const courseMatch = lecture.course?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const locationMatch = lecture.location?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const instructorMatch = lecture.instructor?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const typeMatch = lecture.type?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const matchesSearch = courseMatch || locationMatch || instructorMatch || typeMatch;
    const matchesDay = selectedDay === 'All' || lecture.day === selectedDay;
    
    return matchesSearch && matchesDay;
  });

  // Group lectures by day
  const groupedLectures = {};
  filteredLectures.forEach(lecture => {
    if (!groupedLectures[lecture.day]) {
      groupedLectures[lecture.day] = [];
    }
    groupedLectures[lecture.day].push(lecture);
  });

  // Sort lectures within each day by time
  Object.keys(groupedLectures).forEach(day => {
    groupedLectures[day].sort((a, b) => {
      const timeA = new Date(`1970/01/01 ${a.time}`);
      const timeB = new Date(`1970/01/01 ${b.time}`);
      return timeA - timeB;
    });
  });

  const renderLectureItem = ({ item }) => (
    <View style={styles.lectureCard}>
      <View style={styles.lectureHeader}>
        <View style={styles.courseInfo}>
          <Text style={styles.courseText}>{item.course || 'Unknown Course'}</Text>
          {item.code && <Text style={styles.courseCode}>{item.code}</Text>}
          {item.type && (
            <View style={[styles.typeTag, { backgroundColor: getTypeColor(item.type) }]}>
              <Text style={styles.typeText}>{item.type}</Text>
            </View>
          )}
        </View>
        <View style={styles.timeContainer}>
          <MaterialIcons name="access-time" size={16} color="white" />
          <Text style={styles.timeText}>{item.time || 'TBA'}</Text>
        </View>
      </View>
      
      <View style={styles.lectureDetails}>
        <View style={styles.detailRow}>
          <MaterialIcons name="location-on" size={16} color={colors.textMuted} />
          <Text style={styles.detailText}>{item.location || 'Location TBA'}</Text>
        </View>
        
        {item.instructor && (
          <View style={styles.detailRow}>
            <MaterialIcons name="person" size={16} color={colors.textMuted} />
            <Text style={styles.detailText}>{item.instructor}</Text>
          </View>
        )}
        
        {item.duration && (
          <View style={styles.detailRow}>
            <MaterialIcons name="schedule" size={16} color={colors.textMuted} />
            <Text style={styles.detailText}>{item.duration}</Text>
          </View>
        )}
        
        {item.credits && (
          <View style={styles.detailRow}>
            <MaterialIcons name="star" size={16} color={colors.textMuted} />
            <Text style={styles.detailText}>{item.credits} credits</Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderDaySection = (day, lectures) => (
    <View key={day} style={styles.daySection}>
      <Text style={styles.dayHeader}>{day}</Text>
      {lectures.map(lecture => (
        <View key={lecture.id} style={styles.lectureCard}>
          <View style={styles.lectureHeader}>
            <View style={styles.courseInfo}>
              <Text style={styles.courseText}>{lecture.course || 'Unknown Course'}</Text>
              {lecture.code && <Text style={styles.courseCode}>{lecture.code}</Text>}
              {lecture.type && (
                <View style={[styles.typeTag, { backgroundColor: getTypeColor(lecture.type) }]}>
                  <Text style={styles.typeText}>{lecture.type}</Text>
                </View>
              )}
            </View>
            <View style={styles.timeContainer}>
              <MaterialIcons name="access-time" size={16} color="white" />
              <Text style={styles.timeText}>{lecture.time || 'TBA'}</Text>
            </View>
          </View>
          
          <View style={styles.lectureDetails}>
            <View style={styles.detailRow}>
              <MaterialIcons name="location-on" size={16} color={colors.textMuted} />
              <Text style={styles.detailText}>{lecture.location || 'Location TBA'}</Text>
            </View>
            
            {lecture.instructor && (
              <View style={styles.detailRow}>
                <MaterialIcons name="person" size={16} color={colors.textMuted} />
                <Text style={styles.detailText}>{lecture.instructor}</Text>
              </View>
            )}
            
            {lecture.duration && (
              <View style={styles.detailRow}>
                <MaterialIcons name="schedule" size={16} color={colors.textMuted} />
                <Text style={styles.detailText}>{lecture.duration}</Text>
              </View>
            )}
            
            {lecture.credits && (
              <View style={styles.detailRow}>
                <MaterialIcons name="star" size={16} color={colors.textMuted} />
                <Text style={styles.detailText}>{lecture.credits} credits</Text>
              </View>
            )}
          </View>
        </View>
      ))}
    </View>
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="school" size={64} color={colors.textMuted} />
      <Text style={styles.emptyTitle}>No lectures found</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery || selectedDay !== 'All' 
          ? 'Try adjusting your search or filter' 
          : 'Add your first lecture to get started'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Lectures</Text>
        <Text style={styles.headerSubtitle}>{lectures.length} total lectures</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color={colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search courses or locations..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.textMuted}
        />
      </View>

      {/* Day Filter */}
      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          data={days}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedDay === item && styles.filterButtonActive
              ]}
              onPress={() => setSelectedDay(item)}
            >
              <Text style={[
                styles.filterButtonText,
                selectedDay === item && styles.filterButtonTextActive
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
        />
      </View>

      {/* Lectures List */}
      <FlatList
        data={Object.keys(groupedLectures)}
        renderItem={({ item }) => renderDaySection(item, groupedLectures[item])}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={EmptyState}
        showsVerticalScrollIndicator={false}
      />
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    margin: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  filterContainer: {
    marginBottom: 8,
  },
  filterList: {
    paddingHorizontal: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: 'white',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100, // Account for tab bar
  },
  daySection: {
    marginBottom: 24,
  },
  dayHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    paddingLeft: 4,
  },
  lectureCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  lectureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  courseText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  timeText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
    marginLeft: 4,
  },
  lectureDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});

export default AllLecturesScreen;