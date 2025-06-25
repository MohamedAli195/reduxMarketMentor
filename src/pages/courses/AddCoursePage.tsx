


import { Typography } from '@mui/material'
import AddCourseForm from 'components/Courses/AddCourseForm'
import React from 'react'
import { useTranslation } from 'react-i18next';

function AddCoursePage() {
  const { t, i18n } = useTranslation();
  return (
    <>
    <Typography variant="h1" color="initial">
    {t("AddCoursePage")}
        </Typography>
    {/* <AddCourseForm  /> */}
    
    </>
  )
}

export default AddCoursePage