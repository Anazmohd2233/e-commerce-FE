import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { RootState, AppDispatch } from '../store';
import {
  fetchCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  validateCoupon,
  clearError,
  clearCouponValidation,
  applyCoupon,
  clearCart,
} from '../store/reducers/cartSlice';


export const useCart = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Select cart state from Redux store
  const {
    cart,
    loading,
    error,
    couponValidation,
    appliedCoupon,
  } = useSelector((state: RootState) => state.cart);

  // Cart actions
  const getCart = useCallback(
    (page: number = 1) => dispatch(fetchCart(page)),
    [dispatch]
  );

  const addItemToCart = useCallback(
    (cartData: any) => dispatch(addToCart(cartData)),
    [dispatch]
  );

  const updateItem = useCallback(
    (updateData: any) => dispatch(updateCartItem(updateData)),
    [dispatch]
  );

  const removeItem = useCallback(
    (itemId: string) => dispatch(removeCartItem(itemId)),
    [dispatch]
  );

  const checkCoupon = useCallback(
    (couponData: any) => dispatch(validateCoupon(couponData)),
    [dispatch]
  );

  const clearCartError = useCallback(
    () => dispatch(clearError()),
    [dispatch]
  );

  const clearCoupon = useCallback(
    () => dispatch(clearCouponValidation()),
    [dispatch]
  );

  const setCoupon = useCallback(
    (couponCode: string) => dispatch(applyCoupon(couponCode)),
    [dispatch]
  );

  const emptyCart = useCallback(
    () => dispatch(clearCart()),
    [dispatch]
  );

  // Computed values
  const cartItems = cart?.items || [];
  const cartTotal = cart?.totals?.totalPayable || 0;
  const cartSubTotal = cart?.totals?.subTotal || 0;
  const cartTax = cart?.totals?.totalTax || 0;
  const cartItemCount = cartItems.length;
  const cartQuantityCount = cartItems.reduce((total: number, item: any) => total + (item?.quantity || 0), 0);
  const isEmpty = cartItems.length === 0;

  // Helper functions
  const isProductInCart = useCallback(
    (productId: string, variantId?: string): boolean => {
      return cartItems.some((item: any) => {
        const productMatch = item?.product?.id === productId;
        const variantMatch = variantId 
          ? item?.productVariant?.id === variantId 
          : !item?.productVariant;
        return productMatch && variantMatch;
      });
    },
    [cartItems]
  );

  const getCartItem = useCallback(
    (productId: string, variantId?: string) => {
      return cartItems.find((item: any) => {
        const productMatch = item?.product?.id === productId;
        const variantMatch = variantId 
          ? item?.productVariant?.id === variantId 
          : !item?.productVariant;
        return productMatch && variantMatch;
      });
    },
    [cartItems]
  );

  const getItemQuantity = useCallback(
    (productId: string, variantId?: string): number => {
      const item = getCartItem(productId, variantId);
      return item?.quantity || 0;
    },
    [getCartItem]
  );

  return {
    // State
    cart,
    cartItems,
    loading,
    error,
    couponValidation,
    appliedCoupon,
    
    // Computed values
    cartTotal,
    cartSubTotal,
    cartTax,
    cartItemCount,
    cartQuantityCount,
    isEmpty,
    
    // Actions
    getCart,
    addItemToCart,
    updateItem,
    removeItem,
    checkCoupon,
    clearCartError,
    clearCoupon,
    setCoupon,
    emptyCart,
    
    // Helper functions
    isProductInCart,
    getCartItem,
    getItemQuantity,
  };
};
