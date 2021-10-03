import { toJS } from 'mobx';
import queryString from 'query-string';

import { paramRegex, optionalRegex } from './regex';
import { getRegexMatches } from './utils';
import { Store } from './router-store';
import { ReactNode } from 'react';

export type RoutesConfig<T extends Store> = {
    [path: string]: Route<T, any, any>;
};

export type QueryParams =
    | Record<string, string | number | undefined | boolean>
    | undefined;

export type RouteParams = QueryParams;

export class Route<
    S extends Store,
    P extends RouteParams = RouteParams,
    Q extends QueryParams = QueryParams
> {
    //props
    path: string;
    readonly originalPath: string;
    readonly rootPath: string;
    readonly component: ReactNode;
    readonly title?: string;

    //lifecycle methods
    readonly onEnter?: (
        route: Route<S, P, Q>,
        params: P,
        store: S,
        currentQueryParams: Q
    ) => void;
    readonly beforeEnter?: (
        route: Route<S, P, Q>,
        params: P,
        store: S,
        currentQueryParams: Q,
        nextPath: string
    ) => void | boolean | Promise<boolean>;
    readonly beforeExit?: (
        route: Route<S, P, Q>,
        params: P,
        store: S,
        currentQueryParams: Q,
        nextPath: string
    ) => void | boolean | Promise<boolean>;
    readonly onParamsChange?: (
        route: Route<S, P, Q>,
        params: P,
        store: S,
        currentQueryParams: Q
    ) => void;
    readonly onExit?: (
        route: Route<S, P, Q>,
        params: P,
        store: S,
        currentQueryParams: Q,
        nextPath: string
    ) => void;

    constructor({
        path,
        component,
        onEnter,
        beforeExit,
        onParamsChange,
        beforeEnter,
        onExit,
        title,
    }: {
        path: string;
        component: JSX.Element;
        onEnter?: Route<S, P, Q>['onEnter'];
        beforeExit?: Route<S, P, Q>['beforeExit'];
        onParamsChange?: Route<S, P, Q>['onParamsChange'];
        beforeEnter?: Route<S, P, Q>['beforeEnter'];
        onExit?: Route<S, P, Q>['onExit'];
        title?: string;
    }) {
        this.path = path;
        this.component = component;
        this.onEnter = onEnter;
        this.beforeExit = beforeExit;
        this.onParamsChange = onParamsChange;
        this.beforeEnter = beforeEnter;
        this.title = title;
        this.onExit = onExit;

        this.originalPath = this.path;

        //if there are optional parameters, replace the path with a regex expression
        this.path =
            this.path.indexOf('?') === -1
                ? this.path
                : this.path.replace(optionalRegex, '/?([^/]*)?$');

        this.rootPath = this.getRootPath();

        //bind
        this.getRootPath = this.getRootPath.bind(this);
        this.replaceUrlParams = this.replaceUrlParams.bind(this);
        this.getParamsObject = this.getParamsObject.bind(this);
    }

    /*
   Sets the root path for the current path, so it's easier to determine if the route entered/exited or just some params changed
   Example: for '/' the root path is '/', for '/profile/:username/:tab' the root path is '/profile'
   */
    getRootPath() {
        return `/${this.path.split('/')[1]}`;
    }

    /*
   replaces url params placeholders with params from an object
   Example: if url is /book/:id/page/:pageId and object is {id:100, pageId:200} it will return /book/100/page/200
   */
    replaceUrlParams(params?: P, queryParams = {}) {
        const jsParams = params && toJS<P>(params);
        const jsQueryParams = toJS(queryParams);

        const queryParamsString = queryString
            .stringify(jsQueryParams)
            .toString();
        const hasQueryParams = queryParamsString !== '';
        let newPath = this.originalPath;

        getRegexMatches(
            this.originalPath,
            paramRegex,
            // eslint-disable-next-line
            ([_fullMatch, paramKey, paramKeyWithoutColon]) => {
                const value = jsParams
                    ? jsParams[paramKeyWithoutColon]
                    : undefined;

                newPath =
                    value !== undefined
                        ? newPath.replace(paramKey, value.toString())
                        : newPath.replace(`/${paramKey}`, '');
            }
        );

        return `${newPath}${
            hasQueryParams ? `?${queryParamsString}` : ''
        }`.toString();
    }

    /*
   converts an array of params [123, 100] to an object
   Example: if the current this.path is /book/:id/page/:pageId it will return {id:123, pageId:100}
   */
    getParamsObject(
        paramValues: Exclude<P, undefined>[keyof Exclude<P, undefined>][]
    ) {
        const params = [] as (keyof Exclude<P, undefined>)[];
        getRegexMatches(
            this.originalPath,
            paramRegex,
            // eslint-disable-next-line
            ([_fullMatch, _paramKey, paramKeyWithoutColon]) => {
                params.push(paramKeyWithoutColon);
            }
        );

        const result = paramValues.reduce((obj, paramValue, index) => {
            obj[params[index]] = paramValue;
            return obj;
        }, {} as Exclude<P, undefined>);
        return result;
    }
}
