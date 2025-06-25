import { Avatar, Box, Stack, TextField, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

interface IFormInput {
  name: {
    en: string;
    ar: string;
  };
  image: FileList;
  price: string;
  main_video: string;
  course_duration: string;
  course_level: string;
  course_lang: string;
  price_after_discount: string;

  category: {
    id: number;
    name: {
      ar: string;
      en: string;
    };
  };
  description: {
    en: string;
    ar: string;
  };
}

function ViewCoursForm({
  initialData,
}: {
  initialData?: {
    id: number;
    name: { en: string; ar: string };
    price: string;
    image: FileList | string; // allow either FileList or URL string
    main_video: string;
    course_duration: string;
    course_level: string;
    course_lang: string;
    priceAfterDiscount: string;

    category: {
      id: number;
      name: {
        ar: string;
        en: string;
      };
    };
    description: { en: string; ar: string };
    status: string | null;
  };
}) {
  const { register, setValue } = useForm<IFormInput>();
  const theme = useTheme();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      // console.log(initialData)
      // Populate fields with initial data
      setValue('name.en', initialData.name.en);
      setValue('name.ar', initialData.name.ar);
      setValue('price', initialData.price);
      setValue('main_video', initialData.main_video);
      setValue('course_duration', initialData.course_duration);
      setValue('course_level', initialData.course_level);
      setValue('course_lang', initialData.course_lang);
      setValue('price_after_discount', initialData.priceAfterDiscount);

      setValue('category.name', {
        ar: initialData.category.name.ar,
        en: initialData.category.name.en,
      });

      setValue('description.en', initialData.description.en);
      setValue('description.ar', initialData.description.ar);

      // Convert FileList to a URL if necessary
      if (initialData.image instanceof FileList && initialData.image.length > 0) {
        const url = URL.createObjectURL(initialData.image[0]);
        setImageUrl(url);
      } else if (typeof initialData.image === 'string') {
        setImageUrl(initialData.image); // assume image is a URL
      }
    }

    // Clean up URL object when component unmounts
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [initialData, setValue, imageUrl]);

  return (
    <Box
      sx={{
        mt: { sm: 5, xs: 2.5 },
      }}
      component="form"
    >
      <Stack display={'flex'} flexDirection={'row'} alignContent={'space-around'}>
        <Stack spacing={3} width={'100%'}>
          {/* Name Fields */}
          <Stack display={'flex'} flexDirection={'row'}>
            <TextField
              fullWidth
              variant="outlined"
              id="name.ar"
              type="text"
              label="Name (Arabic)"
              sx={{ color: theme.palette.text.primary }}
              {...register('name.ar')}
            />
            <TextField
              fullWidth
              variant="outlined"
              id="name.en"
              type="text"
              label="Name (English)"
              sx={{ color: theme.palette.text.primary }}
              {...register('name.en')}
            />

            {/* Description Fields */}
            <TextField
              fullWidth
              variant="outlined"
              id="description.ar"
              type="text"
              label="Description (Arabic)"
              sx={{ color: theme.palette.text.primary }}
              {...register('description.ar')}
            />
          </Stack>
          <Stack display={'flex'} flexDirection={'row'}>
            <TextField
              fullWidth
              variant="outlined"
              id="description.en"
              type="text"
              label="Description (English)"
              sx={{ color: theme.palette.text.primary }}
              {...register('description.en')}
            />

            {/* Price Fields */}
            <TextField
              fullWidth
              variant="outlined"
              id="price"
              type="text"
              label="Price"
              sx={{ color: theme.palette.text.primary }}
              {...register('price')}
            />
            <TextField
              fullWidth
              variant="outlined"
              id="price_after_discount"
              type="text"
              label="Price After Discount"
              sx={{ color: theme.palette.text.primary }}
              {...register('price_after_discount')}
            />

            {/* Video Field */}
          </Stack>
          <Stack display={'flex'} flexDirection={'row'}>
            <TextField
              fullWidth
              variant="outlined"
              id="main_video"
              type="text"
              label="Main Video URL"
              sx={{ color: theme.palette.text.primary }}
              {...register('main_video')}
            />
            {/* Duration and Level Fields */}
            <TextField
              fullWidth
              variant="outlined"
              id="course_duration"
              type="text"
              label="Course Duration"
              sx={{ color: theme.palette.text.primary }}
              {...register('course_duration')}
            />
            <TextField
              fullWidth
              variant="outlined"
              id="course_level"
              type="text"
              label="Course Level"
              sx={{ color: theme.palette.text.primary }}
              {...register('course_level')}
            />

            {/* Language Field */}

            

          </Stack>
<Stack display={'flex'} flexDirection={'row'}>
              {/* Category and Package Fields */}
              <TextField
                fullWidth
                variant="outlined"
                id="course_lang"
                type="text"
                label="Course Language"
                sx={{ color: theme.palette.text.primary }}
                {...register('course_lang')}
              />
                          <TextField
              fullWidth
              variant="outlined"
              id="category.name"
              type="sting"
              label="Category "
              sx={{ color: theme.palette.text.primary }}
              {...register('category.name.en')}
            />
            <TextField
              fullWidth
              variant="outlined"
              id="category.name"
              type="sting"
              label="Category "
              sx={{ color: theme.palette.text.primary }}
              {...register('category.name.ar')}
            />
            </Stack>
          {/* Image Preview */}
        </Stack>
        <Box width={'100%'}>
          {imageUrl && (
            <Avatar src={imageUrl} alt="Package Image" sx={{ width: '100%', height: '40vh' }} />
          )}
        </Box>
      </Stack>
    </Box>
  );
}

export default ViewCoursForm;
