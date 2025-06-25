import { Avatar, Box, Stack, TextField, useTheme } from '@mui/material';
import { IPackage } from 'interfaces';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface IFormInput {
  name: string;
  value:string
}

function ViewRecommendationsForm({ initialData }: { initialData?: {name:string,value:string} }) {
  const { register, setValue } = useForm<IFormInput>();
  const theme = useTheme();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { t } = useTranslation();
  const inputs: {
    // name: string;
    id:string
    // value:string
    laberl:string
    InputName: 'name' | 'value';
  }[] = [
    { id: 'name', laberl: 'name', InputName: 'name' },
    { id: 'value', laberl: 'value', InputName: 'value' },
  ];

  useEffect(() => {
    if (initialData) {
      setValue('name', initialData.name);
      setValue('value', initialData.value);
    }
  }, [initialData, setValue, imageUrl]);

  return (
    <Box
      sx={{
        mt: { sm: 5, xs: 2.5 },
        width: '50%',
      }}
      component="form"
    >
      <Stack spacing={3}>
        {inputs.map((input) => {
          return (
            <TextField
              fullWidth
              variant="outlined"
              id={input.id}
              type="text"
              label={t(input.laberl)}
              sx={{ color: theme.palette.text.primary }}
              {...register(input.InputName)}
            />
          );
        })}

        {imageUrl && (
          <Avatar src={imageUrl} alt="Package Image" sx={{ width: '100%', height: '40vh' }} />
        )}
      </Stack>
    </Box>
  );
}

export default ViewRecommendationsForm;
