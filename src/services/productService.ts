import { apiClient, API_ENDPOINTS } from "./api";



// Cart Service Functions
const productService = {
  // Get category items with pagination
  getProductsList: async (page: number = 1): Promise<any> => {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.PRODUCT_LIST}/${page}`
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch  procuts list");
      }
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch procuts list"
      );
    }
  },

  viewProduct: async (): Promise<any> => {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.PRODUCT_VIEW}`
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch product "
        );
      }

      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch product"
      );
    }
  },
};

export default productService;
