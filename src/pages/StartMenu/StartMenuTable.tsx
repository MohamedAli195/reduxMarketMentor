import React from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRowClassNameParams } from '@mui/x-data-grid';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import i18n from 'i18n';
import paths from 'routes/path';
import { IAgenda, IAnalytics, ICategory, IStartMenu } from 'interfaces';
import useStartMenuTable from './useStartMenuTable';


interface IProps {
  handleEditOpen: (val: IStartMenu) => void;
  handleOpend: () => void;
  setTempId: (val: number) => void;
  data: IStartMenu[];
}

function StartMenuTable({ data, handleEditOpen, setTempId, handleOpend}: IProps) {
 
const {columns,navigate} = useStartMenuTable({handleEditOpen, setTempId, handleOpend})
  return (
    <DataGrid
      rows={data || []}
      columns={columns}
      sx={{ border: 0 }}
      autoHeight
      getRowHeight={() => 200}
      getRowClassName={(params: GridRowClassNameParams) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? 'even-row' : 'odd-row'
      }
      disableRowSelectionOnClick
      disableMultipleRowSelection
      hideFooterPagination
    />
  );
}

export default StartMenuTable;
