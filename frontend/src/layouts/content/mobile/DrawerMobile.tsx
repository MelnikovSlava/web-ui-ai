import { VitalProps } from '../../../utils/types';
import { Drawer } from '@mui/material';
import { Panel } from '../panel/Panel';
import clsx from 'clsx';


type DrawerProps = {
  open: boolean;
  onClose: () => void;
} & VitalProps;

export const DrawerMobile = (props: DrawerProps) => {
  return (
    <Drawer open={props.open} onClose={props.onClose} PaperProps={{
      sx: {
        width: '80%',
      }
    }}>
      <Panel />
    </Drawer >
  );
};