import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../../store';
import { IAgenda, IAnalytics, ICategory, IStartMenu } from 'interfaces';
import { BASE_URL } from '../auth/authQuery';

// export interface ISize {
//   id?: number | undefined;
//   label: string;

// }

// triggers the proxy

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

export const startMenuApi = createApi({
  reducerPath: 'startMenuApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth?.authData.token ?? null;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
        // Do not manually set Content-Type for FormData
      }
      headers.set('Accept', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['StartMenu'], // ✅ Define tag type
  endpoints: (builder) => ({
    getStartMenus: builder.query<
      Ires,
      { search?: string; page?: number; perPage?: number; sort_direction?: string }
    >({
      query: ({ search = '', page = 1, perPage, sort_direction = 'desc' }) => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        if (perPage) {
          params.append('per_page', perPage.toString()); // تأكد من أن API يتطلب "per_page"
        }

        params.append('sort_direction', sort_direction.toString()); // تأكد من أن API يتطلب "per_page"
        if (search) params.append('search', search);

        return `/admin/start-menu?${params.toString()}`;
      },
      providesTags: ['StartMenu'],
    }),

    getStartMenu: builder.query<IresOne, string | undefined>({
      query: (id) => ({
        url: `/admin/start-menu/${id}`,
      }),
      // invalidatesTags: ['Packages'], // ✅ Invalidate tag to refetch list
    }),

    createStartMenu: builder.mutation<IresPost, FormData>({
      query: (FormData) => ({
        url: `/admin/start-menu`,
        method: 'POST',
        body: FormData,
      }),
      invalidatesTags: ['StartMenu'], // ✅ Invalidate tag to refetch list
    }),
    deleteStartMenu: builder.mutation<IresPost, number | undefined>({
      query: (id) => ({
        url: `/admin/start-menu/${id}/destroy`,
        method: 'DELETE',
      }),
      invalidatesTags: ['StartMenu'],
    }),
    updateStartMenu: builder.mutation<IresPost, { id: number | undefined; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/admin/start-menu/${id}/update`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['StartMenu'],
    }),
  }),
});

export const {
  useGetStartMenusQuery,
  useGetStartMenuQuery,
  useCreateStartMenuMutation,
  useDeleteStartMenuMutation,
  useUpdateStartMenuMutation,
} = startMenuApi;
