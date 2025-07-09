import { Box, Button } from "@mui/material";
import AddCourseLectuerForm from "components/CourseLectuers/AddCourseLectuerForm";
import LecturerTable from "components/lectuerTable";
import LectuerTables from "components/lectuerTable/LectuersTable";
import BasicModal from "components/Shared/modal/ShareModal";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

const Section = () => {
      const [open, setOpen] = useState(false);
      const handleOpen = () => setOpen(true);
      const handleClose = () => setOpen(false);
      const {id} = useParams()
        const { t } = useTranslation();
  return (
    <>
    <div>section</div>
    
        <Box>
            <Button variant="contained" color="info" onClick={handleOpen} sx={{marginY:4 }}>
              {t('AddLecuter')}
            </Button>
          <LecturerTable isDashBoard={false} />
          </Box>
          <BasicModal open={open} handleClose={handleClose}>
            <h2>{t('AddLecuter')}</h2>
    
            <AddCourseLectuerForm vid={id} handleClose={handleClose} />
          </BasicModal>
    </>
    
  )
}

export default Section