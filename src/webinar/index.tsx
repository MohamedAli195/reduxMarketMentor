import { Button, Stack, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { FileSpreadsheet } from 'lucide-react';

import PaginationComponent from 'components/Shared/pagination';
import SearchForm from 'components/Shared/searchForm';
import SelectPerPage from 'components/Shared/selectPerPAge';
import SelectSort from 'components/Shared/selectSort';
import WebinarTable from './WebinarTable';



import {
  downloadWebinarRegistersExcel,
  type IWebinarRegisterRow,
} from 'helpers/exportWebinarRegistersExcel';
import { useGetWebinarRegistersQuery, useLazyGetWebinarRegistersAllQuery } from 'app/webinar/webinar';

const EXPORT_MAX_ROWS = 10_000;

interface IProps {
  isDashBoard: boolean;
}

function WebinarPage({ isDashBoard }: IProps) {
  const [page, setPage] = useState(1);
  const [per, setPer] = useState(10);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('desc');
  const [exporting, setExporting] = useState(false);

  const { t } = useTranslation();

  /** ✅ RTK Query بدل React Query */
  const {
    data,
    error,
    isError,
    isLoading,
  } = useGetWebinarRegistersQuery({
    page,
    perPage: per,
    search,
    sort_direction: sort,
  });

  /** ✅ Lazy Query للـ export */
  const [fetchAll] = useLazyGetWebinarRegistersAllQuery();

  if (isLoading) return <p>Loading...</p>;
  if (isError)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <p>Error: {(error as any)?.data?.message || 'Error'}</p>;

  const totalItems = data?.data?.total ?? 0;

  /** ✅ Export Excel */
  const handleExportExcel = async () => {
    if (totalItems === 0) {
      toast.error(t('exportExcelNoData'));
      return;
    }

    setExporting(true);

    try {
      const res = await fetchAll({
        search,
        sort_direction: sort,
      }).unwrap();

      const payload = res?.data as unknown;

      const rawRows: IWebinarRegisterRow[] = Array.isArray(payload)
        ? payload
        : payload &&
          typeof payload === 'object' &&
          'data' in payload &&
          Array.isArray((payload as { data: unknown }).data)
        ? (payload as { data: IWebinarRegisterRow[] }).data
        : [];

      const rows = rawRows.slice(0, EXPORT_MAX_ROWS);

      if (!rows.length) {
        toast.error(t('exportExcelNoData'));
        return;
      }

      downloadWebinarRegistersExcel(rows, {
        id: t('exportExcelId'),
        name: t('exportExcelName'),
        email: t('exportExcelEmail'),
        phone: t('exportExcelPhone'),
      });

      toast.success(t('exportExcelSuccess'));
    } catch {
      toast.error(t('exportExcelError'));
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      {!isDashBoard && (
        <Stack
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          mb={3}
        >
          <Typography variant="h1" color="initial">
            {t('webinar', { defaultValue: 'Webinar Registrations' })}
          </Typography>

          <Button
            variant="outlined"
            color="primary"
            startIcon={<FileSpreadsheet size={18} />}
            onClick={handleExportExcel}
            disabled={exporting || totalItems === 0}
          >
            {t('exportExcel')}
          </Button>
        </Stack>
      )}

      <Paper sx={{ width: '100%' }}>
        {isDashBoard && (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ m: 2, flexWrap: 'wrap', gap: 1 }}
          >
            <Typography variant="h1" color="initial">
              {t('webinar', { defaultValue: 'Webinar Registrations' })}
            </Typography>

            <Button
              variant="outlined"
              color="primary"
              size="small"
              startIcon={<FileSpreadsheet size={18} />}
              onClick={handleExportExcel}
              disabled={exporting || totalItems === 0}
            >
              {t('exportExcel')}
            </Button>
          </Stack>
        )}

        {!isDashBoard && (
          <Stack flexDirection="row" alignItems="center">
            <SelectSort
              data={['asc', 'desc']}
              setSortFun={setSort}
              sortVal={sort}
            />
            <SearchForm isDashBoard={isDashBoard} setsearch={setSearch} />
          </Stack>
        )}

        <WebinarTable data={data?.data?.data || []} />

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ marginTop: 2, mx: 2 }}
        >
          <PaginationComponent
            page={page}
            pageCounter={
              totalItems / per <= 1 ? 1 : Math.ceil(totalItems / per)
            }
            setPage={setPage}
          />

          <SelectPerPage perPage={per} setPerPage={setPer} />
        </Stack>
      </Paper>
    </>
  );
}

export default WebinarPage;