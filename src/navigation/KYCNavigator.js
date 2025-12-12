import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PANScreen from '../screens/kyc/PANScreen';
import AadhaarScreen from '../screens/kyc/AadhaarScreen';
import KYCConfirmationScreen from '../screens/kyc/KYCConfirmationScreen';

const Stack = createStackNavigator();

const KYCNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#FFFFFF',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '600',
          color: '#000000',
        },
        headerTintColor: '#000000',
      }}>
      <Stack.Screen 
        name="PAN" 
        component={PANScreen} 
        options={{ title: 'PAN Verification' }}
      />
      <Stack.Screen 
        name="Aadhaar" 
        component={AadhaarScreen} 
        options={{ title: 'Aadhaar Verification' }}
      />
      <Stack.Screen 
        name="KYCConfirmation" 
        component={KYCConfirmationScreen} 
        options={{ title: 'KYC Confirmation' }}
      />
    </Stack.Navigator>
  );
};

export default KYCNavigator;