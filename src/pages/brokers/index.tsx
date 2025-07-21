import { Button, Stack, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IBroker, IPackage2, IPackageSelected } from 'interfaces';
import PaginationComponent from 'components/Shared/pagination';
import SearchForm from 'components/Shared/searchForm';
import { checkPermissions } from 'functions';
import BrokersTable from './BrokerTable';
import SelectSort from 'components/Shared/selectSort';
import SelectPerPage from 'components/Shared/selectPerPAge';
import Modals from './Modals';
import { useGetPackagesQuery } from 'app/features/packages/packages';
import { useGetProfileQuery } from 'app/features/profileSlice/profileSlice';
import { useGetBrokersQuery } from 'app/features/brokers/brokers';
// Fetch packages function
interface IProps {
  isDashBoard: boolean;
}
function BrokerPage({ isDashBoard }: IProps) {
  // states

  // const [globalState,setGlobalState]= useState<{page:number,search:string,sort:'desc'|'asc',per:number}>({
  //   page:1,
  //   search:'',
  //   sort:'desc',
  //   per:1
  // })
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('desc');
  const [perPage, setper] = useState(10);
  const [tempId, setTempId] = useState(1);
  const [tempIdUpdate, setTempIdUpdate] = useState<IBroker>();
  const { t } = useTranslation();

  const { data: packagesFromRTK, isLoading: isLoadingRTK } = useGetBrokersQuery({
    page,
    perPage,
    search,
    sort_direction: sort,
  });
  const { data: profile } = useGetProfileQuery();
  const permissions = profile?.data.permissions;

  const brokers = packagesFromRTK?.data || [];
  console.log(packagesFromRTK)
  // const totalItems = packagesFromRTK?.total || 0;
  // console.log(totalItems)
  // add modal

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // delete modal
  const [opend, setOpend] = useState(false);
  const handleOpend = () => setOpend(true);
  const handleClosed = () => setOpend(false);

  // update modal
  const [openU, setOpenU] = useState(false);
  const handleOpenU = () => setOpenU(true);
  const handleCloseU = () => setOpenU(false);
  // Define a state to store selected package data
  // const [selectedPackage, setSelectedPackage] = useState<null | IPackageSelected>(null);

  const handleEditOpen = (packageData: IBroker) => {
    setTempIdUpdate(packageData); // Set selected package data
    handleOpenU(); // Open the update modal
  };

  return (
    <>
      {!isDashBoard && (
        <Stack
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          mb={3}
          height={''}
        >
          <Typography variant="h1" color="initial">
            {t('brokers')}
          </Typography>

          {checkPermissions(permissions, 'add-package') && (
            <Button variant="contained" color="info" onClick={handleOpen}>
              {t('addBrokers')}
            </Button>
          )}
        </Stack>
      )}

      <Paper sx={{ width: '100%' }}>
        {isDashBoard && (
          <Typography variant="h1" color="initial">
            {t('brokers')}
          </Typography>
        )}
        <Stack flexDirection={'row'} alignItems={'center'}>
          <SelectSort data={['asc', 'desc']} setSortFun={setSort} sortVal={sort} />
          <SearchForm setsearch={setSearch} isDashBoard={isDashBoard} />
        </Stack>
        <BrokersTable
          data={brokers}
          handleEditOpen={handleEditOpen}
          handleOpend={handleOpend}
          setTempId={setTempId}
        />
        <Stack
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
          sx={{ marginTop: 2, mx: 2 }}
        >
          {/* <PaginationComponent
            page={page}
            pageCounter={totalItems / perPage <= 1 ? 1 : Math.ceil(totalItems / perPage)}
            setPage={setPage}
          /> */}
          <SelectPerPage perPage={perPage} setPerPage={setper} />
        </Stack>{' '}
      </Paper>

      {/* modals components collect all modal in one componnet */}
      <Modals
        tempId={tempId}
        handleClose={handleClose}
        handleCloseU={handleCloseU}
        handleClosed={handleClosed}
        open={open}
        openU={openU}
        opend={opend}
        tempIdUpdate={tempIdUpdate as IBroker}
      />
    </>
  );
}

export default BrokerPage;
