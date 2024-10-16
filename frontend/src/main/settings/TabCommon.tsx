import React, { FC, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';
import { VitalProps } from '../../utils/types';
import { FormControl, FormLabel, Input } from '@mui/joy';
import { SelectTheme } from './SelectTheme';
import { UsageWidget } from './UsageWidget';
import { InputToken } from './InputToken';


type TabCommonProps = {

} & VitalProps

export const TabCommon = observer((props: TabCommonProps) => {

  return (
    <div className={clsx("flex flex-1 flex-col", props.className)}>
      <InputToken />

      <UsageWidget />
    </div>
  );
});