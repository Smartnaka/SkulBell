import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';

import TodayScreen from './screens/TodayScreen';
import AllLecturesScreen from './screens/AllLectureScreen';
import AddLectureScreen from './screens/AddLectureScreen';
import CalendarScreen from './screens/CalendarScreen';
import SettingsScreen from './screens/SettingsScreen';
import ReminderSettingsScreen from './screens/RemindersettingsScreen';
import RemindersListScreen from './screens/RemindersListScreen';

import { saveLectures, loadLectures } from './utils/Storage';
import { scheduleLectureNotification } from './utils/notifications';
import { colors, styles } from './styles/globalStyles';
import { ThemeProvider } from './context/ThemeContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function SettingsStack({ lectures, editLecture }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsMain" component={SettingsScreen} />
      <Stack.Screen name="RemindersList">
        {props => <RemindersListScreen {...props} lectures={lectures} editLecture={editLecture} />}
      </Stack.Screen>
      <Stack.Screen name="ReminderSettings">
        {props => <ReminderSettingsScreen {...props} editLecture={editLecture} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function AppNavigator() {
  const [lectures, setLectures] = useState([]);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    (async () => {
      // Request notification permissions on app start
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Enable notifications to get lecture reminders!');
      }
      const stored = await loadLectures();
      setLectures(stored || []);
    })();
  }, []);

  const addLecture = async (lecture) => {
    const newLectures = [...lectures, { ...lecture, id: Date.now().toString() }];
    setLectures(newLectures);
    await saveLectures(newLectures);
    await scheduleLectureNotification(lecture);
  };

  const editLecture = async (updatedLecture) => {
    const updatedLectures = lectures.map(l => l.id === updatedLecture.id ? updatedLecture : l);
    setLectures(updatedLectures);
    await saveLectures(updatedLectures);
    await scheduleLectureNotification(updatedLecture);
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          {
            paddingBottom: Math.max(insets.bottom, 12),
            height: 70 + Math.max(insets.bottom, 12),
          },
        ],
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen
        name="Today"
        children={() => <TodayScreen lectures={lectures} />}
        options={{
          tabBarIcon: ({ color, size }) => <MaterialIcons name="today" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="All"
        children={() => <AllLecturesScreen lectures={lectures} />}
        options={{
          tabBarIcon: ({ color, size }) => <MaterialIcons name="list-alt" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Add"
        children={() => <AddLectureScreen onAdd={addLecture} />}
        options={{
          tabBarIcon: ({ color, size }) => <MaterialIcons name="add-box" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Calendar"
        children={() => <CalendarScreen lectures={lectures} />}
        options={{
          tabBarIcon: ({ color, size }) => <MaterialIcons name="calendar-view-week" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        children={() => <SettingsStack lectures={lectures} editLecture={editLecture} />}
        options={{
          tabBarIcon: ({ color, size }) => <MaterialIcons name="settings" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Enable notifications to get lecture reminders!');
      }
    })();
  }, []);
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
