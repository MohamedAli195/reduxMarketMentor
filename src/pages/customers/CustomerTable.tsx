import React from 'react';
import { Box, Button, Stack } from '@mui/material';
import i18n from 'i18n';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import paths from 'routes/path';
import { DataGrid, GridColDef, GridRowClassNameParams } from '@mui/x-data-grid';
import { ICustomer } from 'interfaces';
import { checkPermissions, parsedData } from 'functions';

interface IProps {
  handleEditOpen: (val: ICustomer) => void;
  handleOpend: () => void;
  setTempId: (val: number) => void;
  data: ICustomer[];
  isDashBoard: boolean;
}

function CustomersTable({ data, handleEditOpen, setTempId, handleOpend, isDashBoard }: IProps) {
  const navigate = useNavigate();
  const isArabic = i18n.language === 'ar';

  const commonColumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    i18n.language === 'ar'
      ? { field: 'name', headerName: 'الاسم', flex: 1 }
      : { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: i18n.language === 'ar' ? 'الايميل' : 'Email', flex: 1.5 },
    { field: 'phone', headerName: i18n.language === 'ar' ? 'رقم الموبايل' : 'Phone', flex: 1 },
  ];

  const extraColumns: GridColDef[] = [
    {
      field: 'partner_code',
      headerName: i18n.language === 'ar' ? 'رقم الشريك' : 'Partner Code',
      flex: 1,
    },
    {
      field: 'actions',
      headerName: isArabic ? 'العمليات' : 'Actions',
      flex: 1.8,
      sortable: false,
      filterable: false,
      minWidth: 200,
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {checkPermissions(parsedData, 'delete-customer') && (
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => {
                handleOpend();
                setTempId(params.row.id);
              }}
            >
              <Trash2 size={16} />
            </Button>
          )}
          {checkPermissions(parsedData, 'show-customers') && (
            <Button
              variant="contained"
              color="info"
              size="small"
              onClick={() => navigate(`${paths.customers}/${params.row.id}`)}
            >
              <Eye size={16} />
            </Button>
          )}
          {checkPermissions(parsedData, 'edit-customer') && (
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => handleEditOpen(params.row)}
            >
              <Pencil size={16} />
            </Button>
          )}
        </Box>
      ),
    },
  ];

  // الأعمدة النهائية بناء على isDashBoard
  const columns = isDashBoard ? commonColumns : [...commonColumns, ...extraColumns];

  const rows = data?.length ? data : [];

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      sx={{
        border: 0,
        '& .MuiDataGrid-cell': {
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        '& .MuiDataGrid-cellContent': {
          overflow: 'visible',
        },
      }}
      autoHeight
      getRowHeight={() => (!isDashBoard ? 200 : 'auto')}
      getRowClassName={(params: GridRowClassNameParams) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? 'even-row' : 'odd-row'
      }
      disableRowSelectionOnClick
      disableMultipleRowSelection
      hideFooterPagination
    />
  );
}

export default CustomersTable;
