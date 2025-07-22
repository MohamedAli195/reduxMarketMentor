import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import dayjs, { Dayjs } from 'dayjs';

import { CloudUpload } from 'lucide-react';
import { errorType, IAgenda, IAnalytics, ICategory, IStartMenu } from 'interfaces';
import { useUpdateCategoryMutation } from 'app/features/Categories/CategoriesSlice';
import { useUpdateAgendaMutation } from 'app/features/agenda/AgendaSlice';
import AgendaTimePicker from 'components/Shared/DatePicker';
import { useUpdateAnalyticMutation } from 'app/features/analytics/analyticsSlice';
import { useUpdateStartMenuMutation } from 'app/features/StartMenu/StartMenuSlice';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

interface IFormInput {
  id?: number;
  title: { en: string; ar: string; fr: string };
  video_link:string
}

function UpdateStartMenuForm({
  handleClose,
  initialData,
}: {
  handleClose: () => void;

  initialData?: null | IStartMenu;
}) {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();
  const { t } = useTranslation();
  const [updateStartMenu, { isLoading }] = useUpdateStartMenuMutation();
  const id = initialData?.id;


  useEffect(() => {
    // console.log(initialData);
    if (initialData) {
      setValue('title.en', initialData?.title?.en);
      setValue('title.ar', initialData?.title?.ar);
      setValue('title.fr', initialData?.title?.fr);
      setValue('video_link', initialData?.video_link);

    }
  }, [initialData, setValue]);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const formData = new FormData();
      formData.append('title[en]', data.title.en);
      formData.append('title[ar]', data.title.ar);
      formData.append('title[fr]', data.title.fr);

      formData.append('video_link', data.video_link);


      const response = await updateStartMenu({ id, formData }).unwrap();

      if (response.code === 200) {
        toast.success('Agenda updated successfully');
      }
      handleClose();
    } catch (error: unknown) {
      const err = error as errorType;

      const errorMessages = err?.data?.errors
        ? Object.values(err.data.errors).flat().join('\n')
        : 'Failed to add Agenda, please check your input.';

      toast.error(errorMessages);
    }
  };

  return (
    <Box
      sx={{
        mt: { sm: 5, xs: 2.5 },
      }}
      component="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Stack spacing={3} gap={2}>
        <Stack flexDirection={'row'} gap={2}>
          <TextField
            fullWidth
            variant="outlined"
            id="names.ar"
            type="text"
            label={t('ArabicName')}
            error={!!errors.title?.ar}
            helperText={errors.title?.ar?.message}
            {...register('title.ar', { required: t('ArabictitleReq') })}
          />
          <TextField
            fullWidth
            variant="outlined"
            id="names.en"
            type="text"
            label={t('EnglishName')}
            error={!!errors.title?.en}
            helperText={errors.title?.en?.message}
            {...register('title.en', { required: t('EnglishNameReq') })}
          />
          <TextField
            fullWidth
            variant="outlined"
            id="names.fr"
            type="text"
            label={t('FrancName')}
            error={!!errors.title?.fr}
            helperText={errors.title?.fr?.message}
            {...register('title.fr', { required: t('FrancNameReq') })}
          />
        </Stack>
          <Stack flexDirection={'row'} gap={2}>
          
          <TextField
            multiline
            fullWidth
            variant="outlined"
            id="video_link"
            type="text"
            label={t('video_link')}
            {...register('video_link')}
            sx={{
              '& .MuiInputBase-input': {
                lineHeight: '1.2', // Adjust line height
              },
            }}
          />

          
        </Stack>
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
        {t('updateStartMenu')}
      </Button>
    </Box>
  );
}

export default UpdateStartMenuForm;
