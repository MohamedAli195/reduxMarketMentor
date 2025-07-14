import { Box, Button, Stack, TextField } from '@mui/material';

import { useUpdateSectionMutation } from 'app/features/Sections/sectionsSlice';

import { t } from 'i18next';
import { errorType, ISection } from 'interfaces';

import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';

function ViewSectionToCourse({ initialData }: { initialData?: ISection }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ISection>();
  const [updateSection, { isLoading }] = useUpdateSectionMutation();

  useEffect(() => {
    // console.log(data)
    if (initialData) {
      setValue('name.ar', initialData?.name?.ar);
      setValue('name.en', initialData?.name?.en);
      setValue('name.fr', initialData?.name?.fr);
      // setValue('course_id', initialData?.);
    }
  }, [initialData, setValue]);

  return (
    <>
      <Box
        sx={{
          mt: { sm: 5, xs: 2.5 },
        }}
        component="form"
      >
        <Stack spacing={3}>
          {/* Arabic Name */}
          <Stack display={'flex'} flexDirection={'column'}>
            <TextField
              fullWidth
              variant="outlined"
              label={t('ArabicName')}
              error={!!errors.name?.ar}
              helperText={errors.name?.ar?.message}
              {...register('name.ar', { required: t('ArabicNameReq') })}
            />

            {/* English Name */}
            <TextField
              fullWidth
              variant="outlined"
              label={t('EnglishName')}
              error={!!errors.name?.en}
              helperText={errors.name?.en?.message}
              {...register('name.en', { required: t('EnglishNameReq') })}
            />
            {/* English Name */}
            <TextField
              fullWidth
              variant="outlined"
              label={t('FrancName')}
              error={!!errors.name?.fr}
              helperText={errors.name?.fr?.message}
              {...register('name.fr', { required: 'franc name is required' })}
            />
          </Stack>
        </Stack>
      </Box>
    </>
  );
}

export default ViewSectionToCourse;
