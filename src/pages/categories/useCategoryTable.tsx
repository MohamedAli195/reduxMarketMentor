import React from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRowClassNameParams } from '@mui/x-data-grid';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import i18n from 'i18n';
import paths from 'routes/path';
import { ICategory } from 'interfaces';
import { checkPermissions, parsedData } from 'functions';
import imgNotFound from './../../../public/images/No_Image_Available.jpg';
import { useSelector } from 'react-redux';
import { RootState } from 'app/store';

interface IProps {
  handleEditOpen: (val: ICategory) => void;
  handleOpend: () => void;
  setTempId: (val: number) => void;

}
const useCategoryTable = ({handleEditOpen, setTempId, handleOpend}:IProps) => {
     const navigate = useNavigate();
      // const permissions = useSelector(((state:RootState)=>state.auth.authData.user?.permissions))
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID' },
    {
      field: 'name',
      headerName: i18n.language === 'ar' ? 'الاسم' : 'Name',
      flex: 1,
      renderCell: (params) => (
        <Typography>{i18n.language === 'ar' ? params.row.name.ar : params.row.name.en}</Typography>
      ),
    },
    {
      field: 'image',
      headerName: i18n.language === 'ar' ? 'الصورة' : 'Image',
      flex: 1,
      renderCell: (params) =>
        params.value ? (
          <Box
            component="img"
            src={params.value}
            alt={params.row.name}
            sx={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 1 }}
          />
        ) : (
          <Typography variant="body2" color="textSecondary">
            No Image
          </Typography>
        ),
    },
    {
      field: 'actions',
      headerName: i18n.language === 'ar' ? 'العمليات' : 'Actions',
      flex: 1,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          {/* {checkPermissions(permissions, 'delete-category') && ( */}
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
          {/* )} */}

          {/* {checkPermissions(permissions, 'show-categories') && ( */}
            <Button
              variant="contained"
              color="info"
              onClick={() => navigate(`${paths.categories}/${params.row.id}`)}
            >
              <Eye />
            </Button>
          {/* )} */}

          {/* {checkPermissions(permissions, 'edit-category') && ( */}
            <Button variant="contained" color="primary" onClick={() => handleEditOpen(params.row)}>
              <Pencil />
            </Button>
          {/* )} */}
        </Stack>
      ),
    },
  ];
  return {navigate,columns}
}

export default useCategoryTable