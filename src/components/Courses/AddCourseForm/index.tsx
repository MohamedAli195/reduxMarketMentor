import React, { useEffect, useState } from 'react';
import { Box, Button, MenuItem, Stack, TextField, Typography } from '@mui/material';
import axios from 'axios';
// import { fetchCategories, fetchCategoriesForCourses } from 'pages/categories/categoriesFunct';
// import { fetchPackages, fetchPackagesForCourses } from 'pages/packages/packagesFunct';
import { useForm, SubmitHandler } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { t } from 'i18next';
import { errorType, IFormInputCourses } from 'interfaces';
import { styled } from '@mui/material/styles';

import { CloudUpload } from 'lucide-react';
import { useCreateCourseMutation } from 'app/features/Courses/coursesSlice';
import { useGetCategoriesQuery } from 'app/features/Categories/CategoriesSlice';
import { useGetPackagesQuery } from 'app/features/packages/packages';
import i18n from 'i18n';

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

function AddCourseForm({ handleClose }: { handleClose: () => void }) {
  const [isFree, setIsFree] = useState<'0' | '1'>('1');

  const { data: categories } = useGetCategoriesQuery({});

  const { data: packages } = useGetPackagesQuery({});

  // console.log(categories);
  // console.log(packages);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputCourses>();
  const [preview, setPreview] = useState<string | null>(null);
  const [createCourse, { isLoading }] = useCreateCourseMutation();
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

  const onSubmit: SubmitHandler<IFormInputCourses> = async (data) => {
    try {
      const formData = new FormData();
      formData.append('name[en]', data.name.en);
      formData.append('name[ar]', data.name.ar);
      formData.append('name[fr]', data.name.fr);
      formData.append('image', data.image[0]);
      if (data.price) {
        formData.append('price', data.price);
      }
      formData.append('main_video', data.main_video);
      formData.append('course_duration', data.course_duration);
      formData.append('course_level', data.course_level);
      formData.append('course_lang', data.course_lang);
      if (data.priceAfterDiscount) {
        formData.append('price_after_discount', data.priceAfterDiscount);
      }
      if (data.package_id) {
        formData.append('package_id', data.package_id.toString());
      }
      formData.append('category_id', data.category_id.toString());
      formData.append('is_free', String(isFree));
      formData.append('total_hours', String(data.total_hours));
      formData.append('description[en]', data.description.en);
      formData.append('description[ar]', data.description.ar);
      formData.append('description[fr]', data.description.ar);

      const res = await createCourse(formData).unwrap();
      // console.log(res);
      if (res.code === 200) {
        toast.success('Course added successfully');
      }

      handleClose();
    } catch (error: unknown) {
      const err = error as errorType;
      console.log(err);
      const errorMessages = err?.data?.errors
        ? Object.values(err.data.errors).flat().join('\n')
        : 'Failed to add course, please check your input.';

      toast.error(errorMessages);
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
        <Stack>
          <Stack display={'flex'} flexDirection={'row'}>
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
              label={t('FrancName')}
              error={!!errors.name?.fr}
              helperText={errors.name?.fr?.message}
              {...register('name.fr', { required: t('FrancNameReq') })}
            />
          </Stack>
          <Stack display={'flex'} flexDirection={'row'}>
            {/* Description Fields */}
            <TextField
              fullWidth
              multiline
              variant="outlined"
              label={t('descAr')}
              
              error={!!errors.description?.ar}
              helperText={errors.description?.ar?.message}
              {...register('description.ar', {
                required: t('descArReq'),
              }
            
            )}
               sx={{
              '& .MuiInputBase-input': {
                lineHeight: '1.2', // Adjust line height
              },
            }}
            />
            <TextField
              fullWidth
              multiline
              key={'description.en'}
              variant="outlined"
              label={t('descEn')}
              error={!!errors.description?.en}
              helperText={errors.description?.en?.message}
              {...register('description.en', {
                required: t('descEnReq'),
              })}
                 sx={{
              '& .MuiInputBase-input': {
                lineHeight: '1.2', // Adjust line height
              },
            }}
            />
            <TextField
              fullWidth
              multiline
              key={'description.fr'}
              variant="outlined"
              label={t('FrancDesc')}
              error={!!errors.description?.en}
              helperText={errors.description?.en?.message}
              {...register('description.en', {
                required: t('FrancDescReq'),
              })}
                 sx={{
              '& .MuiInputBase-input': {
                lineHeight: '1.2', // Adjust line height
              },
            }}  
            />
          </Stack>
          <Stack display={'flex'} flexDirection={'row'} gap={1}>
            <TextField
              select
              key={'CourseLanguage'}
              id="Course Language"
              variant="outlined"
              label={t('CourseLanguage')}
              error={!!errors.course_lang}
              helperText={errors.course_lang?.message}
              {...register('course_lang')}
              sx={{
                '.MuiOutlinedInput-root': {
                  lineHeight: 0, // Match default height for MUI TextField
                },
                width: '20%',
              }}
            >
              {['arabic', 'english'].map((lang) => (
                <MenuItem key={lang} value={lang}>
                  {lang}
                </MenuItem>
              ))}
            </TextField>
            {/* Category */}
            <TextField
              select
              variant="outlined"
              label={t('Category')}
              error={!!errors.category_id}
              helperText={errors.category_id?.message}
              {...register('category_id', { required: t('CategoryReq') })}
              sx={{
                '.MuiOutlinedInput-root': {
                  lineHeight: 0,
                },
                width: '20%',
              }}
            >
              {categories?.data?.data?.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {i18n.language === 'ar' ? cat.name.ar : cat.name.en}
                </MenuItem>
              ))}
            </TextField>

            {/* Image Upload */}
            {/* <Button
              component="label"
              role={undefined}
              variant="outlined"
              tabIndex={-1}
              sx={{ mt: 2, maxHeight: '200px', lineHeight: 1 }}
              startIcon={<CloudUpload />}
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
            </Button> */}
            <Button
              component="label"
              role={undefined}
              variant="outlined"
              tabIndex={-1}
              startIcon={<CloudUpload />}
              sx={{ height: '100%',marginTop:3 }}
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
              <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                {errors.image.message}
              </Typography>
            )}
            {preview && (
              <Box sx={{ mt: 2, maxHeight: '85px',overflow:'hidden' }}>
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
            {isFree == '0' && (
              <TextField
                fullWidth
                variant="outlined"
                label={t('price')}
                error={!!errors.price}
                helperText={errors.price?.message}
                {...register('price')}
              />
            )}

            <TextField
              select
              fullWidth
              variant="outlined"
              label={t('package')}
              error={!!errors.package_id}
              helperText={errors.package_id?.message}
              {...register('package_id')}
              sx={{
                '.MuiOutlinedInput-root': {
                  lineHeight: 0, // Match default height for MUI TextField
                },
              }}
            >
              {packages?.data?.data?.map((pkg) => (
                <MenuItem key={pkg.id} value={pkg.id}>
                  {i18n.language === 'ar' ? pkg.name.ar : pkg.name.en}
                </MenuItem>
              ))}
            </TextField>
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
          </Stack>

          <Stack display={'flex'} flexDirection={'row'}>
            <TextField
              select
              fullWidth
              id="Course Level"
              variant="outlined"
              label={t('CourseLevel')}
              error={!!errors.course_level}
              helperText={errors.course_level?.message}
              {...register('course_level', { required: t('CourseLevelReq') })}
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
            {isFree == '0' && (
              <TextField
                fullWidth
                variant="outlined"
                label={t('PriceAfterDiscount')}
                error={!!errors.priceAfterDiscount}
                helperText={errors.priceAfterDiscount?.message}
                {...register('priceAfterDiscount')}
                sx={{
                  marginBottom: 2, // Add margin to separate this field visually from the next
                }}
              />
            )}
            <TextField
              select
              fullWidth
              variant="outlined"
              label={t('isFree')}
              error={!!errors.is_free}
              helperText={errors.is_free?.message}
              value={isFree}
              onChange={(e) => {
                const value = e.target.value;
                setIsFree(value as '0' | '1');
              }}
              sx={{
                '.MuiOutlinedInput-root': {
                  lineHeight: 0, // Match default height for MUI TextField
                },
              }}
            >
              <MenuItem value="1">{t('free')}</MenuItem>
              <MenuItem value="0">{t('notFree')}</MenuItem>
            </TextField>
            <TextField
              fullWidth
              type="number"
              variant="outlined"
              label={t('totalHours')}
              error={!!errors.total_hours}
              helperText={errors.total_hours?.message}
              {...register('total_hours', {
                required: t('totalHoursReq'),
                valueAsNumber: true,
                min: {
                  value: 1,
                  message: 'Total hours must be at least 1',
                },
              })}
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
          disabled={isLoading}
        >
          {t('AddCourse')}
        </Button>
      </Box>
      <Toaster position="bottom-center" reverseOrder={false} />
    </>
  );
}

export default AddCourseForm;
