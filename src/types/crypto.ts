export interface CryptoAsset {
  id: string;
  rank: number;
  name: string;
  symbol: string;
  logo: string;
  currentPrice: number;
  priceChange1h: number;
  priceChange24h: number;
  priceChange7d: number;
  marketCap: number;
  volume24h: number;
  circulatingSupply: number;
  maxSupply: number | null;
  chartData: number[];
}

export interface CryptoState {
  assets: CryptoAsset[];
  status: 'idle' | 'loading' | 'failed';
  sortBy: {
    field: keyof CryptoAsset;
    direction: 'asc' | 'desc';
  } | null;
  filter: string;
} 