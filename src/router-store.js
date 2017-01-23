import {observable, computed, action, runInAction, toJS} from 'mobx';

class RouterStore {

  @observable params = {};
  @observable queryParams = {};
  @observable currentView;

  constructor() {
    this.goTo = this.goTo.bind(this);
  }

  @action async goTo(view, paramsObj, store, queryParamsObj) {

    const nextPath = view.replaceUrlParams(paramsObj, queryParamsObj);
    const pathChanged = nextPath !== this.currentPath;

    if (!pathChanged) {
      return;
    }

    const rootViewChanged = !this.currentView || (this.currentView.rootPath !== view.rootPath);
    const currentParams = toJS(this.params);
    const currentQueryParams = toJS(this.queryParams);

    // Run `beforeExit` hook if it exists on the current view
    if (rootViewChanged && this.currentView && this.currentView.beforeExit) {
      const beforeExitResult = await this.currentView.beforeExit(this.currentView, currentParams, store, currentQueryParams);
      if (beforeExitResult === false) {
        return;
      }
    }
   
    // Run `beforeEnter` hook if it exists on the current route
    if (rootViewChanged && view.beforeEnter) {
        const beforeEnterResult = await view.beforeEnter(view, currentParams, store, currentQueryParams);
        if (beforeEnterResult === false) {
          return;
        }

    }
   
    // Run `onExit` hook if it exists on the current route
    rootViewChanged && this.currentView && this.currentView.onExit && this.currentView.onExit(this.currentView, currentParams, store, currentQueryParams);

    // MobX requires us to update the state in `runAction` as this @action is now async (see https://mobx.js.org/refguide/action.html)
    runInAction('update router state after async beforeExit and beforeEnter', () => {
      this.currentView = view;
      this.params = toJS(paramsObj);
      this.queryParams = toJS(queryParamsObj);
    });
    
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