import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import categoryService from "@/services/categoryService";
import { Category } from "@/types/data.types"; // 👈 make sure SubCategory type exists

// ✅ Async thunk to fetch categories
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const response = await categoryService.getCategoryList(page);

      return response.data.category; // ✅ returns array
    } catch (error: any) {
      console.error("❌ fetch Categories error", error);

      return rejectWithValue(error.message);
    }
  }
);

// ✅ Async thunk to fetch subcategories
export const fetchSubCategories = createAsyncThunk(
  "categories/fetchSubCategories",
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const response = await categoryService.getSubCategoryList(page);
      // response looks like { success, message, instance, data: { items, total, limit } }

      return response.data.items; // ✅ use data.items
    } catch (error: any) {
      console.error("❌ fetch sub Categories error", error);

      return rejectWithValue(error.message);
    }
  }
);

interface CategoryState {
  categories: any;
  subCategories: any;
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: null,
  subCategories: null,
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    // Synchronous actions
    clearError: (state) => {
      state.error = null;
    },

    clearCategory: (state) => {
      state.categories = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch cart cases
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Add to cart cases
      .addCase(fetchSubCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.subCategories = action.payload;
      })
      .addCase(fetchSubCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCategory } = categorySlice.actions;

export const persistConfigCategories = { key: "categories", storage };

export const persistedCategoryReducer = persistReducer(
  persistConfigCategories,
  categorySlice.reducer
);

export default categorySlice.reducer;
