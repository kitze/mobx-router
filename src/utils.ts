import { RoutesConfig } from "./route";
import { Store } from "./router-store";

export const isObject = (obj: any) =>
    obj && typeof obj === 'object' && !Array.isArray(obj);

export const getObjectKeys = (obj: any) => (isObject(obj) ? Object.keys(obj) : []);

export const viewsForDirector = <T extends Store>(views: RoutesConfig<T>, store: T) =>
    getObjectKeys(views).reduce((obj, viewKey) => {
        const view = views[viewKey];
        obj[view.path] = (...paramsArr) => store.router.goTo(view as any, paramsArr as any);
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
