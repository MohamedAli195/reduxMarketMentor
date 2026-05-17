import { createApi } from "@reduxjs/toolkit/query/react";
import { IRole } from "interfaces";
import { IFormInputRoles } from "components/Permissions/addPermissions";
import { baseQueryWithAuth } from "app/api/baseQueryWithAuth";

/** 🔹 Types */

interface Ires {
  code: number;
  message: string;
  status: boolean;
  data: {
    data: IRole[] | undefined;
    total: number | undefined;
  };
}

interface IresPost {
  code: number;
  message: string;
  status: boolean;
  data: IRole;
}

/** 🔹 API */
export const rolesApi = createApi({
  reducerPath: "rolesApi",

  baseQuery: baseQueryWithAuth, // ✅ الحل هنا

  tagTypes: ["Roles"],

  endpoints: (builder) => ({
    getRoles: builder.query<
      Ires,
      { search?: string; page?: number; perPage?: number; sort_direction?: string }
    >({
      query: ({ search = '', page = 1, perPage, sort_direction = 'desc' }) => {
        const params = new URLSearchParams();

        params.append("page", page.toString());

        if (perPage) {
          params.append("per_page", perPage.toString());
        }

        params.append("sort_direction", sort_direction);

        if (search) {
          params.append("search", search);
        }

        return `/admin/roles?${params.toString()}`;
      },

      providesTags: ["Roles"],
    }),

    createRole: builder.mutation<IresPost, IFormInputRoles>({
      query: (data) => ({
        url: `/admin/roles`,
        method: "POST",
        body: data,
      }),

      invalidatesTags: ["Roles"],
    }),

    deleteRole: builder.mutation<IresPost, number | undefined>({
      query: (id) => ({
        url: `/roles/${id}/destroy`,
        method: "DELETE",
      }),

      invalidatesTags: ["Roles"],
    }),

    updateRole: builder.mutation<
      IresPost,
      { id: number | undefined; data: IFormInputRoles }
    >({
      query: ({ id, data }) => ({
        url: `/admin/roles/${id}/update`,
        method: "POST",
        body: data,
      }),

      invalidatesTags: ["Roles"],
    }),
  }),
});

/** 🔹 Hooks */
export const {
  useGetRolesQuery,
  useCreateRoleMutation,
  useDeleteRoleMutation,
  useUpdateRoleMutation,
} = rolesApi;