import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout } from '../../store/slices/authSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { user } = useSelector(state => state.auth);
  const { kycStatus } = useSelector(state => state.kyc);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove(['userToken', 'userData']);
              dispatch(logout());
            } catch (error) {
              console.log('Error during logout:', error);
            }
          },
        },
      ]
    );
  };

  const getKycStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'in-progress': return '#FF9800';
      case 'rejected': return '#F44336';
      default: return '#666666';
    }
  };

  const menuItems = [
    {
      id: 'personal-info',
      title: 'Personal Information',
      icon: 'person',
      onPress: () => {},
    },
    {
      id: 'kyc-status',
      title: 'KYC Status',
      icon: 'verified-user',
      subtitle: kycStatus.charAt(0).toUpperCase() + kycStatus.slice(1),
      subtitleColor: getKycStatusColor(kycStatus),
      onPress: () => {},
    },
    {
      id: 'bank-details',
      title: 'Bank Details',
      icon: 'account-balance',
      onPress: () => {},
    },
    {
      id: 'portfolio',
      title: 'Portfolio Summary',
      icon: 'pie-chart',
      onPress: () => navigation.navigate('Dashboard'),
    },
    {
      id: 'statements',
      title: 'Statements & Reports',
      icon: 'description',
      onPress: () => {},
    },
    {
      id: 'tax-documents',
      title: 'Tax Documents',
      icon: 'receipt',
      onPress: () => {},
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: 'settings',
      onPress: () => {},
    },
    {
      id: 'support',
      title: 'Help & Support',
      icon: 'help',
      onPress: () => {},
    },
    {
      id: 'about',
      title: 'About',
      icon: 'info',
      onPress: () => {},
    },
  ];

  const renderProfileHeader = () => (
    <View style={styles.profileHeader}>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </Text>
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user?.name || 'User'}</Text>
        <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
        <Text style={styles.userPhone}>{user?.phone || '+91 98765 43210'}</Text>
      </View>
    </View>
  );

  const renderMenuItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={item.onPress}>
      <View style={styles.menuItemLeft}>
        <View style={styles.menuIconContainer}>
          <Icon name={item.icon} size={20} color="#666666" />
        </View>
        <View style={styles.menuItemInfo}>
          <Text style={styles.menuItemTitle}>{item.title}</Text>
          {item.subtitle && (
            <Text style={[styles.menuItemSubtitle, { color: item.subtitleColor || '#666666' }]}>
              {item.subtitle}
            </Text>
          )}
        </View>
      </View>
      <Icon name="chevron-right" size={20} color="#CCCCCC" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {renderProfileHeader()}

      <View style={styles.menuContainer}>
        {menuItems.map(renderMenuItem)}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="logout" size={20} color="#F44336" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Version 1.0.0</Text>
        <Text style={styles.footerText}>© 2024 FinanceApp</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 20,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#00C853',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 14,
    color: '#666666',
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemInfo: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  menuItemSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    marginBottom: 20,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#F44336',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 4,
  },
});

export default ProfileScreen;