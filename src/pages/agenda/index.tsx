import {Button, Stack, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import { Toaster } from 'react-hot-toast';
import BasicModal from 'components/Shared/modal/ShareModal';
import { useState } from 'react';
import AddCategoryForm from 'components/Category/addCategoryForm';
import UpdateCategoryForm from 'components/Category/updateCategoryForm/UpdateCategory';
import { useTranslation } from 'react-i18next';
import { IAgenda, ICategory, ISelectCategory } from 'interfaces';
import PaginationComponent from 'components/Shared/pagination';
import SearchForm from 'components/Shared/searchForm';
import DeleteModal from 'components/deleteModal';
import { checkPermissions } from 'functions';
import AgendaTable from './AgendaTable';
import SelectSort from 'components/Shared/selectSort';
import SelectPerPage from 'components/Shared/selectPerPAge';
import { useDeleteCategoryMutation, useGetCategoriesQuery } from 'app/features/Categories/CategoriesSlice';
import { useGetProfileQuery } from 'app/features/profileSlice/profileSlice';
import { useDeleteAgendaMutation, useGetAgendasQuery } from 'app/features/agenda/AgendaSlice';
import UpdateAgendaForm from 'components/agenda/UpdateAgendaForm/UpdateAgendaForm';
import AddAgendaForm from 'components/agenda/AddAgendaForm';

// Fetch packages function
interface IProps {
  isDashBoard:boolean
}
function AgendaPage({isDashBoard}:IProps) {

  
  // states
  const [page, setPage] = useState(1);
  const [perPage, setper] = useState(10);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('desc');
  const { data: CategoriesFromRTK,isError, error, isLoading:isLoadingRTK, isFetching, isSuccess } = 
  useGetAgendasQuery({ page, perPage, search ,sort_direction: sort });

  const [deleteAgenda] =useDeleteAgendaMutation()
    const {data} = useGetProfileQuery()
const permissions = data?.data.permissions

  const agendas = CategoriesFromRTK?.data?.data || [];
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
  const [selectedCategory, setSelectedCategory] = useState<null | IAgenda>(null);

  const handleEditOpen = (categoryData: IAgenda) => {
    // console.log(categoryData)
    setSelectedCategory(categoryData); // Set selected package data
    handleOpenU(); // Open the update modal
  };

  return (
    <>
   {!isDashBoard &&
      <Stack flexDirection="row" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h1" color="initial">
          {t('categories')}
        </Typography>

        {
          checkPermissions(permissions,'add-category') &&  
          <Button variant="contained" color="info" onClick={handleOpen}>
          {t('AddCategory')}
        </Button>
         } 

      </Stack>
}

      <Paper sx={{ width: '100%' }}>
      {isDashBoard &&
        <Typography variant="h1" color="initial" >
          {t('categories')}
        </Typography>}
        <Stack flexDirection={'row'} alignItems={'center'}>
        <SelectSort data={['asc', 'desc']} setSortFun={setSort} sortVal={sort} />
        
          <SearchForm setsearch={setSearch} isDashBoard={isDashBoard} />
          
        </Stack>
        <AgendaTable
          data={agendas}
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
        <h2>{t('AddCategory')}</h2>

        <AddAgendaForm handleClose={handleClose} />
      </BasicModal>

      <DeleteModal handleClosed={handleClosed} module={t('Agenda')}  opend={opend} tempId={tempId} deleteFunc={async()=>{await deleteAgenda(tempId)}}/>
      {/* update modal */}
      <BasicModal open={openU} handleClose={handleCloseU}>
        <h2>{t('updateCategory')}</h2>
        <UpdateAgendaForm
          handleClose={handleCloseU}
          initialData={selectedCategory}
      
        />
      </BasicModal>
      <Toaster position="bottom-center" reverseOrder={false} />
    </>
  );
}

export default AgendaPage;
