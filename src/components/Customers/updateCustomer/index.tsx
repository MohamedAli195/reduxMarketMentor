import {
    Box,
    Button,
    Stack,
    TextField,
  } from '@mui/material';
import { useUpdateCustomerMutation } from 'app/features/Users/usersSlice';
  import axios from 'axios';
import { errorType, IUser } from 'interfaces';
  import { useEffect } from 'react';
  import { useForm, SubmitHandler } from 'react-hook-form';
  import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
  
  interface IFormInput {
    id: number;
    name: string;
    email: string;
    phone: string;
    partner_code:string | undefined
  }
  
  function UpdateCustomerForm({
    handleClose,
    initialData,

  }: {
    handleClose: () => void;

    initialData?: null | IUser
  }) {
    const { register, setValue, handleSubmit ,formState:{errors}} = useForm<IFormInput>();
    const { t } = useTranslation();
    const url = import.meta.env.VITE_API_URL;

    const [updateCustomer] = useUpdateCustomerMutation()
    const id = initialData?.id
    useEffect(() => {
        // console.log({initialData})
      if (initialData) {
        // console.log(initialData);
        
          setValue('name', initialData.name);
          setValue('email', initialData.email);
  
        setValue('phone', initialData.phone);
        setValue('partner_code', initialData.partner_code);
  
      }
    }, [initialData, setValue]);
  
    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
      // console.log(data);
      try {
        // Create a FormData object and append the data
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('phone', data.phone); // Access the first file in the FileList
        formData.append('partner_code', String(data.partner_code))
        // Define headers with the token

  
        const response = await updateCustomer({id,formData}).unwrap()
  
         if (response.code === 200) {
        toast.success('customer updated successfully');
      }
        handleClose();
  
      } catch (error: unknown) {
            const err = error as errorType;
      
            const errorMessages = err?.data?.errors
              ? Object.values(err.data.errors).flat().join('\n')
              : 'Failed to update Customer, please check your input.';
      
            toast.error(errorMessages);
          }
    };
  
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
            {t("updateCustomer")}
          </Button>
        </Box>
      </>
    );
  }
  
  export default UpdateCustomerForm;
  