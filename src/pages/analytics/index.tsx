import {Button, Stack, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import { Toaster } from 'react-hot-toast';
import BasicModal from 'components/Shared/modal/ShareModal';
import { useState } from 'react';
import AddCategoryForm from 'components/Category/addCategoryForm';
import UpdateCategoryForm from 'components/Category/updateCategoryForm/UpdateCategory';
import { useTranslation } from 'react-i18next';
import { IAgenda, IAnalytics, ICategory, ISelectCategory } from 'interfaces';
import PaginationComponent from 'components/Shared/pagination';
import SearchForm from 'components/Shared/searchForm';
import DeleteModal from 'components/deleteModal';
import { checkPermissions } from 'functions';
import AnalyticsTable from './AnalyticsTable';
import SelectSort from 'components/Shared/selectSort';
import SelectPerPage from 'components/Shared/selectPerPAge';
import { useDeleteCategoryMutation, useGetCategoriesQuery } from 'app/features/Categories/CategoriesSlice';
import { useGetProfileQuery } from 'app/features/profileSlice/profileSlice';
import { useDeleteAgendaMutation, useGetAgendasQuery } from 'app/features/agenda/AgendaSlice';
import UpdateAgendaForm from 'components/agenda/UpdateAgendaForm/UpdateAgendaForm';
import AddAgendaForm from 'components/agenda/AddAgendaForm';
import { useDeleteAnalyticMutation, useGetAnalyticsQuery } from 'app/features/analytics/analyticsSlice';
import UpdateAnalyticsForm from 'components/analytics/UpdateAnalyticsForm/UpdateAnalyticsForm';
import AddAnalyticsForm from 'components/analytics/AddAnalyticsForm';

// Fetch packages function
interface IProps {
  isDashBoard:boolean
}
function AnalyticsPage({isDashBoard}:IProps) {

  
  // states
  const [page, setPage] = useState(1);
  const [perPage, setper] = useState(10);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('desc');
  const { data: CategoriesFromRTK,isError, error, isLoading:isLoadingRTK, isFetching, isSuccess } = 
  useGetAnalyticsQuery({ page, perPage, search ,sort_direction: sort });

  const [deleteAnalytic] =useDeleteAnalyticMutation()
    const {data} = useGetProfileQuery()
const permissions = data?.data.permissions

  const analytics = CategoriesFromRTK?.data?.data || [];
  const totalItems = CategoriesFromRTK?.data?.total || 0


  // console.log(search)
 
  const { t, i18n } = useTranslation();
  const [tempId, setTempId] = useState(1);

  // add modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // update modal
  const [openU, setOpenU] = useState(false);
  const handleOpenU = () => setOpenU(true);
  const handleCloseU = () => setOpenU(false);
      // delete modal
      const [opend, setOpend] = useState(false);
      const handleOpend = () => setOpend(true);
      const handleClosed = () => setOpend(false);
  // Define a state to store selected package data
  const [selectedCategory, setSelectedCategory] = useState<null | IAnalytics>(null);

  const handleEditOpen = (categoryData: IAnalytics) => {
    // console.log(categoryData)
    setSelectedCategory(categoryData); // Set selected package data
    handleOpenU(); // Open the update modal
  };

  return (
    <>
   {!isDashBoard &&
      <Stack flexDirection="row" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h1" color="initial">
          {t('analytics')}
        </Typography>

        {
          checkPermissions(permissions,'add-category') &&  
          <Button variant="contained" color="info" onClick={handleOpen}>
          {t('AddAnalytics')}
        </Button>
         } 

      </Stack>
}

      <Paper sx={{ width: '100%' }}>
      {isDashBoard &&
        <Typography variant="h1" color="initial" >
          {t('analytics')}
        </Typography>}
        <Stack flexDirection={'row'} alignItems={'center'}>
        <SelectSort data={['asc', 'desc']} setSortFun={setSort} sortVal={sort} />
        
          <SearchForm setsearch={setSearch} isDashBoard={isDashBoard} />
          
        </Stack>
        <AnalyticsTable
          data={analytics}
          handleEditOpen={handleEditOpen}
          handleOpend={handleOpend}
          setTempId={setTempId}
        />
        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} sx={{ marginTop: 2,mx:2}}>
          <PaginationComponent
            page={page}
            pageCounter={totalItems / perPage <= 1 ? 1 :  Math.ceil(totalItems / perPage)}
            setPage={setPage}
          />
          <SelectPerPage perPage={perPage} setPerPage={setper} />
        </Stack>
      </Paper>


      {/* add modal */}
      <BasicModal open={open} handleClose={handleClose}>
        <h2>{t('AddAnalytics')}</h2>

        <AddAnalyticsForm handleClose={handleClose} />
      </BasicModal>

      <DeleteModal handleClosed={handleClosed} module={t('Agenda')}  opend={opend} tempId={tempId} deleteFunc={async()=>{await deleteAnalytic(tempId)}}/>
      {/* update modal */}
      <BasicModal open={openU} handleClose={handleCloseU}>
        <h2>{t('updateAnalytics')}</h2>
        <UpdateAnalyticsForm
          handleClose={handleCloseU}
          initialData={selectedCategory}
      
        />
      </BasicModal>
      <Toaster position="bottom-center" reverseOrder={false} />
    </>
  );
}

export default AnalyticsPage;
