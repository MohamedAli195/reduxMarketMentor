import { createApi } from '@reduxjs/toolkit/query/react';
import { Ipermisson } from 'interfaces';
import { baseQueryWithAuth } from 'app/api/baseQueryWithAuth';

/** 🔹 Types */

interface Ires {
  code: number;
  message: string;
  status: boolean;
  data: Ipermisson[] | undefined;
}

/** 🔹 API */
export const permissionsApi = createApi({
  reducerPath: 'permissionsApi',

  baseQuery: baseQueryWithAuth, // ✅ الحل هنا

  tagTypes: ['Permissions'],

  endpoints: (builder) => ({
    getPermissions: builder.query<Ires, void>({
      query: () => `/admin/roles/permissions`,
      providesTags: ['Permissions'],
    }),
  }),
});

/** 🔹 Hooks */
export const {
  useGetPermissionsQuery,
} = permissionsApi;