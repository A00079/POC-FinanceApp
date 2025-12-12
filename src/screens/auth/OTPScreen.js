import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginSuccess, loginFailure } from '../../store/slices/authSlice';
import Button from '../../components/common/Button';
import dummyCredentials from '../../data/dummyCredentials.json';

const OTPScreen = () => {
  const dispatch = useDispatch();
  const route = useRoute();
  const { phoneNumber, user } = route.params;
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const enteredOtp = otp.join('');
    
    if (enteredOtp.length !== 6) {
      Alert.alert('Error', 'Please enter complete OTP');
      return;
    }

    const validOtp = dummyCredentials.otps[phoneNumber];
    if (enteredOtp !== validOtp) {
      Alert.alert('Error', 'Invalid OTP. Please use: 123456');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(async () => {
      try {
        await AsyncStorage.setItem('userToken', user.token);
        await AsyncStorage.setItem('userData', JSON.stringify(user));
        
        dispatch(loginSuccess({
          token: user.token,
          user: user,
        }));
      } catch (error) {
        dispatch(loginFailure('Login failed'));
        Alert.alert('Error', 'Something went wrong. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }, 1500);
  };

  const handleResendOTP = () => {
    setTimer(30);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
    Alert.alert('Success', 'OTP sent successfully');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Verify OTP</Text>
        <Text style={styles.subtitle}>
          We've sent a 6-digit code to {phoneNumber}
        </Text>
      </View>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={styles.otpInput}
            value={digit}
            onChangeText={(value) => handleOtpChange(value, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="numeric"
            maxLength={1}
            textAlign="center"
          />
        ))}
      </View>

      <Button
        title="Verify OTP"
        onPress={handleVerifyOTP}
        loading={isLoading}
        style={styles.verifyButton}
      />

      <View style={styles.resendContainer}>
        {canResend ? (
          <TouchableOpacity onPress={handleResendOTP}>
            <Text style={styles.resendText}>Resend OTP</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.timerText}>
            Resend OTP in {timer}s
          </Text>
        )}
      </View>

      <View style={styles.demoInfo}>
        <Text style={styles.demoText}>Demo OTP: 123456</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  verifyButton: {
    marginBottom: 20,
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  resendText: {
    fontSize: 16,
    color: '#00C853',
    fontWeight: '600',
  },
  timerText: {
    fontSize: 16,
    color: '#666666',
  },
  demoInfo: {
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    alignItems: 'center',
  },
  demoText: {
    fontSize: 12,
    color: '#666666',
  },
});

export default OTPScreen;