import { useDeleteBrokerMutation } from 'app/features/brokers/brokers';
import { useDeletePackageMutation } from 'app/features/packages/packages';
import AddBrokersForm from 'components/Brokers/addBrokersForm';
import UpdateBrokersForm from 'components/Brokers/updateBrokersForm';
import DeleteModal from 'components/deleteModal';
import AddPackageForm from 'components/Packages/addPackageForm';
import BasicModal from 'components/Shared/modal/ShareModal';
import { t } from 'i18next';
import { IBroker, IPackage, IPackage2, IPackageSelected } from 'interfaces';
import toast, { Toaster } from 'react-hot-toast';

interface IProps {
  tempId: number;
  tempIdUpdate: IBroker;
  handleClose: () => void;
  handleClosed: () => void;
  handleCloseU: () => void;
  open: boolean;
  openU: boolean;
  opend: boolean;
}
function Modals({
  tempId,
  tempIdUpdate,
  handleClose,
  handleClosed,
  handleCloseU,
  opend,
  openU,
  open,
}: IProps) {
  const [deleteBroker, { isSuccess , }] = useDeleteBrokerMutation();
  return (
    <>
      {/* delete modal */}
      {/* add modal */}
      <BasicModal open={open} handleClose={handleClose}>
        <h2>{t('addBrokers')}</h2>
        <AddBrokersForm handleClose={handleClose} />
      </BasicModal>

      {/* delete modal */}
      <DeleteModal
        handleClosed={handleClosed}
        opend={opend}
        tempId={tempId}
        module={'Package'}
        deleteFunc={async () => {
          await deleteBroker(tempId);
        }}
      />

      {/* update modal */}
      <BasicModal open={openU} handleClose={handleCloseU}>
        <h2>{t('editBrokers')}</h2>
        <UpdateBrokersForm handleClose={handleCloseU} tempIdUpdate={tempIdUpdate} />
      </BasicModal>

      {/* toaster */}
      <Toaster position="bottom-center" reverseOrder={false} />
    </>
  );
}

export default Modals;
