import { Box, Button, Stack, Typography, Paper } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import PaginationComponent from 'components/Shared/pagination';
import DeleteModal from 'components/deleteModal';
import SearchForm from 'components/Shared/searchForm';
import SelectPerPage from 'components/Shared/selectPerPAge';
import SelectSort from 'components/Shared/selectSort';
import LecturerTableContent from './LectuersTable';
import BasicModal from 'components/Shared/modal/ShareModal';
import UpdateLectuerForm from 'components/CourseLectuers/updateLectuerForm';
import useLeactuerTable from './useLeactuerTable';
import { useDeleteLectureMutation } from 'app/features/Lectuers/Lectuers';
import { useParams } from 'react-router-dom';


interface IProps {
  isDashBoard: boolean;
}

function LecturerTable({ isDashBoard }: IProps) {
   const {id} = useParams()
  const {
    sort,
    setSort,
    search,
    setSearch,
    tempId,
    setTempId,
    openU,
    handleCloseU,
    handleEditOpen,
    handleOpend,
    opend,
    handleClosed,
    selectedCategory,
    page,
    setPage,
    perPage,
    setper,
    lecters,
    isLoading,
    isError,
    totalItems
  } = useLeactuerTable(id)
    
  const [deleteLecture] =useDeleteLectureMutation()
  const { t } = useTranslation();
// console.log(selectedCategory)
  if (isLoading) {
    return <Typography>{t('Loading')}...</Typography>;
  }

  if (isError) {
    return <Typography color="error">{t('ErrorLoadingData')}</Typography>;
  }

  return (
    <>
      <Typography variant="h1">{t('CoursesTable')}</Typography>

      <Paper sx={{ width: '100%', mt: 2 }}>
        <Stack direction="row" alignItems="center" flexWrap="wrap" spacing={2} p={2}>
          <SelectSort data={['asc', 'desc']} setSortFun={setSort} sortVal={sort} />
          <SearchForm setsearch={setSearch} isDashBoard={isDashBoard} />
        </Stack>

        <LecturerTableContent
          data={lecters}
          handleEditOpen={handleEditOpen}
          handleOpend={handleOpend}
          setTempId={setTempId}
        />

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mt: 2, mx: 2 }}
        >
          <PaginationComponent
            page={page}
            pageCounter={Math.max(1, Math.ceil(totalItems / perPage))}
            setPage={setPage}
          />
          <SelectPerPage perPage={perPage} setPerPage={setper} />
        </Stack>
      </Paper>

      <BasicModal open={openU} handleClose={handleCloseU}>
        <Typography variant="h6" mb={2}>
          {t('updateCategory')}
        </Typography>
        <UpdateLectuerForm
          handleClose={handleCloseU}
          initialData={selectedCategory}

        />
      </BasicModal>

      <DeleteModal
        handleClosed={handleClosed}
        opend={opend}
        tempId={tempId}
        deleteFunc={() => deleteLecture(tempId)}
      />

      <Toaster position="bottom-center" reverseOrder={false} />
    </>
  );
}

export default LecturerTable;
