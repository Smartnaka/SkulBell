// AddLectureScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, styles }  from '../styles/globalStyles';
import TimePicker from '../components/TimePicker';

export default function AddLectureScreen({ onAdd, navigation }) {
  const [formData, setFormData] = useState({
    title: '',
    instructor: '',
    location: '',
    day: '',
    startTime: '',
    endTime: '',
    description: '',
    color: colors.primary
  });

  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const lectureColors = [
    colors.primary,
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#96CEB4',
    '#FFEAA7',
    '#DDA0DD',
    '#98D8C8'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTimeSelect = (time, isStartTime) => {
    if (isStartTime) {
      handleInputChange('startTime', time);
      setShowStartTimePicker(false);
    } else {
      handleInputChange('endTime', time);
      setShowEndTimePicker(false);
    }
  };

  const validateForm = () => {
    const { title, instructor, location, day, startTime, endTime } = formData;
    
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a lecture title');
      return false;
    }
    if (!instructor.trim()) {
      Alert.alert('Error', 'Please enter instructor name');
      return false;
    }
    if (!location.trim()) {
      Alert.alert('Error', 'Please enter location');
      return false;
    }
    if (!day) {
      Alert.alert('Error', 'Please select a day');
      return false;
    }
    if (!startTime) {
      Alert.alert('Error', 'Please select start time');
      return false;
    }
    if (!endTime) {
      Alert.alert('Error', 'Please select end time');
      return false;
    }

    // Check if end time is after start time
    const start = new Date(`2000-01-01 ${startTime}`);
    const end = new Date(`2000-01-01 ${endTime}`);
    if (end <= start) {
      Alert.alert('Error', 'End time must be after start time');
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    console.log('Form data before validation:', formData);
    
    if (validateForm()) {
      try {
        const newLecture = {
          ...formData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          isEnabled: true
        };
        
        console.log('New lecture object:', newLecture);
        console.log('onAdd function type:', typeof onAdd);
        
        // Call the onAdd function passed from parent
        if (onAdd && typeof onAdd === 'function') {
          onAdd(newLecture);
          
          // Show success message and navigate back
          Alert.alert('Success', 'Lecture added successfully!', [
            {
              text: 'OK',
              onPress: () => {
                // Reset form first
                resetForm();
                // Navigate back if navigation prop exists
                if (navigation && navigation.goBack) {
                  navigation.goBack();
                }
              }
            }
          ]);
        } else {
          console.error('onAdd is not a function:', onAdd);
          Alert.alert('Error', 'Unable to add lecture. Please try again.');
        }
      } catch (error) {
        console.error('Error adding lecture:', error);
        Alert.alert('Error', 'Failed to add lecture. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      instructor: '',
      location: '',
      day: '',
      startTime: '',
      endTime: '',
      description: '',
      color: colors.primary
    });
  };

  return (
    <SafeAreaView style={styles.screenContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Enhanced Header */}
        <View style={[styles.simpleHeader, { paddingBottom: 20 }]}>
          <View style={styles.headerTitleRow}>
            <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}20` }]}>
              <MaterialIcons name="add-box" size={28} color={colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.simpleHeaderTitle, { fontSize: 24, fontWeight: '700' }]}>
                Add New Lecture
              </Text>
              <Text style={[styles.simpleHeaderSubtitle, { marginTop: 4, fontSize: 16 }]}>
                Schedule a new course in your timetable
              </Text>
            </View>
          </View>
        </View>

        <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
          {/* Form Fields */}
          <View style={formStyles.formSection}>
            {/* Title */}
            <View style={formStyles.inputGroup}>
              <Text style={formStyles.label}>Lecture Title *</Text>
              <TextInput
                style={formStyles.input}
                value={formData.title}
                onChangeText={(text) => handleInputChange('title', text)}
                placeholder="e.g., Data Structures"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            {/* Instructor */}
            <View style={formStyles.inputGroup}>
              <Text style={formStyles.label}>Instructor *</Text>
              <TextInput
                style={formStyles.input}
                value={formData.instructor}
                onChangeText={(text) => handleInputChange('instructor', text)}
                placeholder="e.g., Dr. Smith"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            {/* Location */}
            <View style={formStyles.inputGroup}>
              <Text style={formStyles.label}>Location *</Text>
              <TextInput
                style={formStyles.input}
                value={formData.location}
                onChangeText={(text) => handleInputChange('location', text)}
                placeholder="e.g., Room 101, Building A"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            {/* Day Selection */}
            <View style={formStyles.inputGroup}>
              <Text style={formStyles.label}>Day *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={formStyles.dayContainer}>
                  {days.map((day) => (
                    <TouchableOpacity
                      key={day}
                      style={[
                        formStyles.dayButton,
                        formData.day === day && formStyles.dayButtonSelected
                      ]}
                      onPress={() => handleInputChange('day', day)}
                    >
                      <Text style={[
                        formStyles.dayButtonText,
                        formData.day === day && formStyles.dayButtonTextSelected
                      ]}>
                        {day.substring(0, 3)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Time Selection */}
            <View style={formStyles.timeRow}>
              <View style={[formStyles.inputGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={formStyles.label}>Start Time *</Text>
                <TouchableOpacity
                  style={[formStyles.input, formStyles.timeButton]}
                  onPress={() => setShowStartTimePicker(true)}
                >
                  <MaterialIcons name="access-time" size={20} color={colors.textSecondary} />
                  <Text style={[
                    formStyles.timeButtonText,
                    formData.startTime && { color: colors.textPrimary }
                  ]}>
                    {formData.startTime || 'Select time'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={[formStyles.inputGroup, { flex: 1, marginLeft: 10 }]}>
                <Text style={formStyles.label}>End Time *</Text>
                <TouchableOpacity
                  style={[formStyles.input, formStyles.timeButton]}
                  onPress={() => setShowEndTimePicker(true)}
                >
                  <MaterialIcons name="access-time" size={20} color={colors.textSecondary} />
                  <Text style={[
                    formStyles.timeButtonText,
                    formData.endTime && { color: colors.textPrimary }
                  ]}>
                    {formData.endTime || 'Select time'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Color Selection */}
            <View style={formStyles.inputGroup}>
              <Text style={formStyles.label}>Color Theme</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={formStyles.colorContainer}>
                  {lectureColors.map((color, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        formStyles.colorButton,
                        { backgroundColor: color },
                        formData.color === color && formStyles.colorButtonSelected
                      ]}
                      onPress={() => handleInputChange('color', color)}
                    >
                      {formData.color === color && (
                        <MaterialIcons name="check" size={20} color="white" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Description */}
            <View style={formStyles.inputGroup}>
              <Text style={formStyles.label}>Description (Optional)</Text>
              <TextInput
                style={[formStyles.input, formStyles.textArea]}
                value={formData.description}
                onChangeText={(text) => handleInputChange('description', text)}
                placeholder="Additional notes about this lecture..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Action Buttons */}
          <View style={formStyles.buttonContainer}>
            <TouchableOpacity
              style={[formStyles.button, formStyles.resetButton]}
              onPress={resetForm}
            >
              <MaterialIcons name="refresh" size={20} color={colors.textSecondary} />
              <Text style={formStyles.resetButtonText}>Reset</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[formStyles.button, formStyles.submitButton]}
              onPress={handleSubmit}
            >
              <MaterialIcons name="add" size={20} color="white" />
              <Text style={formStyles.submitButtonText}>Add Lecture</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Time Pickers */}
        {showStartTimePicker && (
          <TimePicker
            isVisible={showStartTimePicker}
            onTimeSelect={(time) => handleTimeSelect(time, true)}
            onCancel={() => setShowStartTimePicker(false)}
            title="Select Start Time"
          />
        )}

        {showEndTimePicker && (
          <TimePicker
            isVisible={showEndTimePicker}
            onTimeSelect={(time) => handleTimeSelect(time, false)}
            onCancel={() => setShowEndTimePicker(false)}
            title="Select End Time"
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Form Styles
const formStyles = {
  formSection: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: colors.background,
    color: colors.textPrimary,
  },
  textArea: {
    height: 80,
  },
  timeRow: {
    flexDirection: 'row',
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  timeButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: colors.textSecondary,
  },
  dayContainer: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  dayButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dayButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  dayButtonTextSelected: {
    color: 'white',
  },
  colorContainer: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorButtonSelected: {
    borderColor: colors.textPrimary,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 10,
    gap: 15,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  resetButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  submitButton: {
    backgroundColor: colors.primary,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
};