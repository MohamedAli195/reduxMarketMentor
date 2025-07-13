import React, { useEffect, useState } from 'react';
import { Box, Stack, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useGetCustomerQuery } from 'app/features/Users/usersSlice';

interface IFormInput {
  id: number;
  name: string;
  email: string;
  phone: string;
  password: string;
  partner_code: string;
}

function ViewCustomer() {
  const [fileName, setFileName] = useState<string | null>(null); // State to store the selected file name
  const { t } = useTranslation();
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IFormInput>();

  const { data, error, isLoading, isError } = useGetCustomerQuery(id);
  console.log(data);
  useEffect(() => {
    if (data?.data) {
      setValue('name', data?.data.name);
      setValue('email', data?.data.email);
      setValue('phone', data?.data.phone);
      if (data?.data?.partner_code) {
        setValue('partner_code', data?.data?.partner_code);
      }
    }
  }, [data?.data, setValue]);

  if (isLoading) return <p>Loading...</p>;

  return (
    <Box
      sx={{
        mt: { sm: 5, xs: 2.5 },
      }}
      component="form"
    >
      <Stack spacing={3}>
        <TextField
          fullWidth
          variant="outlined"
          id="names.ar"
          type="text"
          label={t('name')}
          {...register('name', { required: t('ArabicNameReq') })}
        />
        <TextField
          fullWidth
          variant="outlined"
          id="email"
          type="text"
          label={t('email')}
          {...register('email', { required: t('EnglishNameReq') })}
        />
        <TextField
          fullWidth
          variant="outlined"
          id="phone"
          type="text"
          label={t('phone')}
          {...register('phone', { required: t('priceReq2') })}
        />
        <TextField
          fullWidth
          variant="outlined"
          id="password"
          type="password"
          label={t('password')}
          {...register('password', { required: t('priceReq2') })}
        />
        <TextField
          fullWidth
          variant="outlined"
          id="partner_code"
          type="text"
          label={t('partner_code')}
          {...register('partner_code', { required: t('priceReq2') })}
        />
      </Stack>
      {/* <Button
        color="primary"
        variant="contained"
        size="large"
        fullWidth
        type="submit"
        sx={{ mt: 3, fontSize: '18px' }}
      >
        {t("Addcustomers")}
      </Button> */}
      {/* <div>hi</div> */}
    </Box>
  );
}

export default ViewCustomer;
