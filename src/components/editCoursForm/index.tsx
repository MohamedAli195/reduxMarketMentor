// import { Avatar, Box, Button, MenuItem, Stack, TextField, useTheme } from '@mui/material';
// import axios from 'axios';
// import { IPackageRes } from 'components/AddCourseForm';
// import { fetchCategories } from 'pages/categories/categoriesFunct';
// import { fetchPackages } from 'pages/packages/packagesFunct';
// import { useEffect, useState } from 'react';
// import { SubmitHandler, useForm } from 'react-hook-form';
// import toast from 'react-hot-toast';
// import { useTranslation } from 'react-i18next';

// interface IFormInput {
//   name: {
//     en: string;
//     ar: string;
//     fr: string;
//   };
//   image: FileList | string;
//   price: string;
//   main_video: string;
//   course_duration: string;
//   course_level: string;
//   course_lang: string;
//   price_after_discount: string;
//   package_id: number;
//   category_id: number;
//   category: {
//     name: {
//       ar: string;
//       en: string;
//       fr?: string;
//     };
//   };
//   description: {
//     en: string;
//     ar: string;
//     fr: string;
//   };
// }

// function EditCoursForm({
//   initialData,
// }: {
//   initialData?: {
//     id: number;
//     name: { en: string; ar: string; fr: string };
//     price: string;
//     image: FileList | string;
//     main_video: string;
//     course_duration: string;
//     course_level: string;
//     course_lang: string;
//     priceAfterDiscount: string;
//     package_id: number | string;
//     category: {
//       name: { ar: string; en: string; fr?: string };
//       category_id: number;
//     };
//     description: { en: string; ar: string; fr: string };
//   };
// }) {
//   const { t } = useTranslation();
//   const theme = useTheme();
//   const [previewImage, setPreviewImage] = useState<string | null>(null);
//   const {
//     register,
//     setValue,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<IFormInput>();

//   const [categoriesOption, setCategoriesOption] = useState<IPackageRes>({
//     code: 0,
//     data: [],
//   });

//   const [packagesOption, setPackagesOption] = useState<IPackageRes>({
//     code: 0,
//     data: [],
//   });

//   useEffect(() => {
//     if (initialData) {
//       setValue('name.en', initialData.name.en);
//       setValue('name.ar', initialData.name.ar);
//       setValue('name.fr', initialData.name.fr);
//       setValue('price', initialData.price);
//       setValue('main_video', initialData.main_video);
//       setValue('course_duration', initialData.course_duration);
//       setValue('course_level', initialData.course_level);
//       setValue('course_lang', initialData.course_lang);
//       setValue('price_after_discount', initialData.priceAfterDiscount);
//       setValue('category_id', initialData.category.category_id);
//       setValue('description.en', initialData.description.en);
//       setValue('description.ar', initialData.description.ar);
//       setValue('description.fr', initialData.description.fr);

//       if (typeof initialData.image === 'string') {
//         setPreviewImage(initialData.image);
//       }
//     }
//   }, [initialData, setValue]);

//   useEffect(() => {
//     const loadCategories = async () => {
//       try {
//         const categoryData = await fetchCategories();
//         setCategoriesOption(categoryData);
//       } catch (error) {
//         console.error('Error fetching categories:', error);
//         toast.error(t('Failed to load categories.'));
//       }
//     };

//     const loadPackages = async () => {
//       try {
//         const packageData = await fetchPackages();
//         setPackagesOption(packageData);
//       } catch (error) {
//         console.error('Error fetching packages:', error);
//         toast.error(t('Failed to load packages.'));
//       }
//     };

//     loadCategories();
//     loadPackages();
//   }, []);

//   const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       setPreviewImage(URL.createObjectURL(file));
//     }
//   };

//   const onSubmit: SubmitHandler<IFormInput> = async (data) => {
//     try {
//       const formData = new FormData();
//       formData.append('name[en]', data.name.en);
//       formData.append('name[ar]', data.name.ar);
//       formData.append('name[fr]', data.name.fr);
//       formData.append('description[en]', data.description.en);
//       formData.append('description[ar]', data.description.ar);
//       formData.append('description[fr]', data.description.fr);
//       formData.append('price', data.price);
//       formData.append('price_after_discount', data.price_after_discount);
//       formData.append('main_video', data.main_video);
//       formData.append('course_duration', data.course_duration);
//       formData.append('course_level', data.course_level);
//       formData.append('course_lang', data.course_lang);
//       formData.append('category_id', data.category_id);
//       formData.append('package_id', data.package_id);

//       if (data.image instanceof FileList && data.image.length > 0) {
//         formData.append('image', data.image[0]);
//       }

