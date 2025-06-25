import React, { useEffect, useState } from 'react';
import { Box, Button, Stack, TextField } from '@mui/material';
import axios from 'axios';
import { useForm, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { fetchOne } from 'functions';

interface IFormInput {
    id: number;
    name: string;
    email: string;
    phone: string;
    password: string;
    partner_code:string
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

  const { data, error, isLoading, isError, refetch } = useQuery({
    queryKey: [`customer-${id}`],
    queryFn: () => fetchOne(id,'customers'),
  });
// console.log(data?.data)

// const courseID = data?.data?.course?.id
// console.log(data)
    useEffect(() => {
      if (data?.data) {
        // setValue('name', data?.data.title.ar);
        // setValue('email', data?.data.title.en);
        // setValue('phone', data?.data.title.fr);
        // setValue('phone', data?.data.description.ar);
        // setValue('password', data?.data.description.en);
        // setValue('partner_code', data?.data.description.fr);
      }
    }, [data?.data, setValue]);

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error: {error.message}</p>;

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
    </Box>
  );
}

export default ViewCustomer;
