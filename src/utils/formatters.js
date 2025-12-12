export const formatCurrency = (amount, options = {}) => {
  const {
    currency = 'INR',
    locale = 'en-IN',
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
  } = options;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount);
};

export const formatNumber = (number, options = {}) => {
  const {
    locale = 'en-IN',
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
  } = options;

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(number);
};

export const formatPercentage = (value, decimals = 1) => {
  return `${value.toFixed(decimals)}%`;
};

export const formatDate = (date, format = 'short') => {
  const dateObj = new Date(date);
  
  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    case 'long':
      return dateObj.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    case 'time':
      return dateObj.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    default:
      return dateObj.toLocaleDateString('en-IN');
  }
};

export const formatCompactNumber = (number) => {
  if (number >= 10000000) {
    return `₹${(number / 10000000).toFixed(1)}Cr`;
  } else if (number >= 100000) {
    return `₹${(number / 100000).toFixed(1)}L`;
  } else if (number >= 1000) {
    return `₹${(number / 1000).toFixed(1)}K`;
  }
  return `₹${number}`;
};

export const maskString = (str, visibleChars = 4, maskChar = 'X') => {
  if (str.length <= visibleChars) return str;
  
  const visiblePart = str.slice(-visibleChars);
  const maskedPart = maskChar.repeat(str.length - visibleChars);
  
  return maskedPart + visiblePart;
};

export const formatPhoneNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return `${match[1]} ${match[2]} ${match[3]}`;
  }
  
  return phone;
};