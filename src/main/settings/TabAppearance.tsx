import React, { FC, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';
import { VitalProps } from '../../utils/types';
import { SelectTheme } from './SelectTheme';


type TabAppearanceProps = {

} & VitalProps

export const TabAppearance = observer((props: TabAppearanceProps) => {

  return (
    <div className={clsx('', props.className)}>

      <SelectTheme />
    </div>
  );
});