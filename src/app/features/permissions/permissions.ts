import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../../store';
import { Ipermisson } from 'interfaces';
import { number } from 'echarts';
import { BASE_URL } from '../auth/authQuery';

interface Ires {
  code: number;
  message: string;
  status: boolean;
  data: Ipermisson[] | undefined;
}



export const permissionsApi = createApi({
  reducerPath: 'permissionsApi',
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
  tagTypes: ['Permissions'], // ✅ Define tag type
  endpoints: (builder) => ({
    getPermissions: builder.query<Ires, void>({
      query: () => {
        return `/admin/roles/permissions`;
      },
      providesTags: ['Permissions'],
    }),




  }),
});

export const {

 useGetPermissionsQuery,

} = permissionsApi;
