import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import GradientBackground from '../components/GradientBackground';
import GlassCard from '../components/GlassCard';
import AnimatedFadeIn from '../components/AnimatedFadeIn';
import PressableScale from '../components/PressableScale';
import { SkeletonCard } from '../components/SkeletonCard';
import { COLORS, FONTS, GLASS, GOLD_GLOW, SPACING, ANIMATION } from '../../theme';
import { getPosts, addPost } from '../services/exchange';
import { useAuth } from '../context/AuthContext';

const CARD_GAP = SPACING.md;
const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SPACING.xl * 2 - CARD_GAP) / 2;

function formatTime(ms) {
  if (!ms) return '';
  const d = new Date(ms);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return d.toLocaleDateString();
}

function PostCard({ item, index }) {
  return (
    <AnimatedFadeIn delay={index != null ? index * ANIMATION.stagger : 0}>
      <GlassCard style={[styles.postCard, { width: CARD_WIDTH }]} accent>
        <Text style={styles.postType}>{item.type || 'sale'}</Text>
        <Text style={styles.postTitle} numberOfLines={2}>{item.title || 'No title'}</Text>
        <Text style={styles.postBody} numberOfLines={3}>{item.body || ''}</Text>
        <Text style={styles.postMeta}>{formatTime(item.timestamp)}</Text>
      </GlassCard>
    </AnimatedFadeIn>
  );
}

