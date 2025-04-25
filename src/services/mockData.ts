import { CryptoAsset } from '../types/crypto';

export const initialCryptoData: CryptoAsset[] = [
  {
    id: 'bitcoin',
    rank: 1,
    name: 'Bitcoin',
    symbol: 'BTC',
    logo: '/icons/btc.png',
    currentPrice: 50000,
    priceChange1h: 0.5,
    priceChange24h: 2.3,
    priceChange7d: -1.2,
    marketCap: 928000000000,
    volume24h: 28000000000,
    circulatingSupply: 19000000,
    maxSupply: 21000000,
    chartData: Array.from({ length: 7 }, () => Math.random() * 1000),
  },
  {
    id: 'ethereum',
    rank: 2,
    name: 'Ethereum',
    symbol: 'ETH',
    logo: '/icons/eth.png',
    currentPrice: 3000,
    priceChange1h: -0.2,
    priceChange24h: 1.5,
    priceChange7d: 3.8,
    marketCap: 360000000000,
    volume24h: 15000000000,
    circulatingSupply: 120000000,
    maxSupply: null,
    chartData: Array.from({ length: 7 }, () => Math.random() * 1000),
  },
  {
    id: 'tether',
    rank: 3,
    name: 'Tether',
    symbol: 'USDT',
    logo: '/icons/usdt.png',
    currentPrice: 1,
    priceChange1h: 0.01,
    priceChange24h: -0.02,
    priceChange7d: 0.05,
    marketCap: 83000000000,
    volume24h: 50000000000,
    circulatingSupply: 83000000000,
    maxSupply: null,
    chartData: Array.from({ length: 7 }, () => Math.random() * 1000),
  },
  {
    id: 'binancecoin',
    rank: 4,
    name: 'BNB',
    symbol: 'BNB',
    logo: '/icons/bnb.png',
    currentPrice: 300,
    priceChange1h: 1.2,
    priceChange24h: -0.8,
    priceChange7d: 2.5,
    marketCap: 50000000000,
    volume24h: 2000000000,
    circulatingSupply: 166801148,
    maxSupply: 200000000,
    chartData: Array.from({ length: 7 }, () => Math.random() * 1000),
  },
  {
    id: 'solana',
    rank: 5,
    name: 'Solana',
    symbol: 'SOL',
    logo: '/icons/sol.png',
    currentPrice: 100,
    priceChange1h: -1.5,
    priceChange24h: 5.2,
    priceChange7d: 10.5,
    marketCap: 40000000000,
    volume24h: 3000000000,
    circulatingSupply: 400000000,
    maxSupply: null,
    chartData: Array.from({ length: 7 }, () => Math.random() * 1000),
  },
  {
    id: 'cardano',
    rank: 6,
    name: 'Cardano',
    symbol: 'ADA',
    logo: '/icons/ada.png',
    currentPrice: 0.45,
    priceChange1h: 0.8,
    priceChange24h: -2.1,
    priceChange7d: 4.3,
    marketCap: 15000000000,
    volume24h: 800000000,
    circulatingSupply: 33000000000,
    maxSupply: 45000000000,
    chartData: Array.from({ length: 7 }, () => Math.random() * 1000),
  },
  {
    id: 'ripple',
    rank: 7,
    name: 'XRP',
    symbol: 'XRP',
    logo: '/icons/xrp.png',
    currentPrice: 0.52,
    priceChange1h: -0.3,
    priceChange24h: 1.8,
    priceChange7d: -2.5,
    marketCap: 28000000000,
    volume24h: 1200000000,
    circulatingSupply: 54000000000,
    maxSupply: 100000000000,
    chartData: Array.from({ length: 7 }, () => Math.random() * 1000),
  },
  {
    id: 'polkadot',
    rank: 8,
    name: 'Polkadot',
    symbol: 'DOT',
    logo: '/icons/dot.png',
    currentPrice: 6.5,
    priceChange1h: 1.2,
    priceChange24h: -1.5,
    priceChange7d: 3.2,
    marketCap: 8000000000,
    volume24h: 400000000,
    circulatingSupply: 1200000000,
    maxSupply: null,
    chartData: Array.from({ length: 7 }, () => Math.random() * 1000),
  },
  {
    id: 'dogecoin',
    rank: 9,
    name: 'Dogecoin',
    symbol: 'DOGE',
    logo: '/icons/doge.png',
    currentPrice: 0.12,
    priceChange1h: -0.5,
    priceChange24h: 3.2,
    priceChange7d: -1.8,
    marketCap: 16000000000,
    volume24h: 900000000,
    circulatingSupply: 130000000000,
    maxSupply: null,
    chartData: Array.from({ length: 7 }, () => Math.random() * 1000),
  },
  {
    id: 'avalanche',
    rank: 10,
    name: 'Avalanche',
    symbol: 'AVAX',
    logo: '/icons/avax.png',
    currentPrice: 35,
    priceChange1h: 0.7,
    priceChange24h: -2.3,
    priceChange7d: 5.6,
    marketCap: 12000000000,
    volume24h: 600000000,
    circulatingSupply: 340000000,
    maxSupply: 720000000,
    chartData: Array.from({ length: 7 }, () => Math.random() * 1000),
  }
];

export class WebSocketSimulator {
  private intervalId: NodeJS.Timeout | null = null;
  private subscribers: ((data: CryptoAsset[]) => void)[] = [];

  subscribe(callback: (data: CryptoAsset[]) => void) {
    this.subscribers.push(callback);
    if (!this.intervalId) {
      this.start();
    }
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
      if (this.subscribers.length === 0) {
        this.stop();
      }
    };
  }

  private start() {
    this.intervalId = setInterval(() => {
      const updatedData = this.generateUpdate();
      this.subscribers.forEach(callback => callback(updatedData));
    }, 1500);
  }

  private stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private generateUpdate(): CryptoAsset[] {
    return initialCryptoData.map(asset => ({
      ...asset,
      currentPrice: this.updatePrice(asset.currentPrice),
      priceChange1h: this.updatePercentage(asset.priceChange1h),
      priceChange24h: this.updatePercentage(asset.priceChange24h),
      priceChange7d: this.updatePercentage(asset.priceChange7d),
      volume24h: this.updateVolume(asset.volume24h),
    }));
  }

  private updatePrice(currentPrice: number): number {
    const changePercent = (Math.random() - 0.5) * 0.02; // ±1% max change
    return +(currentPrice * (1 + changePercent)).toFixed(2);
  }

  private updatePercentage(current: number): number {
    const change = (Math.random() - 0.5) * 0.4; // ±0.2% max change
    return +(current + change).toFixed(2);
  }

  private updateVolume(current: number): number {
    const changePercent = (Math.random() - 0.5) * 0.04; // ±2% max change
    return Math.round(current * (1 + changePercent));
  }
} 