
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ViewLectuerForm from 'components/CourseLectuers/viewLectuerForm';

function LectuerDetails() {
  const { t } = useTranslation();

  return (
    <>
      <Typography variant="h1" color="initial">
        {t('LectuerPage')}
      </Typography>
      <ViewLectuerForm />
    </>
  );
}

export default LectuerDetails;
