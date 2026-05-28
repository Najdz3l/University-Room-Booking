import { APIEndpoints } from "./endpoints";

export type APIEndpoint = (typeof APIEndpoints)[keyof typeof APIEndpoints];
