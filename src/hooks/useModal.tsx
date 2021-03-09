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

  const RenderModal = ({ children }: { children: React.ReactChild }) =>
    isOpen && <Portal target={target}>{children}</Portal>;

  return {
    open,
    close,
    toggle: toggleIsOpen,
    RenderModal,
    isOpen,
  };
};
