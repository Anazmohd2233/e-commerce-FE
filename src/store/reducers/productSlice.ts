import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import productService from "@/services/productService";

// ✅ Async thunk to fetch categories
export const fetchProductsList = createAsyncThunk(
  "products/fetchProductsList",
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const response = await productService.getProductsList(page);
      console.log(
        "response.data from product listing slice",
        response.data.items
      );

      return response.data.items; // ✅ returns array
    } catch (error: any) {
      console.error("❌ fetch Product error", error);

      return rejectWithValue(error.message);
    }
  }
);

// ✅ Async thunk to fetch subcategories
export const fetchProductById= createAsyncThunk(
  "products/fetchProductById",
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const response = await productService.viewProduct();
      console.log(
        "response.data from product viedw  slice",
        response.data.items
      );

      return response.data; // ✅ use data.items
    } catch (error: any) {
      console.error("❌ fetch Product view error", error);

      return rejectWithValue(error.message);
    }
  }
);

interface ProductState {
  productsList: any;
  productView: any;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  productsList: null,
  productView: null,
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    // Synchronous actions
    clearError: (state) => {
      state.error = null;
    },

    clearProducts: (state) => {
      state.productsList = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch cart cases
    builder
      .addCase(fetchProductsList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsList.fulfilled, (state, action) => {
        state.loading = false;
        state.productsList = action.payload;
      })
      .addCase(fetchProductsList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Add to cart cases
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.productView = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearProducts } = productSlice.actions;

export const persistConfigProducts = { key: "products", storage };

export const persistedProductsReducer = persistReducer(
  persistConfigProducts,
  productSlice.reducer
);

export default productSlice.reducer;
