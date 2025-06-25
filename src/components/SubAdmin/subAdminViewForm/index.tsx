import { Box, Stack, TextField } from '@mui/material';
import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { styled, Theme } from '@mui/material/styles';
import {
  Skeleton,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  OutlinedInput,
} from '@mui/material';

import { CloudUpload } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllData, fetchOne } from 'functions';
import { ISubADmin } from 'interfaces';
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

interface IFormInput {
  name: string;
  email: string;
  password?: string | undefined;
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

function SubAdminViewForm({ initialData }: { initialData?: ISubADmin }) {
  const {
    register,
    setValue,

    control,
    formState: { errors },
  } = useForm<IFormInput>();

  const { t } = useTranslation();

  console.log(initialData);

  useEffect(() => {
    if (initialData) {
      setValue('name', initialData?.name);
      setValue('email', initialData.email);
      setValue('password', initialData?.password);
      setValue('roles', initialData?.role);
    }
  }, [initialData, setValue]);
  return (
    <Box
      sx={{
        mt: { sm: 5, xs: 2.5 },
      }}
      component="form"
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
                </Select>
              )}
            />
          </FormControl>
        </Stack>
      </Stack>
    </Box>
  );
}

export default SubAdminViewForm;
