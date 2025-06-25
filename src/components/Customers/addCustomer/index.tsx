import React, { useState } from 'react';
import { Box, Button, Stack, TextField } from '@mui/material';
import axios from 'axios';
import { useForm, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

interface IFormInput {
    id: number;
    name: string;
    email: string;
    phone: string;
    password: string;
    partner_code:string
}

function AddCustomer({ handleClose, refetch }: { handleClose: () => void; refetch: () => void }) {
  const [fileName, setFileName] = useState<string | null>(null); // State to store the selected file name
  const { t } = useTranslation();
  const url = import.meta.env.VITE_API_URL;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      // Create a FormData object and append the data
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('phone', data.phone); // Access the first file in the FileList
      formData.append('password', data.password); // Access the first file in the FileList
      formData.append('partner_code', data.partner_code);

      // Define headers with the token
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data',
      };

      const response = await axios.post(
        `${url}admin/customers`,
        formData,
        { headers }
      );

      toast.success('customer added successfully');
      handleClose();
      refetch();
    } catch (err) {
      console.error('Error in adding customer:', err);
      toast.error('Failed to add customer, please check your input.');
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
              label={t("name")}
              {...register('name', { required: t("ArabicNameReq") })}
            />
            <TextField
              fullWidth
              variant="outlined"
              id="email"
              type="text"
              label={t("email")}
              {...register('email', { required: t("EnglishNameReq") })}
            />
            <TextField
              fullWidth
              variant="outlined"
              id="phone"
              type="text"
              label={t("phone")}
              {...register('phone', { required: t("priceReq2") })}
            />
            <TextField
              fullWidth
              variant="outlined"
              id="password"
              type="password"
              label={t("password")}
              {...register('password', { required: t("priceReq2") })}
            />
            <TextField
              fullWidth
              variant="outlined"
              id="partner_code"
              type="text"
              label={t("partner_code")}
              {...register('partner_code', { required: t("priceReq2") })}
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
        {t("Addcustomers")}
      </Button>
    </Box>
  );
}

export default AddCustomer;
