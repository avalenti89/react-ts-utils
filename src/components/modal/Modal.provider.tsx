import { IPortalProps, ToggablePortal } from 'components/portal';
import React, { createContext, useEffect, useState } from 'react';

type IModalContextState = {
	isOpen: boolean;
};
type IModalContextCallback = {
	open: () => void;
	close: () => void;
	toggle: (isOpen: boolean) => void;
};

type IModalContext = IModalContextState & IModalContextCallback;

export const modalContext = createContext({} as IModalContext);

export type IModalProviderProps = Partial<IModalContextState> & {
	onToggle?: (isOpen: boolean) => void;
	target: IPortalProps['target'];
};

export const ModalProvider = ({
	isOpen: _isOpen = false,
	onToggle,
	target,
	children,
}: React.PropsWithChildren<IModalProviderProps>) => {
	const [isOpen, setIsOpen] = useState(_isOpen);

	useEffect(() => {
		setIsOpen(_isOpen);
	}, [_isOpen]);

	useEffect(() => {
		onToggle?.(isOpen);
	}, [isOpen]);

	const open = () => setIsOpen(true);
	const close = () => setIsOpen(false);
	const toggle = (value: boolean) => setIsOpen((prev) => value ?? !prev);

	return (
		<modalContext.Provider value={{ isOpen: _isOpen, open, close, toggle }}>
			<ToggablePortal target={target} isActive={_isOpen}>
				{children}
			</ToggablePortal>
		</modalContext.Provider>
	);
};
