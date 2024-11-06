
import { observer } from 'mobx-react-lite';
import { useUrlChatId } from '../../../hooks/useUrlChatId';
import { useUrlWorkspaceId } from '../../../hooks/useUrlWorkspaceId';
import { useRootStore } from '../../../store/root.store';
import type { VitalProps } from '../../../utils/types';
import { ChatTitle } from '../panel/ChatTitle';


type MobileChatTitleProps = {

} & VitalProps

export const MobileChatTitle = observer((props: MobileChatTitleProps) => {
  const rootStore = useRootStore();
  const urlWorkspaceId = useUrlWorkspaceId();
  const urlChatId = useUrlChatId();

  if (Number.isNaN(urlWorkspaceId) || Number.isNaN(urlChatId)) {
    return null;
  }

  const chatStore = rootStore.getChat(urlWorkspaceId, urlChatId);

  if (!chatStore) {
    return null;
  }

  return (
    <ChatTitle title={chatStore.data.name} />
  );
});