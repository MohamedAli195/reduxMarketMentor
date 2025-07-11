import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Ipermisson } from "interfaces";

const BASE_URL = "/api"; // triggers the proxy

interface Ires {
  code: number;
  data: {
    permissions: Ipermisson[];
    email: string;
    id: number;
    name: string;
  };
  status: boolean;
  token: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<Ires, { email: string; password: string }>({
      query: (credentials) => ({
        url: "/admin/login",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;
