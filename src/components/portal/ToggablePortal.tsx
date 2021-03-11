import React from 'react';
import { IPortalProps, Portal } from './Portal';

export const ToggablePortal = ({
  children,
  isActive,
  target,
}: React.PropsWithChildren<{
  isActive: boolean;
  target: IPortalProps['target'];
}>) => {
  return isActive ? <Portal target={target}>{children}</Portal> : null;
};
