import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "app/features/auth/authQuery";
import { handleLogout } from "app/services/handleLogout";
import { RootState } from "app/store";
import paths from "routes/path";


const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token =
      (getState() as RootState).auth?.authData.token ?? null;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    headers.set("Accept", "application/json");
    return headers;
  },
});

export const baseQueryWithAuth = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  api: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extraOptions: any
) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    handleLogout(api.dispatch); // ✅ الصح
    window.location.href = paths.login; // ✅ الصح
  }

  return result;
};