import React from 'react';
import { IPortalProps, Portal } from '../components/portal/Portal';
import { useToggle } from './useToggle';

interface IUseModalProps {
  target: IPortalProps['target'];
  defaultIsOpen?: boolean;
}
export const useModal = (props: IUseModalProps) => {
  const { defaultIsOpen, target } = props;
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
