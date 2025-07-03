import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from '../styles/globalStyles';
import { useTheme } from '../context/ThemeContext';

export default function SettingsScreen({ navigation }) {
  const { colors, theme, setTheme } = useTheme();
  const [themeModalVisible, setThemeModalVisible] = useState(false);

  const handleReminderPress = () => {
    navigation.navigate('RemindersList');
  };

  const handleNotificationPress = () => {
    navigation.navigate('RemindersList');
  };

  const handleThemePress = () => {
    setThemeModalVisible(true);
  };

  const handleThemeSelect = (selectedTheme) => {
    setTheme(selectedTheme);
    setThemeModalVisible(false);
  };

  return (
    <SafeAreaView style={[styles.screenContainer, { backgroundColor: colors.background }]}> 
      <View style={[styles.simpleHeader, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}> 
        <View style={styles.headerTitleRow}>
          <MaterialIcons name="settings" size={24} color={colors.primary} />
          <Text style={[styles.simpleHeaderTitle, { color: colors.text }]}>Settings</Text>
        </View>
        <Text style={[styles.simpleHeaderSubtitle, { color: colors.textSecondary }]}>Customize your learning experience</Text>
      </View>
      
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.settingsSection}>
          <Text style={[styles.settingsSectionTitle, { color: colors.text }]}>📚 Academic Preferences</Text>
          
          <TouchableOpacity 
            style={styles.settingsItem}
            onPress={handleReminderPress}
          >
            <View style={styles.settingsItemLeft}>
              <View style={[styles.settingsIconContainer, { backgroundColor: `${colors.warning}15` }]}> 
                <MaterialIcons name="notifications-active" size={20} color={colors.warning} />
              </View>
              <View style={styles.settingsItemText}>
                <Text style={[styles.settingsItemTitle, { color: colors.text }]}>Class Reminders</Text>
                <Text style={[styles.settingsItemSubtitle, { color: colors.textSecondary }]}>Manage all your lecture reminders</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={colors.textMuted} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingsItem}
            onPress={handleNotificationPress}
          >
            <View style={styles.settingsItemLeft}>
              <View style={[styles.settingsIconContainer, { backgroundColor: `${colors.info}15` }]}> 
                <MaterialIcons name="schedule" size={20} color={colors.info} />
              </View>
              <View style={styles.settingsItemText}>
                <Text style={[styles.settingsItemTitle, { color: colors.text }]}>Study Schedule</Text>
                <Text style={[styles.settingsItemSubtitle, { color: colors.textSecondary }]}>Smart study time suggestions</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={styles.settingsSection}>
          <Text style={[styles.settingsSectionTitle, { color: colors.text }]}>🎨 Appearance</Text>
          <TouchableOpacity style={styles.settingsItem} onPress={handleThemePress}>
            <View style={styles.settingsItemLeft}>
              <View style={[styles.settingsIconContainer, { backgroundColor: `${colors.primaryLight}15` }]}> 
                <MaterialIcons name="palette" size={20} color={colors.primaryLight} />
              </View>
              <View style={styles.settingsItemText}>
                <Text style={[styles.settingsItemTitle, { color: colors.text }]}>Theme</Text>
                <Text style={[styles.settingsItemSubtitle, { color: colors.textSecondary }]}> 
                  {theme === 'light' ? 'Light' : theme === 'dark' ? 'Dark' : 'System Default'}
                </Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={colors.textMuted} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <View style={[styles.settingsIconContainer, { backgroundColor: `${colors.success}15` }]}> 
                <MaterialIcons name="text-fields" size={20} color={colors.success} />
              </View>
              <View style={styles.settingsItemText}>
                <Text style={[styles.settingsItemTitle, { color: colors.text }]}>Font Size</Text>
                <Text style={[styles.settingsItemSubtitle, { color: colors.textSecondary }]}>Standard</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={styles.settingsSection}>
          <Text style={[styles.settingsSectionTitle, { color: colors.text }]}>💾 Data Management</Text>
          <TouchableOpacity style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <View style={[styles.settingsIconContainer, { backgroundColor: `${colors.secondary}15` }]}> 
                <MaterialIcons name="cloud-upload" size={20} color={colors.secondary} />
              </View>
              <View style={styles.settingsItemText}>
                <Text style={[styles.settingsItemTitle, { color: colors.text }]}>Export Schedule</Text>
                <Text style={[styles.settingsItemSubtitle, { color: colors.textSecondary }]}>Save to calendar or PDF</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={colors.textMuted} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <View style={[styles.settingsIconContainer, { backgroundColor: `${colors.accent}15` }]}> 
                <MaterialIcons name="sync" size={20} color={colors.accent} />
              </View>
              <View style={styles.settingsItemText}>
                <Text style={[styles.settingsItemTitle, { color: colors.text }]}>Sync Data</Text>
                <Text style={[styles.settingsItemSubtitle, { color: colors.textSecondary }]}>Backup your lectures</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Theme selection modal */}
        <Modal
          visible={themeModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setThemeModalVisible(false)}
        >
          <View style={{ flex: 1, backgroundColor: '#0008', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: colors.surface, borderRadius: 16, padding: 24, width: 300 }}>
              <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: 16 }}>Choose Theme</Text>
              <TouchableOpacity onPress={() => handleThemeSelect('light')} style={{ paddingVertical: 12 }}>
                <Text style={{ color: theme === 'light' ? colors.primary : colors.text }}>Light</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleThemeSelect('dark')} style={{ paddingVertical: 12 }}>
                <Text style={{ color: theme === 'dark' ? colors.primary : colors.text }}>Dark</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleThemeSelect('system')} style={{ paddingVertical: 12 }}>
                <Text style={{ color: theme === 'system' ? colors.primary : colors.text }}>System Default</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setThemeModalVisible(false)} style={{ marginTop: 16 }}>
                <Text style={{ color: colors.textMuted, textAlign: 'right' }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView> 
    </SafeAreaView>
  );
}