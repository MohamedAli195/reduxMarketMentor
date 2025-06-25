import { Stack, Skeleton } from '@mui/material';

import Paper from '@mui/material/Paper';

import { Toaster } from 'react-hot-toast';

function SkeletonTables() {

  return (
    <>
      <Stack flexDirection="row" alignItems="center" justifyContent="space-between" mb={3}>
        <Skeleton variant="text" width={150} height={30} />
        <Skeleton variant="rectangular" width={120} height={40} />
      </Stack>
      <Paper sx={{ width: '100%', p: 2, height: '200px' }}>
        <Stack flexDirection={'row'} alignItems={'center'} gap={2} mb={2}>
          <Skeleton variant="rectangular" width={100} height={40} />
          <Skeleton variant="rectangular" width={200} height={40} />
        </Stack>
        <Skeleton variant="rectangular" width="100%" height={400} />
        <Stack
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
          sx={{ marginTop: 2, mx: 2 }}
        >
          <Skeleton variant="rectangular" width={150} height={40} />
          <Skeleton variant="rectangular" width={100} height={40} />
        </Stack>
      </Paper>
      <Toaster position="bottom-center" reverseOrder={false} />
    </>
  );
}

export default SkeletonTables;
