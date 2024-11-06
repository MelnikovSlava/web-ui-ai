import { AppBar, Toolbar } from '@mui/material';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { useUrlWorkspaceId } from '../../../hooks/useUrlWorkspaceId';
import { AddNewChatIcon } from './AddNewChatIcon';
import { MenuSidebar } from './MenuSidebar';
import { MobileChatTitle } from './MobileChatTitle';

export const MobileSidebar = observer(() => {
  const urlWorkspaceId = useUrlWorkspaceId();

  return (
    <AppBar position="static" color='primary'>
      <Toolbar variant="regular" className={clsx('justify-between')}>

        <MenuSidebar />
        <MobileChatTitle />

        {!Number.isNaN(urlWorkspaceId) && <AddNewChatIcon />}

      </Toolbar>
    </AppBar>
  );
});