// ReminderSettingsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  StyleSheet
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, styles } from '../styles/globalStyles';
import TimePicker from '../components/TimePicker';
import { loadLectures, saveLectures } from '../utils/Storage';
import { scheduleLectureNotification } from '../utils/notifications';

export default function ReminderSettingsScreen({ route, navigation, editLecture: propEditLecture }) {
  const { lecture, editLecture: navEditLecture } = route.params || {};
  const editLecture = propEditLecture || navEditLecture;
  
  const [reminderSettings, setReminderSettings] = useState({
    enabled: true,
    beforeLecture: {
      enabled: true,
      time: 15, // minutes before
      customTime: '15 minutes'
    },
    afterLecture: {
      enabled: true,
      reviewReminder: {
        enabled: true,
        time: 30, // minutes after
        customTime: '30 minutes'
      },
      homeworkReminder: {
        enabled: true,
        time: 2, // hours after
        customTime: '2 hours'
      },
      studyReminder: {
        enabled: true,
        time: 24, // hours after
        customTime: '1 day'
      }
    },
    notifications: {
      sound: true,
      vibration: true,
      showOnLockScreen: true
    }
  });

  useEffect(() => {
    // Load existing settings if present
    if (lecture.reminderSettings) {
      setReminderSettings(lecture.reminderSettings);
    }
  }, [lecture]);

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [currentEditingReminder, setCurrentEditingReminder] = useState(null);

  const timeOptions = [
    { label: '5 minutes', value: 5, type: 'minutes' },
    { label: '10 minutes', value: 10, type: 'minutes' },
    { label: '15 minutes', value: 15, type: 'minutes' },
    { label: '30 minutes', value: 30, type: 'minutes' },
    { label: '1 hour', value: 1, type: 'hours' },
    { label: '2 hours', value: 2, type: 'hours' },
    { label: '1 day', value: 24, type: 'hours' },
    { label: 'Custom', value: 'custom', type: 'custom' }
  ];

  const updateReminderSetting = (path, value) => {
    setReminderSettings(prev => {
      const newSettings = { ...prev };
      const keys = path.split('.');
      let current = newSettings;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  const handleSaveSettings = async () => {
    try {
      const updatedLecture = { ...lecture, reminderSettings };
      if (editLecture) {
        await editLecture(updatedLecture);
      } else {
        // fallback: update storage directly if editLecture is not available
        const lectures = await loadLectures();
        const updatedLectures = lectures.map(l =>
          l.id === lecture.id ? updatedLecture : l
        );
        await saveLectures(updatedLectures);
      }
      // Schedule notifications for all enabled reminders
      if (reminderSettings.enabled && reminderSettings.beforeLecture.enabled) {
        await scheduleLectureNotification({ ...updatedLecture, time: updatedLecture.time, day: updatedLecture.day });
      }
      Alert.alert(
        'Settings Saved',
        'Your reminder preferences have been saved successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (e) {
      Alert.alert('Error', 'Failed to save reminder settings.');
    }
  };

  const ReminderCard = ({ title, description, enabled, onToggle, children }) => (
    <View style={reminderStyles.card}>
      <View style={reminderStyles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={reminderStyles.cardTitle}>{title}</Text>
          {description && (
            <Text style={reminderStyles.cardDescription}>{description}</Text>
          )}
        </View>
        <Switch
          value={enabled}
          onValueChange={onToggle}
          trackColor={{ false: colors.border, true: `${colors.primary}50` }}
          thumbColor={enabled ? colors.primary : colors.textSecondary}
        />
      </View>
      {enabled && children}
    </View>
  );

  const TimeSelector = ({ options, selectedValue, onSelect }) => (
    <View style={reminderStyles.timeOptions}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            reminderStyles.timeOption,
            selectedValue === option.value && reminderStyles.timeOptionSelected
          ]}
          onPress={() => onSelect(option.value, option.label)}
        >
          <Text style={[
            reminderStyles.timeOptionText,
            selectedValue === option.value && reminderStyles.timeOptionTextSelected
          ]}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.screenContainer}>
      {/* Fixed Header with Back Button */}
      <View style={reminderStyles.headerContainer}>
        <TouchableOpacity
          style={reminderStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        
        <View style={reminderStyles.headerContent}>
          <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}20` }]}>
            <MaterialIcons name="notifications" size={28} color={colors.primary} />
          </View>
          <View style={reminderStyles.headerText}>
            <Text style={styles.simpleHeaderTitle}>Reminder Settings</Text>
            <Text style={styles.simpleHeaderSubtitle}>{lecture.title}</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Master Toggle */}
        <View style={reminderStyles.section}>
          <ReminderCard
            title="Enable Reminders"
            description="Turn on/off all reminders for this lecture"
            enabled={reminderSettings.enabled}
            onToggle={(value) => updateReminderSetting('enabled', value)}
          />
        </View>

        {reminderSettings.enabled && (
          <>
            {/* Before Lecture Reminders */}
            <View style={reminderStyles.section}>
              <Text style={reminderStyles.sectionTitle}>Before Lecture</Text>
              
              <ReminderCard
                title="Pre-Lecture Reminder"
                description="Get notified before the lecture starts"
                enabled={reminderSettings.beforeLecture.enabled}
                onToggle={(value) => updateReminderSetting('beforeLecture.enabled', value)}
              >
                <TimeSelector
                  options={timeOptions.filter(opt => opt.type === 'minutes')}
                  selectedValue={reminderSettings.beforeLecture.time}
                  onSelect={(value, label) => {
                    updateReminderSetting('beforeLecture.time', value);
                    updateReminderSetting('beforeLecture.customTime', label);
                  }}
                />
              </ReminderCard>
            </View>

            {/* After Lecture Reminders */}
            <View style={reminderStyles.section}>
              <Text style={reminderStyles.sectionTitle}>After Lecture</Text>
              
              <ReminderCard
                title="Review Reminder"
                description="Reminder to review lecture notes"
                enabled={reminderSettings.afterLecture.reviewReminder.enabled}
                onToggle={(value) => updateReminderSetting('afterLecture.reviewReminder.enabled', value)}
              >
                <TimeSelector
                  options={timeOptions.filter(opt => opt.type === 'minutes' || opt.type === 'hours')}
                  selectedValue={reminderSettings.afterLecture.reviewReminder.time}
                  onSelect={(value, label) => {
                    updateReminderSetting('afterLecture.reviewReminder.time', value);
                    updateReminderSetting('afterLecture.reviewReminder.customTime', label);
                  }}
                />
              </ReminderCard>

              <ReminderCard
                title="Homework Reminder"
                description="Reminder to complete assignments"
                enabled={reminderSettings.afterLecture.homeworkReminder.enabled}
                onToggle={(value) => updateReminderSetting('afterLecture.homeworkReminder.enabled', value)}
              >
                <TimeSelector
                  options={timeOptions.filter(opt => opt.type === 'hours')}
                  selectedValue={reminderSettings.afterLecture.homeworkReminder.time}
                  onSelect={(value, label) => {
                    updateReminderSetting('afterLecture.homeworkReminder.time', value);
                    updateReminderSetting('afterLecture.homeworkReminder.customTime', label);
                  }}
                />
              </ReminderCard>

              <ReminderCard
                title="Study Session Reminder"
                description="Reminder for focused study time"
                enabled={reminderSettings.afterLecture.studyReminder.enabled}
                onToggle={(value) => updateReminderSetting('afterLecture.studyReminder.enabled', value)}
              >
                <TimeSelector
                  options={timeOptions.filter(opt => opt.type === 'hours')}
                  selectedValue={reminderSettings.afterLecture.studyReminder.time}
                  onSelect={(value, label) => {
                    updateReminderSetting('afterLecture.studyReminder.time', value);
                    updateReminderSetting('afterLecture.studyReminder.customTime', label);
                  }}
                />
              </ReminderCard>
            </View>

            {/* Notification Settings */}
            <View style={reminderStyles.section}>
              <Text style={reminderStyles.sectionTitle}>Notification Settings</Text>
              
              <View style={reminderStyles.card}>
                <View style={reminderStyles.notificationRow}>
                  <MaterialIcons name="volume-up" size={24} color={colors.textSecondary} />
                  <Text style={reminderStyles.notificationLabel}>Sound</Text>
                  <Switch
                    value={reminderSettings.notifications.sound}
                    onValueChange={(value) => updateReminderSetting('notifications.sound', value)}
                    trackColor={{ false: colors.border, true: `${colors.primary}50` }}
                    thumbColor={reminderSettings.notifications.sound ? colors.primary : colors.textSecondary}
                  />
                </View>

                <View style={reminderStyles.notificationRow}>
                  <MaterialIcons name="vibration" size={24} color={colors.textSecondary} />
                  <Text style={reminderStyles.notificationLabel}>Vibration</Text>
                  <Switch
                    value={reminderSettings.notifications.vibration}
                    onValueChange={(value) => updateReminderSetting('notifications.vibration', value)}
                    trackColor={{ false: colors.border, true: `${colors.primary}50` }}
                    thumbColor={reminderSettings.notifications.vibration ? colors.primary : colors.textSecondary}
                  />
                </View>

                <View style={reminderStyles.notificationRow}>
                  <MaterialIcons name="lock-open" size={24} color={colors.textSecondary} />
                  <Text style={reminderStyles.notificationLabel}>Show on Lock Screen</Text>
                  <Switch
                    value={reminderSettings.notifications.showOnLockScreen}
                    onValueChange={(value) => updateReminderSetting('notifications.showOnLockScreen', value)}
                    trackColor={{ false: colors.border, true: `${colors.primary}50` }}
                    thumbColor={reminderSettings.notifications.showOnLockScreen ? colors.primary : colors.textSecondary}
                  />
                </View>
              </View>
            </View>
          </>
        )}

        {/* Save Button */}
        <View style={reminderStyles.saveButtonContainer}>
          <TouchableOpacity
            style={reminderStyles.saveButton}
            onPress={handleSaveSettings}
          >
            <MaterialIcons name="save" size={20} color="white" />
            <Text style={reminderStyles.saveButtonText}>Save Settings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const reminderStyles = StyleSheet.create({
  // New header styles for better back button positioning
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.surface || '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: colors.border || '#e0e0e0',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: colors.background || '#f5f5f5',
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
    marginLeft: 12,
  },
  
  // Existing styles
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  timeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timeOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timeOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  timeOptionTextSelected: {
    color: 'white',
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  notificationLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
    marginLeft: 12,
  },
  saveButtonContainer: {
    padding: 20,
    paddingTop: 0,
  },
  saveButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});