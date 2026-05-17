import { DataGrid, GridColDef, GridRowClassNameParams } from '@mui/x-data-grid';
import { IWebinarRegister } from 'app/webinar/webinar';
import i18n from 'i18n';


interface IProps {
  data: IWebinarRegister[];
}

function WebinarTable({ data }: IProps) {
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'name',
      headerName: i18n.language === 'ar' ? 'الاسم' : 'Name',
      flex: 1.2,
      minWidth: 180,
    },
    {
      field: 'email',
      headerName: i18n.language === 'ar' ? 'البريد الإلكتروني' : 'Email',
      flex: 1.4,
      minWidth: 220,
    },
    {
      field: 'phone',
      headerName: i18n.language === 'ar' ? 'الهاتف' : 'Phone',
      flex: 1,
      minWidth: 140,
    },
  ];

  return (
    <DataGrid
      rows={data?.length ? data : []}
      columns={columns}
      sx={{ border: 0 }}
      autoHeight
      getRowClassName={(params: GridRowClassNameParams) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? 'even-row' : 'odd-row'
      }
      disableRowSelectionOnClick
      disableMultipleRowSelection
      hideFooterPagination
    />
  );
}

export default WebinarTable;
