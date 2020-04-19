// eslint-disable-next-line
import React from 'react';
import { Route } from '../../src/route';
import { mocks } from './mocks';

export const routes = {
    home: new Route({
        path: '/',
        component: <div />,
        onEnter: () => {
            mocks.enteringHome();
        },
        onExit: () => {
            mocks.exitingHome();
        },
        onParamsChange: () => {
            mocks.changingParamsHome();
        }
    }),
    profile: new Route({
        path: '/profile/:username/:tab',
        component: <div />,
        onEnter: (route, params) => {
            mocks.enteringProfile(params);
        },
        onExit: (route, params) => {
            mocks.exitingProfile(params);
        },
        onParamsChange: (route, params, store, queryParams) => {
            mocks.changingParamsProfile(params, queryParams);
        }
    })
};
