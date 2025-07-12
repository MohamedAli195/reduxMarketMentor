import { Box, Button, Stack, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import { Toaster } from 'react-hot-toast';
import BasicModal from 'components/Shared/modal/ShareModal';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AddCustomer from 'components/Customers/addCustomer';
import UpdateCustomerForm from 'components/Customers/updateCustomer';
import { Eye, Trash2, Pencil } from 'lucide-react';
import PaginationComponent from 'components/Shared/pagination';
import SearchForm from 'components/Shared/searchForm';
import { ICustomer, IUser } from 'interfaces';
import DeleteModal from 'components/deleteModal';
import { checkPermissions } from 'functions';
import SelectSort from 'components/Shared/selectSort';
import SelectPerPage from 'components/Shared/selectPerPAge';
import CustomersTable from './CustomerTable';
import { useDeleteCustomerMutation, useGetCustomersQuery } from 'app/features/Users/usersSlice';
import { useGetProfileQuery } from 'app/features/profileSlice/profileSlice';


// Fetch packages function
interface IProps {
  isDashBoard:boolean
}
function CustomersPage({isDashBoard}:IProps) {
  const [page, setPage] = useState(1);
  const [perPage, setper] = useState(10);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('desc');

    const { data: CategoriesFromRTK, isLoading:isLoadingRTK, isFetching, isSuccess } = 
    useGetCustomersQuery({ page, perPage, search ,sort_direction: sort });
    const [deleteCustomer] =useDeleteCustomerMutation()
      const {data:profile} = useGetProfileQuery()
  const permissions = profile?.data.permissions
    const categories = CategoriesFromRTK?.data?.data || [];
    const totalItems = CategoriesFromRTK?.data?.total || 0
  const { t, i18n } = useTranslation();
  const [tempId, setTempId] = useState(1);
  // delete modal
  const [opend, setOpend] = useState(false);
  const handleOpend = () => setOpend(true);
  const handleClosed = () => setOpend(false);
  // states

  // add modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // update modal
  const [openU, setOpenU] = useState(false);
  const handleOpenU = () => setOpenU(true);
  const handleCloseU = () => setOpenU(false);
  // Define a state to store selected package data
  const [selectedPackage, setSelectedPackage] = useState<null | IUser>(null);

  const handleEditOpen = (packageData: IUser) => {
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
        {t('customers')}
      </Typography>

      {
        checkPermissions(permissions,'add-customer') && <Button variant="contained" color="info" onClick={handleOpen}>
        {t('Addcustomers')}
      </Button>
      }

    </Stack> 
    }
      

      <Paper sx={{ width: '100%' }}>

        {
          isDashBoard && <Typography variant="h1" color="initial" sx={{m:2}}>
          {t('customers')}
        </Typography>
        }
        {
          !isDashBoard && <Stack flexDirection={'row'} alignItems={'center'}>
          <SelectSort data={['asc', 'desc']} setSortFun={setSort} sortVal={sort} />
          
            <SearchForm setsearch={setSearch} isDashBoard={isDashBoard}/>
          </Stack>
        }
           <CustomersTable
          data={categories}
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
            pageCounter={totalItems / perPage <= 1 ? 1 :  Math.ceil(totalItems / perPage)}
            setPage={setPage}
          />
          <SelectPerPage perPage={perPage} setPerPage={setper} />
        </Stack>{' '}
      </Paper>

      {/* add modal */}
      <BasicModal open={open} handleClose={handleClose}>
        <h2>{t('Addcustomers')}</h2>

        <AddCustomer handleClose={handleClose} />
      </BasicModal>


          
      <DeleteModal handleClosed={handleClosed}  opend={opend} tempId={tempId} deleteFunc={async()=>{await deleteCustomer(tempId)}}/>


      {/* update modal */}
      <BasicModal open={openU} handleClose={handleCloseU}>
        <h2>{t('updateCustomer')}</h2>
        <UpdateCustomerForm
          handleClose={handleCloseU}
          initialData={selectedPackage}
    
        />
      </BasicModal>
      <Toaster position="bottom-center" reverseOrder={false} />
    </>
  );
}

export default CustomersPage;
