import axios, { AxiosInstance } from 'axios';

class AxiosClient {
  private static instance: AxiosInstance;

  private constructor() {}

  public static GetInstance(): AxiosInstance {
    if (!AxiosClient.instance) {
      AxiosClient.instance = axios.create({
        baseURL: 'http://127.0.0.1:3030',
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    return AxiosClient.instance;
  }
}

const getAxiosClient = (): AxiosInstance => AxiosClient.GetInstance();

export { getAxiosClient };
