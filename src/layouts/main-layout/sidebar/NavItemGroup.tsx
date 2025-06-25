import { ListSubheader } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface NavItemGroupProp {
  subheader?: string;
}
const NavItemGroup = ({ subheader }: NavItemGroupProp) => {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);
  return <ListSubheader>{subheader}</ListSubheader>;
};

export default NavItemGroup;
