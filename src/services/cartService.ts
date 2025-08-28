import { apiClient, API_ENDPOINTS } from './api';


export type Product = any;
export type ProductVariant = any;
export type CartItem = any;
export type CartTotals = any;
export type Cart = any;

export type BackendResponse = any;

export type AddToCartData = any;
export type UpdateCartData = any;
export type ValidateCouponData = any;
export type CouponValidationResult = any;

// Cart Service Functions
export const cartService = {
  // Get cart items with pagination
  getCartList: async (page: number = 1): Promise<any> => {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.CART_LIST}/${page}`
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch cart');
      }

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch cart');
    }
  },

  // Add item to cart
  addToCart: async (cartData: any): Promise<any> => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.ADD_TO_CART,
        cartData
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to add item to cart');
      }

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to add item to cart');
    }
  },

  // Update cart item quantity
  updateCartItem: async (updateData: any): Promise<any> => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.UPDATE_CART,
        updateData
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update cart item');
      }

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to update cart item');
    }
  },

  // Remove item from cart (by setting quantity to 0)
  removeFromCart: async (itemId: string): Promise<any> => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.UPDATE_CART,
        {
          itemId,
          quantity: 0
        }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to remove item from cart');
      }

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to remove item from cart');
    }
  },

  // Validate coupon code
  validateCoupon: async (couponData: any): Promise<any> => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.VALIDATE_COUPON,
        couponData
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to validate coupon');
      }

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to validate coupon');
    }
  },

  // Get cart item count
  getCartItemCount: async (): Promise<number> => {
    try {
      const cart = await cartService.getCartList(1);
      return cart.items?.length || 0;
    } catch (error) {
      console.error('Failed to get cart item count:', error);
      return 0;
    }
  },

  // Calculate cart total
  calculateCartTotal: (items: any[]): number => {
    return items.reduce((total, item) => {
      return total + parseFloat(item.subTotal);
    }, 0);
  },

  // Check if product is in cart
  isProductInCart: (items: any[], productId: string, variantId?: string): boolean => {
    return items.some((item: any) => {
      const productMatch = item.product.id === productId;
      const variantMatch = variantId 
        ? item.productVariant?.id === variantId 
        : !item.productVariant;
      return productMatch && variantMatch;
    });
  },

  // Get cart item by product and variant
  getCartItem: (items: any[], productId: string, variantId?: string): any => {
    return items.find((item: any) => {
      const productMatch = item.product.id === productId;
      const variantMatch = variantId 
        ? item.productVariant?.id === variantId 
        : !item.productVariant;
      return productMatch && variantMatch;
    });
  }
};

export default cartService;
