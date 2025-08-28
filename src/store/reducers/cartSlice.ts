import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { cartService } from "../../services/cartService";

// Async thunks for cart operations
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const cart = await cartService.getCartList(page);
      return cart;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (cartData: any, { rejectWithValue }) => {
    try {
      const cart = await cartService.addToCart(cartData);
      return cart;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async (updateData: any, { rejectWithValue }) => {
    try {
      const cart = await cartService.updateCartItem(updateData);
      return cart;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeCartItem = createAsyncThunk(
  'cart/removeCartItem',
  async (itemId: string, { rejectWithValue }) => {
    try {
      const cart = await cartService.removeFromCart(itemId);
      return cart;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const validateCoupon = createAsyncThunk(
  'cart/validateCoupon',
  async (couponData: any, { rejectWithValue }) => {
    try {
      const result = await cartService.validateCoupon(couponData);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

interface CartState {
  cart: any;
  loading: boolean;
  error: string | null;
  couponValidation: any;
  appliedCoupon: string | null;
}

const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
  couponValidation: null,
  appliedCoupon: null,
};





const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Synchronous actions
    clearError: (state) => {
      state.error = null;
    },
    clearCouponValidation: (state) => {
      state.couponValidation = null;
      state.appliedCoupon = null;
    },
    applyCoupon: (state, action) => {
      state.appliedCoupon = action.payload;
    },
    clearCart: (state) => {
      state.cart = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch cart cases
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Add to cart cases
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update cart item cases
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Remove cart item cases
      .addCase(removeCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Validate coupon cases
      .addCase(validateCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validateCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.couponValidation = action.payload;
      })
      .addCase(validateCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCouponValidation, applyCoupon, clearCart } = cartSlice.actions;

export const persistConfigCart = { key: "cart", storage };

export const persistedCartReducer = persistReducer(persistConfigCart, cartSlice.reducer);

export default cartSlice.reducer;
