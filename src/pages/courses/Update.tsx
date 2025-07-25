import React, { useEffect, useState } from 'react';
import { Box, Button, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { t } from 'i18next';
import { styled } from '@mui/material/styles';
import { CloudUpload } from 'lucide-react';
import { useUpdateCourseMutation } from 'app/features/Courses/coursesSlice';
import { errorType, ICourse } from 'interfaces';
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

export interface IPackageRes {
  code: number;
  data: {
    data: {
      id: number;
      image: string;
      name: { ar: string; en: string; fr: string };
      price: string;
      status: string;
    }[];
  };
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
  category_id: number | string;
  package_id: number | string;
  priceAfterDiscount: string;
  is_free: '0' | '1' | undefined;
  total_hours: number;
  package: {
    id: number | undefined;
    name: {
      en: string;
      ar: string;
      fr: string;
    };
  };
  category: {
    id: number | undefined;
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
interface IProps {
  course: ICourse | undefined;
  handleCloseUp: () => void;
}
function UpdateCourse({ course, handleCloseUp }: IProps) {
  // const [isFree, setIsFree] = useState<string>();
  const [isFree, setIsFree] = useState<'0' | '1'>(course?.is_free ? '1' : '0');
  const [catState, setCatState] = useState(course?.category?.id);
  const [coursLangState, setCoursLangState] = useState(course?.course_lang);
  const [coursLevelState, setcoursLevelState] = useState(course?.course_level);
  const [pacState, setpacState] = useState(course?.package?.id);

  const id = course?.id;

  // const [fileName, setFileName] = useState<string | null>(null); // State to store the selected file name

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<IFormInputCourses>();
  // console.log(errors)
  const { data: categories } = useGetCategoriesQuery({});

  const { data: packages } = useGetPackagesQuery({});
  const [updateCourse, { isLoading }] = useUpdateCourseMutation();
  const [previewImage, setPreviewImage] = useState<string | null>(
    typeof course?.image === 'string' ? course?.image : null,
  );
  const selectedImage = watch('image');
  // const [preview, setPreview] = useState<string | null>(null);
  // const [createCourse] = useCreateCourseMutation();
  // console.log(previewImage)
  const url = import.meta.env.VITE_API_URL;
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (course) {
      setValue('name.en', course.name.en);
      setValue('name.ar', course.name.ar);
      setValue('name.fr', course.name.fr);
      setValue('price', course.price);
      setValue('is_free', isFree);
      setValue('main_video', course.main_video);
      setValue('total_hours', course.total_hours);
      setValue('course_duration', course.course_duration);
      // if (coursLevelState) {
      setValue('course_level', course.course_level);
      // }
      if (coursLangState) {
        setValue('course_lang', coursLangState);
      }

      setValue('priceAfterDiscount', course.priceAfterDiscount);
      if (catState) {
        setValue('category.id', catState);
      }

      if (pacState) {
        setValue('package.id', pacState);
      }
      setValue('description.en', course.description.en);
      setValue('description.ar', course.description.ar);
      setValue('description.fr', course.description.fr);

      if (typeof course.image === 'string') {
        setPreviewImage(course.image);
      }
    }
  }, [course, setValue, isFree]);

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
      if (isFree === '1') {
        formData.append('price', '0');
      } else {
        formData.append('price', data.price);
      }
      formData.append('total_hours', data.total_hours.toString());
      formData.append('main_video', data.main_video);
      formData.append('course_duration', data.course_duration);
      if (coursLevelState) formData.append('course_level', coursLevelState);
      if (coursLangState) formData.append('course_lang', coursLangState);

      if (isFree === '1') {
        formData.append('price_after_discount', '0');
      } else {
        formData.append('price_after_discount', data.priceAfterDiscount);
      }
      if (pacState) formData.append('package_id', pacState.toString());
      if (catState) formData.append('category_id', catState.toString());
      formData.append('description[en]', data.description.en);
      formData.append('description[ar]', data.description.ar);
      formData.append('description[fr]', data.description.ar);
      formData.append('is_free', String(isFree));

      // const response = await axios.post(
      //   `${url}/admin/courses/${props.id}/update`,
      //   formData,
      //   { headers },
      // );
      const res = await updateCourse({ id, formData }).unwrap();
      //  console.log(res);
      if (res.code === 200) {
        toast.success('Course updated successfully');
      }

      handleCloseUp();
    } catch (error: unknown) {
      const err = error as errorType;
      console.log(err);
      const errorMessages = err?.data?.errors
        ? Object.values(err.data.errors).flat().join('\n')
        : 'Failed to add course, please check your input.';

      toast.error(errorMessages);
    }
  };
  // console.log(packages.data.data)
  // console.log(categories)

  return (
    <>
      <Box sx={{}} component="form" onSubmit={handleSubmit(onSubmit)}>
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
          <Stack display={'flex'} flexDirection={'row'} gap={1}>
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
              {...register('description.fr', {
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
            {/* <TextField
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
            </TextField> */}

            <Controller
              name="course_lang"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  select
                  fullWidth
                  id="course_lang"
                  variant="outlined"
                  label={t('course lang')}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  value={coursLangState}
                  onChange={(e) => {
                    setCoursLangState(e.target.value);
                    field.onChange(e); // لازم تفضل تمرر القيمة للـ react-hook-form
                  }}
                  sx={{
                    '.MuiOutlinedInput-root': {
                      lineHeight: 0,
                    },
                  }}
                >
                  {['arabic', 'english'].map((lang) => (
                    <MenuItem key={lang} value={lang}>
                      {i18n.language === 'ar' ? lang : lang}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            {/* Category */}

            <Controller
              name="package"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  select
                  fullWidth
                  id="category"
                  variant="outlined"
                  label={t('category')}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  value={catState}
                  onChange={(e) => {
                    setCatState(+e.target.value);
                    field.onChange(e); // لازم تفضل تمرر القيمة للـ react-hook-form
                  }}
                  sx={{
                    '.MuiOutlinedInput-root': {
                      lineHeight: 0,
                    },
                  }}
                >
                  {categories?.data?.data?.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {i18n.language === 'ar' ? cat.name.ar : cat.name.en}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

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
              sx={{ height: '100%', marginTop: 3 }}
            >
              <span style={{ display: 'inline-block', marginLeft: 10, marginRight: 10 }}>
                {t('UploadImage')}
              </span>
              <VisuallyHiddenInput
                type="file"
                {...register('image', {
                  required: previewImage ? '' : t('ImageRequired'), // أو اكتبها نصًا زي "الصورة مطلوبة"
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
            {previewImage && (
              <Box sx={{ mt: 2, maxHeight: '85px', overflow: 'hidden' }}>
                <img
                  src={previewImage}
                  alt={t('Preview')}
                  style={{ maxWidth: '100%', maxHeight: 200, objectFit: 'cover' }}
                />
              </Box>
            )}
          </Stack>
          <Stack display={'flex'} flexDirection={'row'} gap={1}>
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

            <Controller
              name="package"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  select
                  fullWidth
                  id="package"
                  variant="outlined"
                  label={t('package')}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  value={pacState}
                  onChange={(e) => {
                    setpacState(+e.target.value);
                    field.onChange(e); // لازم تفضل تمرر القيمة للـ react-hook-form
                  }}
                  sx={{
                    '.MuiOutlinedInput-root': {
                      lineHeight: 0,
                    },
                  }}
                >
                  {packages?.data?.data?.map((pkg) => (
                    <MenuItem key={pkg.id} value={pkg.id}>
                      {i18n.language === 'ar' ? pkg.name.ar : pkg.name.en}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

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

          <Stack display={'flex'} flexDirection={'row'} gap={1}>
            <Controller
              name="course_level"
              control={control}
              rules={{ required: t('CourseLevelReq') }}
              render={({ field, fieldState }) => (
                <TextField
                  select
                  fullWidth
                  id="Course Level"
                  variant="outlined"
                  label={t('CourseLevel')}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  value={coursLevelState}
                  onChange={(e) => {
                    setcoursLevelState(e.target.value);
                    field.onChange(e); // لازم تفضل تمرر القيمة للـ react-hook-form
                  }}
                  sx={{
                    '.MuiOutlinedInput-root': {
                      lineHeight: 0,
                    },
                  }}
                >
                  {['beginner', 'intermediate', 'advance'].map((lev) => (
                    <MenuItem key={lev} value={lev}>
                      {lev}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
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
                const value = e.target.value as '0' | '1';
                setIsFree(value);
              }}
              sx={{
                '.MuiOutlinedInput-root': {
                  lineHeight: 0,
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
          {t('updateCourse')}
        </Button>
      </Box>
      <Toaster position="bottom-center" reverseOrder={false} />
    </>
  );
}

export default UpdateCourse;
