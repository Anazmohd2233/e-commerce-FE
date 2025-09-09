import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import { RootState, AppDispatch } from "../store";
import { fetchCategories, fetchSubCategories, clearError, clearCategory } from "../store/reducers/categorySlice";

export const useCategory = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Select category + subcategory state
  const { categories, subCategories, loading, error } = useSelector(
    (state: RootState) => state.categories
  );

  // Actions
  const getCategories = useCallback(
    (page: number = 1) => dispatch(fetchCategories(page)),
    [dispatch]
  );

  const getSubCategories = useCallback(
    (page: number = 1) => dispatch(fetchSubCategories(page)),
    [dispatch]
  );

  const clearCategoryError = useCallback(() => dispatch(clearError()), [dispatch]);
  const resetCategories = useCallback(() => dispatch(clearCategory()), [dispatch]);

  return {
    categories,
    subCategories,
    loading,
    error,
    getCategories,
    getSubCategories,
    clearCategoryError,
    resetCategories,
  };
};
