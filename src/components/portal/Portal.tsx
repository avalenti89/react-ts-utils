import React from 'react';
import ReactDOM from 'react-dom';

export interface IPortalProps {
  children: React.ReactChild;
  target: string | HTMLElement | null;
}

export const Portal = React.memo(({ children, target }: IPortalProps) => {
  const portal =
    typeof target === 'string' ? document.getElementById(target) : target;

  if (!portal) return null;
  return ReactDOM.createPortal(children, portal);
});
