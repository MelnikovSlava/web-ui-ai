import { observer } from 'mobx-react-lite';
import clsx from 'clsx';
import { Menu, Plus } from 'lucide-react';
import { useRootStore } from '../../../store/root.store';
import { useUrlChatId } from '../../../hooks/useUrlChatId';
import { useUrlWorkspaceId } from '../../../hooks/useUrlWorkspaceId';
import { ChatTitle } from '../panel/ChatTitle';
import { Fragment, useMemo, useState } from 'react';
import { AppBar, IconButton, Toolbar } from '@mui/material';
import { DrawerMobile } from './DrawerMobile';
import { useCreateChat } from '../../../hooks/useCreateChat';

export const MobileSidebar = observer(() => {
  const rootStore = useRootStore();
  const urlWorkspaceId = useUrlWorkspaceId();
  const urlChatId = useUrlChatId();
  const chatStore = useMemo(() => {
    if (!isNaN(urlWorkspaceId) && !isNaN(urlChatId)) {
      return rootStore.getChat(urlWorkspaceId, urlChatId);
    }

    return undefined
  }, [urlWorkspaceId, urlChatId])
  const { onCreateChat } = useCreateChat();

  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    // <div
    //   className={clsx(
    //     "border-b-[var(--main-border)] border-b",
    //     "bg-[var(--sidebar-background)]",
    //     "h-[60px]",
    //     "flex items-center justify-between",
    //     "px-5"
    //     // "pb-4 pt-6",
    //   )}
    // >
    <Fragment>
      <DrawerMobile onClose={toggleDrawer} open={open} />
      <AppBar position="static" color='primary'>
        <Toolbar variant="regular" className={clsx('justify-between')}>
          <IconButton onClick={() => toggleDrawer()}>
            <Menu />
          </IconButton>

          {chatStore && <ChatTitle title={chatStore.data.name} />}

          <IconButton onClick={() => onCreateChat.promise()}>
            <Plus />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Fragment>
  );
});