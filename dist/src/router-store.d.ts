declare class RouterStore {
    params: {};
    queryParams: {};
    currentView: any;
    constructor();
    goTo(view: any, paramsObj: any, store: any, queryParamsObj: any): void;
    readonly currentPath: any;
}
export default RouterStore;
