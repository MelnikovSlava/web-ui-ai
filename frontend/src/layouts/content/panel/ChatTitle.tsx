import React, { FC } from 'react';
import clsx from 'clsx';
import { INIT_CHAT_TITLE } from '../../../utils/constants';
import { VitalProps } from '../../../utils/types';


type ChatTitleProps = {
  title: string;
} & VitalProps;

export const ChatTitle = (props: ChatTitleProps) => {
  return (
    <h1 className={clsx("line-clamp-1 text-[14px]", props.className)}>
      {props.title || INIT_CHAT_TITLE}
    </h1>
  );
};