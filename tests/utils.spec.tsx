// eslint-disable-next-line
import React from 'react';
import {
    viewsForDirector,
    isObject,
    getObjectKeys,
    getRegexMatches
} from '../src/utils';
import { paramRegex } from '../src/regex';
import { Route } from '../src/route';
import { Store } from '../src/router-store';

test('viewsForDirector', () => {
    const views = {
        home: new Route({
            path: '/',
            component: <div />
        }),
        userProfile: new Route({
            path: '/profile/:username/:tab',
            component: <div />
        }),
        gallery: new Route({
            path: '/gallery',
            component: <div />
        })
    };

    const result = viewsForDirector(views, {} as Store);
    const keys = Object.keys(result);
    const values = keys.map(k => result[k]);

    expect(keys).toEqual(['/', '/profile/:username/:tab', '/gallery']);
    values.forEach(value => {
        expect(typeof value).toEqual('function');
    });
});

test('isObject', () => {
    expect(isObject({})).toBe(true);
    expect(isObject([])).toBe(false);
    expect(isObject(1)).toBe(false);
    expect(isObject('string')).toBe(false);
});

test('getObjectKeys', () => {
    expect(getObjectKeys({ a: 1, b: 2 })).toEqual(['a', 'b']);
    expect(getObjectKeys(null)).toEqual([]);
    expect(getObjectKeys(undefined)).toEqual([]);
    expect(getObjectKeys([])).toEqual([]);
    expect(getObjectKeys('str')).toEqual([]);
    expect(getObjectKeys(123)).toEqual([]);
});

test('getRegexMatches', () => {
    const paramsArray = [] as string[];
    const path = '/profile/user/:username/:tab?';

    getRegexMatches(path, paramRegex, match => {
        paramsArray.push(match[2]);
    });

    const paramsArray2 = [] as string[];
    const path2 = '/profile';

    getRegexMatches(path2, paramRegex, match => {
        paramsArray2.push(match[2]);
    });

    const paramsArray3 = [] as string[];
    const path3 = '/profile/:username';

    getRegexMatches(path3, paramRegex, ([, , third]) => {
        paramsArray3.push(third);
    });

    const paramsArray4 = [] as string[];

    getRegexMatches(path, paramRegex, ([, second]) => {
        paramsArray4.push(second);
    });

    expect(paramsArray).toEqual(['username', 'tab']);
    expect(paramsArray2).toEqual([]);
    expect(paramsArray3).toEqual(['username']);
    expect(paramsArray4).toEqual([':username', ':tab?']);
});
