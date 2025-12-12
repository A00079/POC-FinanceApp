import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import {
  setPortfolioData,
  setMutualFunds,
  setCategories,
  portfolioLoadingStart,
  portfolioLoadingEnd,
} from '../../store/slices/portfolioSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';

import portfolioData from '../../data/portfolioData.json';
import mutualFundsData from '../../data/mutualFunds.json';

const DashboardScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { user } = useSelector(state => state.auth);
  const { totalInvested, currentValue, totalReturns, xirr, holdings, isLoading } = useSelector(state => state.portfolio);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPortfolioData();
  }, []);

  const loadPortfolioData = async () => {
    dispatch(portfolioLoadingStart());
    
    // Simulate API call
    setTimeout(() => {
      const { portfolio } = portfolioData;
      dispatch(setPortfolioData(portfolio));
      dispatch(setMutualFunds(mutualFundsData.funds));
      dispatch(setCategories(mutualFundsData.categories));
      dispatch(portfolioLoadingEnd());
    }, 1000);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPortfolioData();
    setRefreshing(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getReturnColor = (returns) => {
    return returns >= 0 ? '#00C853' : '#F44336';
  };

  const renderPortfolioSummary = () => (
    <View style={styles.portfolioCard}>
      <View style={styles.portfolioHeader}>
        <Text style={styles.portfolioTitle}>Portfolio Value</Text>
        <TouchableOpacity>
          <Icon name="visibility" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.portfolioValue}>{formatCurrency(currentValue || 0)}</Text>
      
      <View style={styles.portfolioStats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Invested</Text>
          <Text style={styles.statValue}>{formatCurrency(totalInvested || 0)}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Returns</Text>
          <Text style={styles.statValue}>
            {formatCurrency(totalReturns || 0)} ({totalInvested ? ((totalReturns / totalInvested) * 100).toFixed(1) : '0.0'}%)
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>XIRR</Text>
          <Text style={styles.statValue}>{xirr || 0}%</Text>
        </View>
      </View>
    </View>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActions}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsGrid}>
        <TouchableOpacity
          style={styles.actionItem}
          onPress={() => navigation.navigate('Funds')}>
          <Icon name="trending-up" size={24} color="#00C853" />
          <Text style={styles.actionText}>Invest</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionItem}
          onPress={() => navigation.navigate('Funds', { screen: 'SIPSetup' })}>
          <Icon name="schedule" size={24} color="#2196F3" />
          <Text style={styles.actionText}>Start SIP</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionItem}
          onPress={() => navigation.navigate('Transactions')}>
          <Icon name="history" size={24} color="#FF9800" />
          <Text style={styles.actionText}>History</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionItem}
          onPress={() => navigation.navigate('Profile')}>
          <Icon name="account-balance-wallet" size={24} color="#9C27B0" />
          <Text style={styles.actionText}>Portfolio</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderHoldings = () => (
    <View style={styles.holdingsSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Your Holdings</Text>
        <TouchableOpacity>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>
      
      {(holdings || []).slice(0, 3).map((holding) => (
        <TouchableOpacity key={holding.id} style={styles.holdingItem}>
          <View style={styles.holdingInfo}>
            <Text style={styles.holdingName}>{holding.fundName}</Text>
            <Text style={styles.holdingAmount}>
              {formatCurrency(holding.currentValue)}
            </Text>
          </View>
          <View style={styles.holdingReturns}>
            <Text style={[styles.returnText, { color: getReturnColor(holding.returns) }]}>
              {formatCurrency(holding.returns)} ({holding.returnsPercentage.toFixed(1)}%)
            </Text>
            <Icon name="chevron-right" size={20} color="#CCCCCC" />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderMarketCategories = () => (
    <View style={styles.categoriesSection}>
      <Text style={styles.sectionTitle}>Explore Categories</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {mutualFundsData.categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[styles.categoryCard, { borderColor: category.color }]}
            onPress={() => navigation.navigate('Funds', { category: category.id })}>
            <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
              <Icon name="trending-up" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.categoryName}>{category.name}</Text>
            <Text style={styles.categoryDesc}>{category.description}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Morning,</Text>
          <Text style={styles.userName}>{user?.name || 'Investor'}</Text>
        </View>
        <TouchableOpacity style={styles.notificationIcon}>
          <Icon name="notifications" size={24} color="#333333" />
        </TouchableOpacity>
      </View>

      {renderPortfolioSummary()}
      {renderQuickActions()}
      {renderHoldings()}
      {renderMarketCategories()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  greeting: {
    fontSize: 14,
    color: '#666666',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  notificationIcon: {
    padding: 8,
  },
  portfolioCard: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#00C853',
  },
  portfolioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  portfolioTitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  portfolioValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  portfolioStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  quickActions: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionItem: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333333',
    marginTop: 8,
  },
  holdingsSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: '#00C853',
    fontWeight: '500',
  },
  holdingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  holdingInfo: {
    flex: 1,
  },
  holdingName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 4,
  },
  holdingAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  holdingReturns: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  returnText: {
    fontSize: 12,
    fontWeight: '500',
    marginRight: 8,
  },
  categoriesSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    width: 140,
    borderWidth: 1,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  categoryDesc: {
    fontSize: 10,
    color: '#666666',
    lineHeight: 14,
  },
});

export default DashboardScreen;