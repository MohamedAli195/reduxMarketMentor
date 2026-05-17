import { createApi } from '@reduxjs/toolkit/query/react';
import { IStartMenu } from 'interfaces';
import { baseQueryWithAuth } from 'app/api/baseQueryWithAuth';

/** 🔹 Types */

interface Ires {
  code: number;
  message: string;
  status: boolean;
  data: { data: IStartMenu[] | undefined; total: number | undefined };
}

interface IresPost {
  code: number;
  message: string;
  status: boolean;
  data: IStartMenu;
}

interface IresOne {
  code: number;
  message: string;
  status: boolean;
  data: IStartMenu;
}

/** 🔹 API */
export const startMenuApi = createApi({
  reducerPath: 'startMenuApi',

  baseQuery: baseQueryWithAuth, // ✅ الحل هنا

  tagTypes: ['StartMenu'],

  endpoints: (builder) => ({
    getStartMenus: builder.query<
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

        return `/admin/start-menu?${params.toString()}`;
      },

      providesTags: ['StartMenu'],
    }),

    getStartMenu: builder.query<IresOne, string | undefined>({
      query: (id) => `/admin/start-menu/${id}`,
    }),

    createStartMenu: builder.mutation<IresPost, FormData>({
      query: (formData) => ({
        url: `/admin/start-menu`,
        method: 'POST',
        body: formData,
      }),

      invalidatesTags: ['StartMenu'],
    }),

    deleteStartMenu: builder.mutation<IresPost, number | undefined>({
      query: (id) => ({
        url: `/admin/start-menu/${id}/destroy`,
        method: 'DELETE',
      }),

      invalidatesTags: ['StartMenu'],
    }),

    updateStartMenu: builder.mutation<
      IresPost,
      { id: number | undefined; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/admin/start-menu/${id}/update`,
        method: 'POST',
        body: formData,
      }),

      invalidatesTags: ['StartMenu'],
    }),
  }),
});

/** 🔹 Hooks */
export const {
  useGetStartMenusQuery,
  useGetStartMenuQuery,
  useCreateStartMenuMutation,
  useDeleteStartMenuMutation,
  useUpdateStartMenuMutation,
} = startMenuApi;