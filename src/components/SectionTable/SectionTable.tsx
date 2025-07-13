import { Box, Button, Stack, Typography } from '@mui/material';
import i18n from 'i18n';
import { Eye, Pencil, Trash2 } from 'lucide-react';


// import { ICompany } from 'interfaces';
import paths from 'routes/path';
import { DataGrid, GridColDef, GridRowClassNameParams } from '@mui/x-data-grid';
import { ICategory, ICourseLectuer, ICustomer, IFormInputCourses, IPackageLectuerSelected, ISection } from 'interfaces';
import { checkPermissions, parsedData } from 'functions';
import SwitchStatus from 'components/Shared/switch';
import { Link } from 'react-router-dom';
import { useDeleteSectionMutation } from 'app/features/Sections/sectionsSlice';


interface IProps {
  handleEditOpen:(val:ISection)=>void
  handleOpend:()=>void
  setTempId:(val:number)=>void
  data: ISection[];
}
function SectionTable({data,handleEditOpen,setTempId,handleOpend}: IProps) {
 
  // console.log(data)
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name',   headerName: i18n.language === 'ar' ? 'العنوان':"title",flex: 1, renderCell:(params)=> i18n.language === 'ar' ?  params.row.name.ar : params.row.name.en  },
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
           <Link to={`${paths.sections}/${params.row.id}`}>
          <Button
            variant="contained"
            color="info"
          >
           
            {/* {t('view')} */}
            <Eye />

           
          </Button>
           </Link>
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
      ? data.map((section: ISection) => ({
          ...section,
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

export default SectionTable;
