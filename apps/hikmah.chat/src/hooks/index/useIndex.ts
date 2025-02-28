import { useQuery, UseQueryResult } from '@tanstack/react-query';
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

const useModels = (
  shouldFetch: boolean,
): UseQueryResult<ApiResponse<string[]>, Error> => {
  return useQuery({
    queryKey: ['models'],
    queryFn: getOllamaModels,
    enabled: shouldFetch,
  });
};

export { useHealthCheck, useModels };
