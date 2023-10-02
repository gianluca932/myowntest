import { AxiosInstance, AxiosResponse } from "axios";
import dotenv from "dotenv";

dotenv.config();

const networkDelayEnabled =
  process.env.REACT_APP_NETWORK_DELAY_ENABLED === "true";

const onResponse = (response: AxiosResponse): Promise<AxiosResponse> => {
  return new Promise<AxiosResponse>((resolve) => {
    if (networkDelayEnabled) {
      console.log("Network Delay Enabled -- response will slow down");
      setTimeout(() => {
        resolve(response);
      }, 3000);
    } else {
      resolve(response);
    }
  });
};

export function setupInterceptorsTo(
  axiosInstance: AxiosInstance
): AxiosInstance {
  axiosInstance.interceptors.response.use(onResponse);
  return axiosInstance;
}
