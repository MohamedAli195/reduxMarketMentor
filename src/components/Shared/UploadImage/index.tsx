import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { CloudUpload } from 'lucide-react';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function InputFileUpload() {
  return (
    <Button
      component="label"
      role={undefined}
      variant="outlined"
      tabIndex={-1}
      startIcon={<CloudUpload /> }
    >
      Upload Image
      <VisuallyHiddenInput
        type="file"
        // onChange={(event) => console.log(event.target.files)}
        multiple
      />
    </Button>
  );
}