import axios, { AxiosResponse, AxiosError } from "axios";

/**
 interface InternalAxiosRequestConfig {
  // Define your Axios request config interface here if needed
}
 */

const Api = axios.create({
  baseURL: "/api",
});

Api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

// Define your response data interfaces here as needed
interface ApiResponse<T> {
  data: T;
}

/**
interface ApiError {
  // Define error properties as needed
  message: string;
}

 */
export const getRequest = async <T>({
  endpoint,
}: {
  endpoint: string;
}): Promise<AxiosResponse<ApiResponse<T>>> => {
  return await Api.get<ApiResponse<T>>(endpoint);
};

export const postRequest = async <T>({
  endpoint,
  payload,
 // config,
}: {
  endpoint: string;
  payload: any;
 // config?: InternalAxiosRequestConfig;
}): Promise<AxiosResponse<ApiResponse<T>>> => {
  return await Api.post<ApiResponse<T>>(endpoint, payload);
};

export const putRequest = async <T>({
  endpoint,
  payload,
}: {
  endpoint: string;
  payload: any;
}): Promise<AxiosResponse<ApiResponse<T>>> => {
  return await Api.put<ApiResponse<T>>(endpoint, payload);
};

export const patchRequest = async <T>({
  endpoint,
  payload,
}: {
  endpoint: string;
  payload: any;
}): Promise<AxiosResponse<ApiResponse<T>>> => {
  return await Api.patch<ApiResponse<T>>(endpoint, payload);
};

export const deleteRequest = async <T>({
  endpoint,
}: {
  endpoint: string;
}): Promise<AxiosResponse<ApiResponse<T>>> => {
  return await Api.delete<ApiResponse<T>>(endpoint);
};