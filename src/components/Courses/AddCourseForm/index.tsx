import React, { useEffect, useState } from 'react';
import { Box, Button, MenuItem, Stack, TextField } from '@mui/material';
import axios from 'axios';
// import { fetchCategories, fetchCategoriesForCourses } from 'pages/categories/categoriesFunct';
// import { fetchPackages, fetchPackagesForCourses } from 'pages/packages/packagesFunct';
import { useForm, SubmitHandler } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { t } from 'i18next';
import { IFormInputCourses } from 'interfaces';
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

function AddCourseForm({ handleClose, refetch }: {handleClose: () => void; refetch: () => void }) {
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


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputCourses>();
  const [preview, setPreview] = useState<string | null>(null);
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
    const loadCategories = async () => {
      try {
        const categoryData = await fetchPackagesOrCAtegoriesForCourses('categories');
        setCategories(categoryData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const loadPackages = async () => {
      try {
        const packageData = await fetchPackagesOrCAtegoriesForCourses('packages');
        setPackages(packageData);
      } catch (error) {
        console.error('Error fetching packages:', error);
      }
    };

    loadCategories();
    loadPackages();
  }, []);


  const onSubmit: SubmitHandler<IFormInputCourses> = async (data) => {
    try {
      const formData = new FormData();
      formData.append('name[en]', data.name.en);
      formData.append('name[ar]', data.name.ar);
      formData.append('name[fr]', data.name.fr);
      formData.append('image', data.image[0]);
      formData.append('price', data.price);
      formData.append('main_video', data.main_video);
      formData.append('course_duration', data.course_duration);
      formData.append('course_level', data.course_level);
      formData.append('course_lang', data.course_lang);
      formData.append('price_after_discount', data.priceAfterDiscount);
      formData.append('package_id', data.package_id.toString());
      formData.append('category_id', data.category_id.toString());
      formData.append('description[en]', data.description.en);
      formData.append('description[ar]', data.description.ar);
      formData.append('description[fr]', data.description.ar);

      const headers = {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data',
      };

      const response = await axios.post(
        `${url}/admin/courses`,
        formData,
        { headers },
      );
      
      toast.success('Course added successfully');
      handleClose();
      refetch();
    } catch (err) {
      console.error('Error adding course:', err);
      toast.error('Failed to add course, please check your input.');
    }
  };
// console.log(categories)
// console.log(packages)
  return (
    <>
      <Box
        sx={{
          mt: { sm: 5, xs: 2.5 },
       
        }}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Stack spacing={3}>
          <Stack display={'flex'} flexDirection={'row'}>
           {/* Name Fields */}
           <TextField
            fullWidth
            variant="outlined"
            label={t("ArabicName")}
            error={!!errors.name?.ar}
            helperText={errors.name?.ar?.message}
            {...register('name.ar', { required:t("ArabicNameReq") })}
          />
          <TextField
            fullWidth
            variant="outlined"
            label={t("EnglishName")}
            error={!!errors.name?.en}
            helperText={errors.name?.en?.message}
            {...register('name.en', { required: t("EnglishNameReq") })}
          />
          <TextField
            fullWidth
            variant="outlined"
            label="name franc"
            error={!!errors.name?.fr}
            helperText={errors.name?.fr?.message}
            {...register('name.fr', { required: "name franc is requirded" })}
          />

          
          </Stack>
          <Stack display={'flex'} flexDirection={'row'}>
            {/* Description Fields */}
         <TextField
            fullWidth
            variant="outlined"
            label={t("descAr")}
            error={!!errors.description?.ar}
            helperText={errors.description?.ar?.message}
            {...register('description.ar', {
              required: t("descArReq"),
            })}
          />
          <TextField
            fullWidth
            key={"description.en"}
            variant="outlined"
            label={t("descEn")}
            error={!!errors.description?.en}
            helperText={errors.description?.en?.message}
            {...register('description.en', {
              required: t("descEnReq"),
            })}
          />
          <TextField
            fullWidth
            key={"description.fr"}
            variant="outlined"
            label="desc france"
            error={!!errors.description?.en}
            helperText={errors.description?.en?.message}
            {...register('description.en', {
              required: "desc france is required",
            })}
          />
          </Stack>
          <Stack display={'flex'} flexDirection={'row'} gap={3}>
          <TextField
            select
            key={"CourseLanguage"}
            id='Course Language'
            variant="outlined"
            label={t("CourseLanguage")}
            error={!!errors.course_lang}
            helperText={errors.course_lang?.message}
            {...register('course_lang', { required: t("CourseLanguageReq") })}
            sx={{
              '.MuiOutlinedInput-root': {
                lineHeight: 0 // Match default height for MUI TextField
              },
              width:"25%"
            }}
          >
            {
            ['arabic', 'english'].map((lang) => (
              <MenuItem key={lang} value={lang}>
                {lang}
              </MenuItem>
            ))
            }
          </TextField>
          {/* Category */}
  <TextField
    select
    variant="outlined"
    label={t("Category")}
    error={!!errors.category_id}
    helperText={errors.category_id?.message}
    {...register('category_id', { required: t("CategoryReq") })}
    sx={{
      '.MuiOutlinedInput-root': {
            lineHeight: 0,
            
           
      },
      width:"25%"
    }}
  >
    {categories?.data?.data?.map((cat) => (
      <MenuItem key={cat.id} value={cat.id}>
        {cat.name.en}
      </MenuItem>
    ))}
  </TextField>

          {/* Image Upload */}
          <Button
          component="label"
          role={undefined}
          variant="outlined"
          tabIndex={-1}
          sx={{ mt: 2 ,maxHeight:"200px",lineHeight:1}}
          startIcon={<CloudUpload />}
          
        >
          Upload Image
          <VisuallyHiddenInput
            type="file"
            {...register('image')}
            multiple
            onChange={handleFileChange}
          />
        </Button>
        {preview  && (
          <Box sx={{ mt: 2 ,maxHeight:"200px"}}>
            <img
              src={preview}
              alt={t('Preview')}
              style={{ maxWidth: '100%', maxHeight: 200, objectFit: 'cover' }}
            />
          </Box>
        )}
          </Stack>
          <Stack display={'flex'} flexDirection={'row'}>
            {/* Other Inputs */}
          <TextField
            fullWidth
            variant="outlined"
            label={t("price")}
            error={!!errors.price}
            helperText={errors.price?.message}
            {...register('price', { required: t("priceReq2") })}
          />
          <TextField
            select
            fullWidth
            variant="outlined"
            label={t("package")}
            error={!!errors.package_id}
            helperText={errors.package_id?.message}
            {...register('package_id', { required: t("packageReq") })}
            sx={{
              '.MuiOutlinedInput-root': {
                lineHeight: 0 // Match default height for MUI TextField
              },
            }}
          >
            {packages?.data?.data?.map((pkg) => (
              <MenuItem key={pkg.id} value={pkg.id}>
                {pkg.name.en}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            variant="outlined"
            label={t("MainVideoURL")}
            error={!!errors.main_video}
            helperText={errors.main_video?.message}
            {...register('main_video', { required: t("MainVideoURLReq") })}
          />
          </Stack>

          <Stack display={'flex'} flexDirection={'row'}>
          <TextField
          id='Course Duration'
            fullWidth
            variant="outlined"
            label={t("CourseDuration")}
            error={!!errors.course_duration}
            helperText={errors.course_duration?.message}
            {...register('course_duration', {
              required: t("CourseDurationReq"),
            })}
          />

          <TextField
            select
            fullWidth
            id='Course Level'
            variant="outlined"
            label={t("CourseLevel")}
            error={!!errors.course_level}
            helperText={errors.course_level?.message}
            {...register('course_level', { required: t("CourseLevelReq") })}
            sx={{
              '.MuiOutlinedInput-root': {
                lineHeight: 0 // Match default height for MUI TextField
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
    label={t("PriceAfterDiscount")}
    error={!!errors.priceAfterDiscount}
    helperText={errors.priceAfterDiscount?.message}
    {...register('priceAfterDiscount', {
      required: t("PriceAfterDiscountReq"),
    })}
    sx={{
      marginBottom: 2, // Add margin to separate this field visually from the next
    }}
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
          {t("AddCourse")}
        </Button>
      </Box>
      <Toaster position="bottom-center" reverseOrder={false} />
    </>
  );
}

export default AddCourseForm;
