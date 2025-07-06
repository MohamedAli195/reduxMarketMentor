import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../store";
import { ISection } from "interfaces";

// export interface ISize {
//   id?: number | undefined;
//   label: string;
  
// }

const BASE_URL = "/api/admin"; // triggers the proxy

interface Ires {
  code: number;
  message: string;
  status: boolean;
    data:  {data:ISection[] | undefined 
        total: number | undefined 
     }
}

interface IresPost {
  code: number;
  message: string;
  status: boolean;
  data: ISection;
}

export const sectionsApi = createApi({
  reducerPath: "sectionsApi",
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
  tagTypes: ["Sections"], // ✅ Define tag type
  endpoints: (builder) => ({
    getSectionsByCourseID: builder.query<Ires, string | undefined>({
      query: (id) => {

    
        return `/courses/${id}/sections`;
      },
      providesTags: ["Sections"],
    }),
    

    createSection: builder.mutation<IresPost, {id:string | undefined , data:ISection}>({
      query: ({id,data}) => ({
        url: `/courses/${id}/sections`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Sections"], // ✅ Invalidate tag to refetch list
    }),
    // deletePackage: builder.mutation<IresPost, number | undefined>({
    //   query: (id) => ({
    //     url: `/packages/${id}/destroy`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: ["Sections"],
    // }),
    // updatePackage: builder.mutation<IresPost, { id: number | undefined; formData: FormData }>({
    //   query: ({ id, formData }) => ({
    //     url: `/packages/${id}/update`,
    //     method: "POST",
    //     body: formData,
    //   }),
    //   invalidatesTags: ["Sections"],
    // }),
  }),
});

export const {
  useCreateSectionMutation,
  useGetSectionsByCourseIDQuery,
//   useDeletePackageMutation,
//   useUpdatePackageMutation,
} = sectionsApi;
