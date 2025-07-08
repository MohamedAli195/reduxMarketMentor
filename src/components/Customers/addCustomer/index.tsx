import React, { useState } from 'react';
import { Box, Button, Stack, TextField } from '@mui/material';
import axios from 'axios';
import { useForm, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useCreateCustomerMutation } from 'app/features/Users/usersSlice';
import { errorType } from 'interfaces';

interface IFormInput {
  id: number;
  name: string;
  email: string;
  phone: string;
  password: string;
  partner_code: string;
}

function AddCustomer({ handleClose }: { handleClose: () => void }) {
  const [fileName, setFileName] = useState<string | null>(null); // State to store the selected file name
  const { t } = useTranslation();
  const url = import.meta.env.VITE_API_URL;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();
  const [createCustomer, { error }] = useCreateCustomerMutation();
  console.log(error);
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      // Create a FormData object and append the data
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('phone', data.phone); // Access the first file in the FileList
      formData.append('password', data.password); // Access the first file in the FileList
      formData.append('partner_code', data.partner_code);

      const response = await createCustomer(formData).unwrap();
      if (response.code === 200) {
        toast.success('customer added successfully');
      }
      handleClose();
    } catch (error: unknown) {
      const err = error as errorType;

      const errorMessages = err?.data?.errors
        ? Object.values(err.data.errors).flat().join('\n')
        : 'Failed to add Customer, please check your input.';

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
        <TextField
          fullWidth
          variant="outlined"
          id="names.ar"
          type="text"
          label={t('name')}
          error={!!errors.name}
            helperText={errors.name?.message}
          {...register('name', { required: t('ArabicNameReq') })}
        />
        <TextField
          fullWidth
          variant="outlined"
          id="email"
          type="text"
          label={t('email')}
          error={!!errors.email}
            helperText={errors.email?.message}
          {...register('email', { required: t('EnglishNameReq') })}
        />
        <TextField
          fullWidth
          variant="outlined"
          id="phone"
          type="text"
          label={t('phone')}
          error={!!errors.phone}
            helperText={errors.phone?.message}
          {...register('phone', { required: t('priceReq2') })}
        />
        <TextField
          fullWidth
          variant="outlined"
          id="password"
          type="password"
          label={t('password')}
          error={!!errors.password}
            helperText={errors.password?.message}
          {...register('password', { required: t('priceReq2') })}
        />
        <TextField
          fullWidth
          variant="outlined"
          id="partner_code"
          type="text"
          label={t('partner_code')}
          {...register('partner_code')}
        />
      </Stack>
      <Button
        color="primary"
        variant="contained"
        size="large"
        fullWidth
        type="submit"
        sx={{ mt: 3, fontSize: '18px' }}
      >
        {t('Addcustomers')}
      </Button>
    </Box>
  );
}

export default AddCustomer;
