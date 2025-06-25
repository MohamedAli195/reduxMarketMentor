import { Grid, SvgIconProps } from '@mui/material';
import CartIcon from 'components/icons/menu-icons/CartIcon';
import CustomersIcon from 'components/icons/menu-icons/CustomersIcon';
import DollarIcon from 'components/icons/menu-icons/DollarIcon';
import PersonalSettingsIcon from 'components/icons/menu-icons/PersonalSettingsIcon';
import StatisticsCardItem from './StatisticsCardItem';
import { useQuery } from '@tanstack/react-query';
import { fetchStatis } from './statisticsFn';
import { useEffect, useState } from 'react';
import CategoriesIcon from 'components/icons/menu-icons/CategoriesIcon';
import ProductsIcon from 'components/icons/menu-icons/ProductsIcon';
import KnowledgebaseIcon from 'components/icons/menu-icons/KnowledgebaseIcon';
import CouponsIcon from 'components/icons/menu-icons/CouponsIcon';
import { t } from 'i18next';
import SkeletonLoader from 'components/dashboardSkelton';

// interface PercentageProps {
//   color: string;
//   count: string;
//   text?: string;
// }
export interface IStatisticsCard {
  id: number;
  title: string;
  subtitle: string;
  // percentage: PercentageProps;
  icon: (props: SvgIconProps) => JSX.Element;
}

export const stats: IStatisticsCard[] = [
  {
    id: 0,
    // percentage: { color: 'success', count: '22.45%' },
    icon: DollarIcon,
    title: '10540',
    subtitle: 'Total Revenue',
  },

  {
    id: 1,
    // percentage: { color: 'success', count: '22.45%' },
    icon: CartIcon,
    title: '1056',
    subtitle: 'Orders',
  },
  {
    id: 2,
    // percentage: { color: 'error', count: '02.45%' },
    icon: PersonalSettingsIcon,
    title: '0056',
    subtitle: 'Active Sessions',
  },
  {
    id: 3,
    // percentage: { color: 'error', count: '00.45%' },
    icon: CustomersIcon,
    title: '0056',
    subtitle: 'Total Sessions',
  },
];

const StatisticsCards = () => {


  const { data, error, isLoading, isError, refetch } = useQuery({
    queryKey: [`statistcs`],
    queryFn: () => fetchStatis(),
  });

  if (isLoading) return <SkeletonLoader />
  if (isError) return <p>Error: {error.message}</p>;
  const stats2: IStatisticsCard[] = [
    {
      id: 0,
      // percentage: { color: 'success', count: '22.45%' },
      icon: CategoriesIcon,
      title: data?.data?.count_of_courses,
      subtitle: t("TotalCourses"),
    },
  
    {
      id: 1,
      // percentage: { color: 'success', count: '22.45%' },
      icon: CartIcon,
      title: data?.data?.count_of_orders,
      subtitle: t('orders'),
    },
    {
      id: 2,
      // percentage: { color: 'error', count: '02.45%' },
      icon: CouponsIcon,
      title: data?.data?.count_of_packages,
      subtitle: t('packages'),
    },
    {
      id: 3,
      // percentage: { color: 'error', count: '00.45%' },
      icon: CustomersIcon,
      title: data?.data?.count_of_customers,
      subtitle: t('customers'),
    },
  ];


 return (
    <Grid container spacing={0.25}>
      {stats2.map((cardItem) => {
        return (
          <Grid item xs={12} sm={6} xl={3} key={cardItem.id}>
            <StatisticsCardItem cardData={cardItem} index={cardItem.id} totalCount={stats.length} />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default StatisticsCards;
