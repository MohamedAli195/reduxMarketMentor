import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import { CloudUpload } from 'lucide-react';
import { useUpdatePackageMutation } from 'app/features/packages/packages';
import { errorType, IPackage, IPackage2, IPackageSelected } from 'interfaces';
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

interface IFormInput {
  name: {
    en: string;
    ar: string;
    fr: string;
  };
  image: FileList | string;
  price: string;
}

function UpdatePackageForm({
  handleClose,

  tempIdUpdate,
}: {
  handleClose: () => void;

  tempIdUpdate: IPackage2;
}) {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();
  const { t } = useTranslation();
  const url = import.meta.env.VITE_API_URL;
  // Fetch packages using React Query
  const [updatePackage, { isLoading }] = useUpdatePackageMutation();
  const id = tempIdUpdate.id;
  const ImageFromApi = tempIdUpdate.image;
  // console.log(ImageFromApi);
  const [preview, setPreview] = useState<string | undefined | null>(ImageFromApi);
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

  // if (isLoading) return <p>Loading...</p>;
  // if (isError) return <p>Error: {error.message}</p>;

  // console.log(data.data.image)

  useEffect(() => {
    if (tempIdUpdate) {
      setValue('name.en', tempIdUpdate.name.en);
      setValue('name.ar', tempIdUpdate.name.ar);
      setValue('name.fr', tempIdUpdate.name.fr);
      setValue('price', tempIdUpdate.price);
    }
  }, [tempIdUpdate, setValue]);

  // useEffect(() => {
  //   if (selectedImage && selectedImage.length > 0) {
  //     const file = selectedImage[0];
  //     setPreviewImage(URL.createObjectURL(file));
  //   }
  // }, [selectedImage]);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const formData = new FormData();
      formData.append('name[en]', data.name.en);
      formData.append('name[ar]', data.name.ar);
      formData.append('name[fr]', data.name.ar);
      formData.append('price', data.price);

      if (data.image && data.image.length > 0) {
        formData.append('image', data.image[0]);
      }

      const response = await updatePackage({ id, formData });
      if (response.data?.code === 200) {
        toast.success(t('Package updated successfully'));
      }

      handleClose();
    } catch (error: unknown) {
      const err = error as errorType;

      const errorMessages = err?.data?.errors
        ? Object.values(err.data.errors).flat().join('\n')
        : 'Failed to add package, please check your input.';

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
            {...register('name.ar', { required: t('ArabicNameReq') })}
          />

          <TextField
            fullWidth
            variant="outlined"
            id="name-en"
            type="text"
            label={t('EnglishName')}
            error={!!errors.name?.en}
            helperText={errors.name?.en?.message}
            {...register('name.en', { required: t('EnglishNameReq') })}
          />

          <TextField
            fullWidth
            variant="outlined"
            id="name-fr"
            type="text"
            label={t('FrancName')}
            error={!!errors.name?.fr}
            helperText={errors.name?.fr?.message}
            {...register('name.fr', { required: t('FrancNameReq') })}
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
          {...register('price', { required: t('priceReq2')  })}
        />

        <Stack flexDirection={'row'} gap={2} alignItems={'center'}>
          <Button
            component="label"
            role={undefined}
            variant="outlined"
            tabIndex={-1}
            startIcon={<CloudUpload />}
            sx={{ height: '100%' }}
          >
            <span style={{ display: 'inline-block', marginLeft: 10, marginRight: 10 }}>
              {t('UploadImage')}
            </span>
            <VisuallyHiddenInput
              type="file"
              {...register('image', {
                required: t('ImageRequired'), // أو اكتبها نصًا زي "الصورة مطلوبة"
              })}
              multiple
              onChange={handleFileChange}
              sx={{ marginLeft: 2, marginRight: 2 }}
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
        {t('UpdatePackage')}
      </Button>
    </Box>
  );
}

export default UpdatePackageForm;
