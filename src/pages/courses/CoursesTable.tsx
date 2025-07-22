import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import i18n from 'i18n';
import paths from 'routes/path';
import SwitchStatus from 'components/Shared/switch';
import { checkPermissions, parsedData } from 'functions';
import { errorType, ICourse, IFormInputCourses } from 'interfaces';
import { useGetProfileQuery } from 'app/features/profileSlice/profileSlice';
import { useUpdateStateCourseMutation } from 'app/features/Courses/coursesSlice';
import toast from 'react-hot-toast';

interface IProps {
  handleEditOpen: (val: ICourse) => void;
  handleOpend: () => void;
  setTempId: (val: number) => void;
  data: ICourse[];
  isDashBoard: boolean;
}

const CustomersTable = ({ data, handleEditOpen, handleOpend, setTempId, isDashBoard }: IProps) => {
  console.log(data);
  const navigate = useNavigate();
  const isArabic = i18n.language === 'ar';
  const { data: profile } = useGetProfileQuery();
  const permissions = profile?.data.permissions;

  const [updateStateCourse] = useUpdateStateCourseMutation();

  const handleUpdateState = async ({
    id,
    newStatus,
  }: {
    id: number;
    newStatus: 'inactive' | 'active';
  }) => {
    try {
      const res = await updateStateCourse({ id, status: newStatus }).unwrap();
      console.log(res);
      if (res.code === 200) {
        toast.success(' course status updated successfully');
      }
    } catch (error: unknown) {
      const err = error as errorType;

      const errorMessages = err?.data?.errors
        ? Object.values(err.data.errors).flat().join('\n')
        : 'Failed to update course status, please check your input.';

      toast.error(errorMessages);
    }
  };
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
            <SwitchStatus
              id={params.row.id}
              url="courses"
              apiStatus={params.row.status}
              updateState={handleUpdateState}
            />
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
              {checkPermissions(permissions, 'delete-course') && (
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
              {checkPermissions(permissions, 'show-courses') && (
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => navigate(`${paths.courses}/${params.row.id}`)}
                >
                  <Eye />
                </Button>
              )}
              {checkPermissions(permissions, 'edit-course') && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleEditOpen(params.row)}
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
          '& .MuiDataGrid-cell:hover': {
            textDecoration: 'none',
            color: 'inherit',
            backgroundColor: 'inherit', // إلغاء تغيير الخلفية عند الـ hover (اختياري)
            cursor: 'default', // إلغاء ظهور شكل اللينك إذا كان يظهر
          },
        }}
      />
    </Box>
  );
};

export default CustomersTable;
