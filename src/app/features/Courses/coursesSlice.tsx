import { createApi } from '@reduxjs/toolkit/query/react';
import { ICourse } from 'interfaces';
import { baseQueryWithAuth } from 'app/api/baseQueryWithAuth';

/** 🔹 Types */

interface Ires {
  code: number;
  message: string;
  status: boolean;
  data: { data: ICourse[] | undefined; total: number | undefined };
}

interface IresOne {
  code: number;
  message: string;
  status: boolean;
  data: ICourse | undefined;
}

interface IresPost {
  code: number;
  message: string;
  status: boolean;
  data: ICourse;
}

/** 🔹 API */
export const coursesApi = createApi({
  reducerPath: 'coursesApi',

  baseQuery: baseQueryWithAuth, // ✅ الحل هنا

  tagTypes: ['Courses'],

  endpoints: (builder) => ({
    getCourse: builder.query<IresOne, string | undefined>({
      query: (id) => `/admin/courses/${id}`,
      providesTags: ['Courses'],
    }),

    getCourses: builder.query<
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

        return `/admin/courses?${params.toString()}`;
      },

      providesTags: ['Courses'],
    }),

    createCourse: builder.mutation<IresPost, FormData>({
      query: (formData) => ({
        url: `/admin/courses`,
        method: 'POST',
        body: formData,
      }),

      invalidatesTags: ['Courses'],
    }),

    deleteCourse: builder.mutation<IresPost, number | undefined>({
      query: (id) => ({
        url: `/admin/courses/${id}/destroy`,
        method: 'DELETE',
      }),

      invalidatesTags: ['Courses'],
    }),

    updateCourse: builder.mutation<
      IresPost,
      { id: number | undefined; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/admin/courses/${id}/update`,
        method: 'POST',
        body: formData,
      }),

      invalidatesTags: ['Courses'],
    }),

    updateStateCourse: builder.mutation<
      IresPost,
      { id: number | undefined; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/admin/courses/${id}/change-status`,
        method: 'POST',
        body: { status },
      }),

      invalidatesTags: ['Courses'],
    }),
  }),
});

/** 🔹 Hooks */
export const {
  useGetCourseQuery,
  useGetCoursesQuery,
  useCreateCourseMutation,
  useDeleteCourseMutation,
  useUpdateCourseMutation,
  useUpdateStateCourseMutation,
} = coursesApi;