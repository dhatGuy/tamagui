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
    get allKeys(): Set<string>;
    get didChangeTheme(): boolean | null;
    get parentName(): string | null;
    get fullName(): string;
    getValue(key: string): import("..").Variable<any> | undefined;
    isTracking(uuid: Object): boolean;
    update(props?: ThemeProps & {
        forceTheme?: ThemeParsed;
    }, force?: boolean, notify?: boolean): boolean;
    findNearestDifferingParentManager(): void;
    getKey(props?: ThemeProps | undefined): string;
    getState(props?: ThemeProps | undefined): ThemeManagerState | null;
    getCN(name: string, disableRemoveScheme?: boolean): string;
    track(uuid: any, keys: Set<string>): void;
    notify(): void;
    onChangeTheme(cb: ThemeListener): () => void;
}
export declare const ThemeManagerContext: import("react").Context<ThemeManager | null>;
export {};
//# sourceMappingURL=ThemeManager.d.ts.map