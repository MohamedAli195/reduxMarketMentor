import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { useDeletePackageMutation } from 'app/features/packages/packages';
import DeleteModal from 'components/deleteModal';
import AddPackageForm from 'components/Packages/addPackageForm';
import UpdatePackageForm from 'components/Packages/updatePacageForm';
import BasicModal from 'components/Shared/modal/ShareModal';
import { deleteAnyThing } from 'functions';
import { t } from 'i18next';
import { IPackage, IPackage2, IPackageSelected } from 'interfaces';
import React from 'react'
import { Toaster } from 'react-hot-toast';


interface IProps {
    tempId:number
    tempIdUpdate:IPackage2;
    handleClose:()=>void;
    handleClosed:()=>void;
    handleCloseU:()=>void;
    open:boolean;
    openU:boolean;
    opend:boolean;

}
function Modals({tempId,tempIdUpdate,handleClose,handleClosed,handleCloseU,opend,openU,open}:IProps) {
 const [deletePackage] = useDeletePackageMutation()
  
  return (
    <>
    {/* delete modal */}
      {/* add modal */}
      <BasicModal open={open} handleClose={handleClose}>
        <h2>{t('addPackage')}</h2>
        <AddPackageForm handleClose={handleClose} />
      </BasicModal>


  {/* delete modal */}
      <DeleteModal
        handleClosed={handleClosed}
        opend={opend}
    
        tempId={tempId}
        deleteFunc={async () => {
          await deletePackage(tempId);
        }}
      />

      {/* update modal */}
      <BasicModal open={openU} handleClose={handleCloseU}>
        <h2>{t('editPackage')}</h2>
        <UpdatePackageForm handleClose={handleCloseU} tempIdUpdate={tempIdUpdate} />
      </BasicModal>

      {/* toaster */}
      <Toaster position="bottom-center" reverseOrder={false} />
    </>
  )
}

export default Modals