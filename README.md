# FinanceApp - Complete Investment & Mutual Fund App

A fully functional React Native CLI finance application similar to Groww, Zerodha Coin, or ET Money, built with JavaScript (no TypeScript) and modern React Native best practices.

## 🚀 Features

### ✅ Authentication Flow
- **Splash Screen** - Native React Native CLI splash
- **Onboarding** - 4 interactive slides with smooth animations
- **Login System** - Phone number based authentication
- **OTP Verification** - 6-digit OTP with resend functionality
- **Persistent Login** - AsyncStorage integration

### ✅ KYC Journey
- **PAN Verification** - PAN number validation and formatting
- **Aadhaar Verification** - Masked input with security features
- **KYC Confirmation** - Review and submit flow
- **Status Tracking** - Real-time KYC status updates

### ✅ Investment Dashboard
- **Portfolio Summary** - Total invested, current value, returns, XIRR
- **Market Categories** - Equity, Debt, Hybrid, ELSS funds
- **Quick Actions** - Invest, Start SIP, View History
- **Holdings Overview** - Fund-wise investment breakdown

### ✅ Mutual Fund Features
- **Fund Listing** - Search and category-wise filtering
- **Fund Details** - Interactive charts, returns, fund information
- **Investment Flow** - Lumpsum investment with amount selection
- **SIP Setup** - Systematic Investment Plan configuration

### ✅ Transaction Management
- **Transaction History** - Complete transaction tracking
- **Status Indicators** - Success, Processing, Failed states
- **Filter Options** - By type, date, and status
- **Real-time Updates** - Live transaction status

### ✅ Profile & Settings
- **User Profile** - Personal information management
- **KYC Status** - Verification status tracking
- **Settings** - App preferences and configurations
- **Secure Logout** - Complete session management

## 🛠 Tech Stack

- **React Native CLI** - 0.83.0 (Latest)
- **JavaScript Only** - No TypeScript
- **Navigation** - @react-navigation/native v6
- **State Management** - Redux Toolkit
- **Storage** - AsyncStorage for persistence
- **Charts** - Victory Native for fund performance
- **Icons** - React Native Vector Icons
- **UI Components** - Custom styled components

## 📱 Supported Platforms

- ✅ **Android** - Full compatibility
- ✅ **iOS** - Full compatibility

## 🚀 Quick Start

### Prerequisites

```bash
# Install Node.js (v18 or higher)
node --version

# Install React Native CLI
npm install -g @react-native-community/cli

# For iOS development (macOS only)
sudo gem install cocoapods
```

### Installation

1. **Clone and Install Dependencies**
```bash
cd Finance
npm install
```

2. **iOS Setup (macOS only)**
```bash
cd ios
pod install
cd ..
```

3. **Android Setup**
```bash
# Make sure Android Studio and SDK are installed
# Set ANDROID_HOME environment variable
```

### Running the App

```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS (macOS only)
npm run ios
```

## 🔐 Demo Credentials

### Login Credentials
- **Phone Numbers**: `9876543210` or `8765432109`
- **OTP**: `123456`

### KYC Demo Data
- **PAN**: `ABCDE1234F`
- **Aadhaar**: `123456789012`

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   └── common/          # Button, Input, LoadingSpinner
├── screens/             # Screen components
│   ├── auth/           # Authentication screens
│   ├── kyc/            # KYC verification screens
│   ├── dashboard/      # Dashboard and portfolio
│   ├── funds/          # Mutual fund screens
│   ├── transactions/   # Transaction history
│   └── profile/        # Profile and settings
├── navigation/          # Navigation configuration
├── store/              # Redux store and slices
├── data/               # Dummy JSON data files
├── services/           # API services
├── utils/              # Utility functions
└── constants/          # App constants and colors
```

## 📊 Data Management

### Dummy Data Files
- `dummyCredentials.json` - Login credentials
- `mutualFunds.json` - Fund data with categories
- `portfolioData.json` - User portfolio information
- `transactionHistory.json` - Transaction records

### API Integration Ready
- Complete API service layer implemented
- Easy to replace dummy data with real APIs
- Error handling and retry mechanisms included

## 🎨 UI/UX Features

- **Modern Design** - Clean, professional finance app UI
- **Responsive Layout** - Works on all screen sizes
- **Smooth Animations** - Loading states and transitions
- **Intuitive Navigation** - Tab-based navigation with stack screens
- **Accessibility** - Screen reader support and proper contrast

## 🔧 Customization

### Colors & Theming
```javascript
// src/constants/colors.js
export const COLORS = {
  PRIMARY: '#00C853',
  SECONDARY: '#2196F3',
  // ... more colors
};
```

### API Configuration
```javascript
// src/services/api.js
class ApiService {
  constructor() {
    this.baseURL = 'YOUR_API_BASE_URL';
  }
}
```

## 🚀 Build for Production

### Android
```bash
# Generate signed APK
cd android
./gradlew assembleRelease

# Generate AAB (recommended for Play Store)
./gradlew bundleRelease
```

### iOS
```bash
# Open in Xcode
open ios/Finance.xcworkspace

# Archive and upload to App Store Connect
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage
```

## 📈 Performance Optimizations

- **Code Splitting** - Loadable components for better performance
- **Image Optimization** - Optimized assets and lazy loading
- **Memory Management** - Proper cleanup and state management
- **Bundle Size** - Optimized dependencies and tree shaking

## 🔒 Security Features

- **Data Encryption** - Sensitive data encryption
- **Secure Storage** - AsyncStorage with encryption
- **Input Validation** - Client-side validation for all inputs
- **Session Management** - Secure token handling

## 🐛 Troubleshooting

### Common Issues

1. **Metro bundler issues**
```bash
npx react-native start --reset-cache
```

2. **Android build issues**
```bash
cd android
./gradlew clean
cd ..
npm run android
```

3. **iOS build issues**
```bash
cd ios
pod install --repo-update
cd ..
npm run ios
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the React Native documentation

---

**Built with ❤️ using React Native CLI and modern JavaScript practices**