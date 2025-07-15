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
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { styled, useTheme, Theme } from '@mui/material/styles';
import { useCreateRecommendationMutation } from 'app/features/Recommendations/RecommendationsSlice';
import { useState } from 'react';

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

export interface IFormInputRecommendations {
  name: string;
  value: string;
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

function AddRecommendationsForm({ handleClose }: { handleClose: () => void }) {
  const { t } = useTranslation();
  const [rec, setRec] = useState<string[]>(['', '', '', '', '']);
  console.log(rec)
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputRecommendations>();
  const url = import.meta.env.VITE_API_URL;
  //   console.log(apiRoles.data.data)

  const [createRecommendation,{isLoading}] = useCreateRecommendationMutation();
  const onSubmit = async () => {
    try {

      const formData = new FormData();
      // formData.append('value', JSON.stringify(rec));
     const res = await createRecommendation({value:rec}).unwrap()
  
    console.log(res)
      toast.success(t('recommendations added successfully'));
      handleClose();
    } catch (err) {
        console.error(err);
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
        <Box>
          {[0, 1, 2, 3, 4].map((index) => (
            <TextField
              key={index}
              fullWidth
              variant="outlined"
              label={`Value ${index + 1}`}
              margin="normal"
              onChange={(e) => {
                setRec((prev) => {
                  const newRec = [...prev];
                  newRec[index] = e.target.value;
                  return newRec;
                });
              }}
            />
          ))}
        </Box>
      </Stack>

      <Button
        color="primary"
        variant="contained"
        size="large"
        fullWidth
        type="submit"
        sx={{ mt: 3, fontSize: '18px' }}
        onClick={onSubmit}
        disabled={isLoading}
      >
        {t('add-Recommendations')}
      </Button>
    </Box>
  );
}

export default AddRecommendationsForm;
