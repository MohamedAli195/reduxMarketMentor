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
import { useCreateSectionMutation } from 'app/features/Sections/sectionsSlice';
import axios from 'axios';
import { t } from 'i18next';
import { ISection } from 'interfaces';
// import { fetchCategories } from 'pages/categories/categoriesFunct';
// import { fetchPackages } from 'pages/packages/packagesFunct';
import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import paths from 'routes/path';




function AddSectionToCourse({ handleClose ,vid }: {vid: string | undefined ,handleClose: () => void; }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ISection>();
  const [createSection,{isLoading}] = useCreateSectionMutation()
  const id = vid
  const onSubmit: SubmitHandler<ISection> = async (data) => {
    // console.log(data);
    try {


    //   formData.append('course_id', vid || ''); // Ensure course_id is included

       await createSection({id,data}).unwrap()

      
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
            {t('AddSection')}
          </Button>
        </Stack>
      </Box>

      <Toaster position="bottom-center" reverseOrder={false} />
    </>
  );
}

export default AddSectionToCourse;
