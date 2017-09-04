import {observable, computed, action, toJS} from 'mobx';

class RouterStore {

  @observable params = {};
  @observable queryParams = {};
  @observable currentView;

  constructor() {
    this.goTo = this.goTo.bind(this);
    this.returnTo = this.returnTo.bind(this);
  }

  @action returnTo( store, defaultView ) {
    if ( this.rejectedView ) this.goTo( this.rejectedView, this.rejectedParams, store, this.rejectedQueryParams );
    else if ( defaultView ) this.goTo( defaultView.view, defaultView.params, store, defaultView.queryParams );
    else console.error( 'no rejected view to return to and no default view provided' );
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

    const nextParams = toJS(paramsObj);
    const nextQueryParams = toJS(queryParamsObj);

    this.rejectedParams = null;
    this.rejectedQueryParams = null;
    this.rejectedView = null;
    
    const beforeEnterResult = (rootViewChanged && view.beforeEnter) ? view.beforeEnter(view, nextParams, store, nextQueryParams) : true
    if (beforeEnterResult === false) {
      this.rejectedParams = toJS(paramsObj);
      this.rejectedQueryParams = toJS(queryParamsObj);
      this.rejectedView = view;
      return;
    }

    rootViewChanged && this.currentView && this.currentView.onExit && this.currentView.onExit(this.currentView, currentParams, store, currentQueryParams);

    this.currentView = view;
    this.params = toJS(paramsObj);
    this.queryParams = toJS(queryParamsObj);

    rootViewChanged && view.onEnter && view.onEnter(view, nextParams, store, nextQueryParams);
    !rootViewChanged && this.currentView && this.currentView.onParamsChange && this.currentView.onParamsChange(this.currentView, nextParams, store, nextQueryParams);
  }

  @computed get currentPath() {
    return this.currentView ? this.currentView.replaceUrlParams(this.params, this.queryParams) : '';
  }
}

export default RouterStore;
