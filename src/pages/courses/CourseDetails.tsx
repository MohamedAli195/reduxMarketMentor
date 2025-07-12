import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ViewCoursForm from 'components/Courses/viewCoursForm';
import BasicModal from 'components/Shared/modal/ShareModal';
import { useState } from 'react';
import { useGetCourseQuery } from 'app/features/Courses/coursesSlice';
import AddSectionToCourse from 'components/section/addSectionToCourse';
import Sections from 'components/SectionTable/Sections';

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const {data ,isLoading,isError ,error} = useGetCourseQuery(id)
const course = data?.data
// console.log(course)
  if (isLoading) return <p>Loading...</p>;
  // if (isError) return <p>Error: {error}</p>;

  return (
    <>
      <Stack flexDirection={'row'} justifyContent={'space-between'}>
        <Typography variant="h1" color="initial">
          {t('coursepage')}
        </Typography>
      </Stack>

      <ViewCoursForm initialData={course} />

      {/* <Box>
        <Button variant="contained" color="info" onClick={handleOpen} sx={{marginY:4 }}>
          {t('AddCourseLectuer')}
        </Button>
        <LectuerTable isDashBoard={false} />
      </Box> */}

      <Box>
        <Button variant="contained" color="info" onClick={handleOpen} sx={{marginY:4 }}>
          {t('AddCourseSection')}
        </Button>
        <Sections isDashBoard={false} />
      </Box>


        <BasicModal open={open} handleClose={handleClose}>
        <h2>{t('AddSection')}</h2>

        <AddSectionToCourse vid={id} handleClose={handleClose} />
      </BasicModal>
    </>
  );
}

export default CourseDetails;
