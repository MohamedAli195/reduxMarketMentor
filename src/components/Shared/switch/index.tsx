import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
// import { updateStatus } from 'pages/courses/coursesFunct';
import { t } from 'i18next';
import { updateStatus } from 'functions';

interface IProps {
  id: number;
  url: string;
  apiStatus: 'inactive' | 'active';
}

export default function SwitchStatus({ id, url, apiStatus }: IProps) {
  const [status, setStatus] = React.useState(apiStatus);

  const handleChange = () => {
    const newStatus = status === 'active' ? 'inactive' : 'active';
    setStatus(newStatus);
    updateStatus(id, url, newStatus); // Use the updated value
  };

  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Switch
            checked={status === 'active'} // Use `checked` prop for boolean state
            onChange={handleChange}
          />
        }
        label={status === 'active' ? '' : ''}
      />
    </FormGroup>
  );
}
