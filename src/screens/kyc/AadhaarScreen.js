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
import { updateAadhaarNumber } from '../../store/slices/kycSlice';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const AadhaarScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateAadhaar = (aadhaar) => {
    const aadhaarRegex = /^[0-9]{12}$/;
    return aadhaarRegex.test(aadhaar);
  };

  const formatAadhaar = (text) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    
    // Add spaces every 4 digits
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    
    return formatted;
  };

  const handleContinue = async () => {
    const cleanedAadhaar = aadhaarNumber.replace(/\s/g, '');
    
    if (!cleanedAadhaar.trim()) {
      Alert.alert('Error', 'Please enter your Aadhaar number');
      return;
    }

    if (!validateAadhaar(cleanedAadhaar)) {
      Alert.alert('Error', 'Please enter a valid 12-digit Aadhaar number');
      return;
    }

    setIsLoading(true);

    // Simulate API validation
    setTimeout(() => {
      setIsLoading(false);
      dispatch(updateAadhaarNumber(cleanedAadhaar));
      navigation.navigate('KYCConfirmation');
    }, 1500);
  };

  const handleAadhaarChange = (text) => {
    const formatted = formatAadhaar(text);
    if (formatted.replace(/\s/g, '').length <= 12) {
      setAadhaarNumber(formatted);
    }
  };

  const getMaskedAadhaar = () => {
    const cleaned = aadhaarNumber.replace(/\s/g, '');
    if (cleaned.length > 8) {
      const masked = 'XXXX XXXX ' + cleaned.slice(8);
      return formatAadhaar(masked);
    }
    return aadhaarNumber;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Aadhaar Verification</Text>
          <Text style={styles.subtitle}>
            Enter your 12-digit Aadhaar number for verification
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Aadhaar Number"
            value={aadhaarNumber}
            onChangeText={handleAadhaarChange}
            placeholder="1234 5678 9012"
            keyboardType="numeric"
            maxLength={14} // Including spaces
          />

          {aadhaarNumber.replace(/\s/g, '').length > 8 && (
            <View style={styles.maskedContainer}>
              <Text style={styles.maskedLabel}>Masked Aadhaar:</Text>
              <Text style={styles.maskedText}>{getMaskedAadhaar()}</Text>
            </View>
          )}

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Security & Privacy</Text>
            <Text style={styles.infoText}>
              • Your Aadhaar is encrypted and stored securely{'\n'}
              • Only last 4 digits are visible after entry{'\n'}
              • Used only for KYC verification{'\n'}
              • Never shared with third parties
            </Text>
          </View>

          <Button
            title="Continue"
            onPress={handleContinue}
            loading={isLoading}
            style={styles.continueButton}
          />

          <View style={styles.demoInfo}>
            <Text style={styles.demoText}>Demo Aadhaar: 123456789012</Text>
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
  maskedContainer: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  maskedLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  maskedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    letterSpacing: 2,
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

export default AadhaarScreen;