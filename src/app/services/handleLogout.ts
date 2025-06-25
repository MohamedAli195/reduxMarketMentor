// handleLogout.ts
import Cookies from "js-cookie";

import { AppDispatch, persistor } from "app/store";
import { clearCredentials } from "app/features/auth/authSlice";


export const handleLogout = (dispatch: AppDispatch) => {
  Cookies.remove("persist:authApi", { path: "/" });
  Cookies.remove("persist:root", { path: "/" });
  Cookies.remove("token", { path: "/" });
  Cookies.remove("user", { path: "/" });

  persistor.purge();
  dispatch(clearCredentials());

  localStorage.removeItem("token")
};
