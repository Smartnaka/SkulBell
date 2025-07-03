// components/TimePicker.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../styles/globalStyles';

const { width } = Dimensions.get('window');

export default function TimePicker({ isVisible, onTimeSelect, onCancel, title = "Select Time" }) {
  const [selectedHour, setSelectedHour] = useState(9);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState('AM');
  const [slideAnim] = useState(new Animated.Value(300));

  // Generate hours (1-12 for 12-hour format)
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  
  // Generate minutes (0, 15, 30, 45)
  const minutes = [0, 15, 30, 45];
  
  const periods = ['AM', 'PM'];

  useEffect(() => {
    if (isVisible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    } else {
      Animated.spring(slideAnim, {
        toValue: 300,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    }
  }, [isVisible]);

  const formatTime = (hour, minute, period) => {
    const formattedMinute = minute.toString().padStart(2, '0');
    return `${hour}:${formattedMinute} ${period}`;
  };

  const handleConfirm = () => {
    const formattedTime = formatTime(selectedHour, selectedMinute, selectedPeriod);
    onTimeSelect(formattedTime);
  };

  const renderScrollPicker = (data, selectedValue, onValueChange, label) => (
    <View style={pickerStyles.scrollContainer}>
      <Text style={pickerStyles.pickerLabel}>{label}</Text>
      <ScrollView
        style={pickerStyles.scrollPicker}
        showsVerticalScrollIndicator={false}
        snapToInterval={40}
        decelerationRate="fast"
      >
        {data.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              pickerStyles.pickerItem,
              selectedValue === item && pickerStyles.selectedPickerItem
            ]}
            onPress={() => onValueChange(item)}
          >
            <Text style={[
              pickerStyles.pickerItemText,
              selectedValue === item && pickerStyles.selectedPickerItemText
            ]}>
              {typeof item === 'number' && label === 'MIN' ? 
                item.toString().padStart(2, '0') : item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderQuickTimeButtons = () => {
    const quickTimes = [
      { label: '9:00 AM', hour: 9, minute: 0, period: 'AM' },
      { label: '10:00 AM', hour: 10, minute: 0, period: 'AM' },
      { label: '11:00 AM', hour: 11, minute: 0, period: 'AM' },
      { label: '1:00 PM', hour: 1, minute: 0, period: 'PM' },
      { label: '2:00 PM', hour: 2, minute: 0, period: 'PM' },
      { label: '3:00 PM', hour: 3, minute: 0, period: 'PM' },
    ];

    return (
      <View style={pickerStyles.quickTimeContainer}>
        <Text style={pickerStyles.quickTimeLabel}>Quick Select:</Text>
        <View style={pickerStyles.quickTimeButtons}>
          {quickTimes.map((time, index) => (
            <TouchableOpacity
              key={index}
              style={pickerStyles.quickTimeButton}
              onPress={() => {
                setSelectedHour(time.hour);
                setSelectedMinute(time.minute);
                setSelectedPeriod(time.period);
              }}
            >
              <Text style={pickerStyles.quickTimeButtonText}>{time.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={pickerStyles.overlay}>
        <TouchableOpacity
          style={pickerStyles.backdrop}
          activeOpacity={1}
          onPress={onCancel}
        />
        
        <Animated.View
          style={[
            pickerStyles.container,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          {/* Header */}
          <View style={pickerStyles.header}>
            <TouchableOpacity onPress={onCancel} style={pickerStyles.cancelButton}>
              <Text style={pickerStyles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            
            <Text style={pickerStyles.title}>{title}</Text>
            
            <TouchableOpacity onPress={handleConfirm} style={pickerStyles.confirmButton}>
              <Text style={pickerStyles.confirmText}>Done</Text>
            </TouchableOpacity>
          </View>

          {/* Current Selection Display */}
          <View style={pickerStyles.currentTimeContainer}>
            <MaterialIcons name="access-time" size={24} color={colors.primary} />
            <Text style={pickerStyles.currentTimeText}>
              {formatTime(selectedHour, selectedMinute, selectedPeriod)}
            </Text>
          </View>

          {/* Time Pickers */}
          <View style={pickerStyles.pickersContainer}>
            {renderScrollPicker(hours, selectedHour, setSelectedHour, 'HR')}
            <Text style={pickerStyles.separator}>:</Text>
            {renderScrollPicker(minutes, selectedMinute, setSelectedMinute, 'MIN')}
            {renderScrollPicker(periods, selectedPeriod, setSelectedPeriod, 'AM/PM')}
          </View>

          {/* Quick Time Selection */}
          {renderQuickTimeButtons()}
          
          {/* Action Buttons */}
          <View style={pickerStyles.buttonContainer}>
            <TouchableOpacity
              style={[pickerStyles.actionButton, pickerStyles.cancelActionButton]}
              onPress={onCancel}
            >
              <MaterialIcons name="close" size={20} color={colors.textSecondary} />
              <Text style={pickerStyles.cancelActionText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[pickerStyles.actionButton, pickerStyles.confirmActionButton]}
              onPress={handleConfirm}
            >
              <MaterialIcons name="check" size={20} color="white" />
              <Text style={pickerStyles.confirmActionText}>Select Time</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const pickerStyles = {
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  cancelButton: {
    padding: 5,
  },
  cancelText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  confirmButton: {
    padding: 5,
  },
  confirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  currentTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: `${colors.primary}10`,
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 12,
    gap: 10,
  },
  currentTimeText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  pickersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  scrollContainer: {
    alignItems: 'center',
    flex: 1,
  },
  pickerLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 10,
    textAlign: 'center',
  },
  scrollPicker: {
    height: 120,
    width: '100%',
  },
  pickerItem: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 2,
  },
  selectedPickerItem: {
    backgroundColor: colors.primary,
  },
  pickerItemText: {
    fontSize: 18,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  selectedPickerItemText: {
    color: 'white',
    fontWeight: '700',
  },
  separator: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textSecondary,
    marginHorizontal: 10,
    marginTop: 25,
  },
  quickTimeContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  quickTimeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 10,
  },
  quickTimeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickTimeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickTimeButtonText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  cancelActionButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  confirmActionButton: {
    backgroundColor: colors.primary,
  },
  confirmActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
};