import { Box, Button, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRowClassNameParams } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useQuery } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import BasicModal from 'components/Shared/modal/ShareModal';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import paths from 'routes/path';
import { useTranslation } from 'react-i18next';
import AddCustomer from 'components/Customers/addCustomer';
import UpdateCustomerForm from 'components/Customers/updateCustomer';
import { Eye, Trash2, Pencil } from 'lucide-react';
import PaginationComponent from 'components/Shared/pagination';

import SearchForm from 'components/Shared/searchForm';
import { ICustomer, IOrder } from 'interfaces';

import DeleteModal from 'components/deleteModal';
// import { fetchCustomers } from 'pages/customers/costumersFunct';
import UpdateOrderForm from 'components/updateOrderForm';
import { fetchAllData } from 'functions';
import SkeletonTables from 'components/Shared/skelton';
import SelectSort from 'components/Shared/selectSort';
import SelectPerPage from 'components/Shared/selectPerPAge';
import OrdersTable from './OrdersTable';


// Fetch packages function
interface IProps {
  isDashBoard:boolean
}
function OrdersPage({isDashBoard}:IProps) {
  const [page, setPage] = useState(1);
  const [per, setper] = useState(10);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('desc');
  const [typeFilter, setTypeFilter] = useState('course');
  const { t, i18n } = useTranslation();
  const [tempId, setTempId] = useState(1);
  // delete modal
  const [opend, setOpend] = useState(false);
  const handleOpend = () => setOpend(true);
  const handleClosed = () => setOpend(false);
  // states
  const navigate = useNavigate();
  // add modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  // update modal
  const [openU, setOpenU] = useState(false);
  const handleOpenU = () => setOpenU(true);
  const handleCloseU = () => setOpenU(false);
  // Define a state to store selected package data
  const [selectedPackage, setSelectedPackage] = useState<null | IOrder>(null);

  const handleEditOpen = (packageData: IOrder) => {
    setSelectedPackage(packageData); // Set selected package data
    handleOpenU(); // Open the update modal
  };

  // Fetch packages using React Query
  const { data, error, isLoading, isError, refetch } = useQuery({
    queryKey: [`orders-${page}-${per}-${search}-${sort}-${typeFilter}`],
    queryFn: () => fetchAllData(page, per, search, sort,typeFilter,'orders'),
  });

  // if (isLoading) return <SkeletonTables />;
  if (isError) return <p>Error: {error.message}</p>;


  const totalItems = data?.data?.total;
  return (
    <>

    {
      !isDashBoard &&<Stack
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      mb={3}
      height={''}
    >
      <Typography variant="h1" color="initial">
        {t('Orders')}
      </Typography>

    </Stack> 
    }
      

      <Paper sx={{ width: '100%' }}>

        {
          isDashBoard && <Typography variant="h1" color="initial" sx={{m:2}}>
         {t('Orders')}
        </Typography>
        }
        {
          !isDashBoard && <Stack flexDirection={'row'} alignItems={'center'}>
          <SelectSort data={['asc', 'desc']} setSortFun={setSort} sortVal={sort} />
          <SelectSort data={['course', 'package']} setSortFun={setTypeFilter} sortVal={typeFilter} />
            <SearchForm setsearch={setSearch} isDashBoard={isDashBoard}/>
          </Stack>
        }
        <OrdersTable
          data={data?.data?.data}
          handleEditOpen={handleEditOpen}
          handleOpend={handleOpend}
          setTempId={setTempId}
          isDashBoard={isDashBoard}
        />
        <Stack
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
          sx={{ marginTop: 2, mx: 2 }}
        >
          <PaginationComponent
            page={page}
            pageCounter={totalItems / per <= 1 ? 1 : Math.round(totalItems / per)}
            setPage={setPage}
          />
          <SelectPerPage perPage={per} setPerPage={setper} />
        </Stack>{' '}
      </Paper>

      {/* add modal */}
      <BasicModal open={open} handleClose={handleClose}>
        <h2>{t('Addcustomers')}</h2>

        <AddCustomer handleClose={handleClose} refetch={refetch} />
      </BasicModal>


      

      {/* update modal */}
      <BasicModal open={openU} handleClose={handleCloseU} isDeleteModal={true}>
        <h2>{t('UpdateOrderstatus')}</h2>
        <UpdateOrderForm
          handleClose={handleCloseU}
          initialData={selectedPackage}
          refetch={refetch}
        />
      </BasicModal>
      <Toaster position="bottom-center" reverseOrder={false} />
    </>
  );
}

export default OrdersPage;
