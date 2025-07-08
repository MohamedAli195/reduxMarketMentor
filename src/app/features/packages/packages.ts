import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../store";
import { ICategory, IPackage } from "interfaces";

// export interface ISize {
//   id?: number | undefined;
//   label: string;
  
// }

const BASE_URL = "/api/admin"; // triggers the proxy

interface Ires {
  code: number;
  message: string;
  status: boolean;
    data:  {data:IPackage[] | undefined 
        total: number | undefined 
     }
}

interface IresPost {
  code: number;
  message: string;
  status: boolean;
  data: ICategory;
}

export const packagesApi = createApi({
  reducerPath: "packagesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
const token = (getState() as RootState).auth?.authData.token ?? null;    
          if (token) {
            headers.set("Authorization", `Bearer ${token}`);
            // Do not manually set Content-Type for FormData
          }
    headers.set("Accept", "application/json");
          return headers;
        }
  }),
  tagTypes: ["Packages"], // ✅ Define tag type
  endpoints: (builder) => ({
    getPackages: builder.query<Ires, { search?: string; page?: number; perPage?: number,sort_direction?:string }>({
      query: ({ search = '', page = 1, perPage ,sort_direction='desc' }) => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        if(perPage) params.append('per_page', perPage.toString()); // تأكد من أن API يتطلب "per_page"
        
        params.append('sort_direction', sort_direction.toString()); // تأكد من أن API يتطلب "per_page"
        if (search) params.append('search', search);
    
        return `/packages?${params.toString()}`;
      },
      providesTags: ["Packages"],
    }),
    

    createPackage: builder.mutation<IresPost, FormData>({
      query: (FormData) => ({
        url: `/packages `,
        method: "POST",
        body: FormData,
      }),
      invalidatesTags: ["Packages"], // ✅ Invalidate tag to refetch list
    }),
    deletePackage: builder.mutation<IresPost, number | undefined>({
      query: (id) => ({
        url: `/packages/${id}/destroy`,
        method: "DELETE",
      }),
      invalidatesTags: ["Packages"],
    }),
    updatePackage: builder.mutation<IresPost, { id: number | undefined; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/packages/${id}/update`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Packages"],
    }),
  }),
});

export const {
  useGetPackagesQuery,
  useCreatePackageMutation,
  useDeletePackageMutation,
  useUpdatePackageMutation,
} = packagesApi;
