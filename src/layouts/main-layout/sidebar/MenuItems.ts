/* eslint-disable @typescript-eslint/no-explicit-any */
import { SvgIconProps } from '@mui/material';
import CategoriesIcon from 'components/icons/menu-icons/CategoriesIcon';
import CustomersIcon from 'components/icons/menu-icons/CustomersIcon';
import HomeIcon from 'components/icons/menu-icons/HomeIcon';
import InboxIcon from 'components/icons/menu-icons/InboxIcon';
import OrderIcon from 'components/icons/menu-icons/OrderIcon';
import ProductsIcon from 'components/icons/menu-icons/ProductsIcon';
import i18next from 'i18next';

import { uniqueId } from 'lodash';

import paths from 'routes/path';

export interface IMenuitems {
  [x: string]: any;
  id?: string;
  navlabel?: boolean;
  subheader?: string;
  title?: string;
  icon?: (props: SvgIconProps) => JSX.Element;
  href?: string;
  children?: IMenuitems[];
  chip?: string;
  chipColor?: string | any;
  variant?: string | any;
  available?: boolean;
  level?: number;
  onClick?: React.MouseEvent<HTMLButtonElement, MouseEvent>;
}

const generateMenuItems = (): IMenuitems[] => [
  {
    id: uniqueId(),
    title: i18next.t("dashboard"),
    icon: HomeIcon,
    href: '/',
    available: true,
  },
  {
    id: uniqueId(),
    title: i18next.t("packages"),
    icon: OrderIcon,
    href: paths.packages,
    chipColor: 'secondary',
    available: true,
  },
  {
    id: uniqueId(),
    title: i18next.t("courses"),
    icon: ProductsIcon,
    href: paths.courses,
    available: true,
  },
  {
    id: uniqueId(),
    title: i18next.t("categories"),
    icon: CategoriesIcon,
    href: paths.categories,
    available: true,
  },
  {
    id: uniqueId(),
    title: i18next.t("Orders"),
    icon: InboxIcon,
    href: paths.orders,
    available: true,
  },
  {
    id: uniqueId(),
    title: i18next.t("customers"),
    icon: CustomersIcon,
    href: paths.customers,
    available: true,
  },
  {
    id: uniqueId(),
    title: i18next.t("Roles"),
    icon: CustomersIcon,
    href: paths.permissions,
    available: true,
  },

  {
    id: uniqueId(),
    title: i18next.t("Sub-Admins"),
    icon: CustomersIcon,
    href: paths.subAdmins,
    available: true,
  },
  {
    id: uniqueId(),
    title: i18next.t("Recommendations"),
    icon: CustomersIcon,
    href: paths.recommendations,
    available: true,
  },
  
];

export default generateMenuItems;
