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

    const rootViewChanged = !this.currentView || (this.currentView !== view);
    const currentParams = toJS(this.params);
    const currentQueryParams = toJS(this.queryParams);

    const beforeExitResult = (rootViewChanged && this.currentView && this.currentView.beforeExit) ? this.currentView.beforeExit(this.currentView, currentParams, store, currentQueryParams) : true;
    if (beforeExitResult === false) {
      return;
    }

    const beforeEnterResult = (rootViewChanged && view.beforeEnter) ? view.beforeEnter(view, currentParams, store, currentQueryParams) : true
    if (beforeEnterResult === false) {
      return;
    }
    const nextParams = toJS(paramsObj);
    const nextQueryParams = toJS(queryParamsObj);

    rootViewChanged && this.currentView && this.currentView.onExit && this.currentView.onExit(this.currentView, currentParams, store, currentQueryParams);

    const origParams = toJS(this.params)
    const origQueryParams = toJS(this.queryParams)

    this.currentView = view;
    this.params = toJS(paramsObj);
    this.queryParams = toJS(queryParamsObj);

    rootViewChanged && view.onEnter && view.onEnter(view, nextParams, store, nextQueryParams);
    !rootViewChanged && this.currentView && this.currentView.onParamsChange &&
      this.currentView.onParamsChange(this.currentView, origParams, store, origQueryParams);
  }

  @computed get currentPath() {
    return this.currentView ? this.currentView.replaceUrlParams(this.params, this.queryParams) : '';
  }
}

export default RouterStore;
