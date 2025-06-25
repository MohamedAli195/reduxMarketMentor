import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { fetchOne } from 'functions';
import ViewRecommendationsForm from 'components/Recommendations/viewRecomendationsForm';

function RecommendationsDetails() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ['RecommendationsDetails', id],
    queryFn: () => fetchOne(id,'recommendations'),
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <>
      <Typography variant="h1" color="initial">
        {t('packagPage')}
      </Typography>
      <ViewRecommendationsForm initialData={data?.data} />
    </>
  );
}

export default RecommendationsDetails;
