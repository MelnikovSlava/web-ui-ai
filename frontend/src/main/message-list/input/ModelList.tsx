import React, { FC, useContext, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';
import { VitalProps } from '../../../utils/types';
import { useRootStore } from '../../../store/root.store';
import { useChatStore } from '../../../hooks/useChatStore';
import { Menu, MenuItem, Typography } from '@mui/material';
import { usePromise } from '../../../hooks/usePromise';


type ModelListProps = {

} & VitalProps

export const ModelList = observer((props: ModelListProps)=> {
  const rootStore = useRootStore();
	const chatStore = useChatStore();

  const update = usePromise({
  func: chatStore.changeChatModel
})

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<any>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange= (model: string) => {
    update.promise(model);
    handleClose();
  };

    const chatModel = chatStore.getModel();

  const list = useMemo(()=>{
    const arr = rootStore.models.map((m) => m.name);

    if (!arr.includes(chatModel)) {
      arr.unshift(chatModel);
    }

    return arr;
  },[rootStore.models.length])
  
  return (
    <div className={clsx('', props.className)}>
      <Typography variant='caption' className={clsx('opacity-30 hover:opacity-100', 'cursor-pointer')} onClick={handleClick}>{chatModel}</Typography>

            <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
      {list.map((model) => {
        return <MenuItem key={model} onClick={() => handleChange(model)}>{model}</MenuItem>
     })} 
      </Menu>
   </div>
  );
});