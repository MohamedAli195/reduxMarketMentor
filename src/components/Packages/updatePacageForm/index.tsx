import { Box, Button, Stack, TextField } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import { CloudUpload } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchOne } from 'functions';
import { useUpdatePackageMutation } from 'app/features/packages/packages';
import { IPackage, IPackage2, IPackageSelected } from 'interfaces';
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
  const { register, setValue, handleSubmit, watch } = useForm<IFormInput>();
  const { t } = useTranslation();
  const url = import.meta.env.VITE_API_URL;
  // Fetch packages using React Query
  const [updatePackage] = useUpdatePackageMutation()
const id = tempIdUpdate.id
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

      const headers = {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data',
      };

      const response = await updatePackage({id , formData})

      toast.success(t('Package updated successfully'));

      handleClose();
    } catch (err) {
      // console.error('Error updating package:', err);
      toast.error(t('Failed to update package, please check your input.'));
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

export default UpdatePackageForm;
