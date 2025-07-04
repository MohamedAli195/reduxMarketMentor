import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import AvatarImage from 'assets/images/avatar.svg';
import IconifyIcon from 'components/base/IconifyIcon';
import { profileOptions } from 'data/navbar/menu-data';
import { useState } from 'react';
import axios from 'axios';

import { toast } from 'react-hot-toast';
import paths from 'routes/path';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { handleLogout } from 'app/services/handleLogout';
const ProfileDropdown = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handlingLogout = async () => {
    try {
      
  
      // Clear the token from local storage
      // localStorage.removeItem('token');
      // console.log("logout")

      handleLogout(dispatch);

  
      // Show a success message
      toast.success('Logout successful');
  




    } catch (error) {
      // Handle errors
      toast.error('Logout failed. Please try again.');
      // console.error(error);
    }
  };
  return (
    <Box
      sx={{
        px: 0.75,
        pr: 2,
      }}
    >
      <ButtonBase disableRipple={true} onClick={handleClick}>
        <Stack
          spacing={1.5}
          direction="row"
          alignItems="center"
          sx={{
            py: 0.75,
            ml: 0.75,
          }}
        >
          <Avatar
            alt="avatar"
            variant="rounded"
            src={AvatarImage}
            sx={{
              height: 36,
              width: 36,
            }}
          />
          <Typography
            variant="subtitle1"
            sx={{
              display: { xs: 'none', sm: 'block' },
            }}
          >
            Admin
          </Typography>
        </Stack>
      </ButtonBase>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        slotProps={{
          paper: {
            style: {
              paddingTop: '8px',
              width: '100%',
              maxWidth: 120,
            },
          },
        }}
      >
        {profileOptions.map((option) => (
          <MenuItem
            key={option.id}
            sx={{
              py: 1,
              px: 1.5,
            }}
            onClick={handleClose}
          >
            <ListItemIcon sx={{ '&.MuiListItemIcon-root': { minWidth: 2, mr: 1 } }}>
              <IconifyIcon width={16} height={16} icon={option.icon} />
            </ListItemIcon>
            <Typography variant="subtitle2"> {option.title}</Typography>
          </MenuItem>
        ))}
        <Stack direction="row" sx={{ width: 1, justifyContent: 'center' }}>
          <Button
            size="small"
            variant="outlined"
            sx={{
              mt: 1.5,
              width: '80%',
              py: 0.5,
            }}
            onClick={()=>{handlingLogout()}}
          >
            Logout
          </Button>
        </Stack>
      </Menu>
    </Box>
  );
};
export default ProfileDropdown;
