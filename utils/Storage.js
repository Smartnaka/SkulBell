import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveLectures = async (lectures) => {
  try {
    await AsyncStorage.setItem('lectures', JSON.stringify(lectures));
  } catch (e) {
    console.log('Save error:', e);
  }
};

export const loadLectures = async () => {
  try {
    const json = await AsyncStorage.getItem('lectures');
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.log('Load error:', e);
    return [];
  }
};
