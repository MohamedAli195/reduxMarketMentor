import { createApi } from "@reduxjs/toolkit/query/react";
import { RootState } from "app/store";
import { IFormInputSubAdmin } from "components/SubAdmin/addSubAdmin";
import { ISubADmin } from "interfaces";
import { BASE_URL } from "../auth/authQuery";
import { baseQueryWithAuth } from "app/api/baseQueryWithAuth";

/** 🔹 Types */

interface Ires {
  code: number;
  message: string;
  status: boolean;
  data: {
    data: ISubADmin[] | undefined;
    total: number | undefined;
  };
}

interface IresPost {
  code: number;
  message: string;
  status: boolean;
  data: ISubADmin;
}

interface IresOne {
  code: number;
  message: string;
  status: boolean;
  data: ISubADmin;
}

/** 🔹 API */
export const subAdminApi = createApi({
  reducerPath: "subAdminApi",

  baseQuery: baseQueryWithAuth, // ✅ الحل هنا

  tagTypes: ["SubAdmin"],

  endpoints: (builder) => ({
    getSubAdmins: builder.query<
      Ires,
      { search?: string; page: number; perPage: number; sort_direction: string }
    >({
      query: ({ search = '', page = 1, perPage = 1, sort_direction = 'desc' }) => {
        const params = new URLSearchParams();

        params.append("page", page.toString());
        params.append("per_page", perPage.toString());
        params.append("sort_direction", sort_direction);

        if (search) {
          params.append("search", search);
        }

        return `/admin/sub-admins?${params.toString()}`;
      },

      providesTags: ["SubAdmin"],
    }),

    getSubAdmin: builder.query<IresOne, number>({
      query: (id) => `/admin/sub-admins/${id}`,
    }),

    createSubAdmin: builder.mutation<IresPost, IFormInputSubAdmin>({
      query: (data) => ({
        url: `/admin/sub-admins`,
        method: "POST",
        body: data,
      }),

      invalidatesTags: ["SubAdmin"],
    }),

    deleteSubAdmin: builder.mutation<IresPost, number | undefined>({
      query: (id) => ({
        url: `/admin/sub-admins/${id}/destroy`,
        method: "DELETE",
      }),

      invalidatesTags: ["SubAdmin"],
    }),

    updateSubAdmin: builder.mutation<
      IresPost,
      { id: number | undefined; data: IFormInputSubAdmin }
    >({
      query: ({ id, data }) => ({
        url: `/admin/sub-admins/${id}/update`,
        method: "POST",
        body: data,
      }),

      invalidatesTags: ["SubAdmin"],
    }),
  }),
});

/** 🔹 Hooks */
export const {
  useGetSubAdminsQuery,
  useGetSubAdminQuery,
  useCreateSubAdminMutation,
  useDeleteSubAdminMutation,
  useUpdateSubAdminMutation,
} = subAdminApi;