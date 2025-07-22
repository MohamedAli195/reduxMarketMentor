import { Box, Button, Stack, Typography } from '@mui/material';
import i18n from 'i18n';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import React from 'react';
import imgNotFound from './../../../public/images/No_Image_Available.jpg';
import { Navigate, useNavigate } from 'react-router-dom';
// import { ICompany } from 'interfaces';
import paths from 'routes/path';
import { DataGrid, GridColDef, GridRowClassNameParams } from '@mui/x-data-grid';
import { IBroker, IPackage, IPackage2, IPackageSelected, ITempPermissions } from 'interfaces';
import { checkPermissions, parsedData } from 'functions';
import SwitchStatus from 'components/Shared/switch';
import { useGetProfileQuery } from 'app/features/profileSlice/profileSlice';
import { useUpdateStatePackageMutation } from 'app/features/packages/packages';
import { useUpdateBrokerMutation } from 'app/features/brokers/brokers';
interface IProps {
  handleEditOpen: (val: IBroker) => void;
  handleOpend: () => void;
  setTempId: (val: number) => void;
  data: IBroker[];
}
function BrokersTable({ data, handleEditOpen, setTempId, handleOpend }: IProps) {
  const { data: profile } = useGetProfileQuery();
  const permissions = profile?.data.permissions;

  const navigate = useNavigate();
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID' },
    // {
    //   field: 'Link',
    //   headerName: i18n.language === 'ar' ? 'الرابط' : 'Link',
    //   flex: 1,
    //   renderCell: (params) => (i18n.language === 'ar' ? params.row.name.ar : params.row.name.en),
    // },
    { field: 'link', headerName: i18n.language === 'ar' ? 'الرابط' : 'link', flex: 1.5,},

    {
      field: 'image',
      headerName: i18n.language === 'ar' ? 'الصورة' : 'image',

      flex: 1,
      renderCell: (params) =>
        params.value ? (
          <img src={params.value} alt={params.row.name} style={{ width: '100%', height: 'auto' }} />
        ) : (
          <Typography variant="body2" color="textSecondary">
            No Image
          </Typography>
        ),
    },
    {
      field: 'actions',
      headerName: i18n.language === 'ar' ? 'العمليات' : 'actions',
      flex: 1.5,
      renderCell: (params) => (
        <Stack direction="row" gap={1}>
          {checkPermissions(permissions, 'delete-package') && (
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                handleOpend();
                setTempId(params.row.id);
              }}
            >
              {/* {t('delete')} */}
              <Trash2 />
            </Button>
          )}
          {checkPermissions(permissions, 'show-packages') && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`${paths.brokers}/${params.row.id}`)}
            >
              {/* {t('view')} */}
              <Eye />
            </Button>
          )}
          {checkPermissions(permissions, 'edit-package') && (
            <Button variant="contained" color="info" onClick={() => handleEditOpen(params.row)}>
              {/* {t('edit')} */}
              <Pencil />
            </Button>
          )}
        </Stack>
      ),
    },
  ];

  const rows =
    data?.length > 0
      ? data?.map((pack: IBroker) => ({
          ...pack,
        }))
      : [];
  return (
    <DataGrid
      rows={rows}
      columns={columns}
  sx={{
    border: 0,
    '& .MuiDataGrid-cell:hover': {
      textDecoration: 'none',
      color: 'inherit',
      backgroundColor: 'inherit', // إلغاء تغيير الخلفية عند الـ hover (اختياري)
      cursor: 'default',          // إلغاء ظهور شكل اللينك إذا كان يظهر
    },
  }}      autoHeight
      getRowHeight={() => 200} // Set each row's height to 200px
      getRowClassName={(params: GridRowClassNameParams) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? 'even-row' : 'odd-row'
      }
      disableRowSelectionOnClick
      disableMultipleRowSelection
      hideFooterPagination={true}
    />
  );
}

export default BrokersTable;
