import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { transactionStart, transactionSuccess } from '../../store/slices/transactionSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { formatCurrency } from '../../utils/formatters';

const SIPSetupScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { fund } = route.params;
  
  const [amount, setAmount] = useState('');
  const [selectedDate, setSelectedDate] = useState(5);
  const [selectedFrequency, setSelectedFrequency] = useState('monthly');
  const [duration, setDuration] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickAmounts = [500, 1000, 2000, 5000, 10000];
  const sipDates = [1, 5, 10, 15, 20, 25];
  const frequencies = [
    { key: 'monthly', label: 'Monthly' },
    { key: 'quarterly', label: 'Quarterly' },
  ];

  const handleAmountChange = (value) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setAmount(numericValue);
  };

  const handleQuickAmount = (quickAmount) => {
    setAmount(quickAmount.toString());
  };

  const calculateTotalInvestment = () => {
    if (!amount || !duration) return 0;
    const monthlyAmount = parseFloat(amount);
    const months = parseInt(duration) * 12;
    return monthlyAmount * months;
  };

  const calculateExpectedReturns = () => {
    if (!amount || !duration) return 0;
    const monthlyAmount = parseFloat(amount);
    const years = parseInt(duration);
    const expectedReturn = 12; // 12% annual return assumption
    
    // Simple SIP calculation
    const months = years * 12;
    const monthlyRate = expectedReturn / 100 / 12;
    const futureValue = monthlyAmount * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
    
    return futureValue;
  };

  const handleStartSIP = async () => {
    if (!amount || parseFloat(amount) < fund.minSipAmount) {
      Alert.alert('Error', `Minimum SIP amount is ${formatCurrency(fund.minSipAmount)}`);
      return;
    }

    if (!duration || parseInt(duration) < 1) {
      Alert.alert('Error', 'Please enter a valid duration');
      return;
    }

    setIsLoading(true);
    dispatch(transactionStart());

    // Simulate SIP setup
    setTimeout(() => {
      const transaction = {
        id: Date.now().toString(),
        type: 'SIP',
        fundName: fund.name,
        amount: parseFloat(amount),
        status: 'success',
        date: new Date().toISOString(),
        transactionId: 'SIP' + Date.now(),
        nav: fund.nav,
        units: parseFloat(amount) / fund.nav,
        sipDate: selectedDate,
        frequency: selectedFrequency,
        duration: parseInt(duration),
      };

      dispatch(transactionSuccess(transaction));
      setIsLoading(false);

      Alert.alert(
        'SIP Started Successfully!',
        `Your SIP of ${formatCurrency(parseFloat(amount))} has been set up for ${fund.name}`,
        [
          {
            text: 'View Portfolio',
            onPress: () => navigation.navigate('Dashboard'),
          },
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }, 2000);
  };

  const renderFundInfo = () => (
    <View style={styles.fundInfo}>
      <Text style={styles.fundName}>{fund.name}</Text>
      <View style={styles.fundDetails}>
        <Text style={styles.detailText}>Min SIP: {formatCurrency(fund.minSipAmount)}</Text>
        <Text style={styles.detailText}>Current NAV: {formatCurrency(fund.nav)}</Text>
      </View>
    </View>
  );

  const renderAmountSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>SIP Amount</Text>
      <Input
        value={amount ? formatCurrency(parseFloat(amount)) : ''}
        onChangeText={handleAmountChange}
        placeholder="Enter SIP amount"
        keyboardType="numeric"
        style={styles.amountInput}
        inputStyle={styles.amountInputText}
      />
      
      <View style={styles.quickAmounts}>
        {quickAmounts.map((quickAmount) => (
          <TouchableOpacity
            key={quickAmount}
            style={[
              styles.quickAmountButton,
              amount === quickAmount.toString() && styles.activeQuickAmount,
            ]}
            onPress={() => handleQuickAmount(quickAmount)}>
            <Text
              style={[
                styles.quickAmountText,
                amount === quickAmount.toString() && styles.activeQuickAmountText,
              ]}>
              {formatCurrency(quickAmount)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderFrequencySection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Frequency</Text>
      <View style={styles.frequencyOptions}>
        {frequencies.map((freq) => (
          <TouchableOpacity
            key={freq.key}
            style={[
              styles.frequencyButton,
              selectedFrequency === freq.key && styles.activeFrequencyButton,
            ]}
            onPress={() => setSelectedFrequency(freq.key)}>
            <Text
              style={[
                styles.frequencyButtonText,
                selectedFrequency === freq.key && styles.activeFrequencyButtonText,
              ]}>
              {freq.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderDateSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>SIP Date</Text>
      <View style={styles.dateOptions}>
        {sipDates.map((date) => (
          <TouchableOpacity
            key={date}
            style={[
              styles.dateButton,
              selectedDate === date && styles.activeDateButton,
            ]}
            onPress={() => setSelectedDate(date)}>
            <Text
              style={[
                styles.dateButtonText,
                selectedDate === date && styles.activeDateButtonText,
              ]}>
              {date}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderDurationSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Duration (Years)</Text>
      <Input
        value={duration}
        onChangeText={setDuration}
        placeholder="Enter duration in years"
        keyboardType="numeric"
        maxLength={2}
      />
    </View>
  );

  const renderSummary = () => {
    if (!amount || !duration) return null;

    const totalInvestment = calculateTotalInvestment();
    const expectedReturns = calculateExpectedReturns();

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Investment Summary</Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Monthly Investment</Text>
            <Text style={styles.summaryValue}>{formatCurrency(parseFloat(amount))}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Duration</Text>
            <Text style={styles.summaryValue}>{duration} years</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Investment</Text>
            <Text style={styles.summaryValue}>{formatCurrency(totalInvestment)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Expected Value*</Text>
            <Text style={[styles.summaryValue, { color: '#00C853' }]}>
              {formatCurrency(expectedReturns)}
            </Text>
          </View>
        </View>
        <Text style={styles.disclaimer}>
          *Expected returns are based on 12% annual return assumption and are for illustration purposes only.
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Start SIP</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderFundInfo()}
        {renderAmountSection()}
        {renderFrequencySection()}
        {renderDateSection()}
        {renderDurationSection()}
        {renderSummary()}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Start SIP"
          onPress={handleStartSIP}
          loading={isLoading}
          disabled={!amount || !duration || parseFloat(amount) < fund.minSipAmount}
        />
      </View>
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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  fundInfo: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 16,
  },
  fundName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  fundDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailText: {
    fontSize: 12,
    color: '#666666',
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
  },
  amountInput: {
    marginBottom: 16,
  },
  amountInputText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  quickAmounts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAmountButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginBottom: 8,
    minWidth: '30%',
    alignItems: 'center',
  },
  activeQuickAmount: {
    backgroundColor: '#00C853',
  },
  quickAmountText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  activeQuickAmountText: {
    color: '#FFFFFF',
  },
  frequencyOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  frequencyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  activeFrequencyButton: {
    backgroundColor: '#00C853',
  },
  frequencyButtonText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  activeFrequencyButtonText: {
    color: '#FFFFFF',
  },
  dateOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dateButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  activeDateButton: {
    backgroundColor: '#00C853',
  },
  dateButtonText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  activeDateButtonText: {
    color: '#FFFFFF',
  },
  summaryCard: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  disclaimer: {
    fontSize: 10,
    color: '#999999',
    fontStyle: 'italic',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
});

export default SIPSetupScreen;