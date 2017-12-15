// eslint-disable-next-line
import React from 'react';
import { Route } from '../src/route';

test('Route', () => {
    const route = new Route({
        path: '/profile/:username/:tab',
        component: <div />
    });

    const replacedUrlParams = route.replaceUrlParams({
        username: 'kitze',
        tab: 'profile'
    });
    const paramsObject = route.getParamsObject(['kitze', 'profile']);

    expect(route.path).toBe('/profile/:username/:tab');
    expect(paramsObject).toEqual({
        tab: 'profile',
        username: 'kitze'
    });
    expect(replacedUrlParams).toBe('/profile/kitze/profile');
    expect(route.rootPath).toBe('/profile');
});
