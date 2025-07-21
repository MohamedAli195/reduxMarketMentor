import { Box, Button, Stack, TextField } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';

import { CloudUpload } from 'lucide-react';
import { IAgenda, IAnalytics, ICategory } from 'interfaces';
import dayjs, { Dayjs } from 'dayjs';
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
  iframe_link:string
}

function ViewAnalyticsForm({ initialData }: { initialData?: null | IAnalytics }) {
  const {
    register,
    setValue,
    formState: { errors },
  } = useForm<IFormInput>();

  const { t } = useTranslation();
  
  const id = initialData?.id;

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
      setValue('iframe_link', initialData?.iframe_link);
    }
  }, [initialData, setValue]);

  return (
    <Box
      sx={{
        mt: { sm: 5, xs: 2.5 },
      }}
      component="form"
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
            id="iframe_link"
            type="text"
            label={t('iframe_link')}
            {...register('iframe_link')}
            sx={{
              '& .MuiInputBase-input': {
                lineHeight: '1.2', // Adjust line height
              },
            }}
          />

          
        </Stack>
      </Stack>
    </Box>
  );
}

export default ViewAnalyticsForm;
