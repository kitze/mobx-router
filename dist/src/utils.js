"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isObject = function (obj) { return obj && typeof obj === 'object' && !(Array.isArray(obj)); };
exports.getObjectKeys = function (obj) { return exports.isObject(obj) ? Object.keys(obj) : []; };
exports.viewsForDirector = function (views, store) { return exports.getObjectKeys(views).reduce(function (obj, viewKey) {
    var view = views[viewKey];
    obj[view.path] = function () {
        var paramsArr = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            paramsArr[_i] = arguments[_i];
        }
        return view.goTo(store, paramsArr);
    };
    return obj;
}, {}); };
exports.getRegexMatches = function (string, regexExpression, callback) {
    var match;
    while ((match = regexExpression.exec(string)) !== null) {
        callback(match);
    }
};
