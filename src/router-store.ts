import { observable, computed, action, toJS, runInAction } from 'mobx';
import { Route } from '.';
import { RouteParams, QueryParams } from './route';

export interface Store {
    router: RouterStore;
}

export class RouterStore {
    @observable params: RouteParams = {};
    @observable queryParams: QueryParams = {};
    @observable currentView?: Route<any, any, any>;

    constructor() {
        this.goTo = this.goTo.bind(this);
    }

    @action
    async goTo<S extends Store, P extends RouteParams = {}, Q extends QueryParams = {}>(
        view: Route<S, P, Q>,
        paramsObj?: P,
        store?: S | null,
        queryParamsObj?: Q,
    ) {
        const nextPath = view.replaceUrlParams(paramsObj, queryParamsObj);
        const pathChanged = nextPath !== this.currentPath;

        if (!pathChanged) {
            return;
        }

        const rootViewChanged = !this.currentView || this.currentView !== view;
        const currentParams = toJS(this.params);
        const currentQueryParams = toJS(this.queryParams);

        const beforeExitResult =
            rootViewChanged && this.currentView && this.currentView.beforeExit
                ? await this.currentView.beforeExit(
                    this.currentView,
                    currentParams,
                    store,
                    currentQueryParams,
                    nextPath
                )
                : true;
        if (beforeExitResult === false) {
            return;
        }

        const beforeEnterResult =
            rootViewChanged && view.beforeEnter
                ? await view.beforeEnter(
                    view,
                    toJS(paramsObj || {} as P),
                    store!, // Todo: use this.store (from constructor)
                    toJS(queryParamsObj || {} as Q),
                    nextPath
                )
                : true;
        if (beforeEnterResult === false) {
            return;
        }

        rootViewChanged &&
            this.currentView &&
            this.currentView.onExit &&
            (this.currentView as Route<S, P, Q>).onExit!(
                this.currentView,
                currentParams as P,
                store!,
                currentQueryParams as Q,
                nextPath
            );

        runInAction(() => {
            this.currentView = view;
            this.params = paramsObj ? toJS(paramsObj) : {};
            this.queryParams = queryParamsObj ? toJS(queryParamsObj) : {};
        });

        const nextParams = toJS(this.params as P);
        const nextQueryParams = toJS(this.queryParams as Q);

        rootViewChanged &&
            view.onEnter &&
            view.onEnter(view,
                nextParams,
                store!, // Todo: use this.store (from constructor)
                nextQueryParams,
            );

        !rootViewChanged &&
            this.currentView &&
            this.currentView.onParamsChange &&
            (this.currentView as Route<S, P, Q>).onParamsChange!(
                this.currentView,
                nextParams,
                store!,
                nextQueryParams
            );
    }

    @computed
    get currentPath() {
        return this.currentView
            ? this.currentView.replaceUrlParams(this.params, this.queryParams)
            : '';
    }
}
