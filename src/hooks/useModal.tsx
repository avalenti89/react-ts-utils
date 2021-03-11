import React, { useCallback } from 'react';
import { ToggablePortal } from '../components';
import { IPortalProps } from '../components/portal/Portal';
import { useToggle } from './useToggle';

export const useModal = (
  target: IPortalProps['target'],
  defaultIsOpen?: boolean
) => {
  const [isOpen, toggleIsOpen] = useToggle(defaultIsOpen);

  const open = useCallback(() => toggleIsOpen(true), [toggleIsOpen]);
  const close = useCallback(() => toggleIsOpen(false), [toggleIsOpen]);

  const Modal = useCallback(
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
    toggle: toggleIsOpen,
    Modal,
    isOpen,
  };
};
