import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../../store';
import { ICategory, IOrder } from 'interfaces';
import { BASE_URL } from '../auth/authQuery';

// export interface ISize {
//   id?: number | undefined;
//   label: string;

// }

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

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth?.authData.token ?? null;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
        // Do not manually set Content-Type for FormData
      }

      return headers;
    },
  }),
  tagTypes: ['Orders'], // ✅ Define tag type
  endpoints: (builder) => ({
    getOrders: builder.query<
      Ires,
      { search?: string; page: number; perPage: number; sort_direction: string }
    >({
      query: ({ search = '', page = 1, perPage = 1, sort_direction = 'desc' }) => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('per_page', perPage.toString()); // تأكد من أن API يتطلب "per_page"
        params.append('sort_direction', sort_direction.toString()); // تأكد من أن API يتطلب "per_page"
        if (search) params.append('search', search);

        return `/admin/orders?${params.toString()}`;
      },
      providesTags: ['Orders'],
    }),
    updateOrderStatus: builder.mutation<IresPost, { id: number | undefined; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/admin/orders/${id}/change-status`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Orders'],
    }),
  }),
});

export const { useGetOrdersQuery, useUpdateOrderStatusMutation } = ordersApi;
