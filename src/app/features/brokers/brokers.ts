import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../../store';
import { IBroker, ICategory, IPackage } from 'interfaces';
import { BASE_URL } from '../auth/authQuery';

// export interface ISize {
//   id?: number | undefined;
//   label: string;

// }
// interface Ires {
//   code: number;
//   message: string;
//   status: boolean;
//   data: { data: IBroker[] | undefined; total: number | undefined };
// }
interface Ires {
  code: number;
  message: string;
  status: boolean;
  data: IBroker[] 
}

interface IresPost {
  code: number;
  message: string;
  status: boolean;
  data: IBroker;
}

interface IresOne {
  code: number;
  message: string;
  status: boolean;
  data: IBroker;
}

export const brokerApi = createApi({
  reducerPath: 'brokerApi',
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
  tagTypes: ['Brokers'], // ✅ Define tag type
  endpoints: (builder) => ({
    getBrokers: builder.query<
      Ires,
      { search?: string; page?: number; perPage?: number; sort_direction?: string }
    >({
      query: ({ search = '', page = 1, perPage, sort_direction = 'desc' }) => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        if (perPage) params.append('per_page', perPage.toString()); // تأكد من أن API يتطلب "per_page"

        params.append('sort_direction', sort_direction.toString()); // تأكد من أن API يتطلب "per_page"
        if (search) params.append('search', search);

        return `/admin/brokers?${params.toString()}`;
      },
      providesTags: ['Brokers'],
    }),
    getBroker: builder.query<IresOne, string | undefined>({
      query: (id) => ({
        url: `/admin/brokers/${id}`,
      }),
      // invalidatesTags: ['Packages'], // ✅ Invalidate tag to refetch list
    }),

    createBroker: builder.mutation<IresPost, FormData>({
      query: (FormData) => ({
        url: `/admin/brokers `,
        method: 'POST',
        body: FormData,
      }),
      invalidatesTags: ['Brokers'], // ✅ Invalidate tag to refetch list
    }),
    deleteBroker: builder.mutation<IresPost, number | undefined>({
      query: (id) => ({
        url: `/admin/brokers/${id}/destroy`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Brokers'],
    }),
    updateBroker: builder.mutation<IresPost, { id: number | undefined; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/admin/brokers/${id}/update`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Brokers'],
    }),
  }),
});

export const {
  useGetBrokersQuery,
  useGetBrokerQuery,
  useCreateBrokerMutation,
  useDeleteBrokerMutation,
  useUpdateBrokerMutation,
} = brokerApi;
