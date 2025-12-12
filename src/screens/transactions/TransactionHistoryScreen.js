import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { setTransactions } from '../../store/slices/transactionSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { formatCurrency, formatDate } from '../../utils/formatters';
import transactionData from '../../data/transactionHistory.json';

const TransactionHistoryScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { transactions } = useSelector(state => state.transactions);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    // Simulate API call
    setTimeout(() => {
      dispatch(setTransactions(transactionData.transactions));
    }, 500);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTransactions();
    setRefreshing(false);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'success': return '#4CAF50';
      case 'processing': return '#FF9800';
      case 'failed': return '#F44336';
      default: return '#666666';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'success': return 'check-circle';
      case 'processing': return 'schedule';
      case 'failed': return 'error';
      default: return 'help';
    }
  };

  const getTransactionIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'sip': return 'schedule';
      case 'lumpsum': return 'trending-up';
      case 'redeem': return 'trending-down';
      default: return 'swap-horiz';
    }
  };

  const getTransactionColor = (type) => {
    switch (type.toLowerCase()) {
      case 'redeem': return '#F44336';
      default: return '#00C853';
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.type.toLowerCase() === filter.toLowerCase();
  });

  const renderFilterTabs = () => (
    <View style={styles.filterContainer}>
      {['All', 'SIP', 'Lumpsum', 'Redeem'].map((filterType) => (
        <TouchableOpacity
          key={filterType}
          style={[
            styles.filterTab,
            filter === filterType.toLowerCase() && styles.activeFilterTab,
          ]}
          onPress={() => setFilter(filterType.toLowerCase())}>
          <Text
            style={[
              styles.filterTabText,
              filter === filterType.toLowerCase() && styles.activeFilterTabText,
            ]}>
            {filterType}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderTransactionItem = ({ item }) => (
    <TouchableOpacity style={styles.transactionItem}>
      <View style={styles.transactionLeft}>
        <View style={[styles.transactionIconContainer, { backgroundColor: getTransactionColor(item.type) + '20' }]}>
          <Icon
            name={getTransactionIcon(item.type)}
            size={20}
            color={getTransactionColor(item.type)}
          />
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.fundName} numberOfLines={1}>
            {item.fundName}
          </Text>
          <Text style={styles.transactionType}>{item.type}</Text>
          <Text style={styles.transactionDate}>
            {formatDate(item.date)}
          </Text>
        </View>
      </View>
      
      <View style={styles.transactionRight}>
        <Text style={[styles.transactionAmount, { color: getTransactionColor(item.type) }]}>
          {item.type.toLowerCase() === 'redeem' ? '-' : '+'}{formatCurrency(item.amount)}
        </Text>
        <View style={styles.statusContainer}>
          <Icon
            name={getStatusIcon(item.status)}
            size={14}
            color={getStatusColor(item.status)}
          />
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
        <Text style={styles.transactionId}>#{item.transactionId}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="receipt-long" size={64} color="#CCCCCC" />
      <Text style={styles.emptyTitle}>No Transactions</Text>
      <Text style={styles.emptySubtitle}>
        Your transaction history will appear here
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction History</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Icon name="filter-list" size={24} color="#333333" />
        </TouchableOpacity>
      </View>

      {renderFilterTabs()}

      <FlatList
        data={filteredTransactions}
        renderItem={renderTransactionItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.transactionsList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  filterButton: {
    padding: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#F5F5F5',
  },
  activeFilterTab: {
    backgroundColor: '#00C853',
  },
  filterTabText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  activeFilterTabText: {
    color: '#FFFFFF',
  },
  transactionsList: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  fundName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 2,
  },
  transactionType: {
    fontSize: 12,
    color: '#666666',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#999999',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  transactionId: {
    fontSize: 10,
    color: '#999999',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
  },
});

export default TransactionHistoryScreen;