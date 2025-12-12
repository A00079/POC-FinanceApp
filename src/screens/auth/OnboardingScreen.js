import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setOnboardingComplete } from '../../store/slices/authSlice';
import Button from '../../components/common/Button';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const onboardingData = [
  {
    id: '1',
    title: 'Invest Smartly',
    description: 'Start your investment journey with mutual funds and build wealth for the future.',
    icon: 'trending-up',
    color: '#4CAF50',
  },
  {
    id: '2',
    title: 'Track Portfolio',
    description: 'Monitor your investments in real-time and track your returns effortlessly.',
    icon: 'dashboard',
    color: '#2196F3',
  },
  {
    id: '3',
    title: 'Secure & Safe',
    description: 'Your investments are protected with bank-level security and encryption.',
    icon: 'security',
    color: '#FF9800',
  },
  {
    id: '4',
    title: 'Start Today',
    description: 'Begin your investment journey with as little as ₹500 per month.',
    icon: 'rocket-launch',
    color: '#9C27B0',
  },
];

const OnboardingScreen = () => {
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex });
    } else {
      handleGetStarted();
    }
  };

  const handleSkip = () => {
    handleGetStarted();
  };

  const handleGetStarted = async () => {
    try {
      await AsyncStorage.setItem('onboardingComplete', 'true');
      dispatch(setOnboardingComplete());
    } catch (error) {
      console.log('Error saving onboarding state:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
        <Icon name={item.icon} size={60} color="#FFFFFF" />
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  const renderPagination = () => (
    <View style={styles.pagination}>
      {onboardingData.map((_, index) => (
        <View
          key={index}
          style={[
            styles.paginationDot,
            index === currentIndex && styles.activeDot,
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />

      {renderPagination()}

      <View style={styles.footer}>
        <Button
          title={currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
          onPress={handleNext}
          style={styles.nextButton}
        />
      </View>
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
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  skipText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#00C853',
    width: 24,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  nextButton: {
    marginTop: 20,
  },
});

export default OnboardingScreen;