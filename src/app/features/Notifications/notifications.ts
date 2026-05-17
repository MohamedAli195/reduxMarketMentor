import { createApi } from '@reduxjs/toolkit/query/react';
import { INotfications } from 'interfaces';
import { baseQueryWithAuth } from 'app/api/baseQueryWithAuth';

/** 🔹 Types */

interface Ires {
  code: number;
  message: string;
  status: boolean;
  data: INotfications[] | undefined;
}

interface IresPost {
  code: number;
  message: string;
  status: boolean;
  data: INotfications;
}

interface resCount {
  code: number;
  data: number;
  message: string;
  status: boolean;
}

/** 🔹 API */
export const notificationsApi = createApi({
  reducerPath: 'notificationsApi',

  baseQuery: baseQueryWithAuth, // ✅ الحل هنا

  tagTypes: ['Notifications'],

  endpoints: (builder) => ({
    getNotifications: builder.query<Ires, void>({
      query: () => `/admin/admin-notifications`,
      providesTags: ['Notifications'],
    }),

    getCountOfNotifications: builder.query<resCount, void>({
      query: () => `/admin/admin-count-of-notifications`,
      providesTags: ['Notifications'],
    }),

    readNotification: builder.mutation<IresPost, number | string>({
      query: (id) => ({
        url: `/admin/admin-read-of-notification/${id}`,
        method: 'POST',
        body: id,
      }),

      invalidatesTags: ['Notifications'],
    }),
  }),
});

/** 🔹 Hooks */
export const {
  useGetCountOfNotificationsQuery,
  useGetNotificationsQuery,
  useReadNotificationMutation,
} = notificationsApi;