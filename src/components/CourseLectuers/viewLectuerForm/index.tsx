
import { Box, Button, Stack, TextField } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

import { fetchOne } from 'functions';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

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
  course_id: string | undefined;
  video_url: string;
  duration: string;
}

function ViewLectuerForm() {
  const {
    register,
    formState: { errors },
    setValue,
  } = useForm<IFormInput>();
  const { t } = useTranslation();
  const { id } = useParams();

  const { data, error, isLoading, isError, refetch } = useQuery({
    queryKey: [`Lectuers-${id}`],
    queryFn: () => fetchOne(id,'course-lectures'),
  });
// console.log(data?.data)

const courseID = data?.data?.course?.id

    useEffect(() => {
      if (data?.data) {
        setValue('title.ar', data?.data.title.ar);
        setValue('title.en', data?.data.title.en);
        setValue('title.fr', data?.data.title.fr);
        setValue('description.ar', data?.data.description.ar);
        setValue('description.en', data?.data.description.en);
        setValue('description.fr', data?.data.description.fr);
        setValue('video_url', data?.data.video_url);
        setValue('duration', data?.data.duration);

      }
    }, [data?.data, setValue]);

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error: {error.message}</p>;

  return (
    <Box
      sx={{
        mt: { sm: 5, xs: 2.5 },
      }}
      component="form"
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
      {/* <Button
        color="primary"
        variant="contained"
        size="large"
        fullWidth
        type="submit"
        sx={{ mt: 3, fontSize: '18px' }}
      >
        {t('UpdatePackage')}
      </Button> */}
    </Box>
  );
}

export default ViewLectuerForm;
