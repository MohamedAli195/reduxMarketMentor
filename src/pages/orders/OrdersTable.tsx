import React from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRowClassNameParams } from '@mui/x-data-grid';
import { Eye, Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import i18n from 'i18n';
import { IOrder } from 'interfaces';
import paths from 'routes/path';

interface IProps {
  handleEditOpen: (val: IOrder) => void;
  handleOpend: () => void;
  setTempId: (val: number) => void;
  data: IOrder[];
  isDashBoard: boolean;
}

function OrdersTable({ data, handleEditOpen, setTempId, handleOpend, isDashBoard }: IProps) {
  const navigate = useNavigate();
  const isArabic = i18n.language === 'ar';

  const defaultColumns: GridColDef[] = [
    { field: 'id', headerName: 'ID' },
    {
      field: 'name',
      headerName: i18n.language === 'ar' ? 'الاسم' : 'Name',
      flex: 1,
      renderCell: (params) => params.row.user.name,
    },
    {
      field: 'order_type',
      headerName: i18n.language === 'ar' ? 'نوع الطلب' : 'Order Type',
      flex: 0.5,
    },
    {
      field: 'created_at',
      headerName: i18n.language === 'ar' ? 'تاريخ الطلب' : 'Created At',
      flex: 0.5,
    },
    {
      field: 'total',
      headerName: i18n.language === 'ar' ? 'الإجمالي' : 'Total',
    },
    {
      field: 'status',
      headerName: i18n.language === 'ar' ? 'الحالة' : 'Status',
      flex: 0.5,
      renderCell: (params) => {
        let color = '';
        let background = '';
        switch (params.value) {
          case 'accepted':
            color = 'green';
            background = '#a8f1cd';
            break;
          case 'canceled':
            color = '#ffd7d7';
            background = '#FF0000';
            break;
          default:
            color = 'blue';
            background = '#6691e7';
        }
        return (
          <Box
            sx={{
              color,
              backgroundColor: background,
              fontWeight: 'bold',
              padding: 1,
              px: 2,
              borderRadius: 2,
              textTransform: 'capitalize',
            }}
          >
            {params.value}
          </Box>
        );
      },
    },
    {
      field: 'payment_method',
      headerName: i18n.language === 'ar' ? 'طريقة الدفع' : 'Payment Method',
    },
    {
      field: 'actions',
      headerName: isArabic ? 'العمليات' : 'Actions',
      flex: 1,
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
          <Button variant="contained" color="info">
            <Eye />
          </Button>
          <Button variant="contained" color="primary" onClick={() => handleEditOpen(params.row)}>
            <Pencil />
          </Button>
        </Box>
      ),
    },
  ];

  const dashboardColumns: GridColDef[] = [
    { field: 'id', headerName: 'ID' },
    {
      field: 'name',
      headerName: i18n.language === 'ar' ? 'الاسم' : 'Name',
      flex: 1,
      renderCell: (params) => params.row.user.name,
    },
    {
      field: 'email',
      headerName: i18n.language === 'ar' ? 'الإيميل' : 'Email',
      flex: 1,
    },
    {
      field: 'phone',
      headerName: i18n.language === 'ar' ? 'الهاتف' : 'Phone',
      flex: 1,
    },
  ];

  console.log(data)
  const columns = isDashBoard ? dashboardColumns : defaultColumns;

const rows = data?.length > 0
  ? data.map((order) => ({
      ...order,
      created_at: new Date(order.created_at).toLocaleDateString('en-GB'), // dd/mm/yyyy
    }))
  : [];
  return (
    <DataGrid
      rows={rows}
      columns={columns}
      sx={{ border: 0 }}
      autoHeight
      getRowHeight={() => 200}
      getRowClassName={(params: GridRowClassNameParams) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? 'even-row' : 'odd-row'
      }
      disableRowSelectionOnClick
      disableMultipleRowSelection
      hideFooterPagination
    />
  );
}

export default OrdersTable;
