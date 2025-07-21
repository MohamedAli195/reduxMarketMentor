import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import dayjs, { Dayjs } from 'dayjs';

import { CloudUpload } from 'lucide-react';
import { errorType, IAgenda, ICategory } from 'interfaces';
import { useUpdateCategoryMutation } from 'app/features/Categories/CategoriesSlice';
import { useUpdateAgendaMutation } from 'app/features/agenda/AgendaSlice';
import AgendaTimePicker from 'components/Shared/DatePicker';

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
  start_date: string;
  end_date: string;
  meeting_url: string;
  notes: string;
}

function UpdateAgendaForm({
  handleClose,
  initialData,
}: {
  handleClose: () => void;

  initialData?: null | IAgenda;
}) {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();
  const { t } = useTranslation();
  // const ImageFromApi = initialData?.image;
  const [updateAgenda, { isLoading }] = useUpdateAgendaMutation();
  // const [preview, setPreview] = useState<string | undefined | null>(ImageFromApi);
  const id = initialData?.id;
  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       setPreview(reader.result as string);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };
  const [start_date, setStart_date] = useState<Dayjs | null>(dayjs());
  const [end_date, setEnd_date] = useState<Dayjs | null>(dayjs());
      const [formattedDateStart, setFormattedDateStart] = useState<string>(
    dayjs().format('YYYY-MM-DD HH:mm:ss')
  );
    const [formattedDateEnd, setFormattedDateEnd] = useState<string>(
    dayjs().format('YYYY-MM-DD HH:mm:ss')
  );
  useEffect(() => {
    // console.log(initialData);
    if (initialData) {
      setValue('title.en', initialData?.title?.en);
      setValue('title.ar', initialData?.title?.ar);
      setValue('title.fr', initialData?.title?.fr);
      setValue('start_date', initialData?.start_date);
      setValue('end_date', initialData?.end_date);
      setValue('meeting_url', initialData?.meeting_url);
      setValue('notes', initialData?.notes);
    }
  }, [initialData, setValue]);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const formData = new FormData();
      formData.append('title[en]', data.title.en);
      formData.append('title[ar]', data.title.ar);
      formData.append('title[fr]', data.title.fr);
      formData.append('start_date', String(formattedDateStart));
      formData.append('end_date', String(formattedDateEnd));
      formData.append('meeting_url', data.meeting_url);
      formData.append('notes', data.notes);

      const response = await updateAgenda({ id, formData }).unwrap();

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

          {/* startDate */}

          <AgendaTimePicker value={start_date} setValue={setStart_date} formattedDateStart={formattedDateStart} setFormattedDateStart={setFormattedDateStart}/>
           {/* endDate */}
          <AgendaTimePicker value={end_date} setValue={setEnd_date} formattedDateStart={formattedDateEnd} setFormattedDateStart={setFormattedDateEnd}    />
          </Stack>
          <Stack flexDirection={'row'} gap={2}>
          
          <TextField
            multiline
            fullWidth
            variant="outlined"
            id="meeting_url"
            type="text"
            label={t('meeting_url')}
            {...register('meeting_url')}
            sx={{
              '& .MuiInputBase-input': {
                lineHeight: '1.2', // Adjust line height
              },
            }}
          />
          <TextField
            multiline
            fullWidth
            variant="outlined"
            id="notes"
            type="text"
            label={t('notes')}
            {...register('notes')}
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
        {t('updateAgenda')}
      </Button>
    </Box>
  );
}

export default UpdateAgendaForm;
