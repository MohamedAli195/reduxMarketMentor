import { Box, Button, Stack, TextField } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { styled, useTheme, Theme } from '@mui/material/styles';
import { Chip, FormControl, InputLabel, MenuItem, Select, OutlinedInput } from '@mui/material';
import { useGetRolesQuery } from 'app/features/Roles/roles';
import { useGetSubAdminQuery, useUpdateSubAdminMutation } from 'app/features/subAdmins/subAdmins';
import { errorType } from 'interfaces';
// import { fetchPackage } from 'pages/packages/packagesFunct';

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

export interface IFormInputSubAdmin {
  name: string;
  email: string;
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

function UpdateSubAdminForm({ handleClose, id }: { handleClose: () => void; id: number }) {
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<IFormInputSubAdmin>();

  const theme = useTheme();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('desc');
  const [perPage, setPer] = useState(10);
  const url = import.meta.env.VITE_API_URL;
  const [updateSubAdmin,{isLoading:isLoadingUpdate}] = useUpdateSubAdminMutation();
  const {
    data: apiRoles,
    error: errorRoles,
    isLoading: isLoadingRoles,
    isError: isErrorRoles,
  } = useGetRolesQuery({ page, perPage, search, sort_direction: sort });
  console.log(apiRoles);
  const [personName, setPersonName] = useState<string[]>([]);
  const { data, error, isLoading, isError } = useGetSubAdminQuery(id);
  // const id = data?.data?.id
  useEffect(() => {
    if (data) {
      setValue('name', data?.data?.name);
      setValue('email', data?.data?.email);
      if (data?.data?.password) {
        setValue('password', data?.data?.password);
      }
      setValue('roles', data?.data?.role);
    }
  }, [data?.data, setValue]);

  const onSubmit: SubmitHandler<IFormInputSubAdmin> = async (data) => {
    try {
      const res = await updateSubAdmin({ id, data }).unwrap();
      if (res.code === 200) {
        toast.success('sub-admin updated successfully');
      }
      handleClose();
    } catch (error: unknown) {
      const err = error as errorType;
      console.log(err);
      const errorMessages = err?.data?.errors
        ? Object.values(err.data.errors).flat().join('\n')
        : 'Failed to updated sub-admin, please check your input.';

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
        <Stack flexDirection="column" gap={2}>
          <TextField
                      fullWidth
                      variant="outlined"
                      id="name"
                      type="text"
                      label={t('name')}
                      error={!!errors.name}
                      helperText={errors?.name?.message}
                      {...control.register('name', { required: t('NameReq') })}
                    />
                    <TextField
                      fullWidth
                      variant="outlined"
                      id="email"
                      type="text"
                      label={t('email')}
                      error={!!errors.email}
                      helperText={errors?.email?.message}
                      {...control.register('email', { required: t('emailReq') })}
                    />
          <TextField
            fullWidth
            variant="outlined"
            id="password"
            type="password"
            label={t('password')}
            {...control.register('password')}
          />
          <FormControl sx={{ m: 1, width: '100%' }}>
            <InputLabel id="permissions-label">{t('Permissions')}</InputLabel>
            <Controller
              name="roles"
              control={control}
              rules={{ required: t('roles') }}
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
                    apiRoles?.data?.data.map((item) => (
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
        disabled={isLoadingUpdate}
      >
        {t('editSubAdmin')}
      </Button>
    </Box>
  );
}

export default UpdateSubAdminForm;
