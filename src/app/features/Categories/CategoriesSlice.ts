import { createApi } from '@reduxjs/toolkit/query/react';
import { ICategory } from 'interfaces';
import { baseQueryWithAuth } from 'app/api/baseQueryWithAuth';

/** 🔹 Types */

interface Ires {
  code: number;
  message: string;
  status: boolean;
  data: { data: ICategory[] | undefined; total: number | undefined };
}

interface IresPost {
  code: number;
  message: string;
  status: boolean;
  data: ICategory;
}

interface IresOne {
  code: number;
  message: string;
  status: boolean;
  data: ICategory;
}

/** 🔹 API */
export const categoriesApi = createApi({
  reducerPath: 'categoriesApi',

  baseQuery: baseQueryWithAuth, // ✅ الحل هنا

  tagTypes: ['Categories'],

  endpoints: (builder) => ({
    getCategories: builder.query<
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

        return `/admin/categories?${params.toString()}`;
      },

      providesTags: ['Categories'],
    }),

    getCategory: builder.query<IresOne, string | undefined>({
      query: (id) => ({
        url: `/admin/categories/${id}`,
      }),
    }),

    createCategory: builder.mutation<IresPost, FormData>({
      query: (formData) => ({
        url: `/admin/categories`,
        method: 'POST',
        body: formData,
      }),

      invalidatesTags: ['Categories'],
    }),

    deleteCategory: builder.mutation<IresPost, number | undefined>({
      query: (id) => ({
        url: `/admin/categories/${id}/destroy`,
        method: 'DELETE',
      }),

      invalidatesTags: ['Categories'],
    }),

    updateCategory: builder.mutation<
      IresPost,
      { id: number | undefined; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/admin/categories/${id}/update`,
        method: 'POST',
        body: formData,
      }),

      invalidatesTags: ['Categories'],
    }),
  }),
});

/** 🔹 Hooks */
export const {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} = categoriesApi;