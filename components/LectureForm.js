import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  Modal,
  Pressable,
  TouchableOpacity,
  FlatList
} from 'react-native';

const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

export default function LectureForm({ onSubmit, initialValues = {}, submitLabel = 'Add Lecture' }) {
  const [course, setCourse] = useState(initialValues.course || '');
  const [day, setDay] = useState(initialValues.day || days[0]);
  const [time, setTime] = useState(initialValues.time || '');
  const [location, setLocation] = useState(initialValues.location || '');
  const [dayModalVisible, setDayModalVisible] = useState(false);

  useEffect(() => {
    setCourse(initialValues.course || '');
    setDay(initialValues.day || days[0]);
    setTime(initialValues.time || '');
    setLocation(initialValues.location || '');
  }, [initialValues]);

  const handleSubmit = () => {
    if (course && time && location) {
      onSubmit({ course, day, time, location });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Course</Text>
      <TextInput
        placeholder="e.g. CSC 201"
        value={course}
        onChangeText={setCourse}
        style={styles.input}
      />

      <Text style={styles.label}>Time</Text>
      <TextInput
        placeholder="HH:MM (24hr)"
        value={time}
        onChangeText={setTime}
        style={styles.input}
      />

      <Text style={styles.label}>Location</Text>
      <TextInput
        placeholder="e.g. Lecture Hall 2"
        value={location}
        onChangeText={setLocation}
        style={styles.input}
      />

      <Text style={styles.label}>Day</Text>
      <TouchableOpacity
        onPress={() => setDayModalVisible(true)}
        style={styles.daySelect}
      >
        <Text style={styles.dayText}>{day}</Text>
      </TouchableOpacity>

      <Modal visible={dayModalVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Select Day</Text>
            <FlatList
              data={days}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    setDay(item);
                    setDayModalVisible(false);
                  }}
                  style={styles.modalItem}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </Pressable>
              )}
            />
            <Pressable onPress={() => setDayModalVisible(false)} style={styles.modalClose}>
              <Text style={styles.modalCloseText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Button title={submitLabel} onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    marginBottom: 4,
    fontWeight: 'bold',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 16,
    borderRadius: 10,
    fontSize: 16,
  },
  daySelect: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 16,
  },
  dayText: {
    fontSize: 16,
    color: '#333',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalCard: {
    margin: 32,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalItemText: {
    fontSize: 16,
    textAlign: 'center',
  },
  modalClose: {
    marginTop: 10,
    alignItems: 'center',
  },
  modalCloseText: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
