// TestLectures.js - Add this to your utils folder for testing
import { saveLectures } from './Storage';

export const addTestLectures = async () => {
  // Get current day and time for realistic test data
  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Create lectures for the next few days to ensure we get reminders
  const testLectures = [
    {
      id: 'test-1',
      title: 'Data Structures',
      instructor: 'Dr. Smith',
      location: 'Room 101, CS Building',
      day: dayNames[(currentDay + 1) % 7], // Tomorrow
      startTime: '09:00',
      endTime: '10:30',
      description: 'Introduction to data structures and algorithms',
      color: '#4ECDC4',
      createdAt: new Date().toISOString()
    },
    {
      id: 'test-2',
      title: 'Machine Learning',
      instructor: 'Prof. Johnson',
      location: 'Lab 205, Engineering Building',
      day: dayNames[(currentDay + 2) % 7], // Day after tomorrow
      startTime: '14:00',
      endTime: '15:30',
      description: 'Introduction to ML algorithms and applications',
      color: '#FF6B6B',
      createdAt: new Date().toISOString()
    },
    {
      id: 'test-3',
      title: 'Database Systems',
      instructor: 'Dr. Wilson',
      location: 'Room 303, IT Building',
      day: dayNames[(currentDay + 3) % 7], // Three days from now
      startTime: '11:00',
      endTime: '12:30',
      description: 'Database design principles and SQL',
      color: '#45B7D1',
      createdAt: new Date().toISOString()
    }
  ];

  try {
    await saveLectures(testLectures);
    console.log('✅ Test lectures added successfully:', testLectures);
    return testLectures;
  } catch (error) {
    console.error('❌ Error adding test lectures:', error);
    throw error;
  }
};

// Function to clear all lectures (for testing)
export const clearAllLectures = async () => {
  try {
    await saveLectures([]);
    console.log('🗑️ All lectures cleared');
  } catch (error) {
    console.error('❌ Error clearing lectures:', error);
    throw error;
  }
};

// Debug function to check current lectures
export const debugLectures = async () => {
  const { loadLectures } = require('./Storage');
  try {
    const lectures = await loadLectures();
    console.log('📚 Current lectures in storage:', lectures);
    return lectures;
  } catch (error) {
    console.error('❌ Error loading lectures:', error);
    return [];
  }
};