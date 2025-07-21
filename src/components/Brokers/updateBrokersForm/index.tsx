import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import { CloudUpload } from 'lucide-react';
import { errorType, IBroker, IPackage, IPackage2, IPackageSelected } from 'interfaces';
import { useUpdateBrokerMutation } from 'app/features/brokers/brokers';
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
  image: FileList | string;
  link: string;
}

function UpdateBrokersForm({
  handleClose,

  tempIdUpdate,
}: {
  handleClose: () => void;
  tempIdUpdate: IBroker;
}) {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();
  const { t } = useTranslation();
  // Fetch packages using React Query
  const [updateBroker, { isLoading }] = useUpdateBrokerMutation();
  const id = tempIdUpdate.id;
  const ImageFromApi = tempIdUpdate.image;
  // console.log(ImageFromApi);
  const [preview, setPreview] = useState<string | undefined | null>(ImageFromApi);
  console.log(preview);
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
    if (tempIdUpdate) {
      setValue('image', tempIdUpdate.image);
      setValue('link', tempIdUpdate.link);
    }
  }, [tempIdUpdate, setValue]);

const onSubmit: SubmitHandler<IFormInput> = async (data) => {
  try {
    const formData = new FormData();
    formData.append('link', data.link);

    // فقط لو المستخدم اختار صورة جديدة (FileList)، ضيفها
    if (data.image instanceof FileList && data.image.length > 0) {
      formData.append('image', data.image[0]);
    }

    const response = await updateBroker({ id, formData });

    if (response.data?.code === 200) {
      toast.success(t('Broker updated successfully'));
      handleClose();
    }
  } catch (error: unknown) {
    const err = error as errorType;

    const errorMessages = err?.data?.errors
      ? Object.values(err.data.errors).flat().join('\n')
      : 'Failed to update Broker, please check your input.';

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
      <Stack flexDirection={'row'} gap={2}>
        <Stack flexDirection={'row'} gap={2} alignItems={'center'}>
          <TextField
            fullWidth
            variant="outlined"
            id="link"
            type="text"
            label={t('link')}
            error={!!errors.link}
            helperText={errors.link?.message}
            {...register('link', { required: t('link') })}
          />
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
                required: preview ? '' : t('ImageRequired'), // أو اكتبها نصًا زي "الصورة مطلوبة"
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
        {t('UpdateBrokers')}
      </Button>
    </Box>
  );
}

export default UpdateBrokersForm;
