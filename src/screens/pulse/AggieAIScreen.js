import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { COLORS, FONTS, SPACING } from '../../../theme';

const BULLDOG_HEAD = require('../../../assets/bulldog-head.png');

const MOCK_RESPONSES = {
  'registrar': 'The Registrar\'s Office is in the Dowdy Building. Hours: Monday–Friday 8am–5pm.',
  'gym': 'The gym (Student Recreation Center) hours are typically 6am–11pm on weekdays. Check the campus site for holiday hours.',
  'student union': 'The Student Union is in the center of campus, near the main plaza.',
  'library': 'Bluford Library. Hours typically 8am–10pm weekdays. Study rooms and research help available.',
  'financial aid': 'Financial Aid is in the Dowdy Building. Monday–Friday 8am–5pm. Bring your student ID.',
  'dining': 'Williams Dining Hall and Chick-fil-A. Check the Line Check in the app for wait times!',
  default: "I'm your Aggie Assistant! Ask about the Registrar, gym hours, library, dining, or campus traditions.",
};

function getMockReply(input) {
  const lower = (input || '').toLowerCase().trim();
  for (const [key, reply] of Object.entries(MOCK_RESPONSES)) {
    if (key !== 'default' && lower.includes(key)) return reply;
  }
  return MOCK_RESPONSES.default;
}

// NC A&T: Blue = AI (school), Gold = student; G.G. mascot for AI
function MessageBubble({ message, isUser }) {
  return (
    <View style={[styles.bubbleWrap, isUser && styles.bubbleWrapUser]}>
      {!isUser && (
        <Image source={BULLDOG_HEAD} style={styles.avatar} resizeMode="contain" />
      )}
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAI]}>
        <Text style={[styles.bubbleText, isUser && styles.bubbleUserText]}>{message}</Text>
      </View>
    </View>
  );
}

const QUICK_TAPS = [
  'Where is the Registrar?',
  'What are the Gym hours?',
  'Library hours?',
  'Dining options?',
];

export default function AggieAIScreen() {
  const [messages, setMessages] = useState([
    { id: '0', text: "Hi! I'm your Aggie Assistant. Ask me about campus buildings, office hours, or traditions.", isUser: false },
  ]);
  const [input, setInput] = useState('');
  const listRef = useRef(null);

  const send = (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed) return;
    setInput('');
    const userMsg = { id: Date.now().toString(), text: trimmed, isUser: true };
    const reply = getMockReply(trimmed);
    const aiMsg = { id: (Date.now() + 1).toString(), text: reply, isUser: false };
    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageBubble message={item.text} isUser={item.isUser} />}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={
          <>
            <Text style={styles.quickLabel}>Quick taps</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickScroll}>
              {QUICK_TAPS.map((q) => (
                <TouchableOpacity key={q} style={styles.quickTap} onPress={() => send(q)}>
                  <Text style={styles.quickTapText} numberOfLines={1}>{q}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={{ height: 16 }} />
          </>
        }
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Ask about campus..."
            placeholderTextColor={COLORS.gray}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => send()}
            returnKeyType="send"
          />
          <TouchableOpacity style={styles.sendBtn} onPress={() => send()} activeOpacity={0.9}>
            <Text style={styles.sendBtnText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.backgroundDark },
  listContent: { padding: SPACING.lg, paddingBottom: SPACING.sm },
  bubbleWrap: { marginBottom: SPACING.md, alignSelf: 'flex-start', maxWidth: '85%', flexDirection: 'row', alignItems: 'flex-end' },
  bubbleWrapUser: { alignSelf: 'flex-end', flexDirection: 'row-reverse' },
  avatar: { width: 32, height: 32, marginRight: 8, marginBottom: 4 },
  bubble: {
    padding: SPACING.md,
    borderRadius: 18,
    borderTopLeftRadius: 4,
  },
  bubbleAI: {
    backgroundColor: COLORS.aggieBlue,
  },
  bubbleUser: {
    backgroundColor: COLORS.aggieGold,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 4,
  },
  bubbleText: { fontSize: FONTS.body, color: COLORS.white },
  bubbleUserText: { color: COLORS.aggieBlue },
  quickLabel: {
    fontSize: FONTS.caption,
    color: COLORS.aggieGold,
    fontWeight: '600',
    marginBottom: 8,
  },
  quickScroll: { marginBottom: 8 },
  quickTap: {
    backgroundColor: COLORS.surfaceDark,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.aggieBlue,
  },
  quickTapText: { fontSize: 12, color: COLORS.grayLight, maxWidth: 160 },
  inputRow: {
    flexDirection: 'row',
    padding: SPACING.md,
    paddingBottom: SPACING.xl + 20,
    gap: SPACING.sm,
    backgroundColor: COLORS.backgroundDark,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.surfaceDark,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    borderRadius: 24,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    fontSize: FONTS.body,
    color: COLORS.grayLight,
  },
  sendBtn: {
    backgroundColor: COLORS.aggieBlue,
    paddingHorizontal: SPACING.xl,
    justifyContent: 'center',
    borderRadius: 24,
  },
  sendBtnText: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.body },
});
