import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';

interface IProps {
  value:Dayjs | null;
  setValue:(val:Dayjs | null)=>void
  formattedDateStart:string
  setFormattedDateStart:(val:string)=>void
}
export default function AgendaTimePicker({value, setValue ,formattedDateStart,setFormattedDateStart}:IProps) {

  // const handleChange = (newValue: Dayjs | null) => {
  //   setValue(newValue);
  //   if (newValue) {
  //   const formatted = newValue.format('YYYY-MM-DD HH:mm:ss'); // 2025-07-30 12:30:01
  //     console.log("Formatted date:", formatted);
  //   }
  // };

    const handleChange = (newVal: Dayjs | null) => {
    setValue(newVal);

    if (newVal) {
      const formatted = newVal.format('YYYY-MM-DD HH:mm:ss');
      setFormattedDateStart(formatted);
      console.log(formatted); // أطبع التاريخ في الكونسول
    } else {
      setFormattedDateStart('');
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateTimePicker']}>
        <DateTimePicker
          label="اختر التاريخ والوقت"
          value={value}
          onChange={handleChange}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
