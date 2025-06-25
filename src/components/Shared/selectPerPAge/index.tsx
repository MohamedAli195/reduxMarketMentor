import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface Iprops {
  perPage: number;
  setPerPage: (val: number) => void;
}
export default function SelectPerPage({ perPage, setPerPage }: Iprops) {
  const handleChange = (event: SelectChangeEvent) => {
    setPerPage(+event.target.value);
  };

  return (
    <Box>
      <FormControl fullWidth sx={{display:"flex",flexDirection:"row", gap:2 ,justifyContent:"space-between",alignItems:"center"}}>
        <InputLabel id="demo-simple-select-label" sx={{ minWidth: 90 }}>Row Per Page</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={`${perPage}`}
          label="page Count"
          onChange={handleChange}
          sx={{
            '.MuiSelect-select': {
              lineHeight: 1.1, // Match default height for MUI TextField
              width: 'fit-content',
            },
          }}
        >
          {[10, 20, 30, 40, 50].map((item) => {
            return (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      
    </Box>
  );
}
