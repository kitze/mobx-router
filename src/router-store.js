import { observable, computed, action, toJS, runInAction } from 'mobx';

export class RouterStore {
    @observable params = {};
    @observable queryParams = {};
    @observable currentView;

    constructor() {
        this.goTo = this.goTo.bind(this);
    }

    @action
    async goTo(view, paramsObj, store, queryParamsObj) {
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
                      toJS(paramsObj),
                      store,
                      toJS(queryParamsObj),
                      nextPath
                  )
                : true;
        if (beforeEnterResult === false) {
            return;
        }

        rootViewChanged &&
            this.currentView &&
            this.currentView.onExit &&
            this.currentView.onExit(
                this.currentView,
                currentParams,
                store,
                currentQueryParams,
                nextPath
            );

        runInAction(() => {
            this.currentView = view;
            this.params = toJS(paramsObj);
            this.queryParams = toJS(queryParamsObj);
        });

        const nextParams = toJS(paramsObj);
        const nextQueryParams = toJS(queryParamsObj);

        rootViewChanged &&
            view.onEnter &&
            view.onEnter(view, nextParams, store, nextQueryParams);
        !rootViewChanged &&
            this.currentView &&
            this.currentView.onParamsChange &&
            this.currentView.onParamsChange(
                this.currentView,
                nextParams,
                store,
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
