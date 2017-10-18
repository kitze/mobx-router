/// <reference types="react" />
export declare type Callback = (route: any, params: any, store: any, queryParams: any) => void;
export declare type ConfirmCallback = (route: any, params: any, store: any, queryParams: any) => boolean;
export declare class Route {
    component: React.ComponentType;
    path: string;
    rootPath: string;
    originalPath: string;
    onEnter: Callback;
    onExit: Callback;
    beforeEnter: ConfirmCallback;
    beforeExit: ConfirmCallback;
    constructor(props: any);
    getRootPath(): string;
    replaceUrlParams(params: any, queryParams?: any): string;
    getParamsObject(paramsArray: string[]): {};
    goTo(store: any, paramsArr: string[]): void;
}
export default Route;
