import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../../store';
import { ICategory, ICourse } from 'interfaces';
import { BASE_URL } from '../auth/authQuery';

// export interface ISize {
//   id?: number | undefined;
//   label: string;

// }


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

export const coursesApi = createApi({
  reducerPath: 'coursesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth?.authData.token ?? null;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
        // Do not manually set Content-Type for FormData
      }
headers.set("Accept", "application/json");
      return headers;
    },
  }),
  tagTypes: ['Courses'], // ✅ Define tag type
  endpoints: (builder) => ({
    getCourse: builder.query<IresOne, string | undefined>({
      query: (id) => {
        return `/admin/courses/${id}`;
      },
      providesTags: ['Courses'],
    }),
    getCourses: builder.query<
      Ires,
      { search?: string; page: number; perPage: number; sort_direction: string }
    >({
      query: ({ search = '', page = 1, perPage = 1, sort_direction = 'desc' }) => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('per_page', perPage.toString()); // تأكد من أن API يتطلب "per_page"
        params.append('sort_direction', sort_direction.toString()); // تأكد من أن API يتطلب "per_page"
        if (search) params.append('search', search);

        return `/admin/courses?${params.toString()}`;
      },
      providesTags: ['Courses'],
    }),

    createCourse: builder.mutation<IresPost, FormData>({
      query: (FormData) => ({
        url: `/admin/courses `,
        method: 'POST',
        body: FormData,
      }),
      invalidatesTags: ['Courses'], // ✅ Invalidate tag to refetch list
    }),
    deleteCourse: builder.mutation<IresPost, number | undefined>({
      query: (id) => ({
        url: `/admin/courses/${id}/destroy`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Courses'],
    }),
    updateCourse: builder.mutation<IresPost, { id: number | undefined; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/admin/courses/${id}/update`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Courses'],
    }),
    updateStateCourse: builder.mutation<IresPost, {id:number | undefined,status:string}>({
      query: ({ id, status }) => ({
        url: `/admin/courses/${id}/change-status`,
        method: 'POST',
        body: {status:status},
      }),
      invalidatesTags: ['Courses'],
    }),
  }),
});

export const {
  useGetCourseQuery,
  useGetCoursesQuery,
  useCreateCourseMutation,
  useDeleteCourseMutation,
  useUpdateCourseMutation,
  useUpdateStateCourseMutation,
} = coursesApi;
