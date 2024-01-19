import axios, { AxiosResponse, AxiosError } from "axios";

interface InternalAxiosResponse extends AxiosResponse {
  status: number;
}

const Api = axios.create({
  baseURL: "/api",
  // timeout: 5000,
});

Api.interceptors.response.use(
  (response: InternalAxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

interface ApiResponse<T> {
  data: T;
}

interface ApiError {
  error: string;
  status: number;
  message: string;
}

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
  config,
}: {
  endpoint: string;
  payload: any;
  config?: InternalAxiosResponse;
}): Promise<AxiosResponse<ApiResponse<T>>> => {
  return await Api.post<ApiResponse<T>>(endpoint, payload, config);
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
