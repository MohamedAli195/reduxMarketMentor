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
import { ISubADmin } from 'interfaces';
import { Eye, Trash2, Pencil } from 'lucide-react';
import PaginationComponent from 'components/Shared/pagination';
import SearchForm from 'components/Shared/searchForm';
import DeleteModal from 'components/deleteModal';
import AddSubAdminForm from 'components/SubAdmin/addSubAdmin';
import UpdateSubAdminForm from 'components/SubAdmin/updateSubAdminForm';
import SkeletonTables from 'components/Shared/skelton';
import SelectSort from 'components/Shared/selectSort';
import SelectPerPage from 'components/Shared/selectPerPAge';
import SubAdminTable from './SubAdminTable';
import { useGetProfileQuery } from 'app/features/profileSlice/profileSlice';
import { useDeleteSubAdminMutation, useGetSubAdminsQuery } from 'app/features/subAdmins/subAdmins';

// Fetch packages function
interface IProps {
  isDashBoard: boolean;
}


function SubAdminsPage({ isDashBoard }: IProps) {
  // states
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('desc');
  const [perPage, setper] = useState(10);
  const { data,isError, error, isLoading:isLoadingRTK, isFetching, isSuccess } = 
  useGetSubAdminsQuery({ page, perPage, search ,sort_direction: sort });

  const [deleteSubAdmin] =useDeleteSubAdminMutation()
    const {data:profile} = useGetProfileQuery()
const permissions = profile?.data?.permissions
  // console.log(data)
  const subAdmins = data?.data?.data || [];
  const totalItems = data?.data?.total || 0






  const [tempId, setTempId] = useState(1);
  const [tempIdUpdate, setTempIdUpdate] = useState(1);
  const { t, i18n } = useTranslation();

  const navigate = useNavigate();
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
  // const [selectedPackage, setSelectedPackage] = useState<null | ISubADmin>(null);

  const handleEditOpen = (subAdmin: ISubADmin) => {
    setTempIdUpdate(subAdmin?.id); // Set selected package data
    handleOpenU(); // Open the update modal
  };

  // Columns configuration



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
            {t('Sub-Admins')}
          </Typography>
          <Button variant="contained" color="info" onClick={handleOpen}>
            {t('addSub-Admins')}
          </Button>
        </Stack>
      )}

      <Paper sx={{ width: '100%' }}>
        {isDashBoard && (
          <Typography variant="h1" color="initial">
            {t('Sub-Admins')}
          </Typography>
        )}
        <Stack flexDirection={'row'} alignItems={'center'}>
          <SelectSort data={['asc', 'desc']} setSortFun={setSort} sortVal={sort} />

          <SearchForm setsearch={setSearch} isDashBoard={isDashBoard} />
        </Stack>
        <SubAdminTable 
          data={subAdmins}
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
            pageCounter={totalItems / perPage <= 1 ? 1 : Math.ceil(totalItems / perPage)}
            setPage={setPage}
          />
          <SelectPerPage perPage={perPage} setPerPage={setper} />
        </Stack>{' '}
      </Paper>

      {/* add modal */}
      <BasicModal open={open} handleClose={handleClose}>
        <h2>{t('addPermissions')}</h2>
        <AddSubAdminForm handleClose={handleClose} />
      </BasicModal>

      <DeleteModal
        handleClosed={handleClosed}
        opend={opend}
        tempId={tempId}
        module={t('SubAdmin')}
        deleteFunc={async() => {
          deleteSubAdmin(tempId);
        }}
      />

      {/* update modal */}
      <BasicModal open={openU} handleClose={handleCloseU}>
        <h2>{t('editSubAdmin')}</h2>
        <UpdateSubAdminForm handleClose={handleCloseU} id={tempIdUpdate} />
      </BasicModal>
      <Toaster position="bottom-center" reverseOrder={false} />
    </>
  );
}

export default SubAdminsPage;
