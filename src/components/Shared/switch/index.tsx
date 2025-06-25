import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
// import { updateStatus } from 'pages/courses/coursesFunct';
import { t } from 'i18next';
import { updateStatus } from 'functions';
import { useUpdateRecommendationStatusMutation } from 'app/features/Recommendations/RecommendationsSlice';

interface IProps {
  id: number;
  url: string;
  apiStatus: 'inactive' | 'active';
  updateStatus?:()=>void
}

export default function SwitchStatus({ id, url, apiStatus , updateStatus}: IProps) {
  const [status, setStatus] = React.useState(apiStatus);
const [updateRecommendationStatus ,{error}] = useUpdateRecommendationStatusMutation()
console.log(error)
  const handleChange = () => {
    const newStatus = status === 'active' ? 'inactive' : 'active';
console.log(newStatus)
    setStatus(newStatus);
    updateRecommendationStatus({id,newStatus})
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
