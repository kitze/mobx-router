import { observable, computed, action, toJS, runInAction } from 'mobx';
import { Route } from '.';
import { RouteParams, QueryParams } from './route';

export interface Store {
    router: RouterStore<Store>;
}

export class RouterStore<S extends Store> {
    @observable params: RouteParams = {};
    @observable queryParams: QueryParams = {};
    @observable currentView?: Route<S, any, any>;

    readonly store: S;

    constructor(store: S) {
        this.store = store;
    }

    @action
    async goTo<P extends RouteParams = {}, Q extends QueryParams = {}>(
        view: Route<S, P, Q>,
        paramsObj?: P,
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
                    this.store,
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
                    this.store,
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
                this.store,
                currentQueryParams as Q,
                nextPath
            );

        runInAction(() => {
            this.currentView = view;
            this.params = toJS(paramsObj) as P;
            this.queryParams = toJS(queryParamsObj) as Q;
        });

        const nextParams = toJS(this.params as P);
        const nextQueryParams = toJS(this.queryParams as Q);

        rootViewChanged &&
            view.onEnter &&
            view.onEnter(view,
                nextParams,
                this.store,
                nextQueryParams,
            );

        !rootViewChanged &&
            this.currentView &&
            this.currentView.onParamsChange &&
            this.currentView.onParamsChange(
                this.currentView,
                nextParams,
                this.store,
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
