import React, { useState } from 'react';
import { Box, Button, Stack, TextField } from '@mui/material';
import axios from 'axios';
import { useForm, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';

import { CloudUpload } from 'lucide-react';
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
  name: {
    en: string;
    ar: string;
    fr: string;
  };
  image: FileList | string;
  price: string;
}

function AddPackageForm({ handleClose, refetch }: { handleClose: () => void; refetch: () => void }) {
  const [fileName, setFileName] = useState<string | null>(null); // State to store the selected file name
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IFormInput>();
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const selectedImage = watch('image');
  const url = import.meta.env.VITE_API_URL;
  

  const onSubmitPackage: SubmitHandler<IFormInput> = async (data) => {
    try {
      // Create a FormData object and append the data
      const formData = new FormData();
      formData.append('name[en]', data.name.en);
      formData.append('name[ar]', data.name.ar);
      formData.append('name[fr]', data.name.fr);
      formData.append('image', data.image[0]);
      formData.append('price', data.price);

      // Define headers with the token
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data',
      };

      const response = await axios.post(
        `${url}/admin/packages`,
        formData,
        { headers }
      );

      toast.success('Package added successfully');
      handleClose();
      refetch();
    } catch (err) {
      // console.error('Error signing in:', err);
      toast.error('Failed to add package, please check your input.');
    }
  };

  return (
  <Box
      sx={{
        mt: { sm: 5, xs: 2.5 },
      }}
      component="form"
      onSubmit={handleSubmit(onSubmitPackage)}
    >
      <Stack spacing={3}>
        <Stack flexDirection={'row'} gap={2}>
          <TextField
            fullWidth
            variant="outlined"
            id="name-ar"
            type="text"
            label={t('ArabicName')}
            {...register('name.ar', { required: t('ArabicNameReq') })}
          />
          <TextField
            fullWidth
            variant="outlined"
            id="name-en"
            type="text"
            label={t('EnglishName')}
            {...register('name.en', { required: t('EnglishNameReq') })}
          />
          <TextField
            fullWidth
            variant="outlined"
            id="name-fr"
            type="text"
            label={t('fr.name')}
            {...register('name.fr', { required: t('EnglishNameReq') })}
          />
        </Stack>

        <TextField
          fullWidth
          variant="outlined"
          id="price"
          type="text"
          label={t('price')}
          {...register('price', { required: t('priceReq2') })}
        />
        <Stack flexDirection={'row'} gap={2} alignItems={"center"}>
          <Button
            component="label"
            role={undefined}
            variant="outlined"
            tabIndex={-1}
            startIcon={<CloudUpload />}
            sx={{ height: '100%' }}
          >
            Upload Image
            <VisuallyHiddenInput
              type="file"
              {...register('image')}
              multiple
              onChange={handleFileChange}
            />
          </Button>

          {preview && (
            <Box sx={{ mt: 2 }}>
              <img
                src={preview}
                alt={t('Preview')}
                style={{ maxWidth: '100%', maxHeight: 200, objectFit: 'cover' }}
              />
            </Box>
          )}
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

export default AddPackageForm;
