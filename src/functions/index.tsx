import { RootState, store } from "app/store";
import axios from "axios";
import i18n from "i18n";
import { Ipermisson } from "interfaces";
import toast from "react-hot-toast";
const url = import.meta.env.VITE_API_URL;
const token = store.getState().auth.authData.token;

const storedPermissions = localStorage.getItem('permissions');
export let parsedData:Ipermisson[];
if (storedPermissions) {
  parsedData = JSON.parse(storedPermissions);
    // console.log(parsedData);
} else {
   
    // console.log('No data found!');
   
}


export const checkPermissions = (permissions: Ipermisson[] | undefined, one: string | undefined) => {
  if(permissions)
  {
    return permissions.some(item => item.name === one);

  }
};