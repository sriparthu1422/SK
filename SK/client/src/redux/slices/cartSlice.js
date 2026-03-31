import { createSlice } from '@reduxjs/toolkit';

const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: savedCart,
    isDrawerOpen: false,
  },
  reducers: {
    addToCart: (state, action) => {
      const { product, color, quantity = 1 } = action.payload;
      const existing = state.items.find(i => i._id === product._id && i.selectedColor === color);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ ...product, selectedColor: color, quantity });
      }
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(i => !(i._id === action.payload._id && i.selectedColor === action.payload.color));
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    updateQuantity: (state, action) => {
      const { _id, color, quantity } = action.payload;
      const item = state.items.find(i => i._id === _id && i.selectedColor === color);
      if (item) item.quantity = quantity;
      if (item && item.quantity <= 0) {
        state.items = state.items.filter(i => !(i._id === _id && i.selectedColor === color));
      }
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('cart');
    },
    openDrawer: (state) => { state.isDrawerOpen = true; },
    closeDrawer: (state) => { state.isDrawerOpen = false; },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, openDrawer, closeDrawer } = cartSlice.actions;
export const selectCartItems = state => state.cart.items;
export const selectCartTotal = state => state.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
export const selectCartCount = state => state.cart.items.reduce((sum, i) => sum + i.quantity, 0);
export const selectDrawerOpen = state => state.cart.isDrawerOpen;
export default cartSlice.reducer;
