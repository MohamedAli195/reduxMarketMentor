import React, { useState } from 'react';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useForm, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';

import { CloudUpload } from 'lucide-react';
import { useCreatePackageMutation } from 'app/features/packages/packages';
import { errorType } from 'interfaces';
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

function AddPackageForm({ handleClose }: { handleClose: () => void;}) {
  const { t } = useTranslation();
const [createPackage ,{isLoading}] = useCreatePackageMutation()
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


      const response = await createPackage(formData).unwrap()
      if(response.code===200){
toast.success('Package added successfully');
      }
      
      handleClose();
    } catch (error: unknown) {
      const err = error as errorType;

      const errorMessages = err?.data?.errors
        ? Object.values(err.data.errors).flat().join("\n")
        : "Failed to add package, please check your input.";

      toast.error(errorMessages);
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
            error={!!errors.name?.ar}
            helperText={errors.name?.ar?.message}
            {...register('name.ar', { required: t('ArabicNameReq')})}
          />
      
          <TextField
            fullWidth
            variant="outlined"
            id="name-en"
            type="text"
            label={t('EnglishName')}
            error={!!errors.name?.en}
            helperText={errors.name?.en?.message}
            {...register('name.en', { required: t('EnglishNameReq') } )}
          />
         
          <TextField
            fullWidth
            variant="outlined"
            id="name-fr"
            type="text"
             label={t('FrancName')}
            error={!!errors.name?.fr}
            helperText={errors.name?.fr?.message}
            {...register('name.fr', { required:t("FrancNameReq")})}
          />
        </Stack>

        <TextField
          fullWidth
          variant="outlined"
          id="price"
          type="text"
          label={t('price')}
          error={!!errors.price}
            helperText={errors.price?.message}
          {...register('price', { required: "حقل السعر مطلوب" })}
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
              {...register('image', {
                required: t('ImageRequired'), // أو اكتبها نصًا زي "الصورة مطلوبة"
              })}
              multiple
              onChange={handleFileChange}
            />
          </Button>

          {errors.image && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {errors.image.message}
            </Typography>
          )}

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
        {errors.image && (
          <p className="text-red-500 text-sm">{errors.image.message}</p>
        )}
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
        {t('addPackage')}
      </Button>
    </Box>
  );
}

export default AddPackageForm;
