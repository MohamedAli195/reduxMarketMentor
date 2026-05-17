import { createApi } from '@reduxjs/toolkit/query/react';
import { IAnalytics } from 'interfaces';
import { baseQueryWithAuth } from 'app/api/baseQueryWithAuth';

/** 🔹 Types */

interface Ires {
  code: number;
  message: string;
  status: boolean;
  data: { data: IAnalytics[] | undefined; total: number | undefined };
}

interface IresPost {
  code: number;
  message: string;
  status: boolean;
  data: IAnalytics;
}

interface IresOne {
  code: number;
  message: string;
  status: boolean;
  data: IAnalytics;
}

/** 🔹 API */
export const analyticsApi = createApi({
  reducerPath: 'analyticsApi',

  baseQuery: baseQueryWithAuth, // ✅ الحل هنا

  tagTypes: ['Analytics'],

  endpoints: (builder) => ({
    getAnalytics: builder.query<
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

        return `/admin/analytics?${params.toString()}`;
      },

      providesTags: ['Analytics'],
    }),

    getAnalytic: builder.query<IresOne, string | undefined>({
      query: (id) => ({
        url: `/admin/analytics/${id}`,
      }),
    }),

    createAnalytic: builder.mutation<IresPost, FormData>({
      query: (formData) => ({
        url: `/admin/analytics`,
        method: 'POST',
        body: formData,
      }),

      invalidatesTags: ['Analytics'],
    }),

    deleteAnalytic: builder.mutation<IresPost, number | undefined>({
      query: (id) => ({
        url: `/admin/analytics/${id}/destroy`,
        method: 'DELETE',
      }),

      invalidatesTags: ['Analytics'],
    }),

    updateAnalytic: builder.mutation<
      IresPost,
      { id: number | undefined; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/admin/analytics/${id}/update`,
        method: 'POST',
        body: formData,
      }),

      invalidatesTags: ['Analytics'],
    }),
  }),
});

/** 🔹 Hooks */
export const {
  useGetAnalyticsQuery,
  useGetAnalyticQuery,
  useCreateAnalyticMutation,
  useDeleteAnalyticMutation,
  useUpdateAnalyticMutation,
} = analyticsApi;