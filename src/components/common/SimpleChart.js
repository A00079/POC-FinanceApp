import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const SimpleChart = ({ data, color = '#00C853' }) => {
  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>No chart data available</Text>
      </View>
    );
  }

  const maxValue = Math.max(...data.map(d => d.y));
  const minValue = Math.min(...data.map(d => d.y));
  const range = maxValue - minValue;

  const chartWidth = width - 80;
  const chartHeight = 150;

  return (
    <View style={styles.container}>
      <View style={styles.chart}>
        {data.map((point, index) => {
          const x = (index / (data.length - 1)) * chartWidth;
          const y = chartHeight - ((point.y - minValue) / range) * chartHeight;
          
          return (
            <View
              key={index}
              style={[
                styles.point,
                {
                  left: x,
                  top: y,
                  backgroundColor: color,
                },
              ]}
            />
          );
        })}
        
        {/* Simple line connecting points */}
        <View style={[styles.line, { backgroundColor: color }]} />
      </View>
      
      <View style={styles.labels}>
        <Text style={styles.labelText}>{data[0]?.x}</Text>
        <Text style={styles.labelText}>{data[data.length - 1]?.x}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chart: {
    width: width - 80,
    height: 150,
    position: 'relative',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  point: {
    width: 4,
    height: 4,
    borderRadius: 2,
    position: 'absolute',
  },
  line: {
    position: 'absolute',
    height: 2,
    width: '90%',
    top: '50%',
    left: '5%',
    opacity: 0.3,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width - 80,
    marginTop: 8,
  },
  labelText: {
    fontSize: 12,
    color: '#666666',
  },
  noDataText: {
    fontSize: 14,
    color: '#999999',
    fontStyle: 'italic',
  },
});

export default SimpleChart;