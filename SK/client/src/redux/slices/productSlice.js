import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchProducts = createAsyncThunk('products/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const { data } = await axios.get('/api/products', { params });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch products');
  }
});

export const fetchFeatured = createAsyncThunk('products/featured', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get('/api/products/featured');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchBestSellers = createAsyncThunk('products/bestSellers', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get('/api/products/bestsellers');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchProductById = createAsyncThunk('products/byId', async (id, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`/api/products/${id}`);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [], featured: [], bestSellers: [],
    currentProduct: null, count: 0, pages: 1, page: 1,
    loading: false, error: null,
  },
  reducers: { clearCurrentProduct: s => { s.currentProduct = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, s => { s.loading = true; })
      .addCase(fetchProducts.fulfilled, (s, a) => {
        s.loading = false; s.items = a.payload.products;
        s.count = a.payload.count; s.pages = a.payload.pages; s.page = a.payload.page;
      })
      .addCase(fetchProducts.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchFeatured.fulfilled, (s, a) => { s.featured = a.payload; })
      .addCase(fetchBestSellers.fulfilled, (s, a) => { s.bestSellers = a.payload; })
      .addCase(fetchProductById.pending, s => { s.loading = true; })
      .addCase(fetchProductById.fulfilled, (s, a) => { s.loading = false; s.currentProduct = a.payload; })
      .addCase(fetchProductById.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
  },
});

export const { clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;
