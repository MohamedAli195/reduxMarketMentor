import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Stack,
  TextField,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  OutlinedInput,
} from '@mui/material';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { styled, useTheme, Theme } from '@mui/material/styles';
import { errorType, IRole } from 'interfaces';
import { useUpdateRoleMutation } from 'app/features/Roles/roles';
import { useGetPermissionsQuery } from 'app/features/permissions/permissions';
import i18n from 'i18n';

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
  tempPermission,
}: {
  handleClose: () => void;
  tempPermission: IRole | undefined;
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [updateRole, { isLoading }] = useUpdateRoleMutation();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IFormInput>();

  const [personName, setPersonName] = useState<string[]>([]);
  console.log(personName)
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('desc');
  const [per, setPer] = useState(10);
  const id = tempPermission?.id;

  const { data: apiPermissions } = useGetPermissionsQuery();

  useEffect(() => {
    if (tempPermission) {
      setValue('name', tempPermission?.name);
      setValue('display_name.en', tempPermission?.display_name?.en);
      setValue('display_name.ar', tempPermission?.display_name?.ar);
      setValue('permissions', tempPermission?.permissions.map((perm) => perm.name) || []);
    }
  }, [tempPermission, setValue]);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const res = await updateRole({ id, data }).unwrap();

      if (res.code === 200) {
        toast.success('roles updated successfully');
      }
      handleClose();
    } catch (error: unknown) {
      const err = error as errorType;

      const errorMessages = err?.data?.errors
        ? Object.values(err.data.errors).flat().join('\n')
        : 'Failed to update roles, please check your input.';

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
                    apiPermissions.data.map((item) => (
                      <MenuItem
                        key={item.id} // Use id as key
                        value={item.name} // Store only name as value
                        style={getStyles(item.name, personName, theme)}
                      >
                        {i18n.language === 'ar' ? item.display_name.ar : item.display_name.en}
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
        disabled={isLoading}
      >
        {t('updatePermissions')}
      </Button>
    </Box>
  );
}

export default UpdatePermissionsForm;
