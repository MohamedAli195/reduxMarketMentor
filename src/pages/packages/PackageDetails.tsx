import { useParams } from 'react-router-dom';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ViewPackageForm from 'components/Packages/viewpackageForm';
import { useGetPackageQuery } from 'app/features/packages/packages';

function PackageDetails() {
  const { id } = useParams();
  const { t } = useTranslation();


 const { data, error, isLoading, isError } = useGetPackageQuery(id)

  if (isLoading) return <p>Loading...</p>;
  // if (isError) return <p>Error: {error.message}</p>;

  return (
    <>
      <Typography variant="h1" color="initial">
        {t('packagPage')}
      </Typography>
      <ViewPackageForm initialData={data?.data} />
    </>
  );
}

export default PackageDetails;
