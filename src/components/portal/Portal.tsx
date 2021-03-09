import React from 'react';
import ReactDOM from 'react-dom';

export interface IPortalProps {
  target: string | HTMLElement | null;
}

export const Portal = React.memo(
  ({ children, target }: React.PropsWithChildren<IPortalProps>) => {
    const portal =
      typeof target === 'string' ? document.querySelector(target) : target;

    if (!portal) return null;
    return ReactDOM.createPortal(children, portal);
  }
);
