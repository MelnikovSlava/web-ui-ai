import { IconButton } from '@mui/material';
import { Menu } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { Fragment, useState } from 'react';
import type { VitalProps } from '../../../utils/types';
import { DrawerMobile } from './DrawerMobile';


type MenuSidebarProps = {} & VitalProps

export const MenuSidebar = observer((props: MenuSidebarProps) => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Fragment>
      <DrawerMobile onClose={toggleDrawer} open={open} onClick={toggleDrawer} />
      <IconButton onClick={() => toggleDrawer()}>
        <Menu />
      </IconButton>
    </Fragment>
  );
});