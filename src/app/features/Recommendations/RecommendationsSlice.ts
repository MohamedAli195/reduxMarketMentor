import { createApi } from '@reduxjs/toolkit/query/react';
import { IREc } from 'interfaces';
import { IFormInputRecommendations } from 'components/Recommendations/addRecommendations';
import { baseQueryWithAuth } from 'app/api/baseQueryWithAuth';

/** 🔹 Types */

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

/** 🔹 API */
export const recommendationsApi = createApi({
  reducerPath: 'recommendationsApi',

  baseQuery: baseQueryWithAuth, // ✅ الحل هنا

  tagTypes: ['Recommendations'],

  endpoints: (builder) => ({
    getRecommendations: builder.query<
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

        return `/admin/recommendations?${params.toString()}`;
      },

      providesTags: ['Recommendations'],
    }),

    getRecommendation: builder.query<IresOne, string | undefined>({
      query: (id) => ({
        url: `/admin/recommendations/${id}`,
      }),
    }),

    createRecommendation: builder.mutation<IresPost, { value: string[] }>({
      query: (value) => ({
        url: `/admin/recommendations`,
        method: 'POST',
        body: value,
      }),

      invalidatesTags: ['Recommendations'],
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

/** 🔹 Hooks */
export const {
  useGetRecommendationsQuery,
  useGetRecommendationQuery,
  useCreateRecommendationMutation,
  useDeleteRecommendationMutation,
  useUpdateRecommendationMutation,
  useUpdateRecommendationStatusMutation,
} = recommendationsApi;