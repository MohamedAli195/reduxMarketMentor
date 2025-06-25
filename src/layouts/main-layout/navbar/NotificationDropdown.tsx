import {
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';

import img from "../../../../public/images/avatar.png"
import { useQuery } from '@tanstack/react-query';
import NotificationIcon from 'components/icons/NotificationIcon';
import { notificationOptions } from 'data/navbar/menu-data';
import { fetchCountOfNotifications, fetchNotifications, readNotification } from 'functions';
import i18n from 'i18n';
import { useState } from 'react';
import SimpleBar from 'simplebar-react';

function notificationsLabel(count: number) {
  if (count === 0) {
    return 'no notifications';
  }
  if (count > 99) {
    return 'more than 99 notifications';
  }
  return `${count} notifications`;
}

const NotificationDropdown = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };



  const { data, error, isLoading, isError, refetch:refetchNotfication } = useQuery({
    queryKey: [`Notifications`],
    queryFn: () => fetchNotifications(),
  });

  const { data:countOfNotifactions, error:errorOfNotifactions, isLoading:isLoadingOfNotifactions, isError:isErrorOfNotifactions, refetch:refetchOfNotifactions } = useQuery({
    queryKey: [`CountOfNotifactions`],
    queryFn: () => fetchCountOfNotifications(),
  });


  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;


  //fetchNotifications
  return (
    <>
      <IconButton
        aria-label={notificationsLabel(100)}
        color="inherit"
        onClick={handleClick}
        sx={{
          color: 'grey.200',
        }}
      >
        <Badge color="primary" badgeContent={countOfNotifactions?.data}>
          <NotificationIcon />
        </Badge>
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          sx: { flex: 1 },
        }}
        keepMounted
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        slotProps={{
          paper: {
            style: {
              width: 326,
            },
          },
        }}
      >
        <Stack direction="row" py={2} px={4} justifyContent="space-between" alignItems="center">

          {/* Notifications and new  */}
          <Typography variant="h6">Notifications</Typography>
          <Chip label={` ${countOfNotifactions?.data} new`} color="primary" size="small" /> 
        </Stack>
        <SimpleBar style={{ height: '385px' }}>
          {
          !isLoading &&
          data?.data?.map((item:{
            id:number ,
            data:{
         
                body:{
                      ar:string;
                      en:string;
                    },
                title:{
                      ar:string;
                      en:string;
                      },
                    
          }} , index:number) => (
            <MenuItem
              key={item?.id}
              sx={{
                py: 2,
                px: 4,
              }}
              // onClick={handleClose}
              onClick={()=>{
                console.log(item.id)
                readNotification(item?.id)
                refetchNotfication()
              }
              
              }
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  src={img}
                  alt={img}
                  sx={{
                    width: 36,
                    height: 36,
                  }}
                />
                <Box
                  sx={{
                    width: 200,
                  }}
                >
                  <Typography variant="subtitle2" color="textPrimary" fontWeight="medium">
                    {
                      i18n.language === 'ar' ?item.data.title.ar:item.data.title.en
                    }
                  </Typography>
                  <Typography color="textSecondary" variant="subtitle2">
                    {i18n.language === 'ar' ?item.data.body.ar:item.data.body.en}
                  </Typography>
                </Box>
              </Stack>
            </MenuItem>

          ))}
        </SimpleBar>
        <Stack direction="row" sx={{ width: 1, justifyContent: 'center' }}>
          <Button
            size="small"
            variant="outlined"
            sx={{
              mt: 3.5,
              width: '80%',
            }}
          >
            See All Notifications
          </Button>
        </Stack>
      </Menu>
    </>
  );
};

export default NotificationDropdown;
