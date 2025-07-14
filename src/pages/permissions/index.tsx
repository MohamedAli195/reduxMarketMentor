import {  Button, Stack, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import { Toaster } from 'react-hot-toast';
import BasicModal from 'components/Shared/modal/ShareModal';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IRole, ITempPermissions } from 'interfaces';
import PaginationComponent from 'components/Shared/pagination';
import SearchForm from 'components/Shared/searchForm';
import DeleteModal from 'components/deleteModal';
import AddPermissinsForm from 'components/Permissions/addPermissions';
import UpdatePermissionsForm from 'components/Permissions/updatePrrmissionForm/UpdatePermissionsForm';
import PermissionsTable from './PermissionsTable';
import SkeletonTables from 'components/Shared/skelton';
import SelectSort from 'components/Shared/selectSort';
import SelectPerPage from 'components/Shared/selectPerPAge';
import { useDeleteRoleMutation, useGetRolesQuery } from 'app/features/Roles/roles';
import { useGetProfileQuery } from 'app/features/profileSlice/profileSlice';

// Fetch packages function
interface IProps {
  isDashBoard: boolean;
}
function PermissionsPage({ isDashBoard }: IProps) {
  // states
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('desc');
  const [perPage, setper] = useState(10);
  const [tempId, setTempId] = useState(1);
  const { t, i18n } = useTranslation();

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
  const [tempPermission, settempPermission] = useState<IRole | undefined>();

  const handleEditOpen = (packageData: IRole) => {
    settempPermission(packageData);
    handleOpenU(); // Open the update modalclg
  };
  const {data, error, isLoading, isError} = useGetRolesQuery({ page, perPage, search ,sort_direction: sort })

     const [deleteRole] =useDeleteRoleMutation()
      const {data:profile} = useGetProfileQuery()
  const permissions = profile?.data.permissions
  
    const roles = data?.data?.data || [];
    const totalItems = data?.data?.total || 0
  if (isLoading) return <SkeletonTables />;
  // if (isError) return <p>Error: {error}</p>;
  
  // console.log(totalItems)
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
            {t('Permissions')}
          </Typography>
          <Button variant="contained" color="info" onClick={handleOpen}>
            {t('addPermissions')}
          </Button>
        </Stack>
      )}

      <Stack flexDirection={'row'} alignItems={'center'}>
        <SelectSort data={['asc', 'desc']} setSortFun={setSort} sortVal={sort} />

        <SearchForm setsearch={setSearch} isDashBoard={isDashBoard} search={search} />
      </Stack>
      <Paper sx={{ width: '100%' }}>
        {isDashBoard && (
          <Typography variant="h1" color="initial">
            {t('permissions')}
          </Typography>
        )}
        <PermissionsTable
          data={roles}
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
        <AddPermissinsForm handleClose={handleClose} />
      </BasicModal>

      <DeleteModal
        handleClosed={handleClosed}
        opend={opend}
        tempId={tempId}
        module={t('Permission')}
        deleteFunc={() => {
          deleteRole(tempId);
        }}
      />

      {/* update modal */}
      <BasicModal open={openU} handleClose={handleCloseU}>
        <h2>{t('editPackage')}</h2>
        <UpdatePermissionsForm
          handleClose={handleCloseU}
          tempPermission={tempPermission}
        />
      </BasicModal>
      <Toaster position="bottom-center" reverseOrder={false} />
    </>
  );
}

export default PermissionsPage;
