import { useLocation, useNavigate, useParams } from 'react-router-dom';
// import { fetchCourse } from "./coursesFunct";
import { useQuery } from '@tanstack/react-query';

import { Stack, Typography } from '@mui/material';

import { useTranslation } from 'react-i18next';

import UpdateCourse from './Update';
import { fetchOne } from 'functions';
// import EditCoursForm from "components/editCoursForm";

function CourseUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const { data, error, isLoading, isError } = useQuery({
    queryKey: ['packageDetail', id],
    queryFn: () => fetchOne(id, 'courses'),
  });

  console.log(data)
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  // console.log(data.data)
  return (
    <>
      <Stack flexDirection={'row'} justifyContent={'space-between'}>
        <Typography variant="h1" color="initial">
          {t('coursepage')} update
        </Typography>
      </Stack>

      {/* <EditCoursForm initialData ={data?.data}/> */}
      <UpdateCourse {...data.data} />
    </>
  );
}

export default CourseUpdate;
