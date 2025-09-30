import axios, { AxiosInstance } from 'axios';
import { Agent as HttpAgent } from 'http';
import { Agent as HttpsAgent } from 'https';

const maxSockets = Number(process.env.HTTP_CLIENT_MAX_SOCKETS ?? 100);
const maxFreeSockets = Number(process.env.HTTP_CLIENT_MAX_FREE_SOCKETS ?? 10);
const socketTimeout = Number(process.env.HTTP_CLIENT_SOCKET_TIMEOUT ?? 30000);
const requestTimeout = Number(process.env.HTTP_CLIENT_REQUEST_TIMEOUT ?? 10000);

const httpAgent = new HttpAgent({
  keepAlive: true,
  maxSockets,
  maxFreeSockets,
  timeout: socketTimeout,
});

const httpsAgent = new HttpsAgent({
  keepAlive: true,
  maxSockets,
  maxFreeSockets,
  timeout: socketTimeout,
});

export const httpClient: AxiosInstance = axios.create({
  httpAgent,
  httpsAgent,
  timeout: requestTimeout,
});

export default httpClient;
