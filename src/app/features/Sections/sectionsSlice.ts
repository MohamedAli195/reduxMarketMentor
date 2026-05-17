import { createApi } from '@reduxjs/toolkit/query/react';
import { ISection } from 'interfaces';
import { baseQueryWithAuth } from 'app/api/baseQueryWithAuth';

/** 🔹 Types */

interface Ires {
  code: number;
  message: string;
  status: boolean;
  data: { data: ISection[] | undefined; total: number | undefined };
}

interface IresOne {
  code: number;
  message: string;
  status: boolean;
  data: ISection;
}

interface IresPost {
  code: number;
  message: string;
  status: boolean;
  data: ISection;
}

/** 🔹 API */
export const sectionsApi = createApi({
  reducerPath: 'sectionsApi',

  baseQuery: baseQueryWithAuth, // ✅ الحل هنا

  tagTypes: ['Sections'],

  endpoints: (builder) => ({
    getSectionsByCourseID: builder.query<Ires, string | undefined>({
      query: (id) => `/admin/courses/${id}/sections`,
      providesTags: ['Sections'],
    }),

    getSection: builder.query<IresOne, string | undefined>({
      query: (id) => `/admin/courses/sections/details/${id}`,
      providesTags: ['Sections'],
    }),

    createSection: builder.mutation<
      IresPost,
      { id: string | undefined; data: ISection }
    >({
      query: ({ id, data }) => ({
        url: `/admin/courses/${id}/sections`,
        method: 'POST',
        body: data,
      }),

      invalidatesTags: ['Sections'],
    }),

    deleteSection: builder.mutation<IresPost, number | undefined>({
      query: (id) => ({
        url: `/admin/courses/sections/details/${id}/delete`,
        method: 'DELETE',
      }),

      invalidatesTags: ['Sections'],
    }),

    updateSection: builder.mutation<
      IresPost,
      { id: number | undefined; data: ISection }
    >({
      query: ({ id, data }) => ({
        url: `/admin/courses/sections/details/${id}/update`,
        method: 'POST',
        body: data,
      }),

      invalidatesTags: ['Sections'],
    }),
  }),
});

/** 🔹 Hooks */
export const {
  useCreateSectionMutation,
  useGetSectionsByCourseIDQuery,
  useGetSectionQuery,
  useDeleteSectionMutation,
  useUpdateSectionMutation,
} = sectionsApi;