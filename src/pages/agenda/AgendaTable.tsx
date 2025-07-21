import React from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRowClassNameParams } from '@mui/x-data-grid';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import i18n from 'i18n';
import paths from 'routes/path';
import { IAgenda, ICategory } from 'interfaces';
import useAgendaTable from './useAgendaTable';


interface IProps {
  handleEditOpen: (val: IAgenda) => void;
  handleOpend: () => void;
  setTempId: (val: number) => void;
  data: IAgenda[];
}

function AgendaTable({ data, handleEditOpen, setTempId, handleOpend}: IProps) {
 
const {columns,navigate} = useAgendaTable({handleEditOpen, setTempId, handleOpend})
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

export default AgendaTable;
