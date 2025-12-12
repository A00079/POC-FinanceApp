import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import dummyCredentials from '../../data/dummyCredentials.json';

const LoginScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handleSendOTP = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }

    // Check if phone number exists in dummy data
    const user = dummyCredentials.users.find(u => u.phone === phoneNumber);
    if (!user) {
      Alert.alert('Error', 'Phone number not registered. Please use: 9876543210 or 8765432109');
      return;
    }

    setIsLoading(true);
    dispatch(loginStart());

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate('OTP', { phoneNumber, user });
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>
            Enter your phone number to continue
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="Enter your 10-digit phone number"
            keyboardType="phone-pad"
            maxLength={10}
          />

          <Button
            title="Send OTP"
            onPress={handleSendOTP}
            loading={isLoading}
            style={styles.sendButton}
          />

          <View style={styles.demoInfo}>
            <Text style={styles.demoTitle}>Demo Credentials:</Text>
            <Text style={styles.demoText}>Phone: 9876543210 or 8765432109</Text>
            <Text style={styles.demoText}>OTP: 123456</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  sendButton: {
    marginTop: 20,
  },
  demoInfo: {
    marginTop: 40,
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    alignItems: 'center',
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  demoText: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
});

export default LoginScreen;