import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

interface IProps {
  open: boolean;
  handleClose: (val: boolean) => void;
  children: React.ReactNode;
  isDeleteModal?: boolean;
}

export default function BasicModal({ open, handleClose, children, isDeleteModal }: IProps) {
  return (
    <div>
      {/* <Button onClick={handleOpen}>Open modal</Button> */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
          
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: !isDeleteModal ?'60%':'auto',
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            borderRadius: '8px', // rounded corners
          }}
        >
          {children}
        </Box>
      </Modal>
    </div>
  );
}
