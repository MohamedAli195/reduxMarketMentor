import { Button, Stack, Typography, Box } from '@mui/material';
import { DataGrid, GridColDef, GridRowClassNameParams } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useQuery } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import paths from 'routes/path';
import { useTranslation } from 'react-i18next';
import { ICourse, ICourseSelect, IFormInputCourses } from 'interfaces';
import { Eye, Trash2, Pencil } from 'lucide-react';
import PaginationComponent from 'components/Shared/pagination';

import SearchForm from 'components/Shared/searchForm';

import BasicModal from 'components/Shared/modal/ShareModal';

import DeleteModal from 'components/deleteModal';
import { checkPermissions, deleteAnyThing, fetchAllData, parsedData } from 'functions';

import AddCourseForm from 'components/Courses/AddCourseForm';
import SelectPerPage from 'components/Shared/selectPerPAge';
import SelectSort from 'components/Shared/selectSort';
import SkeletonTables from 'components/Shared/skelton';
import SwitchStatus from 'components/Shared/switch';
import CustomersTable from './CoursesTable';

// Fetch packages function
interface IProps {
  isDashBoard: boolean;
}
function CoursesPage({ isDashBoard }: IProps) {
  // states
  const [page, setPage] = useState(1);
  const [per, setper] = useState(10);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('desc');
  const [tempId, setTempId] = useState(1);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

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
  const [selectedCourse, setSelectedCourse] = useState<null | IFormInputCourses | undefined>(null);
  const handleEditOpen = (packageData: IFormInputCourses) => {
    setSelectedCourse(packageData); // Set selected package data
    handleOpenU(); // Open the update modal
  };
  // Columns configuration


  // Fetch packages using React Query
  const { data, error, isLoading, isError, refetch } = useQuery({
    queryKey: [`courses-${page}-${per}-${search}-${sort}`],
    queryFn: () => fetchAllData(page, per, search, sort, '', 'courses'),
  });

  // Prepare rows for DataGrid
  // if (isLoading) return <SkeletonTables />;
  if (isError) return <p>Error: {error.message}</p>;
  // console.log(data)
  const totalItems = data?.data?.total;
  return (
    <>
      {isDashBoard ? (
        ''
      ) : (
        <Stack
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          mb={3}
          height={''}
        >
          <Typography variant="h1" color="initial">
            {t('courses')}
          </Typography>

          {
            checkPermissions(parsedData,'add-course') &&  <Button variant="contained" color="info" onClick={() => handleOpen()}>
            {t('AddCourse')}
          </Button>
          }
         
        </Stack>
      )}

      <Paper sx={{ width: '100%' }}>
        {isDashBoard && (
          <Typography variant="h1" color="initial" sx={{ m: 2 }}>
            {t('courses')}
          </Typography>
        )}
        {!isDashBoard && (
          <Stack flexDirection={'row'} alignItems={'center'}>
            <SelectSort data={['asc', 'desc']} setSortFun={setSort} sortVal={sort} />

            <SearchForm isDashBoard={isDashBoard} setsearch={setSearch} />
          </Stack>
        )}

<CustomersTable
          data={data?.data?.data}
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
            pageCounter={totalItems / per <= 1 ? 1 : Math.ceil(totalItems / per)}
            setPage={setPage}
          />
          <SelectPerPage perPage={per} setPerPage={setper} />
        </Stack>
      </Paper>

      <DeleteModal
        handleClosed={handleClosed}
        opend={opend}
        refetch={refetch}
        tempId={tempId}
        deleteFunc={() => {
          deleteAnyThing(tempId, refetch, 'courses');
        }}
      />

       {/* add modal */}
       <BasicModal open={open} handleClose={handleClose}>
        <h2>{t('AddCourse')}</h2>
        <AddCourseForm handleClose={handleClose} refetch={refetch} />
      </BasicModal>
      <Toaster position="bottom-center" reverseOrder={false} />
    </>
  );
}

export default CoursesPage;
