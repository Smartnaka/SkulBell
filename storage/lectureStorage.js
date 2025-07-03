import AsyncStorage from '@react-native-async-storage/async-storage';

const LECTURES_KEY = 'lectures';

// Save lectures to AsyncStorage
export const saveLectures = async (lectures) => {
  try {
    const payload = {
      data: lectures,
      savedAt: Date.now()
    };
    await AsyncStorage.setItem(LECTURES_KEY, JSON.stringify(payload));
  } catch (error) {
    console.error('Failed to save lectures:', error);
  }
};

// Load lectures from AsyncStorage
export const loadLectures = async () => {
  try {
    const json = await AsyncStorage.getItem(LECTURES_KEY);
    if (json) {
      const parsed = JSON.parse(json);
      return parsed.data || [];
    }
    return [];
  } catch (error) {
    console.error('Failed to load lectures:', error);
    return [];
  }
};

// Optional: clear saved lectures
export const clearLectures = async () => {
  try {
    await AsyncStorage.removeItem(LECTURES_KEY);
  } catch (error) {
    console.error('Failed to clear lectures:', error);
  }
};
