import { Box, Button, FormHelperText, InputLabel, Stack, TextField } from '@mui/material';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useUpdateCouponMutation } from 'app/features/Coubons/Coubons';
import { ICoupon } from 'app/features/Coubons/Coubons';

export interface UpdateCouponFormValues {
  value: string;
  min_order_total: number | string;
  usage_limit: number | string;
  status: string;
  start_date: string;
  end_date: string;
}

function toDateOnly(dateStr: string): string {
  if (!dateStr) return '';
  return dateStr.slice(0, 10);
}

interface UpdateCouponFormProps {
  coupon: ICoupon;

  onClose: () => void;
}

export default function UpdateCouponForm({ coupon, onClose }: UpdateCouponFormProps) {
  const { t } = useTranslation();

  const [UpdateCoupon] = useUpdateCouponMutation();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<UpdateCouponFormValues>({
    defaultValues: {
      value: coupon.value ?? '',
      min_order_total: coupon.min_order_total ?? '',
      usage_limit: coupon.usage_limit ?? '',
      status: coupon.status ?? 'active',
      start_date: toDateOnly(coupon.start_date),
      end_date: toDateOnly(coupon.end_date),
    },
  });

  const onSubmit: SubmitHandler<UpdateCouponFormValues> = async (data) => {
    try {
      await UpdateCoupon({
        id: coupon.id,
        body: {
          value: data.value,
          min_order_total: Number(data.min_order_total) || 0,
          usage_limit: Number(data.usage_limit) || 0,
          status: data.status || 'active',
          start_date: data.start_date,
          end_date: data.end_date,
        },
      }).unwrap();
      toast.success(t('couponUpdated', { defaultValue: 'Coupon updated successfully' }));
      onClose();
    } catch {
      toast.error(t('couponUpdateError', { defaultValue: 'Failed to update coupon' }));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 2,
        }}
      >
        <TextField
          label={t('couponValue')}
          {...register('value', { required: true })}
          error={Boolean(errors.value)}
          helperText={errors.value ? t('required', { defaultValue: 'Required' }) : undefined}
          fullWidth
          size="small"
        />
        <TextField
          label={t('minOrder')}
          type="number"
          inputProps={{ min: 0, step: 1 }}
          {...register('min_order_total', { required: true })}
          error={Boolean(errors.min_order_total)}
          helperText={
            errors.min_order_total ? t('required', { defaultValue: 'Required' }) : undefined
          }
          fullWidth
          size="small"
        />
        <TextField
          label={t('usageLimit')}
          type="number"
          inputProps={{ min: 1, step: 1 }}
          {...register('usage_limit', { required: true })}
          error={Boolean(errors.usage_limit)}
          helperText={errors.usage_limit ? t('required', { defaultValue: 'Required' }) : undefined}
          fullWidth
          size="small"
        />
        <Controller
          name="status"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Box sx={{ minWidth: 0 }}>
              <InputLabel htmlFor="update-coupon-status" shrink sx={{ fontSize: 14, mb: 0.5 }}>
                {t('status')}
              </InputLabel>
              <select
                id="update-coupon-status"
                {...field}
                value={field.value ?? ''}
                onChange={(e) => field.onChange(e.target.value)}
                onBlur={field.onBlur}
                ref={field.ref}
                style={{
                  width: '100%',
                  height: 40,
                  padding: '8px 12px',
                  fontSize: 14,
                  borderRadius: 4,
                  border: '1px solid rgba(0, 0, 0, 0.23)',
                  backgroundColor: 'transparent',
                  boxSizing: 'border-box',
                }}
              >
                <option value="">{t('status')}</option>
                <option value="active">{t('Active')}</option>
                <option value="inactive">{t('Inactive')}</option>
              </select>
              {errors.status && (
                <FormHelperText error sx={{ mt: 0.5 }}>
                  {t('required', { defaultValue: 'Required' })}
                </FormHelperText>
              )}
            </Box>
          )}
        />
        <TextField
          label={t('startDate')}
          type="date"
          {...register('start_date', { required: true })}
          error={Boolean(errors.start_date)}
          helperText={errors.start_date ? t('required', { defaultValue: 'Required' }) : undefined}
          fullWidth
          size="small"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label={t('endDate')}
          type="date"
          {...register('end_date', { required: true })}
          error={Boolean(errors.end_date)}
          helperText={errors.end_date ? t('required', { defaultValue: 'Required' }) : undefined}
          fullWidth
          size="small"
          InputLabelProps={{ shrink: true }}
        />
      </Box>
      <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ pt: 2 }}>
        <Button type="button" onClick={onClose}>
          {t('cancel', { defaultValue: 'Cancel' })}
        </Button>
        <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
          {isSubmitting ? t('updating', { defaultValue: 'Updating…' }) : t('Update')}
        </Button>
      </Stack>
    </form>
  );
}
