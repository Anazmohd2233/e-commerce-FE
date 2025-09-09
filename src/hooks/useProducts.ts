import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import { RootState, AppDispatch } from "../store";
import { clearError, clearProducts, fetchProductById, fetchProductsList } from "@/store/reducers/productSlice";

export const useProducts = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { productsList, productView, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  // Actions
  const getProductsList = useCallback(
    (page: number = 1) => dispatch(fetchProductsList(page)),
    [dispatch]
  );

  const getProductsView = useCallback(
    (page: number = 1) => dispatch(fetchProductById(page)),
    [dispatch]
  );

  const clearProductError = useCallback(() => dispatch(clearError()), [dispatch]);
  const resetProducts = useCallback(() => dispatch(clearProducts()), [dispatch]);

  return {
    productsList,
    productView,
    loading,
    error,
    getProductsList,
    getProductsView,
    clearProductError,
    resetProducts,
  };
};
