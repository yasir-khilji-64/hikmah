import { QueryClient as TanstackQueryClient } from '@tanstack/react-query';

class QueryClient {
  private static instance: TanstackQueryClient;

  private constructor() {}

  public static GetInstance(): TanstackQueryClient {
    if (!QueryClient.instance) {
      QueryClient.instance = new TanstackQueryClient();
    }
    return QueryClient.instance;
  }
}

const getQueryClient = (): TanstackQueryClient => QueryClient.GetInstance();

export { getQueryClient };
