import React, { FC, useState } from 'react';
import clsx from 'clsx';
import { FormControl, FormLabel, Input } from '@mui/joy';
import { localStorageUtils } from '../../utils/localStorage';
import { VitalProps } from '../../utils/types';
import { useGlobalStore } from '../../store/global.store';
import { observer } from 'mobx-react-lite';


type InputTokenProps = {

} & VitalProps;

export const InputToken = observer((props: InputTokenProps) => {
  const storeGlobal = useGlobalStore();
  const storeSettings = storeGlobal.settingsStore;

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    storeSettings.setToken(e.target.value);
  };

  return (
    <FormControl>
      <FormLabel sx={{ color: "inherit" }}>Openrouter key</FormLabel>
      <Input value={storeSettings.token} onChange={handleTokenChange} />
    </FormControl>
  );
});