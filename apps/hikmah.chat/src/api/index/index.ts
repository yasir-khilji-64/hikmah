import { ApiResponse, HealthCheckResponse } from '@hikmah/contracts';
import { getAxiosClient } from '../../services/axios-client';

const axiosClient = getAxiosClient();

const getHealthCheck = async (): Promise<HealthCheckResponse> => {
  try {
    const response =
      await axiosClient.get<HealthCheckResponse>('/health-check');
    if (response.status === 503) {
      throw new Error('Service unavailable');
    }
    return response.data;
  } catch (_error) {
    throw new Error('Service unavailable');
  }
};

const getOllamaModels = async (): Promise<ApiResponse<string[]>> => {
  try {
    const response =
      await axiosClient.get<ApiResponse<string[]>>(`/list-models`);
    if (response.status !== 200) {
      throw new Error('Error fetching models');
    }
    return response.data;
  } catch (_error) {
    throw new Error('Error fetching models');
  }
};

export { getHealthCheck, getOllamaModels };
