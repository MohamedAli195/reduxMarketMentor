import { useQuery } from '@tanstack/react-query';
import {  useGetLecturesQuery } from 'app/features/Lectuers/Lectuers';
import { useGetProfileQuery } from 'app/features/profileSlice/profileSlice';
import { ICategory, ICourseLectuer, IPackageLectuerSelected } from 'interfaces';
import React, { useState } from 'react';

  interface UseLecturerTableReturn {
  sort: string;
  setSort: React.Dispatch<React.SetStateAction<string>>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  tempId: number;
  setTempId: React.Dispatch<React.SetStateAction<number>>;
  openU: boolean;
  handleCloseU: () => void;
  handleEditOpen: (categoryData: IPackageLectuerSelected) => void;
  handleOpend: () => void;
  opend: boolean;
  handleClosed: () => void;
  selectedCategory: IPackageLectuerSelected | null;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  perPage: number;
  setper: React.Dispatch<React.SetStateAction<number>>;
 lecters: ICourseLectuer[];
  isLoading: boolean;
  isError: boolean;
  totalItems:number
}

const useLeactuerTable = (id: string | undefined ): UseLecturerTableReturn => {
  // console.log(id)
  const [page, setPage] = useState(1);
  const [perPage, setper] = useState(10);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('desc');
  const [tempId, setTempId] = useState(1);

  // delete modal
  const [opend, setOpend] = useState(false);
  const handleOpend = () => setOpend(true);
  const handleClosed = () => setOpend(false);
  const [selectedCategory, setSelectedCategory] = useState<null | IPackageLectuerSelected>(null);
  const handleEditOpen = (categoryData: IPackageLectuerSelected) => {
    // console.log(categoryData);
    setSelectedCategory(categoryData); // Set selected package data
    handleOpenU(); // Open the update modal
  };
  // update modal
  const [openU, setOpenU] = useState(false);
  const handleOpenU = () => setOpenU(true);
  const handleCloseU = () => setOpenU(false);

  

  const { data,isError, error, isLoading, isFetching, isSuccess } = 
  useGetLecturesQuery({id, page, perPage, search ,sort_direction: sort });

    const {data:profile} = useGetProfileQuery()
const permissions = profile?.data.permissions

  const lecters = data?.data?.data || [];
  const totalItems = data?.data?.total || 0
  return {
  sort,
  setSort,
  search,
  setSearch,
  tempId,
  setTempId,
  openU,
  handleCloseU,
  handleEditOpen,
  handleOpend,
  opend,
  handleClosed,
  selectedCategory,
  page,
  setPage,
  perPage,
  setper,
 lecters,
  isLoading,
  isError,
  totalItems

}
};

export default useLeactuerTable;
