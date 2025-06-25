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
import { ICustomer } from 'interfaces';

import DeleteModal from 'components/deleteModal';
import { checkPermissions, deleteAnyThing, fetchAllData, parsedData } from 'functions';
import SkeletonTables from 'components/Shared/skelton';
import SelectSort from 'components/Shared/selectSort';
import SelectPerPage from 'components/Shared/selectPerPAge';
import CustomersTable from './CustomerTable';


// Fetch packages function
interface IProps {
  isDashBoard:boolean
}
function CustomersPage({isDashBoard}:IProps) {
  const [page, setPage] = useState(1);
  const [per, setper] = useState(10);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('desc');
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

  // update modal
  const [openU, setOpenU] = useState(false);
  const handleOpenU = () => setOpenU(true);
  const handleCloseU = () => setOpenU(false);
  // Define a state to store selected package data
  const [selectedPackage, setSelectedPackage] = useState<null | ICustomer>(null);

  const handleEditOpen = (packageData: ICustomer) => {
    setSelectedPackage(packageData); // Set selected package data
    handleOpenU(); // Open the update modal
  };

  // fetch from api
  // fetchCustomers();

  // Columns configuration


  // Pagination settings
  // const paginationModel = { page: 0, pageSize: 5 };

  // Fetch packages using React Query
  const { data, error, isLoading, isError, refetch } = useQuery({
    queryKey: [`customers-${page}-${per}-${search}-${sort}`],
    queryFn: () => fetchAllData(page, per, search, sort,'','customers'),
  });

  // if (isLoading) return <SkeletonTables />;
  if (isError) return <p>Error: {error.message}</p>;

  // Prepare rows for DataGrid
  // console.log(data.data?.total);
  const rows =
    data?.data?.data?.length > 0
      ? data?.data?.data?.map((packageItem: ICustomer) => ({
          id:packageItem.id,
          name: packageItem.name,
          email: packageItem.email,
          phone: packageItem.phone,
          partner_code: packageItem.partner_code,
        }))
      : [];
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
        {t('customers')}
      </Typography>

      {
        checkPermissions(parsedData,'add-customer') && <Button variant="contained" color="info" onClick={handleOpen}>
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
          data={data?.data?.data}
          handleEditOpen={handleEditOpen}
          handleOpend={handleOpend}
          setTempId={setTempId}
          isDashBoard={isDashBoard}
        />
        {/* <DataGrid
          rows={rows}
          columns={columns}
          // initialState={{ pagination: { paginationModel } }}
          // pageSizeOptions={[5, 10]}
          sx={{ border: 0 }}
          autoHeight
          // getRowHeight={() => !isDashBoard ? 200: 'auto'} 
          getRowClassName={(params: GridRowClassNameParams) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? 'even-row' : 'odd-row'
          }
          disableRowSelectionOnClick
          disableMultipleRowSelection
          hideFooterPagination={true}
        /> */}
        <Stack
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
          sx={{ marginTop: 2, mx: 2 }}
        >
          <PaginationComponent
            page={page}
            pageCounter={totalItems / per <= 1 ? 1 :  Math.ceil(totalItems / per)}
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


            {/* delete modal */}
            {/* <BasicModal open={opend} handleClose={handleClosed}>
      <Typography variant="h6" component="h2" gutterBottom>
          Delete
        </Typography>
        <Typography variant="body1" gutterBottom>
          Are you sure you want to delete this Customer?
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
          <Button variant="outlined" onClick={handleClosed}>
            Close
          </Button>
          <Button variant="contained" color="error" onClick={() => {
            
            deleteCustomer(tempId, refetch)
            handleClosed()
            
            }}>
            Delete 
          </Button>
        </Box>
       
      </BasicModal> */}
      <DeleteModal handleClosed={handleClosed}  opend={opend} refetch={refetch} tempId={tempId} deleteFunc={()=>{deleteAnyThing(tempId,refetch,'customers')}}/>


      {/* update modal */}
      <BasicModal open={openU} handleClose={handleCloseU}>
        <h2>{t('updateCustomer')}</h2>
        <UpdateCustomerForm
          handleClose={handleCloseU}
          initialData={selectedPackage}
          refetch={refetch}
        />
      </BasicModal>
      <Toaster position="bottom-center" reverseOrder={false} />
    </>
  );
}

export default CustomersPage;
