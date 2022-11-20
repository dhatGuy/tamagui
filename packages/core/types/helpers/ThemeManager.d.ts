/// <reference types="react" />
import { ThemeParsed, ThemeProps } from '../types';
declare type ThemeListener = (name: string | null, themeManager: ThemeManager) => void;
export declare type SetActiveThemeProps = {
    className?: string;
    parentManager?: ThemeManager | null;
    name?: string | null;
    theme?: any;
    reset?: boolean;
};
declare type ThemeManagerState = {
    name: string;
    theme?: ThemeParsed | null;
    className?: string;
};
export declare class ThemeManager {
    #private;
    ogParentManager?: ThemeManager | "root" | null | undefined;
    props?: ThemeProps | undefined;
    debug?: any;
    keys: Map<any, Set<string>>;
    listeners: Map<any, Function>;
    themeListeners: Set<ThemeListener>;
    originalParentManager: ThemeManager | null;
    parentManager: ThemeManager | null;
    state: ThemeManagerState;
    constructor(ogParentManager?: ThemeManager | "root" | null | undefined, props?: ThemeProps | undefined, debug?: any);
    updateState(props?: ThemeProps & {
        forceTheme?: ThemeParsed;
    }, forceUpdate?: boolean, notify?: boolean): boolean;
    getState(props?: ThemeProps | undefined): ThemeManagerState | null;
    getKey(props?: ThemeProps | undefined): string;
    get allKeys(): Set<string>;
    get parentName(): string | null;
    get fullName(): string;
    getValue(key: string): import("..").Variable<any> | undefined;
    isTracking(uuid: Object): boolean;
    track(uuid: any, keys: Set<string>): void;
    notify(): void;
    onChangeTheme(cb: ThemeListener): () => void;
}
export declare const ThemeManagerContext: import("react").Context<ThemeManager | null>;
export {};
//# sourceMappingURL=ThemeManager.d.ts.map