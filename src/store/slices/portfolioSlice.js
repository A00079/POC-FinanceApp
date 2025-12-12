import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  totalInvested: 0,
  currentValue: 0,
  totalReturns: 0,
  xirr: 0,
  holdings: [],
  mutualFunds: [],
  categories: [],
  isLoading: false,
  error: null,
};

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    setPortfolioData: (state, action) => {
      const { totalInvested, currentValue, totalReturns, xirr, holdings } = action.payload;
      state.totalInvested = totalInvested;
      state.currentValue = currentValue;
      state.totalReturns = totalReturns;
      state.xirr = xirr;
      state.holdings = holdings;
    },
    setMutualFunds: (state, action) => {
      state.mutualFunds = action.payload;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    portfolioLoadingStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    portfolioLoadingEnd: (state) => {
      state.isLoading = false;
    },
    portfolioError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearPortfolioError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setPortfolioData,
  setMutualFunds,
  setCategories,
  portfolioLoadingStart,
  portfolioLoadingEnd,
  portfolioError,
  clearPortfolioError,
} = portfolioSlice.actions;

export default portfolioSlice.reducer;