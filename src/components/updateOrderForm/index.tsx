import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from '@mui/material';
import { useUpdateOrderStatusMutation } from 'app/features/Orders/ordersSlice';
import axios from 'axios';
import { errorType } from 'interfaces';
import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

interface IFormInput {
  status: string;
}

function UpdateOrderForm({
  handleClose,
  initialData,
}: {
  handleClose: () => void;

  initialData?: null | {
    id: number;
    //   name: { en: string; ar: string };
    status: string;
  };
}) {
  const { register, setValue, handleSubmit } = useForm<IFormInput>();
  const { t } = useTranslation();
  const [status, setStats] = useState(initialData?.status);
  const url = import.meta.env.VITE_API_URL;

  const [updateOrderStatus, { isLoading }] = useUpdateOrderStatusMutation();
  const id = initialData?.id;
  useEffect(() => {
    // console.log({initialData})
    if (initialData) {
      // console.log(initialData);

      setValue('status', initialData?.status);
    }
  }, [initialData, setValue]);
  // console.log(initialData);
  const handleChange = (event: SelectChangeEvent) => {
    setStats(event.target.value);
  };
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    // console.log(data);
    try {
      // Create a FormData object and append the data
      const formData = new FormData();
      formData.append('status', data.status);
      // Define headers with the token
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data',
      };

      // const response = await axios.post(
      //   `${url}/admin/orders/${initialData?.id}/change-status`,
      //   formData,
      //   { headers },
      // );

      const response = await updateOrderStatus({ id, formData }).unwrap()
      if (response.code === 200) {
        toast.success('Order Status successfully');
      }
      handleClose();
    } catch (error: unknown) {
      const err = error as errorType;
      console.log(err);
      const errorMessages = err?.data?.errors
        ? Object.values(err.data.errors).flat().join('\n')
        : 'Failed to updated order status, please check your input.';

      toast.error(errorMessages);
    }
  };

  return (
    <>
      <Box
        sx={{
          mt: { sm: 5, xs: 2.5 },
          width: '500px',
        }}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Stack spacing={3}>
          {/* <TextField
              fullWidth
              variant="outlined"
              id="names.ar"
              type="text"
              
            /> */}
          <FormControl
            fullWidth
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: 2,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Select
              fullWidth
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={`${status}`}
              label={t('status')}
              {...register('status', { required: t('status') })}
              onChange={handleChange}
              sx={{
                '.MuiSelect-select': {
                  lineHeight: 1.1, // Match default height for MUI TextField
                  width: 'fit-content',
                },
              }}
            >
              {['pending', 'accepted', 'canceled'].map((item) => {
                return (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
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
          {t('Update')}
        </Button>
      </Box>
    </>
  );
}

export default UpdateOrderForm;
