/// <reference types="react" />
import { ThemeParsed, ThemeProps } from '../types';
declare type ThemeListener = (name: string | null, themeManager: ThemeManager) => void;
export declare type SetActiveThemeProps = {
    className?: string;
    parentManager?: ThemeManager | null;
    name?: string | null;
    theme?: any;
};
declare type NextTheme = {
    name: string;
    theme?: ThemeParsed | null;
    className?: string;
};
export declare class ThemeManager {
    parentManager?: ThemeManager | undefined;
    reset: boolean;
    keys: Map<any, Set<string>>;
    listeners: Map<any, Function>;
    themeListeners: Set<ThemeListener>;
    name: string;
    className: string;
    theme: ThemeParsed | null;
    constructor(props?: Partial<NextTheme> | undefined, parentManager?: ThemeManager | undefined, reset?: boolean);
    get didChangeTheme(): boolean | undefined;
    get parentName(): string | null;
    get fullName(): string;
    getValue(key: string): import("..").Variable<any> | undefined;
    isTracking(uuid: Object): boolean;
    update({ name, theme, className }?: SetActiveThemeProps, force?: boolean, notify?: boolean): boolean;
    getNextTheme(props?: ThemeProps, debug?: any): NextTheme;
    getCN(name: string, disableRemoveScheme?: boolean): string;
    track(uuid: any, keys: Set<string>): void;
    notify(): void;
    onChangeTheme(cb: ThemeListener): () => void;
}
export declare const ThemeManagerContext: import("react").Context<ThemeManager | null>;
export declare const emptyManager: ThemeManager;
export {};
//# sourceMappingURL=ThemeManager.d.ts.map