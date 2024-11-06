import { Drawer } from '@mui/material';
import type { VitalProps } from '../../../utils/types';
import { Panel } from '../panel/Panel';


type DrawerProps = {
  open: boolean;
  onClose: () => void;
  onClick: (e?: any) => void;
} & VitalProps;

export const DrawerMobile = (props: DrawerProps) => {
  return (
    <Drawer open={props.open} onClose={props.onClose} PaperProps={{
      sx: {
        width: '80%',
      }
    }}>
      <Panel onClick={props.onClick} />
    </Drawer >
  );
};