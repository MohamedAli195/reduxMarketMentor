import { Box, Button, Stack } from '@mui/material';
import i18n from 'i18n';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import React from 'react';
import imgNotFound from './../../../public/images/No_Image_Available.jpg';
import { Navigate, useNavigate } from 'react-router-dom';
// import { ICompany } from 'interfaces';
import paths from 'routes/path';
import { DataGrid, GridColDef, GridRowClassNameParams } from '@mui/x-data-grid';
import { IREc, ITempPermissions } from 'interfaces';
import SwitchStatus from 'components/Shared/switch';
interface IProps {
  handleEditOpen:(val:IREc)=>void
  handleOpend:()=>void
  setTempId:(val:number)=>void
  data: IREc[];
}
function RecommendationsTable({data,handleEditOpen,setTempId,handleOpend}: IProps) {

  const navigate = useNavigate();
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID' },
    { field: 'name', headerName: i18n.language === 'ar' ? 'الاسم' : 'Name',flex: 0.5, },
    { field: 'value', headerName: i18n.language === 'ar' ? 'القيمة' : 'email',flex: 1,  },
    { field: 'status', headerName: i18n.language === 'ar' ? 'الحالة' : 'status', width: 130 ,renderCell: (params) => (
              <SwitchStatus id={params.row.id} url={"recommendations"} apiStatus={params.row.status} />
             
            ), },
    {
      field: 'actions',
      headerName: i18n.language === 'ar' ? 'العمليات' : 'actions',
      flex: 1,
      renderCell: (params) => (
        <Stack direction="row" gap={1}>
          <Button
            variant="contained"
            color="error"
            
            onClick={
              ()=>{
              handleOpend()
              setTempId(params.row.id)
            }
          }
          >
            {/* {t('delete')} */}
            <Trash2 />
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`${paths.recommendations}/${params.row.id}`)}
          >
            {/* {t('view')} */}
            <Eye />
          </Button>
          <Button variant="contained" color="info" onClick={() => handleEditOpen(params.row)}>
            {/* {t('edit')} */}
            <Pencil />
          </Button>
        </Stack>
      ),
    },
  ];


  const rows =
    data?.length > 0
      ? data?.map((recom: IREc) => ({
          ...recom,
        }))
      : [];
  return (
<DataGrid
    rows={rows}
    columns={columns}
    sx={{ border: 0 }}
    autoHeight
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

export default RecommendationsTable;
