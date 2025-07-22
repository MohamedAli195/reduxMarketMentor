import React from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRowClassNameParams } from '@mui/x-data-grid';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import i18n from 'i18n';
import paths from 'routes/path';
import { IAgenda, IAnalytics, ICategory, IStartMenu } from 'interfaces';
import { checkPermissions, parsedData } from 'functions';

import { useGetProfileQuery } from 'app/features/profileSlice/profileSlice';

interface IProps {
  handleEditOpen: (val: IStartMenu) => void;
  handleOpend: () => void;
  setTempId: (val: number) => void;
}
const useStartMenuTable = ({ handleEditOpen, setTempId, handleOpend }: IProps) => {
  const navigate = useNavigate();
  // const permissions = useSelector(((state:RootState)=>state.auth.authData.user?.permissions))
  const { data, error } = useGetProfileQuery();
  const permissions = data?.data.permissions;

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID' },
    {
      field: 'name',
      headerName: i18n.language === 'ar' ? 'الاسم' : 'Name',
      flex: 0.5,
      renderCell: (params) => (
        <Typography>
          {i18n.language === 'ar' ? params.row.title.ar : params.row.title.en}
        </Typography>
      ),
    },
    { field: 'video_link', headerName: i18n.language === 'ar' ? 'video_link' : 'video_link' , flex: 2,},
    {
      field: 'actions',
      headerName: i18n.language === 'ar' ? 'العمليات' : 'Actions',
      flex: 1,
      renderCell: (params) => (
        <Stack direction="row" gap={1}>
          {checkPermissions(permissions, 'delete-category') && (
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

          {checkPermissions(permissions, 'show-categories') && (
            <Button
              variant="contained"
              color="info"
              onClick={() => navigate(`${paths.startMenu}/${params.row.id}`)}
            >
              <Eye />
            </Button>
          )}

          {checkPermissions(permissions, 'edit-category') && (
            <Button variant="contained" color="primary" onClick={() => handleEditOpen(params.row)}>
              <Pencil />
            </Button>
          )}
        </Stack>
      ),
    },
  ];
  return { navigate, columns };
};

export default useStartMenuTable;
