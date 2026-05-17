import { createApi } from "@reduxjs/toolkit/query/react";
import { IUser } from "interfaces";
import { BASE_URL } from "../auth/authQuery";
import { baseQueryWithAuth } from "app/api/baseQueryWithAuth";

/** 🔹 Types */

interface Ires {
  code: number;
  message: string;
  status: boolean;
  data: {
    data: IUser[] | undefined;
    total: number | undefined;
  };
}

interface IresPost {
  code: number;
  message: string;
  status: boolean;
  data: IUser;
}

interface IresOne {
  code: number;
  message: string;
  status: boolean;
  data: IUser;
}

/** 🔹 API */
export const customersApi = createApi({
  reducerPath: "customersApi",

  baseQuery: baseQueryWithAuth, // ✅ الحل هنا

  tagTypes: ["Customers"],

  endpoints: (builder) => ({
    getCustomers: builder.query<
      Ires,
      { search?: string; page: number; perPage: number; sort_direction: string }
    >({
      query: ({ search = '', page = 1, perPage = 1, sort_direction = 'desc' }) => {
        const params = new URLSearchParams();

        params.append("page", page.toString());
        params.append("per_page", perPage.toString());
        params.append("sort_direction", sort_direction);

        if (search) {
          params.append("search", search);
        }

        return `/admin/customers?${params.toString()}`;
      },

      providesTags: ["Customers"],
    }),

    getCustomer: builder.query<IresOne, string | undefined>({
      query: (id) => `/admin/customers/${id}`,
    }),

    createCustomer: builder.mutation<IresPost, FormData>({
      query: (formData) => ({
        url: `/admin/customers`,
        method: "POST",
        body: formData,
      }),

      invalidatesTags: ["Customers"],
    }),

    deleteCustomer: builder.mutation<IresPost, number | undefined>({
      query: (id) => ({
        url: `/admin/customers/${id}/destroy`,
        method: "DELETE",
      }),

      invalidatesTags: ["Customers"],
    }),

    updateCustomer: builder.mutation<
      IresPost,
      { id: number | undefined; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/admin/customers/${id}/update`,
        method: "POST",
        body: formData,
      }),

      invalidatesTags: ["Customers"],
    }),
  }),
});

/** 🔹 Hooks */
export const {
  useGetCustomersQuery,
  useGetCustomerQuery,
  useCreateCustomerMutation,
  useDeleteCustomerMutation,
  useUpdateCustomerMutation,
} = customersApi;