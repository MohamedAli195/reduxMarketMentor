import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../store";
import { ICategory } from "interfaces";
import { BASE_URL } from "../auth/authQuery";

// export interface ISize {
//   id?: number | undefined;
//   label: string;
  
// }

 // triggers the proxy

interface Ires {
  code: number;
  message: string;
  status: boolean;
    data:  {data:ICategory[] | undefined 
        total: number | undefined 
     }
}

interface IresPost {
  code: number;
  message: string;
  status: boolean;
  data: ICategory;
}

export const categoriesApi = createApi({
  reducerPath: "categoriesApi",
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
  tagTypes: ["Categories"], // ✅ Define tag type
  endpoints: (builder) => ({
    getCategories: builder.query<Ires, { search?: string; page?: number; perPage?: number,sort_direction?:string }>({
      query: ({ search = '', page = 1, perPage ,sort_direction='desc' }) => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        if(perPage){
params.append('per_page', perPage.toString()); // تأكد من أن API يتطلب "per_page"
        }
        
        params.append('sort_direction', sort_direction.toString()); // تأكد من أن API يتطلب "per_page"
        if (search) params.append('search', search);
    
        return `/admin/categories?${params.toString()}`;
      },
      providesTags: ["Categories"],
    }),
    

    createCategory: builder.mutation<IresPost, FormData>({
      query: (FormData) => ({
        url: `/admin/categories `,
        method: "POST",
        body: FormData,
      }),
      invalidatesTags: ["Categories"], // ✅ Invalidate tag to refetch list
    }),
    deleteCategory: builder.mutation<IresPost, number | undefined>({
      query: (id) => ({
        url: `/admin/categories/${id}/destroy`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    }),
    updateCategory: builder.mutation<IresPost, { id: number | undefined; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/admin/categories/${id}/update`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Categories"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} = categoriesApi;
