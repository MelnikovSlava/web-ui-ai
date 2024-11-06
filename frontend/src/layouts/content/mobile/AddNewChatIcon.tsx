import { IconButton } from '@mui/material';
import { Plus } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useCreateChat } from '../../../hooks/useCreateChat';
import type { VitalProps } from '../../../utils/types';


type AddNewChatIconProps = {

} & VitalProps

export const AddNewChatIcon = observer((props: AddNewChatIconProps) => {
  const { onCreateChat } = useCreateChat();

  return (
    <IconButton onClick={() => onCreateChat.promise()}>
      <Plus />
    </IconButton>
  );
});