import {
  Box,
  Button,
  Stack,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { useCreateLectureMutation } from 'app/features/Lectuers/Lectuers';
import axios from 'axios';
import { t } from 'i18next';
// import { fetchCategories } from 'pages/categories/categoriesFunct';
// import { fetchPackages } from 'pages/packages/packagesFunct';
import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import paths from 'routes/path';
import { IFormInputLectuers } from '../updateLectuerForm';



function AddCourseLectuerForm({ handleClose ,vid }: {vid: string | undefined ,handleClose: () => void; }) {
  const id = vid
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<IFormInputLectuers>();
  const [createLecture] = useCreateLectureMutation()
  const url = import.meta.env.VITE_API_URL;
  const onSubmit: SubmitHandler<IFormInputLectuers> = async (data) => {
    // console.log(data);
    try {
      const formData = new FormData();
      formData.append('title[en]', data.title.en);
      formData.append('title[ar]', data.title.ar);
      formData.append('title[fr]', data.title.fr);
      formData.append('description[en]', data.description?.en);
      formData.append('description[ar]', data.description?.ar);
      formData.append('description[fr]', data.description?.ar);
      formData.append('video_url', data.video_url);
      formData.append('duration', data.duration);
      // formData.append('course_id', vid || ''); // Ensure course_id is included

await createLecture({ id, formdata: formData }).unwrap();
      // console.log(response.data);
      toast.success('course lectuer added successfully');
         handleClose();
    } catch (err) {
      // console.error('Error adding course lectuer:', err);
      toast.error('Failed to add course lectuer, please check your input.');
    }
  };

  return (
    <>
      <Box
        sx={{
          mt: { sm: 5, xs: 2.5 },
        }}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Stack spacing={3}>
          {/* Arabic Name */}
          <Stack display={'flex'} flexDirection={'row'}>
            <TextField
              fullWidth
              variant="outlined"
              label={t('ArabicName')}
              error={!!errors.title?.ar}
              helperText={errors.title?.ar?.message}
              {...register('title.ar', { required: t('ArabicNameReq') })}
            />

            {/* English Name */}
            <TextField
              fullWidth
              variant="outlined"
              label={t('EnglishName')}
              error={!!errors.title?.en}
              helperText={errors.title?.en?.message}
              {...register('title.en', { required: t('EnglishNameReq') })}
            />
            {/* English Name */}
            <TextField
              fullWidth
              variant="outlined"
               label={t('FrancName')}
              error={!!errors.title?.fr}
              helperText={errors.title?.fr?.message}
              {...register('title.fr', { required: t("FrancNameReq") })}
            />
          </Stack>
          <Stack display={'flex'} flexDirection={'row'}>
            {/* description Name */}
            <TextField
              fullWidth
              variant="outlined"
              label={t('descAr')}
              error={!!errors.description?.ar}
              helperText={errors.description?.ar?.message}
              {...register('description.ar', { required: t('descArReq') })}
            />

            {/* description En */}
            <TextField
              fullWidth
              variant="outlined"
              label={t('descEn')}
              error={!!errors.description?.en}
              helperText={errors.description?.en?.message}
              {...register('description.en', { required: t('descEnReq') })}
            />
            <TextField
              fullWidth
              variant="outlined"
              label={t("FrancDesc")}
              error={!!errors.description?.en}
              helperText={errors.description?.en?.message}
              {...register('description.en', { required: t("FrancDescReq")})}
            />
          </Stack>
          <Stack display={'flex'} flexDirection={'row'}>
            {/* Other Fields */}
            <TextField
              fullWidth
              variant="outlined"
              label={t('videoUrl')}
              error={!!errors.video_url}
              helperText={errors.video_url?.message}
              {...register('video_url', { required: t('videoUrlReq') })}
            />

            <TextField
              fullWidth
              variant="outlined"
              label={t('videoDuration')}
              error={!!errors.duration}
              helperText={errors.duration?.message}
              {...register('duration', {
                required: t('videoDurationReq'),
              })}
            />
          </Stack>
          <Button
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            type="submit"
            sx={{ mt: 3, fontSize: '18px' }}
          >
            {t('AddLecuter')}
          </Button>
        </Stack>
      </Box>

      <Toaster position="bottom-center" reverseOrder={false} />
    </>
  );
}

export default AddCourseLectuerForm;
