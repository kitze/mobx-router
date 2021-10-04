import {
    computed,
    makeObservable,
    observable,
    action,
    toJS,
    runInAction,
} from 'mobx';
import { Route } from '.';
import { RouteParams, QueryParams } from './route';

export type Store = {
    router: RouterStore<any>;
};

export class RouterStore<S extends Store> {
    params: RouteParams = {};
    queryParams: QueryParams = {};
    currentRoute: Route<S, any, any> | null = null;

    readonly store: S;

    constructor(store: S) {
        this.store = store;
        makeObservable(this, {
            params: observable,
            queryParams: observable,
            currentRoute: observable,
            currentPath: computed,
        });

        //bind
        this.goTo = this.goTo.bind(this);
    }

    setCurrentRoute = action((route: Route<S, any, any>) => {
        this.currentRoute = route;
    });

    async goTo<P extends RouteParams = {}, Q extends QueryParams = {}>(
        route: Route<S, P, Q>,
        paramsObj?: P,
        queryParamsObj?: Q
    ) {
        const setParams = action((paramsObj: QueryParams) => {
            this.params = toJS(paramsObj) as P;
        });

        const setQueryParams = action((queryParamsObj: QueryParams) => {
            this.queryParams = toJS(queryParamsObj) as Q;
        });

        const nextPath = route.replaceUrlParams(paramsObj, queryParamsObj);
        const pathChanged = nextPath !== this.currentPath;

        if (!pathChanged) {
            return;
        }

        const routeChanged = !this.currentRoute || this.currentRoute !== route;
        const currentParams = toJS(this.params);
        const currentQueryParams = toJS(this.queryParams);

        const beforeExitResult =
            routeChanged && this.currentRoute && this.currentRoute.beforeExit
                ? await this.currentRoute.beforeExit(
                      this.currentRoute,
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
            routeChanged && route.beforeEnter
                ? await route.beforeEnter(
                      route,
                      toJS(paramsObj || ({} as P)),
                      this.store,
                      toJS(queryParamsObj || ({} as Q)),
                      nextPath
                  )
                : true;
        if (beforeEnterResult === false) {
            return;
        }

        routeChanged &&
            this.currentRoute &&
            this.currentRoute.onExit &&
            (this.currentRoute as Route<S, P, Q>).onExit!(
                this.currentRoute,
                currentParams as P,
                this.store,
                currentQueryParams as Q,
                nextPath
            );

        runInAction(() => {
            this.setCurrentRoute(route);
            setParams(paramsObj);
            setQueryParams(queryParamsObj);
        });

        const nextParams = toJS(this.params as P);
        const nextQueryParams = toJS(this.queryParams as Q);

        routeChanged &&
            route.onEnter &&
            route.onEnter(route, nextParams, this.store, nextQueryParams);

        !routeChanged &&
            this.currentRoute &&
            this.currentRoute.onParamsChange &&
            this.currentRoute.onParamsChange(
                this.currentRoute,
                nextParams,
                this.store,
                nextQueryParams
            );
    }

    @computed
    get currentPath() {
        return this.currentRoute
            ? this.currentRoute.replaceUrlParams(this.params, this.queryParams)
            : '';
    }
}
