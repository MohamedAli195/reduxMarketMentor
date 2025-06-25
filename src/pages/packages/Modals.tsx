import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import DeleteModal from 'components/deleteModal';
import AddPackageForm from 'components/Packages/addPackageForm';
import UpdatePackageForm from 'components/Packages/updatePacageForm';
import BasicModal from 'components/Shared/modal/ShareModal';
import { deleteAnyThing } from 'functions';
import { t } from 'i18next';
import { IPackage } from 'interfaces';
import React from 'react'
import { Toaster } from 'react-hot-toast';


interface IProps {
    tempId:number
    tempIdUpdate:number;
    handleClose:()=>void;
    handleClosed:()=>void;
    handleCloseU:()=>void;
    open:boolean;
    openU:boolean;
    opend:boolean;
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<IPackage, Error>>
}
function Modals({tempId,tempIdUpdate,handleClose,handleClosed,handleCloseU,opend,openU,open,refetch}:IProps) {
  return (
    <>
    {/* delete modal */}
      {/* add modal */}
      <BasicModal open={open} handleClose={handleClose}>
        <h2>{t('addPackage')}</h2>
        <AddPackageForm handleClose={handleClose} refetch={refetch} />
      </BasicModal>


  {/* delete modal */}
      <DeleteModal
        handleClosed={handleClosed}
        opend={opend}
        refetch={refetch}
        tempId={tempId}
        deleteFunc={() => {
          deleteAnyThing(tempId, refetch, 'packages');
        }}
      />

      {/* update modal */}
      <BasicModal open={openU} handleClose={handleCloseU}>
        <h2>{t('editPackage')}</h2>
        <UpdatePackageForm handleClose={handleCloseU} refetch={refetch} id={tempIdUpdate} />
      </BasicModal>

      {/* toaster */}
      <Toaster position="bottom-center" reverseOrder={false} />
    </>
  )
}

export default Modals