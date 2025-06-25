import React from 'react';
import { Box, Button, Stack } from '@mui/material';
import i18n from 'i18n';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import paths from 'routes/path';
import { DataGrid, GridColDef, GridRowClassNameParams } from '@mui/x-data-grid';
import { ISubADmin } from 'interfaces';
import SwitchStatus from 'components/Shared/switch';

interface IProps {
  handleEditOpen: (val: ISubADmin) => void;
  handleOpend: () => void;
  setTempId: (val: number) => void;
  data: ISubADmin[];
}

function SubAdminTable({ data, handleEditOpen, setTempId, handleOpend }: IProps) {
  const navigate = useNavigate();
  const isArabic = i18n.language === 'ar';

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: i18n.language === 'ar' ? 'الاسم' : 'Name', flex: 0.7, minWidth: 120 },
    { field: 'email', headerName: i18n.language === 'ar' ? 'الايميل' : 'Email', flex: 1.2, minWidth: 180 },
    {
      field: 'roles',
      headerName: i18n.language === 'ar' ? 'الصلاحيات' : 'Roles',
      flex: 1.5,
      minWidth: 180,
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 0.5,
            maxWidth: '100%',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
          }}
        >
          {params.row.role.map((item: string) => (
            <Box
              key={item}
              component="div"
              sx={{
                backgroundColor: '#dfdfdf',
                borderRadius: 1,
                px: 1,
                py: 0.5,
                fontSize: '0.85rem',
                whiteSpace: 'nowrap',
              }}
              title={item}
            >
              {item}
            </Box>
          ))}
        </Box>
      ),
    },
    {
      field: 'status',
      headerName: i18n.language === 'ar' ? 'الحالة' : 'Status',
      width: 130,
      renderCell: (params) => (
        <SwitchStatus id={params.row.id} url={'packages'} apiStatus={params.row.status} />
      ),
    },
    {
    field: 'actions',
          headerName: isArabic ? 'العمليات' : 'Actions',
          flex: 1.7,
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

          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => navigate(`${paths.subAdmins}/${params.row.id}`)}
          >
            <Eye size={16} />
          </Button>

          <Button variant="contained" color="info" size="small" onClick={() => handleEditOpen(params.row)}>
            <Pencil size={16} />
          </Button>
     </Box>
      ),
    },
  ];

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
      getRowHeight={() => 200} // ثبات ارتفاع الصف
      getRowClassName={(params: GridRowClassNameParams) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? 'even-row' : 'odd-row'
      }
      disableRowSelectionOnClick
      disableMultipleRowSelection
      hideFooterPagination
    />
  );
}

export default SubAdminTable;