export default function ExchangeScreen() {
  const navigation = useNavigation();
  const { user, isAuthenticated, signOut } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [contact, setContact] = useState('');
  const [type, setType] = useState('sale');
  const [submitting, setSubmitting] = useState(false);

  const loadPosts = useCallback(async () => {
    setLoadError(false);
    try {
      const list = await getPosts(50);
      setPosts(list);
    } catch (e) {
      setPosts([]);
      setLoadError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPosts();
    }, [loadPosts])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadPosts();
  };

  const openPostModal = () => {
    if (!isAuthenticated) {
      navigation.navigate('Login');
      return;
    }
    setModalVisible(true);
    setTitle('');
    setBody('');
    setContact('');
    setType('sale');
  };

  const submitPost = async () => {
    if (!title.trim()) {
      Alert.alert('Title required', 'Please enter a title for your post.');
      return;
    }
    setSubmitting(true);
    const ok = await addPost({ title, body, type, contact });
    setSubmitting(false);
    if (ok) {
      setModalVisible(false);
      loadPosts();
    } else {
      Alert.alert('Error', 'Could not post. Check your connection and try again.');
    }
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.cardWrap}>
      <PostCard item={item} index={index} />
    </View>
  );

  return (
    <GradientBackground>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          {isAuthenticated ? (
            <>
              <Text style={styles.userText} numberOfLines={1}>Posting as {user?.email}</Text>
              <TouchableOpacity onPress={signOut} style={styles.signOutBtn}>
                <Text style={styles.signOutText}>Sign out</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.loginPrompt} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginPromptText}>Log in with @aggies.ncat.edu to post</Text>
            </TouchableOpacity>
          )}
        </View>
        <PressableScale onPress={openPostModal}>
          <View style={[styles.addBtn, GOLD_GLOW]}>
            <Text style={styles.addBtnText}>+ New post</Text>
          </View>
        </PressableScale>
        {loading ? (
          <View style={styles.skeletonWrap}>
            <SkeletonCard style={styles.skeletonCard} />
            <SkeletonCard style={styles.skeletonCard} />
            <SkeletonCard style={styles.skeletonCard} />
          </View>
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[COLORS.aggieGold]}
                tintColor={COLORS.aggieGold}
              />
            }
            ListEmptyComponent={
              loadError ? (
                <TouchableOpacity style={styles.retryWrap} onPress={loadPosts}>
                  <Text style={styles.retryText}>Couldn’t load posts. Tap to retry.</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.emptyText}>No posts yet. Be the first to post!</Text>
              )
            }
          />
        )}

        <Modal visible={modalVisible} animationType="slide" transparent>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalOverlay}
          >
            <ScrollView
              contentContainerStyle={styles.modalScroll}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.modalBox}>
                <Text style={styles.modalTitle}>New post</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Title (e.g. Intro to Engineering textbook $20)"
                  placeholderTextColor={COLORS.gray}
                  value={title}
                  onChangeText={setTitle}
                />
                <TextInput
                  style={[styles.input, styles.inputArea]}
                  placeholder="Description"
                  placeholderTextColor={COLORS.gray}
                  value={body}
                  onChangeText={setBody}
                  multiline
                  numberOfLines={3}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Contact (email or phone)"
                  placeholderTextColor={COLORS.gray}
                  value={contact}
                  onChangeText={setContact}
                  keyboardType="email-address"
                />
                <View style={styles.typeRow}>
                  {['sale', 'study group', 'other'].map((t) => (
                    <TouchableOpacity
                      key={t}
                      style={[styles.typeBtn, type === t && styles.typeBtnActive]}
                      onPress={() => setType(t)}
                    >
                      <Text style={[styles.typeBtnText, type === t && styles.typeBtnTextActive]}>{t}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.submitBtn, GOLD_GLOW]}
                    onPress={submitPost}
                    disabled={submitting}
                  >
                    <Text style={styles.submitBtnText}>{submitting ? 'Posting...' : 'Post'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  userText: { fontSize: FONTS.caption, color: COLORS.gray, flex: 1 },
  signOutBtn: { padding: 8 },
  signOutText: { fontSize: FONTS.caption, color: COLORS.aggieGold, fontWeight: '600' },
  loginPrompt: {},
  loginPromptText: { fontSize: FONTS.caption, color: COLORS.aggieGold },
  addBtn: {
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.aggieGold,
    padding: SPACING.lg,
    borderRadius: 24,
    alignItems: 'center',
  },
  addBtnText: { color: COLORS.gradientStart, fontWeight: '700', fontSize: FONTS.body },
  row: { justifyContent: 'space-between', paddingHorizontal: SPACING.xl, marginBottom: CARD_GAP },
  cardWrap: { width: CARD_WIDTH, marginBottom: 0 },
  listContent: { paddingHorizontal: SPACING.xl, paddingBottom: 40 },
  postCard: {
    padding: SPACING.lg,
    minHeight: 144,
  },
  postType: {
    fontSize: FONTS.overline,
    color: COLORS.aggieGold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.xs,
  },
  postTitle: { fontWeight: '600', fontSize: FONTS.body, color: COLORS.white, marginBottom: 6 },
  postBody: { fontSize: FONTS.caption, color: COLORS.gray, marginBottom: 8 },
  postMeta: { fontSize: 10, color: COLORS.gray },
  skeletonWrap: { padding: 20 },
  skeletonCard: { marginBottom: 12 },
  emptyText: { textAlign: 'center', color: COLORS.gray, marginTop: 40, paddingHorizontal: 20 },
  retryWrap: { padding: 24, alignItems: 'center' },
  retryText: { color: COLORS.aggieGold, fontSize: FONTS.body },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,26,51,0.9)',
    justifyContent: 'center',
  },
  modalScroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  modalBox: {
    backgroundColor: COLORS.gradientEnd,
    borderRadius: GLASS.borderRadius,
    padding: 24,
    borderWidth: 1,
    borderColor: GLASS.cardBorder,
  },
  modalTitle: { fontSize: FONTS.title, fontWeight: '700', color: COLORS.white, marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: GLASS.cardBorder,
    borderRadius: 12,
    padding: 14,
    fontSize: FONTS.body,
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    color: COLORS.white,
  },
  inputArea: { minHeight: 80, textAlignVertical: 'top' },
  typeRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  typeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  typeBtnActive: { backgroundColor: COLORS.aggieGold },
  typeBtnText: { fontSize: FONTS.caption, color: COLORS.gray },
  typeBtnTextActive: { color: COLORS.gradientStart, fontWeight: '600' },
  modalActions: { flexDirection: 'row', gap: 12, justifyContent: 'flex-end' },
  cancelBtn: { padding: 12 },
  cancelBtnText: { color: COLORS.gray, fontWeight: '600' },
  submitBtn: {
    backgroundColor: COLORS.aggieGold,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
  },
  submitBtnText: { color: COLORS.gradientStart, fontWeight: '700' },
});
