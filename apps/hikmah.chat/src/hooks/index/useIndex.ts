import {
  useQuery,
  UseQueryResult,
  useSuspenseQuery,
  UseSuspenseQueryResult,
} from '@tanstack/react-query';
import { getHealthCheck, getOllamaModels } from '../../api/index';
import { ApiResponse, HealthCheckResponse } from '@hikmah/contracts';

const useHealthCheck = (): UseQueryResult<HealthCheckResponse, Error> => {
  return useQuery({
    queryKey: ['health-check'],
    queryFn: getHealthCheck,
    retry: 1,
    staleTime: 60 * 1000,
    refetchInterval: 30 * 1000,
  });
};

const useModels = (): UseSuspenseQueryResult<ApiResponse<string[]>, Error> => {
  return useSuspenseQuery({
    queryKey: ['models'],
    queryFn: getOllamaModels,
    retry: 3,
    staleTime: 5 * 60 * 1000,
  });
};

export { useHealthCheck, useModels };
