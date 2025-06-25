import {
    Box,
    Button,
    Stack,
    TextField,
  } from '@mui/material';
  import axios from 'axios';
  import { useEffect } from 'react';
  import { useForm, SubmitHandler } from 'react-hook-form';
  import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
  
  interface IFormInput {
    id: number;
    name: string;
    email: string;
    phone: string;
    partner_code:string
  }
  
  function UpdateCustomerForm({
    handleClose,
    initialData,
    refetch
  }: {
    handleClose: () => void;
    refetch:()=>void;
    initialData?: null | {
      id: number;
    //   name: { en: string; ar: string };
    name: string;
    email: string;
    phone: string;
    partner_code:string;
    };
  }) {
    const { register, setValue, handleSubmit } = useForm<IFormInput>();
    const { t } = useTranslation();
    const url = import.meta.env.VITE_API_URL;
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
        formData.append('partner_code', data.partner_code);
  
        // Define headers with the token
        const headers = {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'multipart/form-data',
        };
  
        const response = await axios.post(
          `${url}/admin/customers/${initialData?.id}/update`,
          formData,
          { headers }
        );
  
        // console.log(response.data);
        toast.success('Package updated successfully');
        refetch()
        handleClose();
  
      } catch (err) {
        // console.error('Error updating package:', err);
        toast.error('Failed to update package, please check your input.');
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
              label={t("ArabicName")}
              {...register('name', { required: t("ArabicNameReq") })}
            />
            <TextField
              fullWidth
              variant="outlined"
              id="email"
              type="text"
              label={t("EnglishName")}
              {...register('email', { required: t("EnglishNameReq") })}
            />
            <TextField
              fullWidth
              variant="outlined"
              id="price"
              type="text"
              label={t("phone")}
              {...register('phone', { required: t("priceReq2") })}
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
            {t("updateCustomer")}
          </Button>
        </Box>
      </>
    );
  }
  
  export default UpdateCustomerForm;
  