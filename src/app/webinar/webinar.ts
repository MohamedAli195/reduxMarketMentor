
import { createApi } from "@reduxjs/toolkit/query/react";

import { BASE_URL } from "app/features/auth/authQuery";
import { baseQueryWithAuth } from "app/api/baseQueryWithAuth";
import i18n from "i18next";

/** 🔹 Types */
export interface IWebinarRegister { id: number; name: string; email: string; phone: string; }
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
  data: IWebinarRegister[];
}

/** 🔹 API */
export const webinarRegistersApi = createApi({
  reducerPath: "webinarRegistersApi",

  baseQuery: baseQueryWithAuth, // ✅ الحل هنا

  tagTypes: ["WebinarRegisters"],

  endpoints: (builder) => ({
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

        if (search) {
          params.append("search", search);
        }

        return `/admin/webinar-register?${params.toString()}`;
      },

      providesTags: ["WebinarRegisters"],
    }),

    getWebinarRegistersAll: builder.query<
      IresAll,
      { search?: string; sort_direction?: string }
    >({
      query: ({ search = "", sort_direction = "desc" }) => {
        const params = new URLSearchParams();

        params.append("is_paginate", "0");
        params.append("sort_direction", sort_direction);

        if (search) {
          params.append("search", search);
        }

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