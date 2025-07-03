import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, styles as globalStyles } from '../styles/globalStyles';
import { loadLectures, saveLectures } from '../utils/Storage';
import { useIsFocused } from '@react-navigation/native';
import LectureForm from '../components/LectureForm';

const LIGHT_BG = '#f8fafc';
const CARD_BG = '#fff';
const FAB_COLOR = '#1e3a8a';
const SHADOW = Platform.OS === 'ios'
  ? {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
    }
  : { elevation: 4 };

export default function RemindersListScreen({ navigation }) {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editLecture, setEditLecture] = useState(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      (async () => {
        setLoading(true);
        const loaded = await loadLectures();
        setLectures(loaded);
        setLoading(false);
      })();
    }
  }, [isFocused]);

  const getDaysString = (days, day) => {
    if (Array.isArray(days)) return days.join(', ');
    if (typeof day === 'string') return day;
    return '-';
  };

  // --- Edit Modal Logic ---
  const openEditModal = (lecture) => {
    // Normalize fields for LectureForm
    setEditLecture({
      course: lecture.title || '',
      time: lecture.time || lecture.startTime || '',
      day: lecture.day || (Array.isArray(lecture.days) ? lecture.days[0] : ''),
      location: lecture.location || '',
      id: lecture.id,
      // preserve any extra fields for merging on save
      ...lecture
    });
    setEditModalVisible(true);
  };
  const closeEditModal = () => {
    setEditLecture(null);
    setEditModalVisible(false);
  };
  const handleEditSubmit = (updated) => {
    // Merge updated fields with original lecture (preserve id and any extra fields)
    const newLecture = {
      ...editLecture,
      ...updated,
      // keep both time and startTime in sync
      time: updated.time,
      startTime: updated.time,
      course: updated.course,
      title: updated.course,
      day: updated.day,
      location: updated.location,
    };
    const updatedLectures = lectures.map(l => l.id === newLecture.id ? newLecture : l);
    setLectures(updatedLectures);
    saveLectures(updatedLectures);
    closeEditModal();
  };

  // --- UI ---
  return (
    <SafeAreaView style={[globalStyles.screenContainer, { backgroundColor: LIGHT_BG, flex: 1 }]}>  
      {/* Header */}
      <View style={[styles.header, SHADOW]}>  
        <TouchableOpacity
          onPress={() => {
            if (navigation.canGoBack && navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('SettingsMain');
            }
          }}
          style={styles.headerBack}
        >
          <MaterialIcons name="arrow-back" size={26} color={FAB_COLOR} />
        </TouchableOpacity>
        <MaterialIcons name="notifications-active" size={26} color={FAB_COLOR} style={{ marginRight: 8 }} />
        <Text style={styles.headerTitle}>Reminders</Text>
      </View>

      {/* Summary Card */}
      <View style={[styles.summaryCard, SHADOW]}>  
        <MaterialIcons name="analytics" size={28} color={FAB_COLOR} style={{ marginRight: 12 }} />
        <View>
          <Text style={styles.summaryTitle}>Summary</Text>
          <Text style={styles.summaryText}>
            {lectures.length} total lectures
          </Text>
        </View>
      </View>

      {/* Lectures List or Empty State */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : lectures.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="event-busy" size={64} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No Lectures</Text>
            <Text style={styles.emptySubtitle}>Add lectures from the All Lectures or Add tab.</Text>
          </View>
        ) : (
          <View style={styles.cardListWrapper}>
            {lectures.map((lecture, idx) => (
              <React.Fragment key={lecture.id}>
                <View style={[styles.card, SHADOW]}>  
                  <Text style={styles.cardTitle}>{lecture.title || lecture.course}</Text>
                  <View style={styles.cardDetailsBlock}>
                    <View style={styles.detailRowStacked}>
                      <MaterialIcons name="class" size={18} color={FAB_COLOR} style={styles.detailIcon} />
                      <Text style={styles.cardDetail}>{lecture.course}</Text>
                    </View>
                    <View style={styles.detailRowStacked}>
                      <MaterialIcons name="access-time" size={18} color={FAB_COLOR} style={styles.detailIcon} />
                      <Text style={styles.cardDetail}>{lecture.time || lecture.startTime || '-'}</Text>
                    </View>
                    <View style={styles.detailRowStacked}>
                      <MaterialIcons name="calendar-today" size={18} color={FAB_COLOR} style={styles.detailIcon} />
                      <Text style={styles.cardDetail}>{getDaysString(lecture.days, lecture.day)}</Text>
                    </View>
                    {lecture.location ? (
                      <View style={styles.detailRowStacked}>
                        <MaterialIcons name="location-on" size={18} color={FAB_COLOR} style={styles.detailIcon} />
                        <Text style={styles.cardDetail}>{lecture.location}</Text>
                      </View>
                    ) : null}
                    {lecture.professor ? (
                      <View style={styles.detailRowStacked}>
                        <MaterialIcons name="person" size={18} color={FAB_COLOR} style={styles.detailIcon} />
                        <Text style={styles.cardDetail}>{lecture.professor}</Text>
                      </View>
                    ) : null}
                  </View>
                  <View style={styles.cardActionsRow}>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => openEditModal(lecture)}
                    >
                      <MaterialIcons name="edit" size={20} color={FAB_COLOR} />
                      <Text style={styles.actionBtnText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => navigation.navigate('ReminderSettings', { lecture, editLecture })}
                    >
                      <MaterialIcons name="notifications" size={20} color={FAB_COLOR} />
                      <Text style={styles.actionBtnText}>Manage Reminders</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {idx < lectures.length - 1 && <View style={styles.cardDivider} />}
              </React.Fragment>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Edit Lecture Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeEditModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Lecture</Text>
            {editLecture && (
              <LectureForm
                onSubmit={handleEditSubmit}
                initialValues={editLecture}
                submitLabel="Save Changes"
              />
            )}
            <TouchableOpacity style={styles.modalCloseBtn} onPress={closeEditModal}>
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 18,
    paddingBottom: 12,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerBack: {
    marginRight: 8,
    padding: 4,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: FAB_COLOR,
    marginLeft: 6,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD_BG,
    borderRadius: 16,
    margin: 18,
    marginBottom: 8,
    padding: 18,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: FAB_COLOR,
  },
  summaryText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 40,
    color: colors.textMuted,
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textMuted,
    marginTop: 18,
  },
  emptySubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: 6,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  cardListWrapper: {
    flex: 1,
    marginTop: 8,
  },
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 18,
    marginBottom: 0,
    marginHorizontal: 0,
  },
  cardDivider: {
    height: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
    marginLeft: 2,
  },
  cardDetailsBlock: {
    marginBottom: 10,
    marginLeft: 2,
  },
  detailRowStacked: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailIcon: {
    marginRight: 8,
    opacity: 0.7,
  },
  cardDetail: {
    fontSize: 15,
    color: colors.textSecondary,
    marginRight: 10,
  },
  cardActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    gap: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginLeft: 0,
  },
  actionBtnText: {
    marginLeft: 6,
    fontSize: 14,
    color: FAB_COLOR,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    width: '92%',
    ...SHADOW,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: FAB_COLOR,
    marginBottom: 18,
    textAlign: 'center',
  },
  modalCloseBtn: {
    marginTop: 10,
    alignItems: 'center',
  },
  modalCloseText: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 16,
  },
});