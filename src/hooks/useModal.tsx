import React, { useCallback, useState } from 'react';
import { ToggablePortal } from '../components';
import { IPortalProps } from '../components/portal/Portal';

export const useModal = (
  target: IPortalProps['target'],
  defaultIsOpen: boolean = false
) => {
  const [isOpen, setIsOpen] = useState(defaultIsOpen);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback((value: boolean = !isOpen) => setIsOpen(value), [
    isOpen,
  ]);
  const Modal = useCallback<React.FC>(
    ({ children }: React.PropsWithChildren<{}>) => (
      <ToggablePortal target={target} isActive={isOpen}>
        {children}
      </ToggablePortal>
    ),
    [target, isOpen]
  );

  return {
    open,
    close,
    toggle,
    Modal,
    isOpen,
  };
};
