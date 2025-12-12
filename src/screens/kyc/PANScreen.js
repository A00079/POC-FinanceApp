import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { updatePanNumber } from '../../store/slices/kycSlice';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const PANScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [panNumber, setPanNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validatePAN = (pan) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan.toUpperCase());
  };

  const handleContinue = async () => {
    if (!panNumber.trim()) {
      Alert.alert('Error', 'Please enter your PAN number');
      return;
    }

    if (!validatePAN(panNumber)) {
      Alert.alert('Error', 'Please enter a valid PAN number (e.g., ABCDE1234F)');
      return;
    }

    setIsLoading(true);

    // Simulate API validation
    setTimeout(() => {
      setIsLoading(false);
      dispatch(updatePanNumber(panNumber.toUpperCase()));
      navigation.navigate('Aadhaar');
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>PAN Verification</Text>
          <Text style={styles.subtitle}>
            Enter your PAN number to verify your identity
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="PAN Number"
            value={panNumber}
            onChangeText={(text) => setPanNumber(text.toUpperCase())}
            placeholder="ABCDE1234F"
            maxLength={10}
            autoCapitalize="characters"
          />

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Why do we need your PAN?</Text>
            <Text style={styles.infoText}>
              • PAN is mandatory for mutual fund investments{'\n'}
              • Required for tax compliance{'\n'}
              • Helps in tracking your investments
            </Text>
          </View>

          <Button
            title="Continue"
            onPress={handleContinue}
            loading={isLoading}
            style={styles.continueButton}
          />

          <View style={styles.demoInfo}>
            <Text style={styles.demoText}>Demo PAN: ABCDE1234F</Text>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 22,
  },
  form: {
    flex: 1,
  },
  infoBox: {
    backgroundColor: '#F0F8FF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 18,
  },
  continueButton: {
    marginTop: 'auto',
    marginBottom: 20,
  },
  demoInfo: {
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  demoText: {
    fontSize: 12,
    color: '#666666',
  },
});

export default PANScreen;