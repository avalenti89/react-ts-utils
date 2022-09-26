import { DropFirst } from '@avalenti89/typescript-utils';
import { useCallback, useMemo, useRef } from 'react';
import { IntlFormatters, MessageDescriptor, useIntl } from 'react-intl';

type CustomOptions = FormatMessageOpts & { capitalize?: boolean };
type FormatMessageFn<F extends ForceDefault = undefined> = (
	values?: FormatMessageValues,
	options?: CustomOptions
) => F extends false | string | undefined ? string : string | undefined;

type ForceDefault = boolean | string | undefined;
type FormatMessageValues = DropFirst<
	Parameters<IntlFormatters['formatMessage']>
>[0];
type FormatMessageOpts = DropFirst<
	Parameters<IntlFormatters['formatMessage']>
>[1];
type Messages<
	T extends Record<string, MessageDescriptor>,
	F extends ForceDefault = undefined
> = Record<keyof T, FormatMessageFn<F>>;

const getFallback = (
	value: boolean | string | undefined,
	defaultMessage: string | undefined
): false | string | undefined => {
	return value === true ? defaultMessage || undefined : value;
};

/**
 *
 * @param messages defineMessages dict
 * @param forceDefaultMessageFallback It will stored/used as ref.
 * Default behaviour if there is no default message, is to return the ID (defaultMessage == undefined => id).
 * If provided, it will used to overrides default behaviour.
 * - If true, it will be returned as undefined
 * - If string, it will be returned as provided string
 * - If function, the returns will be used as described above
 * @returns A dict of functions with the same parameters of "formatMessage"
 */
export const useMessages = <
	T extends Record<string, MessageDescriptor>,
	F extends ForceDefault = undefined
>(
	messages: T,
	forceDefaultMessageFallback?: F
): Messages<T, F> => {
	const overrideRef = useRef(forceDefaultMessageFallback);
	const intl = useIntl();

	const formatMessage = useCallback(
		(message: MessageDescriptor) =>
			(
				values: FormatMessageValues,
				{ capitalize, ...opts }: CustomOptions = {}
			) => {
				const text = intl.formatMessage(message, values, opts);
				const defaultMessage =
					typeof message.defaultMessage === 'string'
						? message.defaultMessage
						: undefined;
				const fallback = getFallback(overrideRef.current, defaultMessage);
				if (text === message.id && fallback !== false) {
					return fallback;
				}
				return capitalize ? text.charAt(0).toUpperCase() + text.slice(1) : text;
			},
		[intl]
	);

	const _messages = useMemo(
		() =>
			Object.entries(messages).reduce<Messages<T, F>>(
				(prev, [key, message]) => {
					return {
						...prev,
						[key]: formatMessage(message),
						// [key]: (values, { capitalize, ...opts } = {}) => {
						// 	const text = intl.formatMessage(message, values, opts);
						// 	const defaultMessage =
						// 		typeof message.defaultMessage === 'string'
						// 			? message.defaultMessage
						// 			: undefined;
						// 	const fallback = getFallback(overrideRef.current, defaultMessage);
						// 	if (text === message.id && fallback !== false) {
						// 		return fallback;
						// 	}
						// 	return capitalize
						// 		? text.charAt(0).toUpperCase() + text.slice(1)
						// 		: text;
						// },
					};
				},
				{} as Messages<T, F>
			),
		[formatMessage, messages]
	);

	return _messages;
};
