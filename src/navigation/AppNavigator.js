import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginSuccess, setOnboardingComplete } from '../store/slices/authSlice';
import { updateKycStatus } from '../store/slices/kycSlice';

// Import screens
import SplashScreen from '../screens/auth/SplashScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import OTPScreen from '../screens/auth/OTPScreen';
import KYCNavigator from './KYCNavigator';
import MainTabNavigator from './MainTabNavigator';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, hasCompletedOnboarding } = useSelector(state => state.auth);
  const { kycStatus } = useSelector(state => state.kyc);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const user = await AsyncStorage.getItem('userData');
      const onboardingComplete = await AsyncStorage.getItem('onboardingComplete');
      
      if (token && user) {
        dispatch(loginSuccess({
          token,
          user: JSON.parse(user),
        }));
      }
      
      if (onboardingComplete === 'true') {
        dispatch(setOnboardingComplete());
      }
      
      // Check KYC status
      const kycStatusStored = await AsyncStorage.getItem('kycStatus');
      if (kycStatusStored) {
        dispatch(updateKycStatus(kycStatusStored));
      }
    } catch (error) {
      console.log('Error checking auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!hasCompletedOnboarding ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : !isAuthenticated ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="OTP" component={OTPScreen} />
        </>
      ) : kycStatus !== 'completed' ? (
        <Stack.Screen name="KYC" component={KYCNavigator} />
      ) : (
        <Stack.Screen name="Main" component={MainTabNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;