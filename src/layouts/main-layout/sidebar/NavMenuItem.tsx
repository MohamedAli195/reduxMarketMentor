import {
  Chip,
  Link,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { IMenuitems } from './MenuItems';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

interface NavMenuItemType {
  item: IMenuitems;
  pathTo: string;
}

const NavMenuItem = ({ item, pathTo }: NavMenuItemType) => {
  const { icon: Icon } = item;
  const itemIcon = Icon ? <Icon /> : null;

  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
  }, [i18n.language]);

  return (
    <List component="li" disablePadding key={item?.id && item.title}>
      <ListItemButton
        component={Link}
        href={item?.href}
        disabled={item?.disabled}
        selected={pathTo === item?.href}
        sx={{ direction: isArabic ? 'rtl' : 'ltr' }}
      >
        <ListItemIcon
          sx={{
            py: 0.4,
            px: 0,
            ...(!item.available && {
              color: 'action.active',
              opacity: 0.9,
            }),
            ...(isArabic && { marginLeft: 'auto', marginRight: 0 }),
          }}
        >
          {itemIcon}
        </ListItemIcon>
        <ListItemText
          sx={{
            ...(!item.available && {
              color: 'action.active',
              opacity: 0.9,
            }),
            textAlign: isArabic ? 'right' : 'left',
          }}
        >
          <>{`${item?.title}`}</>
          <br />
          {item?.subtitle ? <Typography variant="caption">{item.subtitle}</Typography> : ''}
        </ListItemText>

        {!item?.chip ? null : (
          <Chip
            color={item?.chipColor}
            variant={item?.variant ? item?.variant : 'outlined'}
            size="small"
            label={item?.chip}
            sx={({ palette, shape, typography }) => ({
              borderRadius: shape.borderRadius * 3,
              ...typography.caption,
              ...(pathTo === item?.href
                ? {
                    bgcolor: palette.text.disabled,
                    color: palette.primary.main,
                  }
                : {
                    bgcolor: palette.text.primary,
                    color: palette.common.white,
                  }),
            })}
          />
        )}
      </ListItemButton>
    </List>
  );
};

export default NavMenuItem;
