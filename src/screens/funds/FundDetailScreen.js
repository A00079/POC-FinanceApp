import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import SimpleChart from '../../components/common/SimpleChart';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Button from '../../components/common/Button';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

const { width } = Dimensions.get('window');

const FundDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { fund } = route.params;
  const [selectedPeriod, setSelectedPeriod] = useState('1y');

  const periods = [
    { key: '1y', label: '1Y' },
    { key: '3y', label: '3Y' },
    { key: '5y', label: '5Y' },
  ];

  const getRiskColor = (riskLevel) => {
    switch (riskLevel.toLowerCase()) {
      case 'low': return '#4CAF50';
      case 'moderate': return '#FF9800';
      case 'high': return '#F44336';
      default: return '#666666';
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#333333" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.favoriteButton}>
        <Icon name="favorite-border" size={24} color="#333333" />
      </TouchableOpacity>
    </View>
  );

  const renderFundInfo = () => (
    <View style={styles.fundInfo}>
      <Text style={styles.fundName}>{fund.name}</Text>
      <View style={styles.navContainer}>
        <Text style={styles.navValue}>{formatCurrency(fund.nav)}</Text>
        <Text style={styles.navLabel}>Current NAV</Text>
      </View>
    </View>
  );

  const renderChart = () => (
    <View style={styles.chartContainer}>
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>Performance</Text>
        <View style={styles.periodSelector}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period.key}
              style={[
                styles.periodButton,
                selectedPeriod === period.key && styles.activePeriodButton,
              ]}
              onPress={() => setSelectedPeriod(period.key)}>
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === period.key && styles.activePeriodButtonText,
                ]}>
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <SimpleChart data={fund.chartData} color="#00C853" />
    </View>
  );

  const renderReturns = () => (
    <View style={styles.returnsContainer}>
      <Text style={styles.sectionTitle}>Returns</Text>
      <View style={styles.returnsGrid}>
        {Object.entries(fund.returns).map(([period, value]) => (
          <View key={period} style={styles.returnItem}>
            <Text style={styles.returnPeriod}>{period.toUpperCase()}</Text>
            <Text style={[styles.returnValue, { color: value >= 0 ? '#00C853' : '#F44336' }]}>
              {formatPercentage(value)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderFundDetails = () => (
    <View style={styles.detailsContainer}>
      <Text style={styles.sectionTitle}>Fund Details</Text>
      
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Fund Manager</Text>
        <Text style={styles.detailValue}>{fund.fundManager}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>AUM</Text>
        <Text style={styles.detailValue}>{fund.aum}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Expense Ratio</Text>
        <Text style={styles.detailValue}>{fund.expenseRatio}%</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Risk Level</Text>
        <View style={styles.riskContainer}>
          <View style={[styles.riskIndicator, { backgroundColor: getRiskColor(fund.riskLevel) }]} />
          <Text style={styles.detailValue}>{fund.riskLevel}</Text>
        </View>
      </View>
      
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Min SIP Amount</Text>
        <Text style={styles.detailValue}>{formatCurrency(fund.minSipAmount)}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Launch Date</Text>
        <Text style={styles.detailValue}>
          {new Date(fund.launchDate).toLocaleDateString('en-IN')}
        </Text>
      </View>
    </View>
  );

  const renderDescription = () => (
    <View style={styles.descriptionContainer}>
      <Text style={styles.sectionTitle}>About This Fund</Text>
      <Text style={styles.description}>{fund.description}</Text>
    </View>
  );

  const renderActionButtons = () => (
    <View style={styles.actionButtons}>
      <Button
        title="Start SIP"
        onPress={() => navigation.navigate('SIPSetup', { fund })}
        style={[styles.actionButton, { marginRight: 8 }]}
        variant="outline"
      />
      <Button
        title="Invest Now"
        onPress={() => navigation.navigate('BuyFund', { fund })}
        style={[styles.actionButton, { marginLeft: 8 }]}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderFundInfo()}
        {renderChart()}
        {renderReturns()}
        {renderFundDetails()}
        {renderDescription()}
      </ScrollView>
      
      {renderActionButtons()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    padding: 8,
  },
  favoriteButton: {
    padding: 8,
  },
  fundInfo: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  fundName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  navContainer: {
    alignItems: 'flex-start',
  },
  navValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00C853',
    marginBottom: 4,
  },
  navLabel: {
    fontSize: 14,
    color: '#666666',
  },
  chartContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 2,
  },
  periodButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  activePeriodButton: {
    backgroundColor: '#00C853',
  },
  periodButtonText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  activePeriodButtonText: {
    color: '#FFFFFF',
  },
  returnsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
  },
  returnsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  returnItem: {
    alignItems: 'center',
    flex: 1,
  },
  returnPeriod: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  returnValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  detailsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
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
  descriptionContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  actionButton: {
    flex: 1,
  },
});

export default FundDetailScreen;