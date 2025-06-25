import { Box, Button, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRowClassNameParams } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useQuery } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import BasicModal from 'components/Shared/modal/ShareModal';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import paths from 'routes/path';
import AddCategoryForm from 'components/Category/addCategoryForm';
import UpdateCategoryForm from 'components/Category/updateCategoryForm/UpdateCategory';
import { useTranslation } from 'react-i18next';
import { ICategory, ISelectCategory } from 'interfaces';
import { Eye, Trash2, Pencil } from 'lucide-react';
import PaginationComponent from 'components/Shared/pagination';

import SearchForm from 'components/Shared/searchForm';

// import CustomDataGridFooter from 'components/common/table/CustomDataGridFooter';
import Lottie from "lottie-react";
import deleteAnimation from "./../../../src/components/animations/delete.json";
import DeleteModal from 'components/deleteModal';
import { checkPermissions, deleteAnyThing, fetchAllData, parsedData } from 'functions';

import CategoriesTable from './CategoriesTable';
import SkeletonTables from 'components/Shared/skelton';
import SelectSort from 'components/Shared/selectSort';
import SelectPerPage from 'components/Shared/selectPerPAge';
import { useDeleteCategoryMutation, useGetCategoriesQuery } from 'app/features/Categories/CategoriesSlice';

// Fetch packages function
interface IProps {
  isDashBoard:boolean
}
function CategoriesPage({isDashBoard}:IProps) {

  
  // states
  const [page, setPage] = useState(1);
  const [perPage, setper] = useState(10);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('desc');
  const { data: CategoriesFromRTK, error: errorRTk, isLoading:isLoadingRTK, isFetching, isSuccess } = 
  useGetCategoriesQuery({ page, perPage, search ,sort_direction: sort });

  const [deleteCategory] =useDeleteCategoryMutation()


  const categories = CategoriesFromRTK?.data?.data || [];
  const totalItems = CategoriesFromRTK?.data?.total || 0
console.log(totalItems)

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
  const [selectedCategory, setSelectedCategory] = useState<null | ICategory>(null);

  const handleEditOpen = (categoryData: ICategory) => {
    console.log(categoryData)
    setSelectedCategory(categoryData); // Set selected package data
    handleOpenU(); // Open the update modal
  };

  // Fetch packages using React Query
  const { data, error, isLoading, isError, refetch } = useQuery({
    queryKey: [`packages-${page}-${perPage}-${search}-${sort}`],
    queryFn: () => fetchAllData(page, perPage, search,sort,'','categories'),
  });

  // if (isLoading) return <SkeletonTables />
  if (isError) return <p>Error: {error.message}</p>;

 
      // const totalItems = data?.data?.total
  return (
    <>
   {!isDashBoard &&
      <Stack flexDirection="row" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h1" color="initial">
          {t('categories')}
        </Typography>

        {/* {
          checkPermissions(parsedData,'add-category') &&  */}
          <Button variant="contained" color="info" onClick={handleOpen}>
          {t('AddCategory')}
        </Button>
        {/* } */}

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
        <CategoriesTable
          data={categories}
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

        <AddCategoryForm handleClose={handleClose} refetch={refetch} />
      </BasicModal>

      <DeleteModal handleClosed={handleClosed}  opend={opend} refetch={refetch} tempId={tempId} deleteFunc={async()=>{await deleteCategory(tempId)}}/>
      {/* update modal */}
      <BasicModal open={openU} handleClose={handleCloseU}>
        <h2>{t('updateCategory')}</h2>
        <UpdateCategoryForm
          handleClose={handleCloseU}
          initialData={selectedCategory}
          refetch={refetch}
        />
      </BasicModal>
      <Toaster position="bottom-center" reverseOrder={false} />
    </>
  );
}

export default CategoriesPage;
