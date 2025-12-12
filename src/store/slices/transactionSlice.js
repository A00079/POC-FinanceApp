import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  transactions: [],
  currentTransaction: null,
  isLoading: false,
  error: null,
};

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setTransactions: (state, action) => {
      state.transactions = action.payload;
    },
    addTransaction: (state, action) => {
      state.transactions.unshift(action.payload);
    },
    setCurrentTransaction: (state, action) => {
      state.currentTransaction = action.payload;
    },
    transactionStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    transactionSuccess: (state, action) => {
      state.isLoading = false;
      state.transactions.unshift(action.payload);
    },
    transactionFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearTransactionError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setTransactions,
  addTransaction,
  setCurrentTransaction,
  transactionStart,
  transactionSuccess,
  transactionFailure,
  clearTransactionError,
} = transactionSlice.actions;

export default transactionSlice.reducer;