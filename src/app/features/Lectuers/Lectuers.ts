import { createApi } from '@reduxjs/toolkit/query/react';
import { ICourseLectuer, ILectuer } from 'interfaces';
import { IFormInputLectuers } from 'components/CourseLectuers/updateLectuerForm';
import { baseQueryWithAuth } from 'app/api/baseQueryWithAuth';

/** 🔹 Types */

interface Ires {
  code: number;
  message: string;
  status: boolean;
  data: { data: ICourseLectuer[] | undefined; total: number | undefined };
}

interface IresPost {
  code: number;
  message: string;
  status: boolean;
  data: ICourseLectuer;
}

interface IresOne {
  code: number;
  message: string;
  status: boolean;
  data: ILectuer;
}

/** 🔹 API */
export const leactuersApi = createApi({
  reducerPath: 'leactuersApi',

  baseQuery: baseQueryWithAuth, // ✅ الحل هنا

  tagTypes: ['Lectuers'],

  endpoints: (builder) => ({
    getLectures: builder.query<
      Ires,
      {
        id: string | undefined;
        search?: string;
        page: number;
        perPage: number;
        sort_direction: string;
      }
    >({
      query: ({ id, search = '', page = 1, perPage = 1, sort_direction = 'desc' }) => {
        const params = new URLSearchParams();

        params.append('page', page.toString());
        params.append('per_page', perPage.toString());
        params.append('sort_direction', sort_direction);

        if (search) {
          params.append('search', search);
        }

        return `/admin/sections/${id}/lectures?${params.toString()}`;
      },

      providesTags: ['Lectuers'],
    }),

    getLecture: builder.query<IresOne, string | undefined>({
      query: (id) => ({
        url: `/admin/course-lectures/${id}`,
      }),
    }),

    createLecture: builder.mutation<
      IresPost,
      { id: string | undefined; formdata: FormData }
    >({
      query: ({ id, formdata }) => ({
        url: `/admin/sections/${id}/lectures`,
        method: 'POST',
        body: formdata,
      }),

      invalidatesTags: ['Lectuers'],
    }),

    deleteLecture: builder.mutation<IresPost, number | undefined>({
      query: (id) => ({
        url: `/admin/course-lectures/${id}/destroy`,
        method: 'DELETE',
      }),

      invalidatesTags: ['Lectuers'],
    }),

    updateLecture: builder.mutation<
      IresPost,
      { id: string | number | undefined; data: IFormInputLectuers }
    >({
      query: ({ id, data }) => ({
        url: `/admin/course-lectures/${id}/update`,
        method: 'POST',
        body: data,
      }),

      invalidatesTags: ['Lectuers'],
    }),
  }),
});

/** 🔹 Hooks */
export const {
  useGetLecturesQuery,
  useGetLectureQuery,
  useCreateLectureMutation,
  useDeleteLectureMutation,
  useUpdateLectureMutation,
} = leactuersApi;