import { createApi } from '@reduxjs/toolkit/query/react';
import { IBroker } from 'interfaces';
import { baseQueryWithAuth } from 'app/api/baseQueryWithAuth'; // ✅ مهم

/** 🔹 Types */

interface Ires {
  code: number;
  message: string;
  status: boolean;
  data: IBroker[];
}

interface IresPost {
  code: number;
  message: string;
  status: boolean;
  data: IBroker;
}

interface IresOne {
  code: number;
  message: string;
  status: boolean;
  data: IBroker;
}

/** 🔹 API */
export const brokerApi = createApi({
  reducerPath: 'brokerApi',

  baseQuery: baseQueryWithAuth, // ✅ الحل هنا

  tagTypes: ['Brokers'],

  endpoints: (builder) => ({
    getBrokers: builder.query<
      Ires,
      { search?: string; page?: number; perPage?: number; sort_direction?: string }
    >({
      query: ({ search = '', page = 1, perPage, sort_direction = 'desc' }) => {
        const params = new URLSearchParams();

        params.append('page', page.toString());

        if (perPage) {
          params.append('per_page', perPage.toString());
        }

        params.append('sort_direction', sort_direction);

        if (search) {
          params.append('search', search);
        }

        return `/admin/brokers?${params.toString()}`;
      },

      providesTags: ['Brokers'],
    }),

    getBroker: builder.query<IresOne, string | undefined>({
      query: (id) => ({
        url: `/admin/brokers/${id}`,
      }),
    }),

    createBroker: builder.mutation<IresPost, FormData>({
      query: (formData) => ({
        url: `/admin/brokers`,
        method: 'POST',
        body: formData,
      }),

      invalidatesTags: ['Brokers'],
    }),

    deleteBroker: builder.mutation<IresPost, number | undefined>({
      query: (id) => ({
        url: `/admin/brokers/${id}/destroy`,
        method: 'DELETE',
      }),

      invalidatesTags: ['Brokers'],
    }),

    updateBroker: builder.mutation<
      IresPost,
      { id: number | undefined; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/admin/brokers/${id}/update`,
        method: 'POST',
        body: formData,
      }),

      invalidatesTags: ['Brokers'],
    }),
  }),
});

/** 🔹 Hooks */
export const {
  useGetBrokersQuery,
  useGetBrokerQuery,
  useCreateBrokerMutation,
  useDeleteBrokerMutation,
  useUpdateBrokerMutation,
} = brokerApi;