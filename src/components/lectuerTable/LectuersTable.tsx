import { Box, Button, Stack, Typography } from '@mui/material';
import i18n from 'i18n';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import React from 'react';
import imgNotFound from './../../../public/images/No_Image_Available.jpg';
import { Navigate, useNavigate } from 'react-router-dom';
// import { ICompany } from 'interfaces';
import paths from 'routes/path';
import { DataGrid, GridColDef, GridRowClassNameParams } from '@mui/x-data-grid';
import { ICategory, ICustomer, IFormInputCourses, IPackageLectuerSelected } from 'interfaces';
import { checkPermissions, parsedData } from 'functions';
import SwitchStatus from 'components/Shared/switch';
interface IProps {
  handleEditOpen:(val:IPackageLectuerSelected)=>void
  handleOpend:()=>void
  setTempId:(val:number)=>void
  data: IPackageLectuerSelected[];
}
function LectuerTables({data,handleEditOpen,setTempId,handleOpend}: IProps) {
  // console.log(data)
  const navigate = useNavigate();
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'title',   headerName: i18n.language === 'ar' ? 'العنوان':"title",flex: 1, renderCell:(params)=> i18n.language === 'ar' ?  params.row.title.ar : params.row.title.en  },

    // i18n.language === 'ar'
    //   ? { field: 'descriptionAr', headerName: 'الوصف' }
    //   : { field: 'descriptionEn', headerName: 'description' },
    { field: 'video_url', headerName: i18n.language === 'ar' ? 'الرابط' : 'Link',flex: 1, },
    { field: 'duration', headerName: i18n.language === 'ar' ? 'المدة' : 'time '},
    {
      field: 'actions',
      headerName: i18n.language === 'ar' ? 'العمليات' : 'actions',

      flex: 1,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            color="error"
            // onClick={() => deleteLectuer(params.row.id, refetch)}
            onClick={
              ()=>{
              handleOpend()
              setTempId(params.row.id)
            }}
          >
            {/* {t('delete')} */}
            <Trash2 />
          </Button>
          <Button
            variant="contained"
            color="info"
            onClick={() => navigate(`${paths.lectuers}/${params.row.id}`)}
          >
            {/* {t('view')} */}
            <Eye />
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleEditOpen(params.row)}
          >
            {/* {t('edit')} */}
            <Pencil />
          </Button>
        </Stack>
      ),
    },
  ];

  const rows =
    data?.length > 0
      ? data.map((lectuer: IPackageLectuerSelected) => ({
          ...lectuer,
        }))
      : [];
  return (
<DataGrid
    rows={rows}
    columns={columns}
    sx={{ border: 0 }}
    autoHeight
    // getRowHeight={() => 200} // Set each row's height to 200px
    getRowClassName={(params: GridRowClassNameParams) =>
      params.indexRelativeToCurrentPage % 2 === 0 ? 'even-row' : 'odd-row'
    }
    disableRowSelectionOnClick
    disableMultipleRowSelection
    hideFooterPagination={true}
  />
  );
}

export default LectuerTables;
