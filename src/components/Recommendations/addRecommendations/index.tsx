import React, { useState } from 'react';
import { Box, Button, Stack, TextField, Skeleton, Chip, FormControl, InputLabel, MenuItem, Select, OutlinedInput } from '@mui/material';
import axios from 'axios';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { styled, useTheme, Theme } from '@mui/material/styles';
import { useQuery } from '@tanstack/react-query';
import { fetchAllData } from 'functions';

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

interface IFormInput {
  name: string;
  value:string
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight: personName.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

function AddRecommendationsForm({ handleClose, refetch }: { handleClose: () => void; refetch: () => void }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();
  const url = import.meta.env.VITE_API_URL;
//   console.log(apiRoles.data.data)

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data',
      };
  
      await axios.post(`${url}/admin/recommendations`, data, { headers });
      toast.success(t('recommendations added successfully'));
      handleClose();
      refetch();
    } catch (err) {
    //   console.error(err);
      toast.error(t('Failed to add roles, please check your input.'));
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
        <Stack flexDirection="column" gap={2}>
          <TextField
            fullWidth
            variant="outlined"
            id="name"
            type="text"
            label={t('name')}
            error={!!errors.name}
            helperText={errors?.name?.message}
            {...control.register('name', { required: t('name') })}
          />
          <TextField
            fullWidth
            variant="outlined"
            id="value"
            type="text"
            label={t('value')}
            error={!!errors.value}
            helperText={errors?.value?.message}
            {...control.register('value', { required: t('email') })}
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
      >
        {t('add-Recommendations')}
      </Button>
    </Box>
  );
}

export default AddRecommendationsForm;
