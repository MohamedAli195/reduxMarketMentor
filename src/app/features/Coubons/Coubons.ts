import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "app/features/auth/authQuery";
import { RootState } from "app/store";

import i18n from "i18next";

/** 🔹 Types */

export interface ICouponCreatedBy {
  id: number;
  name: string;
  email: string;
  status: string;
  avatar: string;
  role: string[];
  permissions?: { id: number; name: string; display_name: string }[];
}


export interface ICoupon {
  id: number;
  code: string;
  value: string;
  min_order_total: string;
  usage_limit: number;
  used_count: number;
  status: string;
  start_date: string;
  end_date: string;
  createdBy: ICouponCreatedBy;
}
// export interface ICoupon {
//   id: number;
//   value: string;
//   min_order_total: number;
//   usage_limit: number;
//   status: string;
//   start_date: string;
//   end_date: string;
// }

interface IRes {
  code: number;
  message: string;
  status: boolean;
  data: {
    data: ICoupon[];
    total: number;
    lastPage: number;
  };
}

interface IResPost {
  code: number;
  message: string;
  status: boolean;
  data: ICoupon;
}

/** 🔹 API */

export const couponsApi = createApi({
  reducerPath: "couponsApi",

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

  tagTypes: ["Coupons"],

  endpoints: (builder) => ({
    /** 🔹 GET Coupons */
    getCoupons: builder.query<
      IRes,
      { page: number; perPage: number }
    >({
      query: ({ page = 1, perPage = 10 }) => {
        const params = new URLSearchParams();

        params.append("page", page.toString());
        params.append("per_page", perPage.toString());

        return `/admin/coupons?${params.toString()}`;
      },

      providesTags: ["Coupons"],
    }),

    /** 🔹 CREATE Coupon */
    createCoupon: builder.mutation<
      IResPost,
      {
        value: string;
        min_order_total: number;
        usage_limit: number;
        status: string;
        start_date: string;
        end_date: string;
      }
    >({
      query: (body) => ({
        url: `/admin/coupons`,
        method: "POST",
        body,
      }),

      invalidatesTags: ["Coupons"],
    }),

    /** 🔹 DELETE Coupon */
    deleteCoupon: builder.mutation<
      IResPost,
      number
    >({
      query: (id) => ({
        url: `/admin/coupons/${id}/destroy`,
        method: "DELETE",
      }),

      invalidatesTags: ["Coupons"],
    }),

    /** 🔹 UPDATE Coupon */
    updateCoupon: builder.mutation<
      IResPost,
      {
        id: number;
        body: {
          value: string;
          min_order_total: number;
          usage_limit: number;
          status: string;
          start_date: string;
          end_date: string;
        };
      }
    >({
      query: ({ id, body }) => ({
        url: `/admin/coupons/${id}/update`,
        method: "POST",
        body,
      }),

      invalidatesTags: ["Coupons"],
    }),
  }),
});

/** 🔹 Hooks */

export const {
  useGetCouponsQuery,
  useLazyGetCouponsQuery,
  useCreateCouponMutation,
  useDeleteCouponMutation,
  useUpdateCouponMutation,
} = couponsApi;