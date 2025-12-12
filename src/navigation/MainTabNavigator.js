import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import screens
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import MutualFundsScreen from '../screens/funds/MutualFundsScreen';
import FundDetailScreen from '../screens/funds/FundDetailScreen';
import BuyFundScreen from '../screens/funds/BuyFundScreen';
import SIPSetupScreen from '../screens/funds/SIPSetupScreen';
import TransactionHistoryScreen from '../screens/transactions/TransactionHistoryScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const DashboardStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="DashboardMain" component={DashboardScreen} />
  </Stack.Navigator>
);

const FundsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MutualFunds" component={MutualFundsScreen} />
    <Stack.Screen name="FundDetail" component={FundDetailScreen} />
    <Stack.Screen name="BuyFund" component={BuyFundScreen} />
    <Stack.Screen name="SIPSetup" component={SIPSetupScreen} />
  </Stack.Navigator>
);

const TransactionsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="TransactionHistory" component={TransactionHistoryScreen} />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileMain" component={ProfileScreen} />
  </Stack.Navigator>
);

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = 'dashboard';
          } else if (route.name === 'Funds') {
            iconName = 'trending-up';
          } else if (route.name === 'Transactions') {
            iconName = 'history';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#00C853',
        tabBarInactiveTintColor: '#757575',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      })}>
      <Tab.Screen name="Dashboard" component={DashboardStack} />
      <Tab.Screen name="Funds" component={FundsStack} />
      <Tab.Screen name="Transactions" component={TransactionsStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;