import { createApi } from '@reduxjs/toolkit/query/react';
import { IOrder } from 'interfaces';
import { baseQueryWithAuth } from 'app/api/baseQueryWithAuth';

/** 🔹 Types */

interface Ires {
  code: number;
  message: string;
  status: boolean;
  data: { data: IOrder[] | undefined; total: number | undefined };
}

interface IresPost {
  code: number;
  message: string;
  status: boolean;
  data: IOrder;
}

/** 🔹 API */
export const ordersApi = createApi({
  reducerPath: 'ordersApi',

  baseQuery: baseQueryWithAuth, // ✅ الحل هنا

  tagTypes: ['Orders'],

  endpoints: (builder) => ({
    getOrders: builder.query<
      Ires,
      { search?: string; page: number; perPage: number; sort_direction: string }
    >({
      query: ({ search = '', page = 1, perPage = 1, sort_direction = 'desc' }) => {
        const params = new URLSearchParams();

        params.append('page', page.toString());
        params.append('per_page', perPage.toString());
        params.append('sort_direction', sort_direction);

        if (search) {
          params.append('search', search);
        }

        return `/admin/orders?${params.toString()}`;
      },

      providesTags: ['Orders'],
    }),

    updateOrderStatus: builder.mutation<
      IresPost,
      { id: number | undefined; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/admin/orders/${id}/change-status`,
        method: 'POST',
        body: formData,
      }),

      invalidatesTags: ['Orders'],
    }),
  }),
});

/** 🔹 Hooks */
export const {
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
} = ordersApi;