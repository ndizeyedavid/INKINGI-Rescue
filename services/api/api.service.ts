import { API_CONFIG, buildUrl } from "@/config/api.config";
import { AxiosResponse } from "axios";
import axiosInstance from "./axios.instance";

/**
 * API Service
 *
 * This file provides a clean interface for making API calls.
 * All API requests should go through these methods.
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class ApiService {
  /**
   * Generic GET request
   */
  async get<T = any>(
    endpoint: string,
    params?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await axiosInstance.get(endpoint, {
        params,
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  /**
   * Generic POST request
   */
  async post<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await axiosInstance.post(
        endpoint,
        data
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  /**
   * Generic PUT request
   */
  async put<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await axiosInstance.put(
        endpoint,
        data
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  /**
   * Generic PATCH request
   */
  async patch<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await axiosInstance.patch(
        endpoint,
        data
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  /**
   * Generic DELETE request
   */
  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await axiosInstance.delete(endpoint);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  /**
   * Upload file with FormData
   */
  async upload<T = any>(
    endpoint: string,
    formData: FormData
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await axiosInstance.post(
        endpoint,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  /**
   * Error handler
   */
  private handleError(error: any): ApiResponse {
    // Handle array of error messages from backend validation
    let message = "An error occurred";

    if (error.response?.data?.message) {
      const errorMessage = error.response.data.message;
      // If it's an array of validation errors, join them
      if (Array.isArray(errorMessage)) {
        message = errorMessage.join(", ");
      } else {
        message = errorMessage;
      }
    } else if (error.message) {
      message = error.message;
    }

    // Log error for debugging but don't crash
    if (__DEV__) {
      console.log("API Error handled:", {
        status: error.response?.status,
        message,
        url: error.config?.url,
      });
    }

    return {
      success: false,
      error: message,
      message,
    };
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export specific API methods for common operations
export const authApi = {
  login: (email: string, password: string) =>
    apiService.post(API_CONFIG.ENDPOINTS.LOGIN, { email, password }),

  register: (data: {
    firstName?: string;
    lastName?: string;
    name?: string;
    email: string;
    password: string;
    phoneNumber: string;
  }) => apiService.post(API_CONFIG.ENDPOINTS.REGISTER, data),

  logout: () => apiService.post(API_CONFIG.ENDPOINTS.LOGOUT),
};

export const userApi = {
  getAll: () => apiService.get(API_CONFIG.ENDPOINTS.GET_ALL_USERS),

  getById: (id: string) =>
    apiService.get(buildUrl(API_CONFIG.ENDPOINTS.GET_USER_BY_ID, { id })),

  // Get current authenticated user profile
  getProfile: () => apiService.get(API_CONFIG.ENDPOINTS.GET_USER_PROFILE),

  update: (id: string, data: any) =>
    apiService.patch(buildUrl(API_CONFIG.ENDPOINTS.UPDATE_USER, { id }), data),

  updateProfile: (data: any) =>
    apiService.patch(API_CONFIG.ENDPOINTS.UPDATE_USER_PROFILE, data),

  uploadProfileImage: (formData: FormData) =>
    apiService.post(API_CONFIG.ENDPOINTS.UPLOAD_PROFILE_IMAGE, formData),

  delete: (id: string) =>
    apiService.delete(buildUrl(API_CONFIG.ENDPOINTS.DELETE_USER, { id })),
  getStats: (id: string) =>
    apiService.get(buildUrl(API_CONFIG.ENDPOINTS.GET_USER_STATS, { id })),
};

export const emergencyApi = {
  create: (data: any) =>
    apiService.post(API_CONFIG.ENDPOINTS.CREATE_EMERGENCY_WITH_MEDIA, data),

  getAll: (params?: any) =>
    apiService.get(API_CONFIG.ENDPOINTS.GET_ALL_EMERGENCIES, params),

  getNearby: (params?: any) =>
    apiService.get(API_CONFIG.ENDPOINTS.GET_NEARBY_EMERGENCIES, params),

  getById: (id: string) =>
    apiService.get(buildUrl(API_CONFIG.ENDPOINTS.GET_EMERGENCY_BY_ID, { id })),

  update: (id: string, data: any) =>
    apiService.patch(
      buildUrl(API_CONFIG.ENDPOINTS.UPDATE_EMERGENCY, { id }),
      data
    ),

  delete: (id: string) =>
    apiService.delete(buildUrl(API_CONFIG.ENDPOINTS.DELETE_EMERGENCY, { id })),

  updateStatus: (id: string, data: any) =>
    apiService.patch(
      buildUrl(API_CONFIG.ENDPOINTS.UPDATE_EMERGENCY_STATUS, { id }),
      data
    ),

  assignResponder: (id: string, data: any) =>
    apiService.post(
      buildUrl(API_CONFIG.ENDPOINTS.ASSIGN_RESPONDER, { id }),
      data
    ),

  addUpdate: (id: string, data: any) =>
    apiService.post(
      buildUrl(API_CONFIG.ENDPOINTS.ADD_EMERGENCY_UPDATE, { id }),
      data
    ),

  volunteer: (id: string, data: { message: string; skills: string }) =>
    apiService.post(
      buildUrl(API_CONFIG.ENDPOINTS.VOLUNTEER_FOR_EMERGENCY, { id }),
      data
    ),

  deleteVolunteer: (emergencyId: string, volunteerId: string) =>
    apiService.delete(
      buildUrl(API_CONFIG.ENDPOINTS.DELETE_VOLUNTEER, { emergencyId, volunteerId })
    ),
};

// Community Posts API
export const postsApi = {
  getAll: () => apiService.get(API_CONFIG.ENDPOINTS.GET_ALL_POSTS),

  getById: (id: string) =>
    apiService.get(buildUrl(API_CONFIG.ENDPOINTS.GET_POST_BY_ID, { id })),

  create: (data: any) =>
    apiService.post(API_CONFIG.ENDPOINTS.CREATE_POST, data),

  update: (id: string, data: any) =>
    apiService.patch(buildUrl(API_CONFIG.ENDPOINTS.UPDATE_POST, { id }), data),

  delete: (id: string) =>
    apiService.delete(buildUrl(API_CONFIG.ENDPOINTS.DELETE_POST, { id })),

  like: (id: string) =>
    apiService.post(buildUrl(API_CONFIG.ENDPOINTS.LIKE_POST, { id })),

  unlike: (id: string) =>
    apiService.delete(buildUrl(API_CONFIG.ENDPOINTS.UNLIKE_POST, { id })),

  getComments: (id: string) =>
    apiService.get(buildUrl(API_CONFIG.ENDPOINTS.GET_POST_COMMENTS, { id })),

  createComment: (id: string, data: { content: string }) =>
    apiService.post(buildUrl(API_CONFIG.ENDPOINTS.CREATE_COMMENT, { id }), data),

  deleteComment: (postId: string, commentId: string) =>
    apiService.delete(buildUrl(API_CONFIG.ENDPOINTS.DELETE_COMMENT, { postId, commentId })),
};


// Health API
export const healthApi = {
  check: () => apiService.get(API_CONFIG.ENDPOINTS.HEALTH_CHECK),
};
