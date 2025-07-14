import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../../store';
import { ISection } from 'interfaces';
import { BASE_URL } from '../auth/authQuery';

// export interface ISize {
//   id?: number | undefined;
//   label: string;

// }
interface Ires {
  code: number;
  message: string;
  status: boolean;
  data: { data: ISection[] | undefined; total: number | undefined };
}

interface IresOnew {
  code: number;
  message: string;
  status: boolean;
  data:ISection 
}

interface IresPost {
  code: number;
  message: string;
  status: boolean;
  data: ISection;
}

export const sectionsApi = createApi({
  reducerPath: 'sectionsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth?.authData.token ?? null;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
        // Do not manually set Content-Type for FormData
      }

      return headers;
    },
  }),
  tagTypes: ['Sections'], // ✅ Define tag type
  endpoints: (builder) => ({
    getSectionsByCourseID: builder.query<Ires, string | undefined>({
      query: (id) => {
        return `/admin/courses/${id}/sections`;
      },
      providesTags: ['Sections'],
    }),
    getSection: builder.query<IresOnew, string | undefined>({
      query: (id) => {
        return `/admin/courses/sections/details/${id}`;
      },
      providesTags: ['Sections'],
    }),
    createSection: builder.mutation<IresPost, { id: string | undefined; data: ISection }>({
      query: ({ id, data }) => ({
        url: `/admin/courses/${id}/sections`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Sections'], // ✅ Invalidate tag to refetch list
    }),
    deleteSection: builder.mutation<IresPost, number | undefined>({
      query: (id) => ({
        url: `/admin/courses/sections/details/${id}/delete`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Sections'],
    }),
    updateSection: builder.mutation<IresPost, { id: number | undefined; data: ISection }>({
      query: ({ id, data }) => ({
        url: `/admin/courses/sections/details/${id}/update`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Sections'],
    }),
  }),
});

export const {
  useCreateSectionMutation,
  useGetSectionsByCourseIDQuery,
  useGetSectionQuery,
  useDeleteSectionMutation,
  useUpdateSectionMutation,
} = sectionsApi;
