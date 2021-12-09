import { DropFirst } from '@avalenti89/typescript-utils';
import { useMemo } from 'react';
import { IntlFormatters, MessageDescriptor, useIntl } from 'react-intl';

type Messages<T extends Record<string, MessageDescriptor>> = Record<
	keyof T,
	(...args: DropFirst<Parameters<IntlFormatters['formatMessage']>>) => string
>;

export const useMessages = <T extends Record<string, MessageDescriptor>>(
	messages: T
): Messages<T> => {
	const intl = useIntl();
	const _messages = useMemo(
		() => ({
			...Object.entries(messages).reduce<Messages<T>>(
				(prev, [key, message]) => {
					return {
						...prev,
						[key]: (
							...args: DropFirst<Parameters<IntlFormatters['formatMessage']>>
						) => intl.formatMessage(message, ...args),
					};
				},
				{} as Messages<T>
			),
		}),
		[intl, messages]
	);

	return _messages;
};
