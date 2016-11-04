import {observable, computed, action, toJS} from 'mobx';

class RouterStore {

  @observable params = {};
  @observable currentView;

  constructor() {
    this.goTo = this.goTo.bind(this);
  }

  @action goTo(view, paramsObj, store) {

    const rootViewChanged = !this.currentView || (this.currentView.rootPath !== view.rootPath);

    const currentParams = toJS(this.params);

    const beforeExitResult = (rootViewChanged && this.currentView && this.currentView.beforeExit) ? this.currentView.beforeExit(this.currentView, currentParams, store) : true;
    if (beforeExitResult === false) {
      return;
    }

    const beforeEnterResult = (rootViewChanged && view.beforeEnter) ? view.beforeEnter(view, currentParams, store) : true
    if (beforeEnterResult === false) {
      return;
    }

    rootViewChanged && this.currentView && this.currentView.onExit && this.currentView.onExit(this.currentView, currentParams, store);

    this.currentView = view;
    const nextParams = toJS(paramsObj);
    this.params = toJS(paramsObj);

    rootViewChanged && view.onEnter && view.onEnter(view, nextParams, store);
    !rootViewChanged && this.currentView && this.currentView.onParamsChange && this.currentView.onParamsChange(this.currentView, nextParams, store);
  }

  @computed get currentPath() {
    return this.currentView ? this.currentView.replaceUrlParams(this.params) : '';
  }
}

export default RouterStore;