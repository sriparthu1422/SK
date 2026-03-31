import { createSlice } from '@reduxjs/toolkit';

const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: savedWishlist,
  },
  reducers: {
    toggleWishlist: (state, action) => {
      const product = action.payload;
      const idx = state.items.findIndex(i => i._id === product._id);
      if (idx >= 0) {
        state.items.splice(idx, 1);
      } else {
        state.items.push(product);
      }
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter(i => i._id !== action.payload);
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    },
    clearWishlist: (state) => {
      state.items = [];
      localStorage.removeItem('wishlist');
    },
  },
});

export const { toggleWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export const selectWishlistItems = state => state.wishlist.items;
export const selectWishlistCount = state => state.wishlist.items.length;
export const selectIsWishlisted = (state, productId) =>
  state.wishlist.items.some(i => i._id === productId);
export default wishlistSlice.reducer;
