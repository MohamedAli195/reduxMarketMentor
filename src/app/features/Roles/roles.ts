import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../store";
import { ICategory, IRole } from "interfaces";
import { IFormInputRoles } from "components/Permissions/addPermissions";

// export interface ISize {
//   id?: number | undefined;
//   label: string;
  
// }

const BASE_URL = "/api/admin"; // triggers the proxy

interface Ires {
  code: number;
  message: string;
  status: boolean;
    data:  {data:IRole[] | undefined 
        total: number | undefined 
     }
}

interface IresPost {
  code: number;
  message: string;
  status: boolean;
  data: IRole;
}

export const rolesApi = createApi({
  reducerPath: "rolesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
const token = (getState() as RootState).auth?.authData.token ?? null;    
          if (token) {
            headers.set("Authorization", `Bearer ${token}`);
            // Do not manually set Content-Type for FormData
          }
    
          return headers;
        }
  }),
  tagTypes: ["Roles"], // ✅ Define tag type
  endpoints: (builder) => ({
    getRoles: builder.query<Ires, { search?: string; page?: number; perPage?: number,sort_direction?:string }>({
      query: ({ search = '', page = 1, perPage ,sort_direction='desc' }) => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        if(perPage){
params.append('per_page', perPage.toString()); // تأكد من أن API يتطلب "per_page"
        }
        
        params.append('sort_direction', sort_direction.toString()); // تأكد من أن API يتطلب "per_page"
        if (search) params.append('search', search);
    
        return `/roles?${params.toString()}`;
      },
      providesTags: ["Roles"],
    }),
    

    createRole: builder.mutation<IresPost, IFormInputRoles>({
      query: (data) => ({
        url: `/roles `,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Roles"], // ✅ Invalidate tag to refetch list
    }),
    deleteRole: builder.mutation<IresPost, number | undefined>({
      query: (id) => ({
        url: `/roles/${id}/destroy`,
        method: "DELETE",
      }),
      invalidatesTags: ["Roles"],
    }),
    updateRole: builder.mutation<IresPost, { id: number | undefined; data: IFormInputRoles }>({
      query: ({ id, data }) => ({
        url: `/roles/${id}/update`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Roles"],
    }),
  }),
});

export const {
  useGetRolesQuery,
  useCreateRoleMutation,
  useDeleteRoleMutation,
  useUpdateRoleMutation,
} = rolesApi;
