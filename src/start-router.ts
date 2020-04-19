// @ts-ignore
import { Router } from 'director/build/director';

import { autorun } from 'mobx';

import { viewsForDirector } from './utils';
import { RoutesConfig } from './route';
import { Store } from './router-store';

const createDirectorRouter = (views: RoutesConfig, store: Store, config = {}) => {
    new Router({
        ...viewsForDirector(views, store)
    })
        .configure({
            html5history: true,
            ...config
        })
        .init();
};

export const startRouter = (views: RoutesConfig, store: Store, config = {}) => {
    //create director configuration
    createDirectorRouter(views, store, config);

    //autorun and watch for path changes
    autorun(() => {
        const { currentPath } = store.router;
        if (currentPath !== (window.location.pathname + window.location.search)) {
            window.history.pushState(null, null || "", currentPath);
        }
    });
};
