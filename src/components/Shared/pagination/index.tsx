import React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { Button } from '@mui/material';
import i18n from 'i18n';

interface IProps {
  pageCounter: number; // Total number of pages
  setPage: (newPage: number) => void; // Function to set the current page
  page: number; // Current page
}

const PaginationComponent: React.FC<IProps> = ({ page, pageCounter, setPage }) => {
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value); // Call the setPage function with the new page value
  };

  const handlePrevious = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < pageCounter) setPage(page + 1);
  };

  const buttonStyles = {
    m: 0,
    p: 0.5,
    lineHeight: 1.4,
    width: '100px', // Set a fixed width for both buttons
    textAlign: 'center',
  };

  return (
    <Stack
      
      direction="row"
      sx={{
        justifyContent: 'start',
        alignItems: 'center',
        width: '100%', // Ensure full width of container
      }}
    >
      <Button
        variant="contained"
        onClick={handlePrevious}
        disabled={page === 1}
        sx={buttonStyles}
      >
        {i18n.language === 'ar' ? 'السابق' : 'Previous'}
      </Button>

      <Pagination
        count={pageCounter}
        variant="outlined"
        shape="rounded"
        page={page}
        onChange={handlePageChange}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          m: 0,
          p: 0.5,
          
        }}
        
      />

      <Button
        variant="contained"
        onClick={handleNext}
        disabled={page === pageCounter}
        sx={buttonStyles}
      >
        {i18n.language === 'ar' ? 'التالى' : 'Next'}
      </Button>
    </Stack>
  );
};

export default PaginationComponent;
