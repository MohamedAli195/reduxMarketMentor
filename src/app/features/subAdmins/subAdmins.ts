import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "app/store";
import { IFormInputSubAdmin } from "components/SubAdmin/addSubAdmin";

import { ICategory, ISubADmin } from "interfaces";

// export interface ISize {
//   id?: number | undefined;
//   label: string;
  
// }

const BASE_URL = "/api"; // triggers the proxy

interface Ires {
  code: number;
  message: string;
  status: boolean;
    data:  {data:ISubADmin[] | undefined 
        total: number | undefined 
     }
}

interface IresPost {
  code: number;
  message: string;
  status: boolean;
  data: ISubADmin;
}

export const subAdminApi = createApi({
  reducerPath: "subAdminApi",
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
  tagTypes: ["SubAdmin"], // ✅ Define tag type
  endpoints: (builder) => ({
    getSubAdmins: builder.query<Ires, { search?: string; page: number; perPage: number,sort_direction:string }>({
      query: ({ search = '', page = 1, perPage = 1 ,sort_direction='desc' }) => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('per_page', perPage.toString()); // تأكد من أن API يتطلب "per_page"
        params.append('sort_direction', sort_direction.toString()); // تأكد من أن API يتطلب "per_page"
        if (search) params.append('search', search);
    
        return `/sub-admins?${params.toString()}`;
      },
      providesTags: ["SubAdmin"],
    }),
    

    createSubAdmin: builder.mutation<IresPost, IFormInputSubAdmin>({
      query: (data) => ({
        url: `/sub-admins `,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SubAdmin"], // ✅ Invalidate tag to refetch list
    }),
    deleteSubAdmin: builder.mutation<IresPost, number | undefined>({
      query: (id) => ({
        url: `/sub-admins/${id}/destroy`,
        method: "DELETE",
      }),
      invalidatesTags: ["SubAdmin"],
    }),
    updateSubAdmin: builder.mutation<IresPost, { id: number | undefined; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/sub-admins/${id}/update`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["SubAdmin"],
    }),
  }),
});

export const {
  useGetSubAdminsQuery,
  useCreateSubAdminMutation,
  useDeleteSubAdminMutation,
  useUpdateSubAdminMutation,
} = subAdminApi;
