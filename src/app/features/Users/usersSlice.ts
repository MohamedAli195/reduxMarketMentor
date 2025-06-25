import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../store";
import { ICategory, IPackage, IUser } from "interfaces";

// export interface ISize {
//   id?: number | undefined;
//   label: string;
  
// }

const BASE_URL = "/api/admin"; // triggers the proxy

interface Ires {
  code: number;
  message: string;
  status: boolean;
    data:  {data:IUser[] | undefined 
        total: number | undefined 
     }
}

interface IresPost {
  code: number;
  message: string;
  status: boolean;
  data: IUser;
}

export const customersApi = createApi({
  reducerPath: "customersApi",
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
  tagTypes: ["Customers"], // ✅ Define tag type
  endpoints: (builder) => ({
    getCustomers: builder.query<Ires, { search?: string; page: number; perPage: number,sort_direction:string }>({
      query: ({ search = '', page = 1, perPage = 1 ,sort_direction='desc' }) => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('per_page', perPage.toString()); // تأكد من أن API يتطلب "per_page"
        params.append('sort_direction', sort_direction.toString()); // تأكد من أن API يتطلب "per_page"
        if (search) params.append('search', search);
    
        return `/customers?${params.toString()}`;
      },
      providesTags: ["Customers"],
    }),
    

    createCustomer: builder.mutation<IresPost, FormData>({
      query: (FormData) => ({
        url: `/customers `,
        method: "POST",
        body: FormData,
      }),
      invalidatesTags: ["Customers"], // ✅ Invalidate tag to refetch list
    }),
    deleteCustomer: builder.mutation<IresPost, number | undefined>({
      query: (id) => ({
        url: `/customers/${id}/destroy`,
        method: "DELETE",
      }),
      invalidatesTags: ["Customers"],
    }),
    updateCustomer: builder.mutation<IresPost, { id: number | undefined; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/customers/${id}/update`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Customers"],
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useCreateCustomerMutation,
  useDeleteCustomerMutation,
  useUpdateCustomerMutation,
} = customersApi;
