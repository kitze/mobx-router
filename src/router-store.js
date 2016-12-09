import {observable, computed, action, toJS} from 'mobx';

class RouterStore {

  @observable params = {};
  @observable queryParams = {};
  @observable currentView;

  constructor() {
    this.goTo = this.goTo.bind(this);
  }

  @action goTo(view, paramsObj, store, queryParamsObj) {

    const nextPath = view.replaceUrlParams(paramsObj, queryParamsObj);
    const pathChanged = nextPath !== this.currentPath;

    if (!pathChanged) {
      return;
    }

    const rootViewChanged = !this.currentView || (this.currentView.rootPath !== view.rootPath);
    const currentParams = toJS(this.params);
    const currentQueryParams = toJS(this.queryParams);

    const beforeExitResult = (rootViewChanged && this.currentView && this.currentView.beforeExit) ? this.currentView.beforeExit(this.currentView, currentParams, store, currentQueryParams) : true;
    if (beforeExitResult === false) {
      return;
    }

    let beforeEnterResult;
    if (rootViewChanged && view.beforeEnter) {
      beforeEnterResult = view.beforeEnter(view, paramsObj, store, currentQueryParams);
      if (typeof beforeEnterResult.then === 'function') {
        return beforeEnterResult
          .then(() => this.changeView(rootViewChanged, currentParams, queryParamsObj, paramsObj, store, currentQueryParams, view));
      }
    }

    if (beforeEnterResult === false) {
        return;
      }
    this.changeView(rootViewChanged, currentParams, queryParamsObj, paramsObj, store, currentQueryParams, view);
  }

  @action changeView(rootViewChanged, currentParams, queryParamsObj, paramsObj, store, currentQueryParams, view) {
    rootViewChanged && this.currentView && this.currentView.onExit && this.currentView.onExit(this.currentView, currentParams, store, currentQueryParams);
    this.currentView = view;
    this.params = toJS(paramsObj);
    this.queryParams = toJS(queryParamsObj);
    const nextParams = toJS(paramsObj);
    const nextQueryParams = toJS(queryParamsObj);

    rootViewChanged && view.onEnter && view.onEnter(view, nextParams, store, nextQueryParams);
    !rootViewChanged && this.currentView && this.currentView.onParamsChange && this.currentView.onParamsChange(this.currentView, nextParams, store, nextQueryParams);
  }

  @computed get currentPath() {
    return this.currentView ? this.currentView.replaceUrlParams(this.params, this.queryParams) : '';
  }
}

export default RouterStore;