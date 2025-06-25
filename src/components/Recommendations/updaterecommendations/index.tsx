import { Box, Button, Stack, TextField } from '@mui/material';
import axios from 'axios';
import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import { useUpdateRecommendationMutation } from 'app/features/Recommendations/RecommendationsSlice';
import { IFormInputRecommendations } from '../addRecommendations';


// import { fetchPackage } from 'pages/packages/packagesFunct';

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


function UpdateRecommendationsForm({
  redData,
  handleClose,

}: {
  redData:{
    id:number;
    name:string;
    value:string
  }
  handleClose: () => void;
 

}) {
  const { register, setValue, handleSubmit, watch } = useForm<IFormInputRecommendations>();
  const { t } = useTranslation();
  const url = import.meta.env.VITE_API_URL;
  const id = redData.id
  const [updateRecommendation] = useUpdateRecommendationMutation()

  useEffect(() => {
    if (redData) {

      setValue('name', redData.name);
      setValue('value',redData.value);

    }
  }, []);


  const onSubmit: SubmitHandler<IFormInputRecommendations> = async (data) => {
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data',
      };
  
      await updateRecommendation({id,data})
      toast.success(t('recommendations added successfully'));
      handleClose();
    } catch (err) {
    //   console.error(err);
      toast.error(t('Failed to add roles, please check your input.'));
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
      <Stack spacing={3}>
  <Stack flexDirection="column" gap={2}>
          <TextField
            fullWidth
            variant="outlined"
            id="name"
            type="text"
            label={t('name')}
            {...register('name', { required: t('EnglishNameReq') })}
          />
          <TextField
            fullWidth
            variant="outlined"
            id="value"
            type="text"
            {...register('value', { required: t('EnglishNameReq') })}
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
      >
        {t('UpdatePackage')}
      </Button>
    </Box>
  );
}

export default UpdateRecommendationsForm;
