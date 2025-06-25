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
  email:string
  password: string;
  roles: string[];
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

function AddSubAdminForm({ handleClose, refetch }: { handleClose: () => void; refetch: () => void }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const [personName, setPersonName] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('desc');
  const [per, setPer] = useState(10);

  const url = import.meta.env.VITE_API_URL;

  const { data: apiRoles, error, isLoading, isError } = useQuery({
    queryKey: [`roles-${page}-${per}-${search}-${sort}`],
    queryFn: () => fetchAllData(page, per, search, sort, '', 'roles'),
  });

  // console.log(apiRoles?.data?.data)

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data',
      };
  
      await axios.post(`${url}/admin/sub-admins`, data, { headers });
      toast.success(t('roles added successfully'));
      handleClose();
      refetch();
    } catch (err) {
    //   console.error(err);
      toast.error(t('Failed to add roles, please check your input.'));
    }
  };
  

  if (isLoading) {
   
    return (
      <Box sx={{ width: '100%' }}>
        <Skeleton variant="rectangular" width="100%" height={40} />
      </Box>
    );
  }

  if (isError) {
    return <p>{t('Failed to fetch permissions. Please try again later.')}</p>;
  }

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
            id="email"
            type="text"
            label={t('email')}
            error={!!errors.email}
            helperText={errors?.email?.message}
            {...control.register('email', { required: t('email') })}
          />
          <TextField
            fullWidth
            variant="outlined"
            id="password"
            type="password"
            label={t('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            {...control.register('password', { required: t('password') })}
          />
        <FormControl sx={{ m: 1, width: '100%' }}>
          <InputLabel id="permissions-label">{t('Permissions')}</InputLabel>
          <Controller
            name="roles"
            control={control}
            rules={{ required: t('roles') }}
            render={({ field }) => (
              <Select
              sx={{ lineHeight:0}}
                {...field}
                multiple
                value={field.value || []}
                onChange={(event) => {
                  const { target: { value } } = event;
                  const newValue = typeof value === 'string' ? value.split(',') : value;
                  setPersonName(newValue);
                  field.onChange(newValue);
                }}
                input={<OutlinedInput id="roles" label="roles" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {Array.isArray(apiRoles?.data?.data) &&
                  apiRoles?.data?.data.map((item: { id: number; name: string }) => (
                    <MenuItem
                      key={item.name}
                      value={item.name}
                      style={getStyles(item.name, personName, theme)}
                    >
                      {item.name}
                    </MenuItem>
                  ))}
              </Select>
            )}
          />
        </FormControl>
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
        {t('addPermissions')}
      </Button>
    </Box>
  );
}

export default AddSubAdminForm;
