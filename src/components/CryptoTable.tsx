import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  TextField,
  TableSortLabel,
  useMediaQuery,
  useTheme,
  Chip,
  Typography,
} from '@mui/material';
import { styled } from '@mui/system';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import { selectFilteredAndSortedAssets, selectSortBy, setSort, setFilter, updateAssets } from '../store/cryptoSlice';
import { WebSocketSimulator } from '../services/mockData';
import { CryptoAsset } from '../types/crypto';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.background.paper,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  transition: 'background-color 0.2s',
}));

const PriceChangeCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 600,
}));

const CryptoTable: React.FC = () => {
  const dispatch = useDispatch();
  const assets = useSelector(selectFilteredAndSortedAssets);
  const sortBy = useSelector(selectSortBy);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const ws = new WebSocketSimulator();
    const unsubscribe = ws.subscribe((data) => {
      dispatch(updateAssets(data));
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  const handleSort = (field: keyof CryptoAsset) => {
    const direction = sortBy?.field === field && sortBy.direction === 'asc' ? 'desc' : 'asc';
    dispatch(setSort({ field, direction }));
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFilter(event.target.value));
  };

  const formatNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <Box sx={{ width: '100%' }}>
      <TextField
        label="Search cryptocurrencies"
        variant="outlined"
        onChange={handleFilterChange}
        fullWidth
        margin="normal"
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
          },
        }}
      />
      <TableContainer 
        component={Paper} 
        sx={{ 
          borderRadius: 2,
          boxShadow: 'none',
          background: 'transparent',
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy?.field === 'currentPrice'}
                  direction={sortBy?.field === 'currentPrice' ? sortBy.direction : 'asc'}
                  onClick={() => handleSort('currentPrice')}
                >
                  Price
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy?.field === 'priceChange24h'}
                  direction={sortBy?.field === 'priceChange24h' ? sortBy.direction : 'asc'}
                  onClick={() => handleSort('priceChange24h')}
                >
                  24h
                </TableSortLabel>
              </TableCell>
              {!isMobile && (
                <>
                  <TableCell>Market Cap</TableCell>
                  <TableCell>Volume (24h)</TableCell>
                </>
              )}
              <TableCell>7d Chart</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assets.map((asset) => (
              <StyledTableRow key={asset.id}>
                <TableCell>{asset.rank}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <img 
                      src={asset.logo} 
                      alt={asset.symbol} 
                      style={{ 
                        width: 32, 
                        height: 32,
                        borderRadius: '50%',
                        objectFit: 'cover',
                      }} 
                    />
                    <Box>
                      <Typography variant="body1" fontWeight={600}>
                        {asset.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {asset.symbol}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography fontWeight={600}>
                    {formatPrice(asset.currentPrice)}
                  </Typography>
                </TableCell>
                <PriceChangeCell 
                  sx={{ 
                    color: asset.priceChange24h >= 0 ? 
                      theme.palette.success.main : 
                      theme.palette.error.main 
                  }}
                >
                  <Chip
                    label={`${asset.priceChange24h >= 0 ? '+' : ''}${asset.priceChange24h.toFixed(2)}%`}
                    size="small"
                    sx={{
                      backgroundColor: asset.priceChange24h >= 0 ? 
                        'rgba(0, 255, 136, 0.1)' : 
                        'rgba(255, 0, 0, 0.1)',
                      color: 'inherit',
                      fontWeight: 600,
                    }}
                  />
                </PriceChangeCell>
                {!isMobile && (
                  <>
                    <TableCell>{formatNumber(asset.marketCap)}</TableCell>
                    <TableCell>{formatNumber(asset.volume24h)}</TableCell>
                  </>
                )}
                <TableCell sx={{ width: 200 }}>
                  <ResponsiveContainer width="100%" height={50}>
                    <LineChart data={asset.chartData.map((value, index) => ({ value }))}>
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={asset.priceChange7d >= 0 ? theme.palette.success.main : theme.palette.error.main}
                        strokeWidth={2}
                        dot={false}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: theme.palette.background.paper,
                          border: 'none',
                          borderRadius: 8,
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CryptoTable; 