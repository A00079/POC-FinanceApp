import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import mutualFundsData from '../../data/mutualFunds.json';

const MutualFundsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { mutualFunds, categories } = useSelector(state => state.portfolio);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(route.params?.category || 'all');
  const [filteredFunds, setFilteredFunds] = useState(mutualFundsData.funds);

  useEffect(() => {
    filterFunds();
  }, [searchQuery, selectedCategory]);

  const filterFunds = () => {
    let filtered = mutualFundsData.funds;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(fund => fund.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(fund =>
        fund.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredFunds(filtered);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel.toLowerCase()) {
      case 'low': return '#4CAF50';
      case 'moderate': return '#FF9800';
      case 'high': return '#F44336';
      default: return '#666666';
    }
  };

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <Icon name="search" size={20} color="#666666" style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search mutual funds..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor="#999999"
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity onPress={() => setSearchQuery('')}>
          <Icon name="clear" size={20} color="#666666" />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderCategoryFilter = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.categoryFilter}>
      <TouchableOpacity
        style={[
          styles.categoryChip,
          selectedCategory === 'all' && styles.activeCategoryChip,
        ]}
        onPress={() => setSelectedCategory('all')}>
        <Text
          style={[
            styles.categoryChipText,
            selectedCategory === 'all' && styles.activeCategoryChipText,
          ]}>
          All
        </Text>
      </TouchableOpacity>
      
      {mutualFundsData.categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.categoryChip,
            selectedCategory === category.id && styles.activeCategoryChip,
          ]}
          onPress={() => setSelectedCategory(category.id)}>
          <Text
            style={[
              styles.categoryChipText,
              selectedCategory === category.id && styles.activeCategoryChipText,
            ]}>
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderFundItem = ({ item }) => (
    <TouchableOpacity
      style={styles.fundCard}
      onPress={() => navigation.navigate('FundDetail', { fund: item })}>
      <View style={styles.fundHeader}>
        <View style={styles.fundInfo}>
          <Text style={styles.fundName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.fundCategory}>
            {mutualFundsData.categories.find(cat => cat.id === item.category)?.name}
          </Text>
        </View>
        <View style={styles.navContainer}>
          <Text style={styles.navLabel}>NAV</Text>
          <Text style={styles.navValue}>{formatCurrency(item.nav)}</Text>
        </View>
      </View>

      <View style={styles.fundStats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>1Y Return</Text>
          <Text style={[styles.statValue, { color: item.returns['1y'] >= 0 ? '#00C853' : '#F44336' }]}>
            {item.returns['1y']}%
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>3Y Return</Text>
          <Text style={[styles.statValue, { color: item.returns['3y'] >= 0 ? '#00C853' : '#F44336' }]}>
            {item.returns['3y']}%
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>5Y Return</Text>
          <Text style={[styles.statValue, { color: item.returns['5y'] >= 0 ? '#00C853' : '#F44336' }]}>
            {item.returns['5y']}%
          </Text>
        </View>
      </View>

      <View style={styles.fundFooter}>
        <View style={styles.riskContainer}>
          <View style={[styles.riskIndicator, { backgroundColor: getRiskColor(item.riskLevel) }]} />
          <Text style={styles.riskText}>{item.riskLevel} Risk</Text>
        </View>
        <Text style={styles.minSip}>Min SIP: {formatCurrency(item.minSipAmount)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mutual Funds</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Icon name="tune" size={24} color="#333333" />
        </TouchableOpacity>
      </View>

      {renderSearchBar()}
      {renderCategoryFilter()}

      <FlatList
        data={filteredFunds}
        renderItem={renderFundItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.fundsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="search-off" size={48} color="#CCCCCC" />
            <Text style={styles.emptyText}>No funds found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
          </View>
        }
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#333333',
  },
  categoryFilter: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  activeCategoryChip: {
    backgroundColor: '#00C853',
    borderColor: '#00C853',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  activeCategoryChipText: {
    color: '#FFFFFF',
  },
  fundsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  fundCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  fundHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  fundInfo: {
    flex: 1,
    marginRight: 12,
  },
  fundName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  fundCategory: {
    fontSize: 12,
    color: '#666666',
    textTransform: 'uppercase',
  },
  navContainer: {
    alignItems: 'flex-end',
  },
  navLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 2,
  },
  navValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  fundStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  fundFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  riskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  riskIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  riskText: {
    fontSize: 12,
    color: '#666666',
  },
  minSip: {
    fontSize: 12,
    color: '#666666',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
  },
});

export default MutualFundsScreen;