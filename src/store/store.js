import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import kycSlice from './slices/kycSlice';
import portfolioSlice from './slices/portfolioSlice';
import transactionSlice from './slices/transactionSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    kyc: kycSlice,
    portfolio: portfolioSlice,
    transactions: transactionSlice,
  },
});