import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import { Pencil, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

import PaginationComponent from 'components/Shared/pagination';
import SelectPerPage from 'components/Shared/selectPerPAge';
import SkeletonTables from 'components/Shared/skelton';

import DeleteModal from 'components/deleteModal';

import dayjs from 'dayjs';

import RadixDialog from 'components/Shared/RadixDialog';
import { ICoupon, useDeleteCouponMutation, useGetCouponsQuery } from 'app/features/Coubons/Coubons';
import UpdateCouponForm from './UpdateCouponForm';
import AddCouponForm from './AddCouponForm';
import { useDispatch } from 'react-redux';
import { handleLogout } from 'app/services/handleLogout';


function CouponsPage() {
  const { t } = useTranslation();
const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [per, setPer] = useState(10);
  const [addOpen, setAddOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<ICoupon | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [couponIdToDelete, setCouponIdToDelete] = useState<number | null>(null);

  /** ✅ RTK Query */
  const { data, isLoading, isError, error ,refetch } = useGetCouponsQuery({
    page,
    perPage: per,
  });

  const [deleteCoupon] = useDeleteCouponMutation();

  if (isLoading) return <SkeletonTables />;
  if (isError)
    return (
  
      <Typography color="error">
       
        Error: { 
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any)?.data?.message || 'Error'}
      </Typography>
    );

  const coupons: ICoupon[] = data?.data?.data ?? [];
  const total = data?.data?.total ?? 0;
  const lastPage = data?.data?.lastPage ?? 1;
//     useEffect(() => {
//   if (error?.status_code === 401) {
//     handleLogout(dispatch);
//   }
// }, [error]);
  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
      >
        <Typography variant="h1" color="initial">
          {t('coupons')}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={() => setAddOpen(true)}
        >
          {t('addCoupon', { defaultValue: 'Add coupon' })}
        </Button>
      </Stack>

      {/* ✅ Add */}
      <RadixDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        title={t('addCoupon')}
        description={t('addCouponDescription')}
      >
        <AddCouponForm onClose={() => setAddOpen(false)} />
      </RadixDialog>

      {/* ✅ Update */}
      <RadixDialog
        open={editingCoupon != null}
        onOpenChange={(open) => !open && setEditingCoupon(null)}
        title={t('updateCoupon')}
        description={
          editingCoupon ? `${t('couponCode')}: ${editingCoupon.code}` : ''
        }
      >
        {editingCoupon && (
          <UpdateCouponForm
           
            coupon={editingCoupon}
            onClose={() => setEditingCoupon(null)}
          />
        )}
      </RadixDialog>

      {/* ✅ Delete */}
      <DeleteModal
        opend={deleteOpen}
        handleClosed={() => {
          setDeleteOpen(false);
          setCouponIdToDelete(null);
        }}
        tempId={couponIdToDelete ?? 0}
        deleteFunc={async (id: number) => {
          try {
            await deleteCoupon(id).unwrap();
          } catch (err) {
            console.error(err);
          }
        }}
      />

      {/* ✅ Cards */}
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
          },
        }}
      >
        {coupons.map((coupon) => (
          <CouponCard
            key={coupon.id}
            coupon={coupon}
            t={t}
            onEdit={() => setEditingCoupon(coupon)}
            onDelete={() => {
              setCouponIdToDelete(coupon.id);
              setDeleteOpen(true);
            }}
          />
        ))}
      </Box>

      {coupons.length === 0 && (
        <Box sx={{ py: 6, textAlign: 'center' }}>
          <Typography color="text.secondary">
            {t('noData', { defaultValue: 'No coupons found' })}
          </Typography>
        </Box>
      )}

      {total > 0 && (
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ marginTop: 3 }}
        >
          <PaginationComponent
            page={page}
            pageCounter={lastPage <= 1 ? 1 : lastPage}
            setPage={setPage}
          />
          <SelectPerPage perPage={per} setPerPage={setPer} />
        </Stack>
      )}
    </>
  );
}

/** 🔹 Card */
function CouponCard({
  coupon,
  t,
  onEdit,
  onDelete,
}: {
  coupon: ICoupon;
  t: TFunction;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const isActive = coupon.status === 'active';
  const formatDate = (d: string) => dayjs(d).format('MMM D, YYYY');

  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        '&:hover': {
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          borderColor: 'primary.light',
        },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Typography
          variant="h6"
          sx={{
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: 1,
            color: 'primary.main',
          }}
        >
          {coupon.code}
        </Typography>

        <Stack direction="row" spacing={1}>
          <Button size="small" onClick={onEdit}>
            <Pencil size={16} />
          </Button>
          <Button size="small" color="error" onClick={onDelete}>
            <Trash2 size={16} />
          </Button>

          <Chip
            label={isActive ? t('Active') : t('Inactive')}
            size="small"
            color={isActive ? 'success' : 'default'}
          />
        </Stack>
      </Stack>

      <Stack spacing={1.5}>
        <Row label={t('couponValue')} value={`${coupon.value}`} />
        <Row label={t('minOrder')} value={coupon.min_order_total} />
        <Row
          label={t('usedCount')}
          value={`${coupon.used_count} / ${coupon.usage_limit}`}
        />
        <Row label={t('startDate')} value={formatDate(coupon.start_date)} />
        <Row label={t('endDate')} value={formatDate(coupon.end_date)} />
        {coupon.createdBy && (
          <Row label={t('createdBy')} value={coupon.createdBy.name} />
        )}
      </Stack>
    </Box>
  );
}

/** 🔹 Row */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Row({ label, value }: { label: string; value: any }) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="baseline"
      flexWrap="wrap"
    >
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600}>
        {value}
      </Typography>
    </Stack>
  );
}

export default CouponsPage;