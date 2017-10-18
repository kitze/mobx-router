"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isObject = (obj) => obj && typeof obj === 'object' && !(Array.isArray(obj));
exports.getObjectKeys = (obj) => exports.isObject(obj) ? Object.keys(obj) : [];
exports.viewsForDirector = (views, store) => exports.getObjectKeys(views).reduce((obj, viewKey) => {
    const view = views[viewKey];
    obj[view.path] = (...paramsArr) => view.goTo(store, paramsArr);
    return obj;
}, {});
exports.getRegexMatches = (string, regexExpression, callback) => {
    let match;
    while ((match = regexExpression.exec(string)) !== null) {
        callback(match);
    }
};
