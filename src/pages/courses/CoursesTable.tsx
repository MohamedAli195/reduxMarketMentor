import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import i18n from 'i18n';
import paths from 'routes/path';
import SwitchStatus from 'components/Shared/switch';
import { checkPermissions, parsedData } from 'functions';
import { IFormInputCourses } from 'interfaces';

interface IProps {
  handleEditOpen: (val: IFormInputCourses) => void;
  handleOpend: () => void;
  setTempId: (val: number) => void;
  data: IFormInputCourses[];
  isDashBoard: boolean;
}

const CustomersTable = ({ data, handleEditOpen, handleOpend, setTempId, isDashBoard }: IProps) => {
  const navigate = useNavigate();
  const isArabic = i18n.language === 'ar';

  const columns: GridColDef[] = isDashBoard
    ? [
        { field: 'id', headerName: 'ID', width: 30, headerAlign: isArabic ? 'right' : 'left' },
        {
          field: 'name',
          headerName: isArabic ? 'الاسم' : 'Name',
          flex: 1,
          headerAlign: isArabic ? 'right' : 'left',
          renderCell: (params) => (isArabic ? params.row.name.ar : params.row.name.en),
        },
        {
          field: 'price',
          headerName: isArabic ? 'السعر' : 'Price',
          flex: 1.5,
          width: 150,
          headerAlign: isArabic ? 'right' : 'left', //
        },
        {
          field: 'category',
          headerName: isArabic ? 'القسم' : 'Category',
          flex: 1,
          headerAlign: isArabic ? 'right' : 'left',
          renderCell: (params) =>
            isArabic ? params.row.category.name.ar : params.row.category.name.en,
        },
      ]
    : [
        { field: 'id', headerAlign: isArabic ? 'right' : 'left', headerName: 'ID', width: 50 },
        {
          field: 'name',
          headerAlign: isArabic ? 'right' : 'left',
          headerName: isArabic ? 'الاسم' : 'Name',
          flex: 2,
          
          renderCell: (params) => (isArabic ? params.row.name.ar : params.row.name.en),
        },
        {
          field: 'price',
          headerName: isArabic ? 'السعر' : 'Price',
          flex: 1,
          headerAlign: isArabic ? 'right' : 'left',
        },
        {
          field: 'category',
          headerAlign: isArabic ? 'right' : 'left',
          headerName: isArabic ? 'القسم' : 'Category',
          flex: 1.5,
          renderCell: (params) =>
            isArabic ? params.row.category.name.ar : params.row.category.name.en,
        },
        {
          field: 'image',
          headerAlign: isArabic ? 'right' : 'left',
          headerName: isArabic ? 'الصورة' : 'Image',
          flex: 1.5,
          renderCell: (params) =>
            params.value ? (
              <img
                src={params.value}
                alt={params.row.name?.en || ''}
                style={{ width: '100%', height: 'auto', maxHeight: 150, objectFit: 'contain' }}
              />
            ) : (
              <Typography variant="body2" color="textSecondary">
                No Image
              </Typography>
            ),
        },
        {
          field: 'status',
          headerName: isArabic ? 'الحالة' : 'Status',
          renderCell: (params) => (
            <SwitchStatus id={params.row.id} url="courses" apiStatus={params.row.status} />
          ),
        },
        {
          field: 'actions',
          headerName: isArabic ? 'العمليات' : 'Actions',
          flex: 3,
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
              {checkPermissions(parsedData, 'delete-course') && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    handleOpend();
                    setTempId(params.row.id);
                  }}
                >
                  <Trash2 />
                </Button>
              )}
              {checkPermissions(parsedData, 'show-courses') && (
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => navigate(`${paths.courses}/${params.row.id}`)}
                >
                  <Eye />
                </Button>
              )}
              {checkPermissions(parsedData, 'edit-course') && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate(`${paths.courses}/update/${params.row.id}`)}
                >
                  <Pencil />
                </Button>
              )}
            </Box>
          ),
        },
      ];

  const rows = data?.map((course) => ({ ...course })) || [];

  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        autoHeight
        getRowHeight={() => (!isDashBoard ? 200 : 'auto')}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? 'even-row' : 'odd-row'
        }
        disableRowSelectionOnClick
        disableMultipleRowSelection
        hideFooterPagination
        sx={{
          border: 0,
          minWidth: 600,
          '& .MuiDataGrid-row': {
            alignItems: 'start',
          },
          '& .MuiDataGrid-cell': {
            wordWrap: 'break-word',
            whiteSpace: 'normal',
            lineHeight: 1.5,
          },
        }}
      />
    </Box>
  );
};

export default CustomersTable;
