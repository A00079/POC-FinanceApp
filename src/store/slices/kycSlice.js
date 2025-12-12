import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  kycStatus: 'pending', // pending, in-progress, completed, rejected
  panNumber: '',
  aadhaarNumber: '',
  personalInfo: {
    name: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
  },
  documents: {
    panCard: null,
    aadhaarCard: null,
  },
  isLoading: false,
  error: null,
};

const kycSlice = createSlice({
  name: 'kyc',
  initialState,
  reducers: {
    updatePanNumber: (state, action) => {
      state.panNumber = action.payload;
    },
    updateAadhaarNumber: (state, action) => {
      state.aadhaarNumber = action.payload;
    },
    updatePersonalInfo: (state, action) => {
      state.personalInfo = { ...state.personalInfo, ...action.payload };
    },
    updateKycStatus: (state, action) => {
      state.kycStatus = action.payload;
    },
    kycSubmitStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    kycSubmitSuccess: (state) => {
      state.isLoading = false;
      state.kycStatus = 'completed';
    },
    kycSubmitFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearKycError: (state) => {
      state.error = null;
    },
  },
});

export const {
  updatePanNumber,
  updateAadhaarNumber,
  updatePersonalInfo,
  updateKycStatus,
  kycSubmitStart,
  kycSubmitSuccess,
  kycSubmitFailure,
  clearKycError,
} = kycSlice.actions;

export default kycSlice.reducer;