import { useNavigate, useParams } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';
import { Box, Button, Stack, Typography } from '@mui/material';
import paths from 'routes/path';
import { useTranslation } from 'react-i18next';
import ViewCoursForm from 'components/Courses/viewCoursForm';
import LectuerTable from 'components/lectuerTable';
import { fetchOne } from 'functions';
import BasicModal from 'components/Shared/modal/ShareModal';
import AddCourseForm from 'components/Courses/AddCourseForm';
import AddCourseLectuerForm from 'components/CourseLectuers/AddCourseLectuerForm';
import { useState } from 'react';
import useLeactuerTable from 'components/lectuerTable/useLeactuerTable';

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { refetch: lectuerRefetch } = useLeactuerTable();

  const { data, error, isLoading, isError, refetch } = useQuery({
    queryKey: ['CourseDetails', id],
    queryFn: () => fetchOne(id, 'courses'),
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;
  console.log(data);
  return (
    <>
      <Stack flexDirection={'row'} justifyContent={'space-between'}>
        <Typography variant="h1" color="initial">
          {t('coursepage')}
        </Typography>
      </Stack>

      <ViewCoursForm initialData={data?.data} />

      <Box>
        <Button variant="contained" color="info" onClick={handleOpen} sx={{marginY:4 }}>
          {t('AddCourseLectuer')}
        </Button>
        <LectuerTable isDashBoard={false} />
      </Box>

      <BasicModal open={open} handleClose={handleClose}>
        <h2>{t('AddCourse')}</h2>

        <AddCourseLectuerForm vid={id} handleClose={handleClose} refetch={lectuerRefetch} />
      </BasicModal>
    </>
  );
}

export default CourseDetails;
