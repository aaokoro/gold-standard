import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import PressableScale from '../../components/PressableScale';
import { usePlanner } from '../../context/PlannerContext';
import { COLORS, FONTS, SPACING } from '../../../theme';

// Aggie Pride hand signal as completed checkmark (NC A&T)
const AGGIE_PRIDE_CHECK = '✊';

const PRIORITIES = [
  { key: 'high', label: 'High', color: COLORS.busyRed },
  { key: 'medium', label: 'Medium', color: COLORS.aggieGold },
  { key: 'low', label: 'Low', color: COLORS.busyGreen },
];

export default function PlannerScreen() {
  const { tasks, addTask: addTaskToContext, deleteTask, toggleCompleted } = usePlanner();
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');

  const addTask = () => {
    const trimmed = title.trim();
    if (!trimmed) {
      Alert.alert('Title required', 'Enter a task title.');
      return;
    }
    addTaskToContext({
      id: Date.now().toString(),
      title: trimmed,
      dueDate: dueDate.trim() || 'No date',
      priority,
      completed: false,
    });
    setTitle('');
    setDueDate('');
    setPriority('medium');
    setModalVisible(false);
  };

  const priorityColor = (p) => PRIORITIES.find((x) => x.key === p)?.color || COLORS.gray;

  return (
    <View style={styles.container}>
      <PressableScale onPress={() => setModalVisible(true)}>
        <View style={styles.addBtn}>
          <Text style={styles.addBtnIcon}>+</Text>
          <Text style={styles.addBtnText}>Add task</Text>
        </View>
      </PressableScale>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>—</Text>
              <Text style={styles.emptyText}>No tasks yet. Tap "Add task" to create a focus schedule.</Text>
            </View>
          }
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            <View style={[styles.priorityBar, { backgroundColor: priorityColor(item.priority) }]} />
            <TouchableOpacity
              style={styles.taskRow}
              onPress={() => toggleCompleted(item.id)}
              activeOpacity={0.7}
            >
              <View style={styles.checkWrap}>
                {item.completed ? (
                  <Text style={styles.aggieCheck}>{AGGIE_PRIDE_CHECK}</Text>
                ) : (
                  <View style={styles.checkEmpty} />
                )}
              </View>
              <View style={styles.taskMain}>
                <Text style={[styles.taskTitle, item.completed && styles.taskTitleDone]}>{item.title}</Text>
                <Text style={styles.taskDue}>Due: {item.dueDate}</Text>
              </View>
              <TouchableOpacity
                onPress={(e) => { e.stopPropagation(); deleteTask(item.id); }}
                style={styles.deleteBtn}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.deleteBtnText}>×</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        )}
      />

        <Modal visible={modalVisible} animationType="slide" transparent>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalOverlay}
          >
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>New task</Text>
              <TextInput
                style={styles.input}
                placeholder="Assignment or task title"
                placeholderTextColor={COLORS.gray}
                value={title}
                onChangeText={setTitle}
              />
              <TextInput
                style={styles.input}
                placeholder="Due date (e.g. Mar 15)"
                placeholderTextColor={COLORS.gray}
                value={dueDate}
                onChangeText={setDueDate}
              />
              <View style={styles.priorityRow}>
                {PRIORITIES.map((p) => (
                  <TouchableOpacity
                    key={p.key}
                    style={[styles.priorityBtn, priority === p.key && { backgroundColor: p.color }]}
                    onPress={() => setPriority(p.key)}
                  >
                    <Text style={[styles.priorityBtnText, priority === p.key && styles.priorityBtnTextActive]}>
                      {p.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.modalActions}>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelBtn}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <PressableScale onPress={addTask}>
                  <View style={styles.submitBtn}>
                    <Text style={styles.submitBtnText}>Add</Text>
                  </View>
                </PressableScale>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.backgroundDark },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.aggieGold,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    borderRadius: 15,
  },
  addBtnIcon: { fontSize: 22, marginRight: SPACING.sm, color: COLORS.aggieBlue, fontWeight: '700' },
  addBtnText: { fontSize: FONTS.subtitle, fontWeight: '700', color: COLORS.aggieBlue },
  listContent: { paddingHorizontal: SPACING.xl, paddingBottom: 40 },
  empty: { alignItems: 'center', paddingVertical: 48 },
  emptyIcon: { fontSize: 32, color: COLORS.aggieBlue, marginBottom: SPACING.sm },
  emptyText: { fontSize: FONTS.body, color: COLORS.gray, textAlign: 'center', paddingHorizontal: SPACING.xl },
  taskCard: {
    marginBottom: SPACING.md,
    padding: SPACING.lg,
    paddingLeft: SPACING.lg + 6,
    backgroundColor: COLORS.surfaceDark,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  priorityBar: {
    position: 'absolute',
    left: 0,
    top: 12,
    bottom: 12,
    width: 4,
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
  },
  taskRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  checkWrap: { width: 32, alignItems: 'center', justifyContent: 'center', marginRight: SPACING.sm },
  aggieCheck: { fontSize: 22 },
  checkEmpty: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.aggieBlue,
  },
  taskMain: { flex: 1 },
  taskTitle: { fontSize: FONTS.subtitle, fontWeight: '600', color: COLORS.grayLight, marginBottom: 2 },
  taskTitleDone: { textDecorationLine: 'line-through', opacity: 0.7 },
  taskDue: { fontSize: FONTS.caption, color: COLORS.gray },
  deleteBtn: { padding: SPACING.sm },
  deleteBtnText: { color: COLORS.gray, fontSize: 18 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: COLORS.backgroundDark,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: SPACING.xl,
    borderTopWidth: 1,
    borderColor: COLORS.borderDark,
  },
  modalTitle: { fontSize: FONTS.title, fontWeight: '700', color: COLORS.aggieGold, marginBottom: SPACING.lg },
  input: {
    backgroundColor: COLORS.surfaceDark,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    borderRadius: 12,
    padding: SPACING.md,
    fontSize: FONTS.body,
    color: COLORS.grayLight,
    marginBottom: SPACING.md,
  },
  priorityRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.xl },
  priorityBtn: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceDark,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    alignItems: 'center',
  },
  priorityBtnText: { fontSize: FONTS.caption, color: COLORS.gray },
  priorityBtnTextActive: { color: COLORS.aggieGold, fontWeight: '600' },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: SPACING.md },
  cancelBtn: { paddingVertical: SPACING.md },
  cancelBtnText: { color: COLORS.gray, fontWeight: '600' },
  submitBtn: {
    backgroundColor: COLORS.aggieGold,
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.md,
    borderRadius: 14,
  },
  submitBtnText: { color: COLORS.aggieBlue, fontWeight: '700' },
});
