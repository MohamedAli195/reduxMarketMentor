import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../store";
import { ICategory, IPackage, IUser } from "interfaces";
import { BASE_URL } from "../auth/authQuery";

// export interface ISize {
//   id?: number | undefined;
//   label: string;
// }
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

interface IresOne {
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
    headers.set("Accept", "application/json");
    
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
    
        return `/admin/customers?${params.toString()}`;
      },
      providesTags: ["Customers"],
    }),
    getCustomer: builder.query<IresOne, string | undefined>({
      query: (id) => ({
        url: `/admin/customers/${id}`,
      }),
      // invalidatesTags: ['Packages'], // ✅ Invalidate tag to refetch list
    }),
    

    createCustomer: builder.mutation<IresPost, FormData>({
      query: (FormData) => ({
        url: `/admin/customers `,
        method: "POST",
        body: FormData,
      }),
      invalidatesTags: ["Customers"], // ✅ Invalidate tag to refetch list
    }),
    deleteCustomer: builder.mutation<IresPost, number | undefined>({
      query: (id) => ({
        url: `/admin/customers/${id}/destroy`,
        method: "DELETE",
      }),
      invalidatesTags: ["Customers"],
    }),
    updateCustomer: builder.mutation<IresPost, { id: number | undefined; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/admin/customers/${id}/update`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Customers"],
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useGetCustomerQuery,
  useCreateCustomerMutation,
  useDeleteCustomerMutation,
  useUpdateCustomerMutation,
} = customersApi;
