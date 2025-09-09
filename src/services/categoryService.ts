import { apiClient, API_ENDPOINTS } from "./api";

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
const categoryService = {
  // Get category items with pagination
  getCategoryList: async (page: number = 1): Promise<any> => {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.GET_CATEGORY}/${page}`
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch category");
      }
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch category"
      );
    }
  },

  getSubCategoryList: async (page: number = 1): Promise<any> => {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.GET_SUB_CATEGORY}/${page}`
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch sub category"
        );
      }

      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch sub category"
      );
    }
  },
};

export default categoryService;
