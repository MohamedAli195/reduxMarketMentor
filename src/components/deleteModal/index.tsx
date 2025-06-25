import { Button, Typography ,Box } from '@mui/material'
import BasicModal from 'components/Shared/modal/ShareModal'
import Lottie from 'lottie-react'
import {  } from 'lucide-react'

import deleteAnimation from "./../../../src/components/animations/delete.json";
import { t } from 'i18next';
interface IProps {
    opend:boolean;
    handleClosed:()=>void;
    tempId:number;
    refetch:()=>void;
    deleteFunc:(val1:number,val2:()=>void)=>void
}
function DeleteModal({opend,handleClosed,refetch,tempId,deleteFunc}:IProps) {
  return (
    <BasicModal open={opend} handleClose={handleClosed} isDeleteModal={true}>
        <Box>
        <Lottie style={{height:350}}  animationData={deleteAnimation} />
        </Box>
      <Typography variant="h6" component="h2" gutterBottom>
          {t('Delete')}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {t('deleteMsg')}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
          <Button variant="outlined" onClick={handleClosed}>
            Close
          </Button>
          <Button variant="contained" color="error" onClick={() => {
            
            deleteFunc(tempId, refetch)
            handleClosed()
            
            }}>
            Delete 
          </Button>
        </Box>
       
      </BasicModal>
  )
}

export default DeleteModal