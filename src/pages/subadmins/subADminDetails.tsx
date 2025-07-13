import { useParams } from 'react-router-dom';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import SubAdminViewForm from 'components/SubAdmin/subAdminViewForm';
import { useGetSubAdminQuery } from 'app/features/subAdmins/subAdmins';

function SubAdminDetails() {
  const { id } = useParams();
  const { t } = useTranslation();
  
    const { data, error, isLoading, isError } = useGetSubAdminQuery(+id!);

    if (isLoading) return <p>Loading...</p>;
    // if (isError) return <p>Error: {error.message}</p>;
  
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
