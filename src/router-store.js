import {extendObservable, action, toJS} from 'mobx';

class Router {

  params = {};
  currentView;

  constructor() {
    extendObservable(this, {
      currentView: undefined,
      params: undefined,
      currentPath: () => this.currentView ? this.currentView.replaceUrlParams(this.params) : ''
    });
  }

  goTo = action((view, paramsObj, store) => {

    const rootViewChanged = !this.currentView || (this.currentView.rootPath !== view.rootPath);

    const beforeExitResult = (rootViewChanged && this.currentView && this.currentView.beforeExit) ? this.currentView.beforeExit(this.currentView, this.params, store) : true;
    if (beforeExitResult === false) {
      return;
    }

    const beforeEnterResult = (rootViewChanged && view.beforeEnter) ? view.beforeEnter(view, this.params, store) : true
    if (beforeEnterResult === false) {
      return;
    }

    rootViewChanged && this.currentView && this.currentView.onExit && this.currentView.onExit(this.currentView, this.params, store);

    this.currentView = view;
    this.params = toJS(paramsObj);

    rootViewChanged && view.onEnter && view.onEnter(view, this.params, store);
  });

}

export default Router;