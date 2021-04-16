export type KeyString<T extends object> = Extract<keyof T, string>;
