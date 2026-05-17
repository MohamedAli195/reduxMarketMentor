import { createApi } from "@reduxjs/toolkit/query/react";
import { RootState } from "app/store";
import { Ipermisson } from "interfaces";
import { BASE_URL } from "../auth/authQuery";
import { baseQueryWithAuth } from "app/api/baseQueryWithAuth";

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

export const profileApi = createApi({
  reducerPath: "profileApi",

  baseQuery: baseQueryWithAuth, // ✅ الحل هنا

  tagTypes: ["Profile"],

  endpoints: (builder) => ({
    getProfile: builder.query<Ires, void>({
      query: () => `/admin/profile`,
    }),
  }),
});

export const { useGetProfileQuery } = profileApi;