import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../../store';
import { IAgenda, ICategory } from 'interfaces';
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
  data: { data: IAgenda[] | undefined; total: number | undefined };
}

interface IresPost {
  code: number;
  message: string;
  status: boolean;
  data: IAgenda;
}

interface IresOne {
  code: number;
  message: string;
  status: boolean;
  data: IAgenda;
}

export const agendaApi = createApi({
  reducerPath: 'agendaApi',
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
  tagTypes: ['Agenda'], // ✅ Define tag type
  endpoints: (builder) => ({
    getAgendas: builder.query<
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

        return `/admin/agenda?${params.toString()}`;
      },
      providesTags: ['Agenda'],
    }),

    
    getAgenda: builder.query<IresOne, string | undefined>({
      query: (id) => ({
        url: `/admin/agenda/${id}`,
      }),
      // invalidatesTags: ['Packages'], // ✅ Invalidate tag to refetch list
    }),

    createAgenda: builder.mutation<IresPost, FormData>({
      query: (FormData) => ({
        url: `/admin/agenda `,
        method: 'POST',
        body: FormData,
      }),
      invalidatesTags: ['Agenda'], // ✅ Invalidate tag to refetch list
    }),
    deleteAgenda: builder.mutation<IresPost, number | undefined>({
      query: (id) => ({
        url: `/admin/agenda/${id}/destroy`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Agenda'],
    }),
    updateAgenda: builder.mutation<IresPost, { id: number | undefined; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/admin/agenda/${id}/update`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Agenda'],
    }),
  }),
});

export const {
  useGetAgendasQuery,
  useGetAgendaQuery,
  useCreateAgendaMutation,
  useDeleteAgendaMutation,
  useUpdateAgendaMutation,
} = agendaApi;
