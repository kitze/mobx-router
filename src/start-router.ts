// @ts-ignore
import { Router } from 'director/build/director';

import { autorun } from 'mobx';

import { viewsForDirector } from './utils';
import { RoutesConfig } from './route';
import { Store } from './router-store';

const createDirectorRouter = <T extends Store>(views: RoutesConfig<T>, store: T, config = {}) => {
    new Router({
        ...viewsForDirector(views, store)
    })
        .configure({
            html5history: true,
            ...config
        })
        .init();
};

export const startRouter = <T extends Store>(routes: RoutesConfig<T>, store: T, config = {}) => {
    //create director configuration
    createDirectorRouter<T>(routes, store, config);

    //autorun and watch for path changes
    autorun(() => {
        const { currentPath } = store.router;
        if (currentPath !== (window.location.pathname + window.location.search)) {
            window.history.pushState(null, null || "", currentPath);
        }
    });
};
