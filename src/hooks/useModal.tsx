import React from 'react';
import { IPortalProps, Portal } from '../components/portal/Portal';
import { useToggle } from './useToggle';

export const useModal = (
  target: IPortalProps['target'],
  defaultIsOpen?: boolean
) => {
  const [isOpen, toggleIsOpen] = useToggle(defaultIsOpen);

  const open = () => toggleIsOpen(true);
  const close = () => toggleIsOpen(false);

  const Modal = ({ children }: React.PropsWithChildren<{}>) =>
    isOpen ? <Portal target={target}>{children}</Portal> : null;

  return {
    open,
    close,
    toggle: toggleIsOpen,
    Modal,
    isOpen,
  };
};
