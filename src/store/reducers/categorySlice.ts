import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import initialData from '@/utility/data/categorysliderone';
import { Category } from '@/types/data.types';
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import categoryService from "@/services/categoryService";

// Async thunks for cart operations
export const fetchCart = createAsyncThunk(
  'cat/fetchCategory',
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const category = await categoryService.getCategoryList(page);
      return category;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);


interface InitialState {
  data: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: InitialState = {
  data: initialData,
  loading: false,
  error: null,
};

export const categoryslideroneSlice = createSlice({
  name: 'categorysliderone',
  initialState,
  reducers: {},
});

export const persistConfigCategorysliderone = { key: "categorysliderone", storage };

export const persistedCategoryslideroneReducer = persistReducer(persistConfigCategorysliderone,categoryslideroneSlice.reducer);

export default categoryslideroneSlice.reducer;