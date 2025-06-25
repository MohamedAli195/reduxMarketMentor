import { Box, Button, Stack, TextField } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';

import { CloudUpload } from 'lucide-react';
import { ICategory } from 'interfaces';

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

function ViewCategoryForm({

  initialData,

}: {

  initialData?: null | ICategory
}) {
  const { register, setValue , formState: { errors },} = useForm<IFormInput>();
  const { t } = useTranslation();
  const ImageFromApi = initialData?.image
  // console.log(ImageFromApi)
  const [preview, setPreview] = useState<string | undefined |null>(ImageFromApi);
  const url = import.meta.env.VITE_API_URL;
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
    console.log(initialData)
    if (initialData) {
      setValue('name.en', initialData?.name?.en);
      setValue('name.ar', initialData?.name?.ar);
      setValue('name.fr', initialData?.name?.fr);
      setValue('description.ar', initialData?.description?.ar);
      setValue('description.en', initialData?.description?.en);
      setValue('description.fr', initialData?.description?.fr);

    }
  }, [initialData, setValue]);



  return (
    <Box
      sx={{
        mt: { sm: 5, xs: 2.5 },
      }}
      component="form"
    >
      <Stack spacing={3}>
                <Stack flexDirection={"row"} gap={2}>
                <TextField
                  fullWidth
                  variant="outlined"
                  id="names.ar"
                  type="text"
                  label={t("ArabicName")}
                  error={!!errors.name?.ar}
                  helperText={errors.name?.ar?.message}
                  {...register('name.ar', { required: t("ArabicNameReq") })}
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  id="names.en"
                  type="text"
                  label={t("EnglishName")}
                  error={!!errors.name?.en}
                  helperText={errors.name?.en?.message}
                  {...register('name.en', { required: t("EnglishNameReq") })}
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  id="names.fr"
                  type="text"
                  label="fr name"
                  error={!!errors.name?.fr}
                  helperText={errors.name?.fr?.message}
                  {...register('name.fr', { required: "fr name is requried" })}
                />
                </Stack>
                <Stack flexDirection={"row"} gap={2}>
                <TextField
                multiline
                  fullWidth
                  variant="outlined"
                  id="description.ar"
                  type="text"
                  label={t("descAr")}
                  error={!!errors.description?.ar}
                  helperText={errors.description?.ar?.message}
                  {...register('description.ar', { required: t("descArReq")  })}
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
                  label={t("descEn")}
                  error={!!errors.description?.en}
                  helperText={errors.description?.en?.message}
                  {...register('description.en', { required: t("descEnReq")   })}
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
                  label="fr desc"
                  error={!!errors.description?.fr}
                  helperText={errors.description?.fr?.message}
                  {...register('description.fr', { required: "fr desc is required"   })}
                  sx={{
                    '& .MuiInputBase-input': {
                      lineHeight: '1.2', // Adjust line height
                    },
                  }}
                />
                </Stack>
                <Stack flexDirection={"row"} gap={2} alignItems={"center"}>
            
                {preview  && (
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

    </Box>
  );
}

export default ViewCategoryForm;
