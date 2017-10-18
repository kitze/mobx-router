"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var queryString = require("query-string");
var mobx_1 = require("mobx");
var utils_1 = require("./utils");
var regex_1 = require("./regex");
var utils_2 = require("./utils");
var Route = (function () {
    function Route(props) {
        var _this = this;
        this.originalPath = '';
        utils_1.getObjectKeys(props).forEach(function (propKey) { return _this[propKey] = props[propKey]; });
        this.originalPath = this.path;
        this.path = this.path.indexOf('?') === -1 ? this.path : this.path.replace(regex_1.optionalRegex, "/?([^/]*)?$");
        this.rootPath = this.getRootPath();
        this.getRootPath = this.getRootPath.bind(this);
        this.replaceUrlParams = this.replaceUrlParams.bind(this);
        this.getParamsObject = this.getParamsObject.bind(this);
        this.goTo = this.goTo.bind(this);
    }
    Route.prototype.getRootPath = function () {
        return "/" + this.path.split('/')[1];
    };
    ;
    Route.prototype.replaceUrlParams = function (params, queryParams) {
        if (queryParams === void 0) { queryParams = {}; }
        params = mobx_1.toJS(params);
        queryParams = mobx_1.toJS(queryParams);
        var queryParamsString = queryString.stringify(queryParams).toString();
        var hasQueryParams = queryParamsString !== '';
        var newPath = this.originalPath;
        utils_2.getRegexMatches(this.originalPath, regex_1.paramRegex, function (_a) {
            var _fullMatch = _a[0], paramKey = _a[1], paramKeyWithoutColon = _a[2];
            var value = params[paramKeyWithoutColon];
            newPath = value ? newPath.replace(paramKey, value) : newPath.replace("/" + paramKey, '');
        });
        return ("" + newPath + (hasQueryParams ? "?" + queryParamsString : '')).toString();
    };
    Route.prototype.getParamsObject = function (paramsArray) {
        var params = [];
        utils_2.getRegexMatches(this.originalPath, regex_1.paramRegex, function (_a) {
            var _fullMatch = _a[0], _paramKey = _a[1], paramKeyWithoutColon = _a[2];
            params.push(paramKeyWithoutColon);
        });
        var result = paramsArray.reduce(function (obj, paramValue, index) {
            obj[params[index]] = paramValue;
            return obj;
        }, {});
        return result;
    };
    Route.prototype.goTo = function (store, paramsArr) {
        var paramsObject = this.getParamsObject(paramsArr);
        var queryParamsObject = queryString.parse(window.location.search);
        store.router.goTo(this, paramsObject, store, queryParamsObject);
    };
    return Route;
}());
exports.Route = Route;
exports.default = Route;
