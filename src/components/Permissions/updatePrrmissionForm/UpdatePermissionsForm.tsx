import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Stack,
  TextField,
  Skeleton,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  OutlinedInput,
} from '@mui/material';
import axios from 'axios';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { styled, useTheme, Theme } from '@mui/material/styles';
import { useQuery } from '@tanstack/react-query';
import { fetchAllData, fetchOne } from 'functions';
import { IPermissions, ITempPermissions } from 'interfaces';

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
  display_name: {
    ar: string;
    en: string;
  };
  permissions: string[];
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

function UpdatePermissionsForm({
  handleClose,
  refetch,
  tempPermission,
}: {
  handleClose: () => void;
  refetch: () => void;
  tempPermission: ITempPermissions | undefined;
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IFormInput>();

  const [personName, setPersonName] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('desc');
  const [per, setPer] = useState(10);

  const url = import.meta.env.VITE_API_URL;
  const {
    data: apiPermissions,
    error: errorPermissions,
    isLoading: isLoadingpermissions,
    isError: iserrorpermissions,
  } = useQuery({
    queryKey: [`permissions-${page}-${per}-${search}-${sort}`],
    queryFn: () => fetchAllData(page, per, search, sort, '', 'roles/permissions'),
  });

  // console.log(tempPermission);

  useEffect(() => {
    if (tempPermission) {
      setValue('name', tempPermission?.name);
      setValue('display_name.en', tempPermission?.display_nameEn);
      setValue('display_name.ar', tempPermission?.display_nameAr);
      setValue(
        'permissions',
        tempPermission?.permissions.map((perm) => perm.name) || []
      );
    }
  }, [tempPermission, setValue]);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data',
      };

      const resonse = await axios.post(`${url}/admin/roles/${tempPermission?.id}/update`, data, { headers });

      // console.log(resonse);
      toast.success(t('roles added successfully'));
      handleClose();
      refetch();
    } catch (err) {
      // console.error(err);
      toast.error(t('Failed to add roles, please check your input.'));
    }
  };

  //   if (isLoading) {
  //     return (
  //       <Box sx={{ width: '100%' }}>
  //         <Skeleton variant="rectangular" width="100%" height={40} />
  //       </Box>
  //     );
  //   }

  //   if (isError) {
  //     return <p>{t('Failed to fetch permissions. Please try again later.')}</p>;
  //   }

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
            id="name-ar"
            type="text"
            label={t('display_name.ar')}
            error={!!errors.display_name?.ar}
            helperText={errors.display_name?.ar?.message}
            {...control.register('display_name.ar', { required: t('display_nameNameReq') })}
          />
          <TextField
            fullWidth
            variant="outlined"
            id="name-en"
            type="text"
            label={t('display_name.en')}
            error={!!errors.display_name?.en}
            helperText={errors.display_name?.en?.message}
            {...control.register('display_name.en', { required: t('EnglishNameReq') })}
          />
          <TextField
            fullWidth
            variant="outlined"
            id="name"
            type="text"
            label={t('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
            {...control.register('name', { required: t('NameReq') })}
          />
          <FormControl sx={{ m: 1, width: '100%' }}>
            <InputLabel id="permissions-label">{t('Permissions')}</InputLabel>
            <Controller
              name="permissions"
              control={control}
              rules={{ required: t('permissionsReq') }}
              render={({ field }) => (
                <Select
                  sx={{ lineHeight: 0 }}
                  {...field}
                  multiple
                  value={field.value || []}
                  onChange={(event) => {
                    const {
                      target: { value },
                    } = event;
                    const newValue = typeof value === 'string' ? value.split(',') : value;
                    setPersonName(newValue);
                    field.onChange(newValue);
                  }}
                  input={<OutlinedInput id="permissions" label="Permissions" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        // console.log('Selected Value:', value); // Log each value
                        return <Chip key={value} label={value} />; // Use value directly
                      })}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {Array.isArray(apiPermissions?.data) &&
                    apiPermissions.data.map((item: { id: number; name: string }) => (
                      <MenuItem
                        key={item.id} // Use id as key
                        value={item.name} // Store only name as value
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

export default UpdatePermissionsForm;
