import {Router} from 'director/build/director';
import {autorun} from 'mobx';
import {viewsForDirector} from './utils';

const createDirectorRouter = (views: any, store: any) => {
  new Router({
    ...viewsForDirector(views, store)
  }).configure({
    html5history: true
  }).init();
};

const startRouter = (views: any, store: any) => {
  //create director configuration
  createDirectorRouter(views, store);

  //autorun and watch for path changes
  autorun(() => {
    const {currentPath} = store.router;
    if (currentPath !== window.location.pathname) {
      window.history.pushState(null, null, currentPath)
    }
  });
};

export default startRouter;
