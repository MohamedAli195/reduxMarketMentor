import { store } from "app/store";
import axios from "axios";
import i18n from "i18n";

// const url = 'https://market-mentor.flexi-code.com/public/api/admin/'
 const url = import.meta.env.VITE_API_URL;


export const fetchStatis = async () => {
  const token = store.getState().auth.authData.token;

    if (!token) {
      throw new Error('Authorization token is missing');
    }

    const response = await axios.get(
      `${url}/admin/home-page`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept:'application/json',
          lang:i18n.language
        },
      },
    );

    return response.data;
  };