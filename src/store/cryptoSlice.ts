import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CryptoState, CryptoAsset } from '../types/crypto';
import { initialCryptoData } from '../services/mockData';

const initialState: CryptoState = {
  assets: initialCryptoData,
  status: 'idle',
  sortBy: null,
  filter: '',
};

export const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    updateAssets: (state, action: PayloadAction<CryptoAsset[]>) => {
      state.assets = action.payload;
    },
    setStatus: (state, action: PayloadAction<CryptoState['status']>) => {
      state.status = action.payload;
    },
    setSort: (state, action: PayloadAction<{ field: keyof CryptoAsset; direction: 'asc' | 'desc' } | null>) => {
      state.sortBy = action.payload;
    },
    setFilter: (state, action: PayloadAction<string>) => {
      state.filter = action.payload;
    },
  },
});

export const { updateAssets, setStatus, setSort, setFilter } = cryptoSlice.actions;

// Selectors
export const selectAllAssets = (state: { crypto: CryptoState }) => state.crypto.assets;
export const selectStatus = (state: { crypto: CryptoState }) => state.crypto.status;
export const selectSortBy = (state: { crypto: CryptoState }) => state.crypto.sortBy;
export const selectFilter = (state: { crypto: CryptoState }) => state.crypto.filter;

export const selectFilteredAndSortedAssets = (state: { crypto: CryptoState }) => {
  const { assets, filter, sortBy } = state.crypto;
  
  // Filter assets
  const filteredAssets = filter
    ? assets.filter(asset => 
        asset.name.toLowerCase().includes(filter.toLowerCase()) ||
        asset.symbol.toLowerCase().includes(filter.toLowerCase())
      )
    : assets;

  // Sort assets
  if (!sortBy) return filteredAssets;

  return [...filteredAssets].sort((a, b) => {
    const aValue = a[sortBy.field];
    const bValue = b[sortBy.field];

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortBy.direction === 'asc' ? aValue - bValue : bValue - aValue;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortBy.direction === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });
};

export default cryptoSlice.reducer; 