import { useParams } from 'react-router-dom';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ViewRecommendationsForm from 'components/Recommendations/viewRecomendationsForm';
import { useGetRecommendationQuery } from 'app/features/Recommendations/RecommendationsSlice';

function RecommendationsDetails() {
  const { id } = useParams();
  const { t } = useTranslation();
   const { data, error, isLoading, isError }=useGetRecommendationQuery(id)

  if (isLoading) return <p>Loading...</p>;
  // if (isError) return <p>Error: {error.message}</p>;

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
