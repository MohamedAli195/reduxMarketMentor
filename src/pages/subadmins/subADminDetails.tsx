import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { fetchOne } from 'functions';
import SubAdminViewForm from 'components/SubAdmin/subAdminViewForm';

function SubAdminDetails() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ['SubAdminDetails', id],
    queryFn: () => fetchOne(id,'sub-admins'),
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <>
      <Typography variant="h1" color="initial">
        {t('packagPage')}
      </Typography>
      <SubAdminViewForm initialData={data?.data} />
    </>
  );
}

export default SubAdminDetails;