//       const headers = {
//         Authorization: `Bearer ${localStorage.getItem('token')}`,
//         'Content-Type': 'multipart/form-data',
//       };

//       await axios.post(
//         `https://market-mentor.flexi-code.com/public/api/admin/courses/${initialData?.id}/update`,
//         formData,
//         { headers },
//       );

//       toast.success(t('Course updated successfully'));
//     } catch (error) {
//       console.error(error);
//       toast.error(t('Failed to update course, please check your input.'));
//     }
//   };

//   return (
//     <Box
//       component="form"
//       onSubmit={handleSubmit(onSubmit)}
//       sx={{
//         mt: { sm: 5, xs: 2.5 },
//         width: '50%',
//       }}
//     >
//       <Stack spacing={3}>
//         {/* Form Fields */}
//         <TextField
//           label={t('Name (Arabic)')}
//           fullWidth
//           {...register('name.ar', { required: t('Required') })}
//           error={!!errors.name?.ar}
//           helperText={errors.name?.ar?.message}
//           defaultValue=""
//         />
//         <TextField
//           label={t('Name (English)')}
//           fullWidth
//           {...register('name.en', { required: t('Required') })}
//           error={!!errors.name?.en}
//           helperText={errors.name?.en?.message}
//           defaultValue=""
//         />
//         <TextField
//           label={t('Name (French)')}
//           fullWidth
//           {...register('name.fr', { required: t('Required') })}
//           error={!!errors.name?.fr}
//           helperText={errors.name?.fr?.message}
//           defaultValue=""
//         />
//         <TextField
//           label={t('Description (Arabic)')}
//           fullWidth
//           {...register('description.ar', { required: t('Required') })}
//           error={!!errors.description?.ar}
//           helperText={errors.description?.ar?.message}
//           defaultValue=""
//         />
//         <TextField
//           label={t('Description (English)')}
//           fullWidth
//           {...register('description.en', { required: t('Required') })}
//           error={!!errors.description?.en}
//           helperText={errors.description?.en?.message}
//           defaultValue=""
//         />
//         <TextField
//           label={t('Description (French)')}
//           fullWidth
//           {...register('description.fr', { required: t('Required') })}
//           error={!!errors.description?.fr}
//           helperText={errors.description?.fr?.message}
//           defaultValue=""
//         />
//         <TextField
//           label={t('Price')}
//           fullWidth
//           {...register('price', { required: t('Required') })}
//           error={!!errors.price}
//           helperText={errors.price?.message}
//           defaultValue=""
//         />
//         <TextField
//           label={t('Price After Discount')}
//           fullWidth
//           {...register('price_after_discount')}
//           defaultValue=""
//         />
//         <TextField
//           label={t('Main Video URL')}
//           fullWidth
//           {...register('main_video')}
//           defaultValue=""
//         />
//         <TextField
//           label={t('Course Duration')}
//           fullWidth
//           {...register('course_duration')}
//           defaultValue=""
//         />
//         <TextField
//           label={t('Course Level')}
//           fullWidth
//           {...register('course_level')}
//           defaultValue=""
//         />
//         <TextField
//           label={t('Course Language')}
//           fullWidth
//           {...register('course_lang')}
//           defaultValue=""
//         />
//         <TextField select fullWidth
//          label={t('Category')}  
//         {...register('category_id')} 
//         defaultValue={initialData?.category.category_id}
//         >
//           {categoriesOption.data.map((cat) => (
//             <MenuItem key={cat.id} value={cat.id} selected={cat.id=== initialData?.category.category_id?true:false }>
//               {cat.name.en}
//             </MenuItem>
//           ))}
//         </TextField>
//         <TextField
//           select
//           fullWidth
//           label={t('Package')}
//           defaultValue={initialData?.package_id} // Set default value here
//           {...register('package_id')}
//         >
//           {packagesOption.data.map((pkg) => (
//             <MenuItem key={pkg.id} value={pkg.id}>
//               {pkg.name.en}
//             </MenuItem>
//           ))}
//         </TextField>
//         <TextField
//           type="file"
//           inputProps={{ accept: 'image/*' }}
//           {...register('image')}
//           onChange={handleImageChange}
//         />
//         {previewImage && (
//           <Box sx={{ mt: 2 }}>
//             <img
//               src={previewImage}
//               alt={t('Preview')}
//               style={{ maxWidth: '100%', maxHeight: 200 }}
//             />
//           </Box>
//         )}
//       </Stack>
//       <Button color="primary" variant="contained" fullWidth type="submit" sx={{ mt: 3 }}>
//         {t('Update Course')}
//       </Button>
//     </Box>
//   );
// }

// export default EditCoursForm;
