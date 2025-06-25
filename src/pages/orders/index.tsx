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
import { useGetOrdersQuery } from 'app/features/Orders/ordersSlice';
import { useGetProfileQuery } from 'app/features/profileSlice/profileSlice';


// Fetch packages function
interface IProps {
  isDashBoard:boolean
}
function OrdersPage({isDashBoard}:IProps) {
  const [page, setPage] = useState(1);
  const [perPage, setper] = useState(10);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('desc');
  const [typeFilter, setTypeFilter] = useState('course');

    const { data: CategoriesFromRTK,isError, error, isLoading:isLoadingRTK, isFetching, isSuccess } = 
    useGetOrdersQuery({ page, perPage, search ,sort_direction: sort });
  
      const {data} = useGetProfileQuery()
  const permissions = data?.data.permissions
  
    const orders = CategoriesFromRTK?.data?.data || [];
    const totalItems = CategoriesFromRTK?.data?.total || 0
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
          data={orders}
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
            pageCounter={totalItems / perPage <= 1 ? 1 : Math.round(totalItems / perPage)}
            setPage={setPage}
          />
          <SelectPerPage perPage={perPage} setPerPage={setper} />
        </Stack>{' '}
      </Paper>

      {/* add modal */}



      

      {/* update modal */}
      <BasicModal open={openU} handleClose={handleCloseU} isDeleteModal={true}>
        <h2>{t('UpdateOrderstatus')}</h2>
        <UpdateOrderForm
          handleClose={handleCloseU}
          initialData={selectedPackage}
        />
      </BasicModal>
      <Toaster position="bottom-center" reverseOrder={false} />
    </>
  );
}

export default OrdersPage;
