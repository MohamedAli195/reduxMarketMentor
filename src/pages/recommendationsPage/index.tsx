import { Box, Button, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRowClassNameParams } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useQuery } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import BasicModal from 'components/Shared/modal/ShareModal';

// import { fetchPackages } from './packagesFunct';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import { IPackageSelected, IREc } from 'interfaces';

import PaginationComponent from 'components/Shared/pagination';

import SearchForm from 'components/Shared/searchForm';

import DeleteModal from 'components/deleteModal';
import { deleteAnyThing, fetchAllData } from 'functions';
;
import AddRecommendationsForm from 'components/Recommendations/addRecommendations';
import UpdateRecommendationsForm from 'components/Recommendations/updaterecommendations';
import SwitchStatus from 'components/Shared/switch';
import SkeletonTables from 'components/Shared/skelton';
import SelectSort from 'components/Shared/selectSort';
import SelectPerPage from 'components/Shared/selectPerPAge';
import RecommendationsTable from './RecommendationsTable';
import { useDeleteRecommendationMutation, useGetRecommendationsQuery } from 'app/features/Recommendations/RecommendationsSlice';
import { useGetProfileQuery } from 'app/features/profileSlice/profileSlice';


// Fetch packages function
interface IProps {
  isDashBoard:boolean
}
function RecommendationsPage({isDashBoard}:IProps) {
  // states
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('desc');
  const [perPage, setper] = useState(10);


    const { data,isError, error, isLoading:isLoadingRTK, isFetching, isSuccess } = 
    useGetRecommendationsQuery({ page, perPage, search ,sort_direction: sort });
  
    const [deleteRecommendation] =useDeleteRecommendationMutation()
      const {data:profile} = useGetProfileQuery()
  const permissions = profile?.data.permissions
  
    const recommendations = data?.data?.data || [];
    const totalItems = data?.data?.total || 0
  const [tempId, setTempId] = useState(1);
  const [tempIdUpdate, setTempIdUpdate] = useState(1);
  const { t, i18n } = useTranslation();

  const navigate = useNavigate();
  // add modal
  const [open, setOpen] = useState(false);
  const [tempRecommandation, setTempRecommandation] = useState<IREc>({
    id:0,
    name:'',
    value:'',
    status:''
  });
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
  const [selectedPackage, setSelectedPackage] = useState<null | IPackageSelected>(null);

  const handleEditOpen = (recData: IREc) => {
    setTempIdUpdate(recData.id); // Set selected package data

    setTempRecommandation(recData)
    handleOpenU(); // Open the update modal
  };

  // Columns configuration



  return (
    <>
    {
      !isDashBoard && <Stack
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      mb={3}
      height={''}
    >
      <Typography variant="h1" color="initial">
        {t('Recommendations')}
      </Typography>
      <Button variant="contained" color="info" onClick={handleOpen}>
        {t('add-Recommendations')}
      </Button>
    </Stack>
    }
      

      <Paper sx={{ width: '100%' }}>
        {
          isDashBoard && <Typography variant="h1" color="initial">
          {t('Sub-Admins')}
        </Typography>
        }
        <Stack flexDirection={'row'} alignItems={'center'}>
        <SelectSort data={['asc', 'desc']} setSortFun={setSort} sortVal={sort} />
        
          <SearchForm setsearch={setSearch} isDashBoard={isDashBoard} />
          
        </Stack>
        <RecommendationsTable 
          data={recommendations}
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
        <h2>{t('add-Recommendations')}</h2>
        <AddRecommendationsForm handleClose={handleClose} />
      </BasicModal>

      <DeleteModal handleClosed={handleClosed}  opend={opend}  tempId={tempId} deleteFunc={async()=>{ await deleteRecommendation(tempId)}}/>

      {/* update modal */}
      <BasicModal open={openU} handleClose={handleCloseU}>
        <h2>{t('editPackage')}</h2>
        <UpdateRecommendationsForm
        redData={tempRecommandation}
          handleClose={handleCloseU}

        />
      </BasicModal>
      <Toaster position="bottom-center" reverseOrder={false} />
    </>
  );
}

export default RecommendationsPage;
