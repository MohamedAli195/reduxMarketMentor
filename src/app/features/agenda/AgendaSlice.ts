import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../../store';
import { IAgenda } from 'interfaces';
import { BASE_URL } from '../auth/authQuery';
import { handleLogout } from 'app/services/handleLogout';


/** 🔹 Types */

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

/** 🔹 Base Query الأصلي */
const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth?.authData.token ?? null;

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    headers.set('Accept', 'application/json');
    return headers;
  },
});

/** 🔥 Wrapper لمعالجة 401 */
const baseQueryWithAuth = async (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  api: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extraOptions: any
) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    handleLogout(api.dispatch); // ✅ الصح
    window.location.href = '/login';
  }

  return result;
};

/** 🔹 API */
export const agendaApi = createApi({
  reducerPath: 'agendaApi',

  baseQuery: baseQueryWithAuth, // ✅ هنا التعديل

  tagTypes: ['Agenda'],

  endpoints: (builder) => ({
    /** 🔹 GET Agendas */
    getAgendas: builder.query<
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

        return `/admin/agenda?${params.toString()}`;
      },

      providesTags: ['Agenda'],
    }),

    /** 🔹 GET Single Agenda */
    getAgenda: builder.query<IresOne, string | undefined>({
      query: (id) => ({
        url: `/admin/agenda/${id}`,
      }),
    }),

    /** 🔹 CREATE Agenda */
    createAgenda: builder.mutation<IresPost, FormData>({
      query: (formData) => ({
        url: `/admin/agenda`,
        method: 'POST',
        body: formData,
      }),

      invalidatesTags: ['Agenda'],
    }),

    /** 🔹 DELETE Agenda */
    deleteAgenda: builder.mutation<IresPost, number | undefined>({
      query: (id) => ({
        url: `/admin/agenda/${id}/destroy`,
        method: 'DELETE',
      }),

      invalidatesTags: ['Agenda'],
    }),

    /** 🔹 UPDATE Agenda */
    updateAgenda: builder.mutation<
      IresPost,
      { id: number | undefined; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/admin/agenda/${id}/update`,
        method: 'POST',
        body: formData,
      }),

      invalidatesTags: ['Agenda'],
    }),
  }),
});

/** 🔹 Hooks */
export const {
  useGetAgendasQuery,
  useGetAgendaQuery,
  useCreateAgendaMutation,
  useDeleteAgendaMutation,
  useUpdateAgendaMutation,
} = agendaApi;