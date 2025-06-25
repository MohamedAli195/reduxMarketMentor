import { useQuery } from '@tanstack/react-query';
import { fetchLectuers } from 'functions';
import { ICategory, IPackageLectuerSelected } from 'interfaces';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

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
  refetch: () => void;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  per: number;
  setper: React.Dispatch<React.SetStateAction<number>>;
 extractData: IPackageLectuerSelected[];
  isLoading: boolean;
  isError: boolean;
  totalItems:number
}

const useLeactuerTable = (): UseLecturerTableReturn => {
  const [page, setPage] = useState(1);
  const [per, setper] = useState(10);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('desc');
  const [tempId, setTempId] = useState(1);
  const { id } = useParams();

  // delete modal
  const [opend, setOpend] = useState(false);
  const handleOpend = () => setOpend(true);
  const handleClosed = () => setOpend(false);
  const [selectedCategory, setSelectedCategory] = useState<null | IPackageLectuerSelected>(null);
  const handleEditOpen = (categoryData: IPackageLectuerSelected) => {
    console.log(categoryData);
    setSelectedCategory(categoryData); // Set selected package data
    handleOpenU(); // Open the update modal
  };
  // update modal
  const [openU, setOpenU] = useState(false);
  const handleOpenU = () => setOpenU(true);
  const handleCloseU = () => setOpenU(false);

  

  // Fetch packages using React Query
  const { data, error, isLoading, isError, refetch } = useQuery({
    queryKey: [`Lectuers-${page}-${per}-${search}-${sort}`],
    queryFn: () => fetchLectuers(id, page, per, search, sort),
  });

  // console.log(data)

  // console.log(data.data.data);
  // Prepare rows for DataGrid

  const totalItems = data?.data?.total;
  const extractData = data?.data?.data;
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
    refetch,
    page,
    setPage,
    per,
    setper,
    extractData,
    isLoading,
    isError,
    totalItems
  };
};

export default useLeactuerTable;
