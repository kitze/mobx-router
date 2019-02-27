import { Router } from 'director/build/director';
import { autorun } from 'mobx';
import { viewsForDirector } from './utils';

const createDirectorRouter = (views, store, config) => {
    new Router({
        ...viewsForDirector(views, store)
    })
        .configure({
            ...config
        })
        // For more info, see:
        // https://github.com/flatiron/director/issues/199
        .init(config && config.html5history ? null : '/');
};

export const startRouter = (views, store, config) => {
    //set default parameter html5history
    if (
        !config ||
        (config &&
            (config.html5history === null ||
                config.html5history == 'undefined'))
    ) {
        config = { html5history: true };
    }

    //create director configuration
    createDirectorRouter(views, store, config);

    //autorun and watch for path changes
    autorun(() => {
        const { currentPath } = store.router;
        if (config && config.html5history) {
            if (
                currentPath !==
                window.location.pathname + window.location.search
            ) {
                window.history.pushState(null, null, currentPath);
            }
        } else {
            const hash = `#${currentPath}`;
            if (hash !== window.location.hash) {
                window.history.pushState(null, null, hash);
            }
        }
    });
};
