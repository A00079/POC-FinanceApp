import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

const Button = ({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
  loading = false,
  variant = 'primary',
}) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return [styles.button, styles.secondaryButton, style];
      case 'outline':
        return [styles.button, styles.outlineButton, style];
      default:
        return [styles.button, styles.primaryButton, style];
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'secondary':
        return [styles.buttonText, styles.secondaryText, textStyle];
      case 'outline':
        return [styles.buttonText, styles.outlineText, textStyle];
      default:
        return [styles.buttonText, styles.primaryText, textStyle];
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}>
      {loading ? (
        <ActivityIndicator color="#FFFFFF" size="small" />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  primaryButton: {
    backgroundColor: '#00C853',
  },
  secondaryButton: {
    backgroundColor: '#F5F5F5',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#00C853',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#333333',
  },
  outlineText: {
    color: '#00C853',
  },
});

export default Button;