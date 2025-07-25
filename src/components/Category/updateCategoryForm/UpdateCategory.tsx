import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';

import { CloudUpload } from 'lucide-react';
import { errorType, ICategory } from 'interfaces';
import { useUpdateCategoryMutation } from 'app/features/Categories/CategoriesSlice';

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
  description: {
    en: string;
    ar: string;
    fr: string;
  };
  image: FileList;
}

function UpdateCategoryForm({
  handleClose,
  initialData,
}: {
  handleClose: () => void;

  initialData?: null | ICategory;
}) {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();
  const { t } = useTranslation();
  const ImageFromApi = initialData?.image;
  const [updateCategory ,{isLoading}] = useUpdateCategoryMutation();
  const [preview, setPreview] = useState<string | undefined | null>(ImageFromApi);
  const id = initialData?.id;
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

  useEffect(() => {
    // console.log(initialData);
    if (initialData) {
      setValue('name.en', initialData?.name?.en);
      setValue('name.ar', initialData?.name?.ar);
      setValue('name.fr', initialData?.name?.fr);
      setValue('description.ar', initialData?.description?.ar);
      setValue('description.en', initialData?.description?.en);
      setValue('description.fr', initialData?.description?.fr);
    }
  }, [initialData, setValue]);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const formData = new FormData();
      formData.append('name[en]', data.name.en);
      formData.append('name[ar]', data.name.ar);
      formData.append('description[en]', data.description.en);
      formData.append('description[ar]', data.description.ar);

      if (data.image && data.image.length > 0) {
        formData.append('image', data.image[0]);
      }

      const response = await updateCategory({ id, formData }).unwrap();

      if (response.code === 200) {
        toast.success('Category updated successfully');
      }
      handleClose();
    } catch (error: unknown) {
      const err = error as errorType;

      const errorMessages = err?.data?.errors
        ? Object.values(err.data.errors).flat().join('\n')
        : 'Failed to add category, please check your input.';

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
            error={!!errors.name?.ar}
            helperText={errors.name?.ar?.message}
            {...register('name.ar', { required: t('ArabicNameReq') })}
          />
          <TextField
            fullWidth
            variant="outlined"
            id="names.en"
            type="text"
            label={t('EnglishName')}
            error={!!errors.name?.en}
            helperText={errors.name?.en?.message}
            {...register('name.en', { required: t('EnglishNameReq') })}
          />
          <TextField
                      fullWidth
                      variant="outlined"
                      id="names.fr"
                      type="text"
                      label={t('FrancName')}
                      error={!!errors.name?.fr}
                      helperText={errors.name?.fr?.message}
                      {...register('name.fr', { required:t("FrancNameReq") })}
                    />
        </Stack>
        <Stack flexDirection={'row'} gap={2}>
          <TextField
            multiline
            fullWidth
            variant="outlined"
            id="description.ar"
            type="text"
            label={t('descAr')}
            {...register('description.ar')}
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
            id="description.en"
            type="text"
            label={t('descEn')}
            {...register('description.en')}
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
                     id="description.fr"
                     type="text"
                     label={t("FrancDesc")}
                     {...register('description.fr')}
                     sx={{
                       '& .MuiInputBase-input': {
                         lineHeight: '1.2', // Adjust line height
                       },
                     }}
                   />
        </Stack>
        <Stack flexDirection={'row'} gap={2} alignItems={'center'}>
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
                required: preview ? '' : t('ImageRequired'), // أو اكتبها نصًا زي "الصورة مطلوبة"
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
        {t('updateCategory')}
      </Button>
    </Box>
  );
}

export default UpdateCategoryForm;
