import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { kycSubmitStart, kycSubmitSuccess, updateKycStatus } from '../../store/slices/kycSlice';
import Button from '../../components/common/Button';
import Icon from 'react-native-vector-icons/MaterialIcons';

const KYCConfirmationScreen = () => {
  const dispatch = useDispatch();
  const { panNumber, aadhaarNumber, isLoading } = useSelector(state => state.kyc);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getMaskedAadhaar = () => {
    return 'XXXX XXXX ' + aadhaarNumber.slice(-4);
  };

  const handleSubmitKYC = async () => {
    setIsSubmitting(true);
    dispatch(kycSubmitStart());

    // Simulate KYC submission
    setTimeout(async () => {
      try {
        await AsyncStorage.setItem('kycStatus', 'completed');
        setIsSubmitting(false);
        dispatch(kycSubmitSuccess());
        dispatch(updateKycStatus('completed'));
        
        Alert.alert(
          'KYC Submitted Successfully!',
          'Your KYC has been submitted for verification. You can now start investing.',
          [{ text: 'Continue', onPress: () => {} }]
        );
      } catch (error) {
        console.log('Error saving KYC status:', error);
        setIsSubmitting(false);
      }
    }, 2000);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Icon name="verified-user" size={60} color="#00C853" />
          </View>
          <Text style={styles.title}>Confirm Your Details</Text>
          <Text style={styles.subtitle}>
            Please review your information before submitting
          </Text>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>PAN Number</Text>
            <Text style={styles.detailValue}>{panNumber}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Aadhaar Number</Text>
            <Text style={styles.detailValue}>{getMaskedAadhaar()}</Text>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Icon name="info" size={20} color="#2196F3" style={styles.infoIcon} />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>What happens next?</Text>
            <Text style={styles.infoText}>
              • Your documents will be verified within 24-48 hours{'\n'}
              • You'll receive a confirmation email{'\n'}
              • You can start investing immediately after verification{'\n'}
              • All your data is encrypted and secure
            </Text>
          </View>
        </View>

        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            By submitting, you agree to our{' '}
            <Text style={styles.linkText}>Terms & Conditions</Text> and{' '}
            <Text style={styles.linkText}>Privacy Policy</Text>
          </Text>
        </View>

        <Button
          title="Submit KYC"
          onPress={handleSubmitKYC}
          loading={isSubmitting}
          style={styles.submitButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
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
    textAlign: 'center',
  },
  detailsContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  detailItem: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#F0F8FF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
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
  termsContainer: {
    marginBottom: 30,
  },
  termsText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 18,
  },
  linkText: {
    color: '#00C853',
    fontWeight: '500',
  },
  submitButton: {
    marginTop: 10,
  },
});

export default KYCConfirmationScreen;