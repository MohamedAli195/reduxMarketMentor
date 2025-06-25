import { Outlet } from 'react-router-dom';
import React, { useEffect } from "react";

import { useTranslation } from "react-i18next";
import { store } from 'app/store';
const App = () => {
  const { i18n } = useTranslation();
  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  // useEffect(()=>{

  // },[token])
  return (
    <>
      <Outlet />
      
    </>
  );
};

export default App;
