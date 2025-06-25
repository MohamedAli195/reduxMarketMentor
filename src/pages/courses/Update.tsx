import React, { useEffect, useState } from 'react';
import { Box, Button, MenuItem, Stack, TextField } from '@mui/material';
import axios from 'axios';
// import { fetchCategories, fetchCategoriesForCourses } from 'pages/categories/categoriesFunct';
// import { fetchPackages, fetchPackagesForCourses } from 'pages/packages/packagesFunct';
import { useForm, SubmitHandler } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { t } from 'i18next';
// import { IFormInputCourses } from 'interfaces';
import { styled } from '@mui/material/styles';

import { CloudUpload } from 'lucide-react';
import { fetchPackagesOrCAtegoriesForCourses } from 'functions';

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

export interface IPackageRes {
  code: number;
  data:{
    data: {
      id: number;
      image: string;
      name: { ar: string; en: string; fr: string };
      price: string;
      status: string;
    }[];
  }
  
}

interface IFormInputCourses {
  name: {
    en: string;
    ar: string;
    fr: string;
  };
  id: number;
  image: FileList | string;
  price: string;
  main_video: string;
  course_duration: string;
  course_level: string;
  course_lang: string;
  priceAfterDiscount: string;
  package: {
    id: number;
    name: {
      en: string;
      ar: string;
      fr: string;
    };
  };
  category: {
    id: number;
    name: {
      en: string;
      ar: string;
      fr: string;
    };
  };
  description: {
    en: string;
    ar: string;
    fr: string;
  };
}
function UpdateCourse(props: IFormInputCourses) {

  const [catState, setCatState] = useState(props.category.id);
  const [coursLangState, setCoursLangState] = useState(props.course_lang);
  const [coursLevelState, setcoursLevelState] = useState(props.course_level);
  const [pacState, setpacState] = useState(props.package?.id);

  // console.log(catState);
  const [categories, setCategories] = useState<IPackageRes>({
    code: 0,
    data:{
      data: [],
    }
    
  });

  const [packages, setPackages] = useState<IPackageRes>({
    code: 0,
    data:{
      data: [],
    }
  });

  const [fileName, setFileName] = useState<string | null>(null); // State to store the selected file name

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IFormInputCourses>();

  const [previewImage, setPreviewImage] = useState<string | null>(
    typeof props.image === "string" ? props.image : null
  );
  const selectedImage = watch('image');

  const url = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoryData = await fetchPackagesOrCAtegoriesForCourses('categories');
        setCategories(categoryData);
      } catch (error) {
        // console.error('Error fetching categories:', error);
      }
    };

    const loadPackages = async () => {
      try {
        const packageData = await fetchPackagesOrCAtegoriesForCourses('packages');
        setPackages(packageData);
      } catch (error) {
        // console.error('Error fetching packages:', error);
      }
    };

    loadCategories();
    loadPackages();
  }, []);

  useEffect(() => {
    if (props) {
      setValue('name.en', props.name.en);
      setValue('name.ar', props.name.ar);
      setValue('name.fr', props.name.fr);
      setValue('price', props.price);
      setValue('main_video', props.main_video);
      setValue('course_duration', props.course_duration);
      setValue('course_level', coursLevelState);
      setValue('course_lang', coursLangState);
      setValue('priceAfterDiscount', props.priceAfterDiscount);
      setValue('category.id', pacState);
      setValue('package.id', catState);
      setValue('description.en', props.description.en);
      setValue('description.ar', props.description.ar);
      setValue('description.fr', props.description.fr);

      if (typeof props.image === 'string') {
        setPreviewImage(props.image);
      }
    }
  }, [props, setValue]);

  useEffect(() => {
    if (selectedImage && selectedImage.length > 0) {
      const file = selectedImage[0];
      if (file instanceof File) {
        setPreviewImage(URL.createObjectURL(file));
      }
    }
  }, [selectedImage]);

  const onSubmit: SubmitHandler<IFormInputCourses> = async (data) => {
    try {
      const formData = new FormData();
      formData.append('name[en]', data.name.en);
      formData.append('name[ar]', data.name.ar);
      formData.append('name[fr]', data.name.fr);

      // formData.append('image', data.image[0]);
      if (data.image && data.image.length > 0) {
        formData.append('image', data.image[0]);
      }
      formData.append('price', data.price);
      formData.append('main_video', data.main_video);
      formData.append('course_duration', data.course_duration);
      formData.append('course_level', coursLevelState);
      formData.append('course_lang', coursLangState);
      formData.append('price_after_discount', data.priceAfterDiscount);
      formData.append('package_id', pacState.toString());
      formData.append('category_id', catState.toString());
      formData.append('description[en]', data.description.en);
      formData.append('description[ar]', data.description.ar);
      formData.append('description[fr]', data.description.ar);

      const headers = {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data',
      };

      const response = await axios.post(
        `${url}/admin/courses/${props.id}/update`,
        formData,
        { headers },
      );

      toast.success('Course added successfully');
    } catch (err) {

      console.error('Error updating course:', err);
      toast.error('Failed to add course, please check your input.');
    }
  };
  // console.log(packages.data.data)
  // console.log(categories)

  return (
    <>
      <Box
        sx={{
          mt: { sm: 5, xs: 2.5 },
          width: '50%',
        }}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Stack spacing={3}>
          {/* Name Fields */}
          <TextField
            fullWidth
            variant="outlined"
            label={t('ArabicName')}
            error={!!errors.name?.ar}
            helperText={errors.name?.ar?.message}
            {...register('name.ar', { required: t('ArabicNameReq') })}
          />
          <TextField
            fullWidth
            variant="outlined"
            label={t('EnglishName')}
            error={!!errors.name?.en}
            helperText={errors.name?.en?.message}
            {...register('name.en', { required: t('EnglishNameReq') })}
          />
          <TextField
            fullWidth
            variant="outlined"
            label="name franc"
            error={!!errors.name?.fr}
            helperText={errors.name?.fr?.message}
            {...register('name.fr', { required: 'name franc is requirded' })}
          />

          {/* Description Fields */}
          <TextField
            fullWidth
            variant="outlined"
            label={t('descAr')}
            error={!!errors.description?.ar}
            helperText={errors.description?.ar?.message}
            {...register('description.ar', {
              required: t('descArReq'),
            })}
          />
          <TextField
            fullWidth
            key={'description.en'}
            variant="outlined"
            label={t('descEn')}
            error={!!errors.description?.en}
            helperText={errors.description?.en?.message}
            {...register('description.en', {
              required: t('descEnReq'),
            })}
          />
          <TextField
            fullWidth
            key={'description.fr'}
            variant="outlined"
            label="desc france"
            error={!!errors.description?.en}
            helperText={errors.description?.en?.message}
            {...register('description.en', {
              required: 'desc france is required',
            })}
          />

          <TextField
            select
            fullWidth
            key={'CourseLanguage'}
            id="Course Language"
            variant="outlined"
            label={t('CourseLanguage')}
            error={!!errors.course_lang}
            helperText={errors.course_lang?.message}
            value={coursLangState}
            {...register('course_lang', { required: t('CourseLanguageReq') })}
            onChange={(e) => {
              setCoursLangState(e.target.value);
            }}
            sx={{
              '.MuiOutlinedInput-root': {
                lineHeight: 0, // Match default height for MUI TextField
              },
            }}
          >
            {['arabic', 'english'].map((lang) => (
              <MenuItem key={lang} value={lang}>
                {lang}
              </MenuItem>
            ))}
          </TextField>

          <Button
          component="label"
          role={undefined}
          variant="outlined"
          tabIndex={-1}
          startIcon={<CloudUpload />}
          
        >
          Upload Image
          <VisuallyHiddenInput
            type="file"
            {...register('image')}
            multiple
          />
        </Button>

        {previewImage && (
          <Box sx={{ mt: 2 }}>
            <img
              src={previewImage}
              alt={t('Preview')}
              style={{ maxWidth: '100%', maxHeight: 200, objectFit: 'cover' }}
            />
          </Box>
        )}

          {/* Other Inputs */}
          <TextField
            fullWidth
            variant="outlined"
            label={t('price')}
            error={!!errors.price}
            helperText={errors.price?.message}
            {...register('price', { required: t('priceReq2') })}
          />

          {errors.package?.id && <span>{errors.package.id.message}</span>}
          <TextField
            fullWidth
            variant="outlined"
            label={t('MainVideoURL')}
            error={!!errors.main_video}
            helperText={errors.main_video?.message}
            {...register('main_video', { required: t('MainVideoURLReq') })}
          />

          <TextField
            id="Course Duration"
            fullWidth
            variant="outlined"
            label={t('CourseDuration')}
            error={!!errors.course_duration}
            helperText={errors.course_duration?.message}
            {...register('course_duration', {
              required: t('CourseDurationReq'),
            })}
          />

          <TextField
            select
            fullWidth
            id="Course Level"
            variant="outlined"
            label={t('CourseLevel')}
            error={!!errors.course_level}
            helperText={errors.course_level?.message}
            value={coursLevelState}
            {...register('course_level', { required: t('CourseLevelReq') })}
            onChange={(e) => {
              setcoursLevelState(e.target.value);
            }}
            sx={{
              '.MuiOutlinedInput-root': {
                lineHeight: 0, // Match default height for MUI TextField
              },
            }}
          >
            {['beginner', 'intermediate', 'advance'].map((lev) => (
              <MenuItem key={lev} value={lev}>
                {lev}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            variant="outlined"
            label={t('PriceAfterDiscount')}
            error={!!errors.priceAfterDiscount}
            helperText={errors.priceAfterDiscount?.message}
            {...register('priceAfterDiscount', {
              required: t('PriceAfterDiscountReq'),
            })}
            sx={{
              marginBottom: 2, // Add margin to separate this field visually from the next
            }}
          />

          {/* Category */}
          <label htmlFor="package">Category</label>

          <TextField
            select
            id="Category"
            // error={!!errors.category_id}
            // helperText={errors.category_id?.message}
            value={catState || ''}
            {...register('category.id')}
            onChange={(e) => {
              setCatState(+e.target.value);
            }}
            fullWidth
            sx={{
              '.MuiOutlinedInput-root': {
                lineHeight: 0,
              },
            }}
          >
            {categories?.data?.data?.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name.en}
              </MenuItem>
            ))}
          </TextField>
          <label htmlFor="package">Package</label>
          <TextField
            select
            id="package"
            {...register('package.id')}
            value={pacState || ''} // Fallback to an empty string if undefined
            onChange={(e) => setpacState(+e.target.value)} // Sync value with react-hook-form
            fullWidth
            sx={{
              '.MuiOutlinedInput-root': {
                lineHeight: 0,
              },
            }}
          >
            {packages?.data?.data?.map((pkg) => (
              <MenuItem key={pkg.id} value={pkg.id}>
                {pkg.name.en}
              </MenuItem>
            ))}
          </TextField>
        </Stack>

        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          type="submit"
          sx={{ mt: 3, fontSize: '18px' }}
        >
          {t('updateCourse')}
        </Button>
      </Box>
      <Toaster position="bottom-center" reverseOrder={false} />
    </>
  );
}

export default UpdateCourse;
