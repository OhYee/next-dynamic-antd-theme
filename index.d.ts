import ThemeType from './theme/type';

declare function changeTheme(theme: 'default' | 'dark' | ThemeType): void;

export default changeTheme;
export const defaultTheme: ThemeType;
export const darkTheme: ThemeType;
