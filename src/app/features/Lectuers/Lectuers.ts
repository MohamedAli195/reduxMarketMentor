import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../../store';
import { ICategory, ICourseLectuer } from 'interfaces';
import { IFormInputLectuers } from 'components/CourseLectuers/updateLectuerForm';
import { BASE_URL } from '../auth/authQuery';

// export interface ISize {
//   id?: number | undefined;
//   label: string;

// }


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

export const leactuersApi = createApi({
  reducerPath: 'leactuersApi',
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
  tagTypes: ['Lectuers'], // ✅ Define tag type
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
        params.append('per_page', perPage.toString()); // تأكد من أن API يتطلب "per_page"
        params.append('sort_direction', sort_direction.toString()); // تأكد من أن API يتطلب "per_page"
        if (search) params.append('search', search);

        return `/admin/sections/${id}/lectures?${params.toString()}`;
      },
      providesTags: ['Lectuers'],
    }),

    createLecture: builder.mutation<IresPost, { id: string | undefined; formdata: FormData }>({
      query: ({ id, formdata }) => ({
        url: `/admin/sections/${id}/lectures`,
        method: 'POST',
        body: formdata,
      }),
      invalidatesTags: ['Lectuers'], // ✅ Invalidate tag to refetch list
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

export const {
  useGetLecturesQuery,
  useCreateLectureMutation,
  useDeleteLectureMutation,
  useUpdateLectureMutation,
} = leactuersApi;
