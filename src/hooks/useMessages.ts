import { DropFirst } from '@avalenti89/typescript-utils';
import { useMemo, useRef } from 'react';
import { IntlFormatters, MessageDescriptor, useIntl } from 'react-intl';

type Messages<T extends Record<string, MessageDescriptor>> = Record<
	keyof T,
	(...args: DropFirst<Parameters<IntlFormatters['formatMessage']>>) => string
>;

type FormatMessageArgs = DropFirst<Parameters<IntlFormatters['formatMessage']>>;
/**
 *
 * @param messages defineMessages dict
 * @param overrideFallbackId It will stored/used as ref.
 * If provided, it will used to overrides message if this result as id (default fallback).
 * - If true, it will be returned as empty string
 * - If string, it will be returned as provided string
 * - If function, the returns will be used as described above
 * @returns A dict of functions with the same parameters of "formatMessage"
 */
export const useMessages = <T extends Record<string, MessageDescriptor>>(
	messages: T,
	overrideFallbackId?:
		| boolean
		| string
		| ((
				text: string,
				message: MessageDescriptor,
				args: FormatMessageArgs
		  ) => boolean | string)
): Messages<T> => {
	const overrideRef = useRef(overrideFallbackId);
	const intl = useIntl();
	const _messages = useMemo(
		() => ({
			...Object.entries(messages).reduce<Messages<T>>(
				(prev, [key, message]) => {
					return {
						...prev,
						[key]: (...args: FormatMessageArgs) => {
							const text = intl.formatMessage(message, ...args);
							let fallback: boolean | string | undefined;
							if (typeof overrideRef.current === 'function') {
								fallback = overrideRef.current(text, message, args);
							} else {
								fallback = overrideRef.current;
							}
							if (text === message.id && fallback) {
								return fallback === true ? '' : fallback;
							}
							return text;
						},
					};
				},
				{} as Messages<T>
			),
		}),
		[intl, messages]
	);

	return _messages;
};
