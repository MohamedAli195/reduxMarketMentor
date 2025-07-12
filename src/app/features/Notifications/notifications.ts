import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../../store';
import { ICategory, INotfications } from 'interfaces';
import { number } from 'echarts';
import { BASE_URL } from '../auth/authQuery';

// export interface ISize {
//   id?: number | undefined;
//   label: string;

// }


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
export const notificationsApi = createApi({
  reducerPath: 'notificationsApi',
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
  tagTypes: ['Notifications'], // ✅ Define tag type
  endpoints: (builder) => ({
    getNotifications: builder.query<Ires, void>({
      query: () => {
        return `/admin/admin-notifications`;
      },
      providesTags: ['Notifications'],
    }),
    getCountOfNotifications: builder.query<resCount, void>({
      query: () => {
        return `/admin/admin-count-of-notifications`;
      },
      providesTags: ['Notifications'],
    }),

    readNotification: builder.mutation<IresPost, number | string>({
      query: (id) => ({
        url: `/admin/admin-read-of-notification/${id}`,
        method: 'POST',
        body: id,
      }),
      invalidatesTags: ['Notifications'], // ✅ Invalidate tag to refetch list
    }),
  }),
});

export const {
  useGetCountOfNotificationsQuery,
  useGetNotificationsQuery,
  useReadNotificationMutation,
} = notificationsApi;
