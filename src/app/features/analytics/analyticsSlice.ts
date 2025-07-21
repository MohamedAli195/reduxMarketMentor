import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../../store';
import { IAgenda, IAnalytics, ICategory } from 'interfaces';
import { BASE_URL } from '../auth/authQuery';

// export interface ISize {
//   id?: number | undefined;
//   label: string;

// }

// triggers the proxy

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

export const analyticsApi = createApi({
  reducerPath: 'analyticsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth?.authData.token ?? null;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
        // Do not manually set Content-Type for FormData
      }
      headers.set('Accept', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Analytics'], // ✅ Define tag type
  endpoints: (builder) => ({
    getAnalytics: builder.query<
      Ires,
      { search?: string; page?: number; perPage?: number; sort_direction?: string }
    >({
      query: ({ search = '', page = 1, perPage, sort_direction = 'desc' }) => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        if (perPage) {
          params.append('per_page', perPage.toString()); // تأكد من أن API يتطلب "per_page"
        }

        params.append('sort_direction', sort_direction.toString()); // تأكد من أن API يتطلب "per_page"
        if (search) params.append('search', search);

        return `/admin/analytics?${params.toString()}`;
      },
      providesTags: ['Analytics'],
    }),

    
    getAnalytic: builder.query<IresOne, string | undefined>({
      query: (id) => ({
        url: `/admin/analytics/${id}`,
      }),
      // invalidatesTags: ['Packages'], // ✅ Invalidate tag to refetch list
    }),

    createAnalytic: builder.mutation<IresPost, FormData>({
      query: (FormData) => ({
        url: `/admin/analytics `,
        method: 'POST',
        body: FormData,
      }),
      invalidatesTags: ['Analytics'], // ✅ Invalidate tag to refetch list
    }),
    deleteAnalytic: builder.mutation<IresPost, number | undefined>({
      query: (id) => ({
        url: `/admin/analytics/${id}/destroy`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Analytics'],
    }),
    updateAnalytic: builder.mutation<IresPost, { id: number | undefined; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/admin/analytics/${id}/update`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Analytics'],
    }),
  }),
});

export const {
  useGetAnalyticsQuery,
  useGetAnalyticQuery,
  useCreateAnalyticMutation,
  useDeleteAnalyticMutation,
  useUpdateAnalyticMutation,
} = analyticsApi;
