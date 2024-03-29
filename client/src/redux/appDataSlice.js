import { createSelector, createSlice } from '@reduxjs/toolkit';

const initialState = {
  walletAddress: null,
  userData: null,
  isOwner: false,
  message: '',
  loading: true,
};

export const appDataSlice = createSlice({
  name: 'appData',
  initialState,
  reducers: {
    setWalletAddress: (state, action) => {
      state.walletAddress = action.payload;
    },

    setUserData: (state, action) => {
      state.userData = action.payload;
    },

    setIsOwer: (state, action) => {
      state.isOwner = action.payload;
    },

    setMessage: (state, action) => {
      state.message = action.payload;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setWalletAddress, setUserData, setIsOwer, setMessage, setLoading, setTxStatus } = appDataSlice.actions;
export const walletAddressSelector = createSelector(
  (state) => state.appData,
  (appData) => appData.walletAddress
);
export const userDataSelector = createSelector(
  (state) => state.appData,
  (appData) => appData.userData
);
export const isOwnerSelector = createSelector(
  (state) => state.appData,
  (appData) => appData.isOwner
);
export const messageSelector = createSelector(
  (state) => state.appData,
  (appData) => appData.message
);
export const loadingSelector = createSelector(
  (state) => state.appData,
  (appData) => appData.loading
);

export default appDataSlice.reducer;
