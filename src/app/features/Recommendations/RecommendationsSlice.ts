import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../../store';
import { ICategory, IREc } from 'interfaces';
import { IFormInputRecommendations } from 'components/Recommendations/addRecommendations';
import { BASE_URL } from '../auth/authQuery';

// export interface ISize {
//   id?: number | undefined;
//   label: string;

// }
interface Ires {
  code: number;
  message: string;
  status: boolean;
  data: { data: IREc[] | undefined; total: number | undefined };
}

interface IresPost {
  code: number;
  message: string;
  status: boolean;
  data: IREc;
}
interface IresOne {
  code: number;
  message: string;
  status: boolean;
  data: IREc;
}


export const recommendationsApi = createApi({
  reducerPath: 'recommendationsApi',
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
  tagTypes: ['Recommendations'], // ✅ Define tag type
  endpoints: (builder) => ({
    getRecommendations: builder.query<
      Ires,
      { search?: string; page: number; perPage: number; sort_direction: string }
    >({
      query: ({ search = '', page = 1, perPage = 1, sort_direction = 'desc' }) => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('per_page', perPage.toString()); // تأكد من أن API يتطلب "per_page"
        params.append('sort_direction', sort_direction.toString()); // تأكد من أن API يتطلب "per_page"
        if (search) params.append('search', search);

        return `/admin/recommendations?${params.toString()}`;
      },
      providesTags: ['Recommendations'],
    }),

    getRecommendation: builder.query<IresOne, string | undefined>({
      query: (id) => ({
        url: `/admin/recommendations/${id}`,
      }),
      // invalidatesTags: ['Packages'], // ✅ Invalidate tag to refetch list
    }),
    createRecommendation: builder.mutation<IresPost, IFormInputRecommendations>({
      query: (data) => ({
        url: `/admin/recommendations `,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Recommendations'], // ✅ Invalidate tag to refetch list
    }),
    deleteRecommendation: builder.mutation<IresPost, number | undefined>({
      query: (id) => ({
        url: `/admin/recommendations/${id}/destroy`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Recommendations'],
    }),
    updateRecommendation: builder.mutation<
      IresPost,
      { id: number | undefined; data: IFormInputRecommendations }
    >({
      query: ({ id, data }) => ({
        url: `/admin/recommendations/${id}/update`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Recommendations'],
    }),
    updateRecommendationStatus: builder.mutation<
      IresPost,
      { id: number | undefined; newStatus: 'inactive' | 'active' }
    >({
      query: ({ id, newStatus }) => ({
        url: `/admin/recommendations/${id}/change-status`,
        method: 'POST',
        body: newStatus,
      }),
      invalidatesTags: ['Recommendations'],
    }),
  }),
});

export const {
  useGetRecommendationsQuery,
  useGetRecommendationQuery,
  useCreateRecommendationMutation,
  useDeleteRecommendationMutation,
  useUpdateRecommendationMutation,
  useUpdateRecommendationStatusMutation,
} = recommendationsApi;
