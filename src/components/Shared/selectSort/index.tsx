import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { t } from 'i18next';

interface Iprops {
  sortVal: string;
  setSortFun: (val: string) => void;
  data:string[]
}
export default function SelectSort({ sortVal, setSortFun ,data}: Iprops) {
  const handleChange = (event: SelectChangeEvent) => {
    setSortFun(event.target.value);
  };

  return (
    <Box>
      <FormControl fullWidth sx={{display:"flex",flexDirection:"row", gap:2 ,justifyContent:"space-between",alignItems:"center"}}>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={`${sortVal}`}
          onChange={handleChange}
          sx={{
            '.MuiSelect-select': {
              lineHeight: 1.1, // Match default height for MUI TextField
              width: '100%',
            },
          }}
        >
          {data.map((item) => {
            return (
              <MenuItem key={item} value={item}>
                {
                item ==='asc' ? t("asc") : item ==='desc' ? t('desc') :
               item ==='course' ? t("course") :t('package')
               } 
               
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      
    </Box>
  );
}
