import { RoutesConfig, QueryParams, RouteParams } from "./route";
import { Store } from "./router-store";
import queryString from 'query-string';

export interface DirectorConfig {
    html5history?: boolean;
    notfound?(): void;
    [key: string]: any;
}

export const isObject = (obj: any) =>
    obj && typeof obj === 'object' && !Array.isArray(obj);

export const getObjectKeys = (obj: any) => (isObject(obj) ? Object.keys(obj) : []);

export const viewsForDirector = <T extends Store>(views: RoutesConfig<T>, store: T, config: DirectorConfig) =>
    getObjectKeys(views).reduce((obj, viewKey) => {
        const view = views[viewKey];
        obj[view.path] = (...paramsArr) => {
            const paramsObject = paramsArr
                ? view.getParamsObject(paramsArr)
                : undefined;
            let queryParamsObject;
            if (config.html5history === false) {
                // hash routing (query parameter not stored in location.search)
                const m = window.location.hash.match(/\?.*$/);
                if (m) {
                    queryParamsObject = queryString.parse(m[0]);
                }
            } else {
                queryParamsObject = queryString.parse(window.location.search);
            }
            store.router.goTo(view as any, paramsObject || {} as RouteParams, queryParamsObject as QueryParams);
        };
        return obj;
    }, {} as { [path: string]: (...paramsArr: string[]) => any });

export const getRegexMatches = (
    string: string,
    regexExpression: RegExp,
    callback: (result: RegExpExecArray) => void,
) => {
    let match;
    while ((match = regexExpression.exec(string)) !== null) {
        callback(match);
    }
};
