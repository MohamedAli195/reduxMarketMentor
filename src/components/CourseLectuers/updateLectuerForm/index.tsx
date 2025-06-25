import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { fetchOne } from 'functions';
import { IPackageLectuerSelected } from 'interfaces';
import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

interface IFormInput {
  title: {
    en: string;
    ar: string;
    fr: string;
  };
  description: {
    en: string;
    ar: string;
    fr: string;
  };
  course_id: number ;
  video_url: string;
  duration: string;
}

function UpdateLectuerForm({
  handleClose,
  initialData,
  refetch
}: {
  handleClose: () => void;
  refetch:()=>void
  initialData?: null | IPackageLectuerSelected
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<IFormInput>();
  const { t } = useTranslation();
  const { id } = useParams();

  // const { data, error, isLoading, isError, refetch } = useQuery({
  //   queryKey: [`Lectuers-${id}`],
  //   queryFn: () => fetchOne(id,'course-lectures'),
  // });
  // console.log(data?.data);

  const url = import.meta.env.VITE_API_URL;
  useEffect(() => {

    // console.log(data)
    if (initialData) {
      setValue('title.ar', initialData.title.ar);
      setValue('title.en', initialData.title.en);
      setValue('title.fr', initialData.title.fr);
      setValue('description.ar', initialData.description.ar);
      setValue('description.en', initialData.description.en);
      setValue('description.fr', initialData.description.fr);
      setValue('video_url', initialData.video_url);
      setValue('duration', initialData.duration);
      setValue('course_id', initialData.course.id);
    }
  }, [initialData, setValue]);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    console.log(data);
    try {
      

      const headers = {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data',
      };

      const response = await axios.post(
        `${url}/admin/course-lectures/${initialData?.id}/update`,
        data,
        { headers },
      );
      refetch()
      handleClose()
      // console.log(response.data);
      toast.success('course lectuer updated successfully');
    } catch (err) {
      // console.error('Error adding course lectuer:', err);
      toast.error('Failed to add course lectuer, please check your input.');
    }
  };

  return (
    <>
      <Typography variant="h1" color="initial">
        {t('UpdateLecter')}
      </Typography>
      <Box
        sx={{
          mt: { sm: 5, xs: 2.5 },
        }}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Stack spacing={3}>
          {/* Arabic Name */}
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
            label="franc name"
            error={!!errors.title?.fr}
            helperText={errors.title?.fr?.message}
            {...register('title.fr', { required: 'franc name is required' })}
          />

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
            label="franc desc"
            error={!!errors.description?.en}
            helperText={errors.description?.en?.message}
            {...register('description.en', { required: 'franc desc required' })}
          />

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
          {t('UpdatePackage')}
        </Button>
      </Box>
      <Toaster position="bottom-center" reverseOrder={false} />

    </>
  );
}

export default UpdateLectuerForm;
