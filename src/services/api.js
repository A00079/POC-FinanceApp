import AsyncStorage from '@react-native-async-storage/async-storage';

// Dummy API service that simulates real API calls
class ApiService {
  constructor() {
    this.baseURL = 'https://api.financeapp.com'; // Dummy URL
    this.timeout = 5000;
  }

  // Simulate network delay
  delay(ms = 1000) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get auth token from storage
  async getAuthToken() {
    try {
      return await AsyncStorage.getItem('userToken');
    } catch (error) {
      console.log('Error getting auth token:', error);
      return null;
    }
  }

  // Simulate API request
  async request(endpoint, options = {}) {
    await this.delay(Math.random() * 1000 + 500); // Random delay 500-1500ms
    
    const token = await this.getAuthToken();
    
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    // Simulate different response scenarios
    const shouldFail = Math.random() < 0.05; // 5% chance of failure
    
    if (shouldFail) {
      throw new Error('Network request failed');
    }

    return {
      ok: true,
      status: 200,
      json: async () => options.mockResponse || { success: true },
    };
  }

  // Authentication APIs
  async login(phoneNumber) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber }),
      mockResponse: {
        success: true,
        message: 'OTP sent successfully',
      },
    });
  }

  async verifyOTP(phoneNumber, otp) {
    return this.request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber, otp }),
      mockResponse: {
        success: true,
        token: 'dummy_token_' + Date.now(),
        user: {
          id: '1',
          name: 'John Doe',
          phone: phoneNumber,
          email: 'john@example.com',
        },
      },
    });
  }

  // Portfolio APIs
  async getPortfolio() {
    return this.request('/portfolio', {
      mockResponse: {
        success: true,
        data: {
          totalInvested: 125000,
          currentValue: 142500,
          totalReturns: 17500,
          xirr: 16.8,
          holdings: [],
        },
      },
    });
  }

  async getMutualFunds(filters = {}) {
    return this.request('/mutual-funds', {
      mockResponse: {
        success: true,
        data: {
          funds: [],
          categories: [],
        },
      },
    });
  }

  async getFundDetails(fundId) {
    return this.request(`/mutual-funds/${fundId}`, {
      mockResponse: {
        success: true,
        data: {
          id: fundId,
          name: 'Sample Fund',
          nav: 45.67,
          returns: { '1y': 12.5, '3y': 15.2, '5y': 18.7 },
        },
      },
    });
  }

  // Transaction APIs
  async getTransactions(filters = {}) {
    return this.request('/transactions', {
      mockResponse: {
        success: true,
        data: {
          transactions: [],
          totalCount: 0,
        },
      },
    });
  }

  async createTransaction(transactionData) {
    return this.request('/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData),
      mockResponse: {
        success: true,
        data: {
          id: 'TXN' + Date.now(),
          status: 'success',
          ...transactionData,
        },
      },
    });
  }

  // KYC APIs
  async submitKYC(kycData) {
    return this.request('/kyc/submit', {
      method: 'POST',
      body: JSON.stringify(kycData),
      mockResponse: {
        success: true,
        message: 'KYC submitted successfully',
        kycId: 'KYC' + Date.now(),
      },
    });
  }

  async getKYCStatus() {
    return this.request('/kyc/status', {
      mockResponse: {
        success: true,
        data: {
          status: 'completed',
          submittedAt: new Date().toISOString(),
        },
      },
    });
  }

  // Market Data APIs
  async getMarketData() {
    return this.request('/market/data', {
      mockResponse: {
        success: true,
        data: {
          indices: {
            nifty: { value: 19500, change: 150, changePercent: 0.77 },
            sensex: { value: 65000, change: 500, changePercent: 0.78 },
          },
          topGainers: [],
          topLosers: [],
        },
      },
    });
  }
}

export default new ApiService();