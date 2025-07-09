import { Button, Stack, Typography, Box } from '@mui/material';
import Paper from '@mui/material/Paper';
import { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ICourse  } from 'interfaces';
import PaginationComponent from 'components/Shared/pagination';
import SearchForm from 'components/Shared/searchForm';
import BasicModal from 'components/Shared/modal/ShareModal';
import DeleteModal from 'components/deleteModal';
import { checkPermissions } from 'functions';
import AddCourseForm from 'components/Courses/AddCourseForm';
import SelectPerPage from 'components/Shared/selectPerPAge';
import SelectSort from 'components/Shared/selectSort';
import CustomersTable from './CoursesTable';
import { useGetProfileQuery } from 'app/features/profileSlice/profileSlice';
import { useDeleteCourseMutation, useGetCoursesQuery } from 'app/features/Courses/coursesSlice';
import UpdateCourse from './Update';

// Fetch packages function
interface IProps {
  isDashBoard: boolean;
}
function CoursesPage({ isDashBoard }: IProps) {
  // states
  const [page, setPage] = useState(1);
  const [perPage, setper] = useState(10);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('desc');
  const [tempId, setTempId] = useState(1);

  const { data,isError, error, isLoading:isLoadingRTK, isFetching, isSuccess } = 
  useGetCoursesQuery({ page, perPage, search ,sort_direction: sort });
console.log(data)
  const [deleteCourse] =useDeleteCourseMutation()
    const {data:profile} = useGetProfileQuery()
const permissions = profile?.data.permissions

  const courses = data?.data?.data || [];
  const totalItems = data?.data?.total || 0



  const { t, i18n } = useTranslation();

    // add modal
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
  // update modal
  const [openUp, setOpenUp] = useState(false);
  const handleOpenUp = () => setOpenUp(true);
  const handleCloseUp = () => setOpenUp(false);
  // delete modal
  const [opend, setOpend] = useState(false);
  const handleOpend = () => setOpend(true);
  const handleClosed = () => setOpend(false);
  // Define a state to store selected package data
  const [selectedCourse, setSelectedCourse] = useState<ICourse | undefined>();
  const handleEditOpen = (packageData: ICourse) => {
    setSelectedCourse(packageData); // Set selected package data
    handleOpenUp(); // Open the update modal
  };
  // Columns configuration


  // // Fetch packages using React Query
  // const { data, error, isLoading, isError, refetch } = useQuery({
  //   queryKey: [`courses-${page}-${per}-${search}-${sort}`],
  //   queryFn: () => fetchAllData(page, per, search, sort, '', 'courses'),
  // });

  // // Prepare rows for DataGrid
  // // if (isLoading) return <SkeletonTables />;
  // if (isError) return <p>Error: {error.message}</p>;
  // // console.log(data)
  // const totalItems = data?.data?.total;
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
            checkPermissions(permissions,'add-course') &&  <Button variant="contained" color="info" onClick={() => handleOpen()}>
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
          data={courses}
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
            pageCounter={totalItems / perPage <= 1 ? 1 : Math.ceil(totalItems / perPage)}
            setPage={setPage}
          />
          <SelectPerPage perPage={perPage} setPerPage={setper} />
        </Stack>
      </Paper>

      <DeleteModal
        handleClosed={handleClosed}
        opend={opend}
        tempId={tempId}
        deleteFunc={() => {
          deleteCourse(tempId);
        }}
      />

       {/* add modal */}
       <BasicModal open={open} handleClose={handleClose}>
        <h2>{t('AddCourse')}</h2>
        <AddCourseForm handleClose={handleClose} />
      </BasicModal>

             {/* update modal */}
       <BasicModal open={openUp} handleClose={handleCloseUp}>
        <h2>{t('updateCourse')}</h2>
        <UpdateCourse  course={selectedCourse}  handleCloseUp={handleCloseUp}/>
      </BasicModal>
      <Toaster position="bottom-center" reverseOrder={false} />
    </>
  );
}

export default CoursesPage;
