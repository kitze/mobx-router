// eslint-disable-next-line
import React from 'react';

import { autorun, reaction, toJS } from 'mobx';

import { Route, RouterStore, startRouter } from '../src';

const path = '/profile/:username/:tab';
const routes = {
    home: new Route<any>({
        path: '/',
        component: <>HOME</>,
    }),
    profile: new Route<any>({
        path,
        component: <div />,
    }),
};

describe('RouterStore', () => {
    test('it should trigger autorun when currentRoute is changed', () => {
        const router = new RouterStore({} as any);
        const autorunCallback = jest.fn();
        autorun(() => {
            router.currentRoute;
            autorunCallback();
        });

        router.goTo(routes.profile);

        expect(autorunCallback).toHaveBeenCalledTimes(2);
    });

    test('if currentRoute is observable', () => {
        const store = {
            router: new RouterStore({} as any),
        };

        startRouter(routes, store);
        const reactionCallback = jest.fn();
        const dispose = reaction(
            () => store.router.currentRoute,
            (route) => reactionCallback(toJS(route))
        );
        store.router.goTo(routes.profile);

        expect(reactionCallback).toHaveBeenCalledWith(
            expect.objectContaining({
                path: path,
            })
        );

        store.router.goTo(routes.home);

        store.router.goTo(routes.profile);

        expect(reactionCallback).toHaveBeenCalledTimes(3);

        dispose();
    });
});
