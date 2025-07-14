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
import {
  useCreateSectionMutation,
  useUpdateSectionMutation,
} from 'app/features/Sections/sectionsSlice';
import axios from 'axios';
import { t } from 'i18next';
import { errorType, ISection } from 'interfaces';
// import { fetchCategories } from 'pages/categories/categoriesFunct';
// import { fetchPackages } from 'pages/packages/packagesFunct';
import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import paths from 'routes/path';

function UpdateSectionToCourse({
  handleClose,
  initialData,
}: {
  handleClose: () => void;

  initialData?: null | ISection;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ISection>();
  const [updateSection, { isLoading }] = useUpdateSectionMutation();

  const id = initialData?.id;
  useEffect(() => {
    // console.log(data)
    if (initialData) {
      setValue('name.ar', initialData?.name?.ar);
      setValue('name.en', initialData?.name?.en);
      setValue('name.fr', initialData?.name?.fr);
      // setValue('course_id', initialData?.);
    }
  }, [initialData, setValue]);
  const onSubmit: SubmitHandler<ISection> = async (data) => {
    // console.log(data);
    try {
      //   formData.append('course_id', vid || ''); // Ensure course_id is included

      const res = await updateSection({ id, data }).unwrap();

      if (res.code === 200) {
        toast.success('Section added successfully');
      }
      handleClose();
    } catch (error: unknown) {
      const err = error as errorType;

      const errorMessages = err?.data?.errors
        ? Object.values(err.data.errors).flat().join('\n')
        : 'Failed to update section, please check your input.';

      toast.error(errorMessages);
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

          <Button
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            type="submit"
            sx={{ mt: 3, fontSize: '18px' }}
            disabled={isLoading}
          >
            {t('UpdateSection')}
          </Button>
        </Stack>
      </Box>

      <Toaster position="bottom-center" reverseOrder={false} />
    </>
  );
}

export default UpdateSectionToCourse;
