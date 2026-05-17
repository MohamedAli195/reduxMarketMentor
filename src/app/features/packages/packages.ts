import { createApi } from '@reduxjs/toolkit/query/react';
import { IPackage } from 'interfaces';
import { baseQueryWithAuth } from 'app/api/baseQueryWithAuth';

/** 🔹 Types */

interface Ires {
  code: number;
  message: string;
  status: boolean;
  data: { data: IPackage[] | undefined; total: number | undefined };
}

interface IresPost {
  code: number;
  message: string;
  status: boolean;
  data: IPackage;
}

interface IresOne {
  code: number;
  message: string;
  status: boolean;
  data: IPackage;
}

/** 🔹 API */
export const packagesApi = createApi({
  reducerPath: 'packagesApi',

  baseQuery: baseQueryWithAuth, // ✅ هنا الحل

  tagTypes: ['Packages'],

  endpoints: (builder) => ({
    getPackages: builder.query<
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

        return `/admin/packages?${params.toString()}`;
      },

      providesTags: ['Packages'],
    }),

    getPackage: builder.query<IresOne, string | undefined>({
      query: (id) => ({
        url: `/admin/packages/${id}`,
      }),
    }),

    createPackage: builder.mutation<IresPost, FormData>({
      query: (formData) => ({
        url: `/admin/packages`,
        method: 'POST',
        body: formData,
      }),

      invalidatesTags: ['Packages'],
    }),

    deletePackage: builder.mutation<IresPost, number | undefined>({
      query: (id) => ({
        url: `/admin/packages/${id}/destroy`,
        method: 'DELETE',
      }),

      invalidatesTags: ['Packages'],
    }),

    updatePackage: builder.mutation<
      IresPost,
      { id: number | undefined; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/admin/packages/${id}/update`,
        method: 'POST',
        body: formData,
      }),

      invalidatesTags: ['Packages'],
    }),

    updateStatePackage: builder.mutation<
      IresPost,
      { id: number | undefined; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/admin/packages/${id}/change-status`,
        method: 'POST',
        body: { status },
      }),

      invalidatesTags: ['Packages'],
    }),
  }),
});

/** 🔹 Hooks */
export const {
  useGetPackagesQuery,
  useGetPackageQuery,
  useCreatePackageMutation,
  useDeletePackageMutation,
  useUpdatePackageMutation,
  useUpdateStatePackageMutation,
} = packagesApi;