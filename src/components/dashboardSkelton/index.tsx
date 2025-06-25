import { Card, Box, Grid, Stack, Skeleton } from "@mui/material";

const SkeletonLoader = () => {
  return (
    <Stack direction="row" spacing={2}>
      {[...Array(4)].map((_, index) => (
        <Card
          key={index}
          sx={{
            flex: 1,
            borderRadius: 4,
            ...(index === 0 && { borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }),
            ...(index === 3 && { borderTopRightRadius: 8, borderBottomRightRadius: 8 }),
          }}
        >
          <Box sx={{ p: 4, flexGrow: 1 }}>
            <Grid container alignItems="center" spacing={1}>
              <Grid item xs={8}>
                <Box ml={0} lineHeight={1}>
                  <Skeleton variant="text" width={80} height={30} />
                  <Skeleton variant="text" width={120} height={20} sx={{ mb: 1 }} />
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Stack direction="row" justifyContent="flex-end" alignItems="center" ml="auto">
                  <Skeleton variant="circular" width={56} height={56} sx={{ bgcolor: "grey.300" }} />
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Card>
      ))}
    </Stack>
  );
};

export default SkeletonLoader;
