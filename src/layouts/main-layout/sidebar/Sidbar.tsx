import { Box, Drawer } from '@mui/material';
import { useBreakpoints } from 'providers/useBreakPoint';
import SimpleBar from 'simplebar-react';
import SidebarBanner from './SidebarBanner';
import SidebarItems from './SidebarItems';
import SidebarLogo from './SidebarLogo';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
interface SideNavProps {
  onDrawerClose: () => void;
  onDrawerTransitionEnd: () => void;
  mobileOpen: boolean;
}
const Sidebar = ({ onDrawerClose, onDrawerTransitionEnd, mobileOpen }: SideNavProps) => {
  const { up } = useBreakpoints();
  const upLg = up('lg');
  const { t, i18n } = useTranslation();


  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);
  if (upLg) {
    return (
      <Box
        sx={{
          flexShrink: 0,
        }}
      >
        <Drawer
          anchor={i18n.language === "ar" ? "right" : "left"}
          open
          variant="permanent"
          sx={{
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
            },
          }}
        >
          <Box
            sx={{
              height: 1,
            }}
          >
            <Box
              sx={{
                bgcolor: 'common.white',
                px: 3,
                boxShadow: 9,
              }}
            >
              <SidebarLogo />
            </Box>

            <SimpleBar style={{ height: 'calc(100% - 68px)' }}>
              <Box
                sx={{
                  borderRight: 1,
                  borderColor: 'text.disabled',
                }}
              >
                <SidebarItems />
                {/* <SidebarBanner /> */}
              </Box>
            </SimpleBar>
          </Box>
        </Drawer>
      </Box>
    );
  }
  {
    /* Sidebar For Mobile */
  }

  return (
    <Drawer
      anchor="left"
      onTransitionEnd={onDrawerTransitionEnd}
      open={mobileOpen}
      onClose={onDrawerClose}
      variant="temporary"
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
      PaperProps={{
        sx: {
          backgroundColor: 'common.white',
          border: '0 !important',
          boxShadow: (theme) => theme.shadows[2],
        },
      }}
    >
      {/* ------------------------------------------- */}
      <Box
        sx={{
          bgcolor: 'common.white',
          px: 3,
        }}
      >
        <SidebarLogo />
      </Box>

      {/* ------------------------------------------- */}
      <SimpleBar style={{ height: 'calc(100% - 68px)' }}>
        <>
          <SidebarItems />
          <SidebarBanner />
        </>
      </SimpleBar>
   
    </Drawer>
  );
};

export default Sidebar;
