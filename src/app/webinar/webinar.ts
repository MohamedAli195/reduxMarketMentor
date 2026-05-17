import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "app/features/auth/authQuery";
import { RootState } from "app/store";


import i18n from "i18next";

/** 🔹 Types */


// interfaces/webinar.ts
export interface IWebinarRegister {
  id: number;
  name: string;
  email: string;
  phone: string;
}
interface Ires {
  code: number;
  message: string;
  status: boolean;
  data: {
    data: IWebinarRegister[] | undefined;
    total: number | undefined;
  };
}

interface IresAll {
  code: number;
  message: string;
  status: boolean;
  data: IWebinarRegister[]; // غالبًا بيبقى array مباشر
}

/** 🔹 API */

export const webinarRegistersApi = createApi({
  reducerPath: "webinarRegistersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth?.authData.token ?? null;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      headers.set("Accept", "application/json");
      headers.set("lang", i18n.language);

      return headers;
    },
  }),

  tagTypes: ["WebinarRegisters"],

  endpoints: (builder) => ({
    /** 🔹 Pagination */
    getWebinarRegisters: builder.query<
      Ires,
      {
        search?: string;
        page: number;
        perPage: number;
        sort_direction?: string;
      }
    >({
      query: ({
        search = "",
        page = 1,
        perPage = 10,
        sort_direction = "desc",
      }) => {
        const params = new URLSearchParams();

        params.append("page", page.toString());
        params.append("per_page", perPage.toString());
        params.append("sort_direction", sort_direction);

        if (search) params.append("search", search);

        return `/admin/webinar-register?${params.toString()}`;
      },

      providesTags: ["WebinarRegisters"],
    }),

    /** 🔹 Export (Full Data) */
    getWebinarRegistersAll: builder.query<
      IresAll,
      {
        search?: string;
        sort_direction?: string;
      }
    >({
      query: ({ search = "", sort_direction = "desc" }) => {
        const params = new URLSearchParams();

        params.append("is_paginate", "0");
        params.append("sort_direction", sort_direction);

        if (search) params.append("search", search);

        return `/admin/webinar-register?${params.toString()}`;
      },
    }),
  }),
});

/** 🔹 Hooks */

export const {
  useGetWebinarRegistersQuery,
  useLazyGetWebinarRegistersQuery,
  useGetWebinarRegistersAllQuery,
  useLazyGetWebinarRegistersAllQuery,
} = webinarRegistersApi;