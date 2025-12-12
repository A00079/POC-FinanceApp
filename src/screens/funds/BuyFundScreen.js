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

const BuyFundScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { fund } = route.params;
  
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickAmounts = [1000, 5000, 10000, 25000, 50000];

  const handleAmountChange = (value) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, '');
    setAmount(numericValue);
  };

  const handleQuickAmount = (quickAmount) => {
    setAmount(quickAmount.toString());
  };

  const calculateUnits = () => {
    if (!amount || !fund.nav) return 0;
    return (parseFloat(amount) / fund.nav).toFixed(4);
  };

  const handleInvest = async () => {
    if (!amount || parseFloat(amount) < 500) {
      Alert.alert('Error', 'Minimum investment amount is ₹500');
      return;
    }

    setIsLoading(true);
    dispatch(transactionStart());

    // Simulate transaction processing
    setTimeout(() => {
      const transaction = {
        id: Date.now().toString(),
        type: 'Lumpsum',
        fundName: fund.name,
        amount: parseFloat(amount),
        status: 'success',
        date: new Date().toISOString(),
        transactionId: 'TXN' + Date.now(),
        nav: fund.nav,
        units: parseFloat(calculateUnits()),
      };

      dispatch(transactionSuccess(transaction));
      setIsLoading(false);

      Alert.alert(
        'Investment Successful!',
        `You have successfully invested ${formatCurrency(parseFloat(amount))} in ${fund.name}`,
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
      <View style={styles.navInfo}>
        <Text style={styles.navLabel}>Current NAV</Text>
        <Text style={styles.navValue}>{formatCurrency(fund.nav)}</Text>
      </View>
    </View>
  );

  const renderAmountInput = () => (
    <View style={styles.amountSection}>
      <Text style={styles.sectionTitle}>Investment Amount</Text>
      <Input
        value={amount ? formatCurrency(parseFloat(amount)) : ''}
        onChangeText={handleAmountChange}
        placeholder="Enter amount"
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

  const renderInvestmentSummary = () => {
    if (!amount) return null;

    return (
      <View style={styles.summarySection}>
        <Text style={styles.sectionTitle}>Investment Summary</Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Investment Amount</Text>
            <Text style={styles.summaryValue}>{formatCurrency(parseFloat(amount))}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>NAV</Text>
            <Text style={styles.summaryValue}>{formatCurrency(fund.nav)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Units Allocated</Text>
            <Text style={styles.summaryValue}>{calculateUnits()}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderImportantNotes = () => (
    <View style={styles.notesSection}>
      <Text style={styles.sectionTitle}>Important Notes</Text>
      <View style={styles.noteItem}>
        <Icon name="info" size={16} color="#2196F3" />
        <Text style={styles.noteText}>
          Units will be allotted based on the NAV at the time of processing
        </Text>
      </View>
      <View style={styles.noteItem}>
        <Icon name="schedule" size={16} color="#2196F3" />
        <Text style={styles.noteText}>
          Investment will be processed within 1-2 business days
        </Text>
      </View>
      <View style={styles.noteItem}>
        <Icon name="security" size={16} color="#2196F3" />
        <Text style={styles.noteText}>
          Your investment is secure and regulated by SEBI
        </Text>
      </View>
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
        <Text style={styles.headerTitle}>Invest</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderFundInfo()}
        {renderAmountInput()}
        {renderInvestmentSummary()}
        {renderImportantNotes()}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Invest Now"
          onPress={handleInvest}
          loading={isLoading}
          disabled={!amount || parseFloat(amount) < 500}
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
    marginBottom: 12,
  },
  navInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navLabel: {
    fontSize: 14,
    color: '#666666',
  },
  navValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00C853',
  },
  amountSection: {
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
  summarySection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 8,
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
  notesSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 16,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  noteText: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
  footer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
});

export default BuyFundScreen;