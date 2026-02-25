import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import GradientBackground from '../components/GradientBackground';
import { COLORS, FONTS, GLASS, GOLD_GLOW } from '../../theme';
import { useAuth } from '../context/AuthContext';
import { isFirebaseConfigured } from '../config/firebase';

const AGGIE_EMAIL_SUFFIX = '@aggies.ncat.edu';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { signIn, signUp, isDemoMode } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      Alert.alert('Email required', 'Enter your @aggies.ncat.edu email.');
      return;
    }
    if (!trimmed.endsWith(AGGIE_EMAIL_SUFFIX)) {
      Alert.alert('Invalid email', 'Please use your NCAT email (@aggies.ncat.edu).');
      return;
    }
    if (isFirebaseConfigured() && !password.trim()) {
      Alert.alert('Password required', 'Enter your password to sign in or create an account.');
      return;
    }

    setLoading(true);
    let result = await signIn(trimmed, password);
    if (result.error && isFirebaseConfigured()) {
      result = await signUp(trimmed, password);
    }
    setLoading(false);

    if (result.error) {
      Alert.alert('Login', result.error);
      return;
    }
    navigation.goBack();
  };

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <Text style={styles.instruction}>
          {isDemoMode
            ? 'Enter your @aggies.ncat.edu email to use the Exchange (demo mode).'
            : 'Sign in with your NCAT email to post on the Aggie Exchange.'}
        </Text>
        <TextInput
          style={styles.input}
          placeholder="you@aggies.ncat.edu"
          placeholderTextColor={COLORS.gray}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
        />
        {isFirebaseConfigured() && (
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={COLORS.gray}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />
        )}
        <TouchableOpacity
          style={[styles.button, GOLD_GLOW, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.9}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.gradientStart} />
          ) : (
            <Text style={styles.buttonText}>
              {isDemoMode ? 'Continue' : 'Sign in / Create account'}
            </Text>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  instruction: {
    fontSize: FONTS.body,
    color: COLORS.gray,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: GLASS.cardBorder,
    borderRadius: 14,
    padding: 16,
    fontSize: FONTS.subtitle,
    marginBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: COLORS.white,
  },
  button: {
    backgroundColor: COLORS.aggieGold,
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: COLORS.gradientStart, fontWeight: '700', fontSize: FONTS.subtitle },
});
