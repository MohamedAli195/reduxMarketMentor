import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "app/store";
import { Ipermisson } from "interfaces";
import { BASE_URL } from "../auth/authQuery";

interface Ires {
  code: number;
  data: {
    permissions: Ipermisson[];
    // avatar: string;
    email: string;
    id: number;
    name: string;
//   message: string;
};
  status: boolean;
  token: string;
}


export const profileApi = createApi({
  reducerPath: "profileApi",
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
  tagTypes: ["Categories"], // ✅ Define tag type
  endpoints: (builder) => ({
    getProfile: builder.query<Ires,void>({
      query: () => {
        return `/admin/admin/profile`;
      },
     
    }),
  }),
});

export const { useGetProfileQuery } = profileApi;
