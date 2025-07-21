import { useParams } from 'react-router-dom';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ViewPackageForm from 'components/Packages/viewpackageForm';
import { useGetBrokerQuery } from 'app/features/brokers/brokers';
import ViewBrokersForm from 'components/Brokers/viewBrokersForm';

function BrokerDetails() {
  const { id } = useParams();
  const { t } = useTranslation();


 const { data, error, isLoading, isError } = useGetBrokerQuery(id)
console.log(id)
console.log(data)
  if (isLoading) return <p>Loading...</p>;
  // if (isError) return <p>Error: {error.message}</p>;

  return (
    <>
      <Typography variant="h1" color="initial">
        {t('BrokerPage')}
      </Typography>
      <ViewBrokersForm initialData={data?.data} />
    </>
  );
}

export default BrokerDetails;
