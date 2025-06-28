import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../store";
import { ICategory, ICourseLectuer } from "interfaces";
import { IFormInputLectuers } from "components/CourseLectuers/updateLectuerForm";

// export interface ISize {
//   id?: number | undefined;
//   label: string;
  
// }

const BASE_URL = "/api/admin"; // triggers the proxy

interface Ires {
  code: number;
  message: string;
  status: boolean;
    data:  {data:ICourseLectuer[] | undefined 
        total: number | undefined 
     }
}

interface IresPost {
  code: number;
  message: string;
  status: boolean;
  data: ICourseLectuer;
}

export const leactuersApi = createApi({
  reducerPath: "leactuersApi",
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
  tagTypes: ["Lectuers"], // ✅ Define tag type
  endpoints: (builder) => ({
    getLectures: builder.query<Ires, { search?: string; page: number; perPage: number,sort_direction:string }>({
      query: ({ search = '', page = 1, perPage = 1 ,sort_direction='desc' }) => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('per_page', perPage.toString()); // تأكد من أن API يتطلب "per_page"
        params.append('sort_direction', sort_direction.toString()); // تأكد من أن API يتطلب "per_page"
        if (search) params.append('search', search);
    
        return `/course-lectures?${params.toString()}`;
      },
      providesTags: ["Lectuers"],
    }),
    

    createLecture: builder.mutation<IresPost, IFormInputLectuers>({
      query: (data) => ({
        url: `/course-lectures `,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Lectuers"], // ✅ Invalidate tag to refetch list
    }),
    deleteLecture: builder.mutation<IresPost, number | undefined>({
      query: (id) => ({
        url: `/course-lectures/${id}/destroy`,
        method: "DELETE",
      }),
      invalidatesTags: ["Lectuers"],
    }),
    updateLecture: builder.mutation<IresPost, { id:string | number | undefined, data: IFormInputLectuers }>({
      query: ({ id, data }) => ({
        url: `/course-lectures/${id}/update`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Lectuers"],
    }),
  }),
});

export const {
  useGetLecturesQuery,
  useCreateLectureMutation,
  useDeleteLectureMutation,
  useUpdateLectureMutation,
} = leactuersApi;
