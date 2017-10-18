"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const queryString = require("query-string");
const mobx_1 = require("mobx");
const utils_1 = require("./utils");
const regex_1 = require("./regex");
const utils_2 = require("./utils");
class Route {
    constructor(props) {
        this.originalPath = '';
        utils_1.getObjectKeys(props).forEach((propKey) => this[propKey] = props[propKey]);
        this.originalPath = this.path;
        this.path = this.path.indexOf('?') === -1 ? this.path : this.path.replace(regex_1.optionalRegex, "/?([^/]*)?$");
        this.rootPath = this.getRootPath();
        this.getRootPath = this.getRootPath.bind(this);
        this.replaceUrlParams = this.replaceUrlParams.bind(this);
        this.getParamsObject = this.getParamsObject.bind(this);
        this.goTo = this.goTo.bind(this);
    }
    getRootPath() {
        return `/${this.path.split('/')[1]}`;
    }
    ;
    replaceUrlParams(params, queryParams = {}) {
        params = mobx_1.toJS(params);
        queryParams = mobx_1.toJS(queryParams);
        const queryParamsString = queryString.stringify(queryParams).toString();
        const hasQueryParams = queryParamsString !== '';
        let newPath = this.originalPath;
        utils_2.getRegexMatches(this.originalPath, regex_1.paramRegex, ([_fullMatch, paramKey, paramKeyWithoutColon]) => {
            const value = params[paramKeyWithoutColon];
            newPath = value ? newPath.replace(paramKey, value) : newPath.replace(`/${paramKey}`, '');
        });
        return `${newPath}${hasQueryParams ? `?${queryParamsString}` : ''}`.toString();
    }
    getParamsObject(paramsArray) {
        const params = [];
        utils_2.getRegexMatches(this.originalPath, regex_1.paramRegex, ([_fullMatch, _paramKey, paramKeyWithoutColon]) => {
            params.push(paramKeyWithoutColon);
        });
        const result = paramsArray.reduce((obj, paramValue, index) => {
            obj[params[index]] = paramValue;
            return obj;
        }, {});
        return result;
    }
    goTo(store, paramsArr) {
        const paramsObject = this.getParamsObject(paramsArr);
        const queryParamsObject = queryString.parse(window.location.search);
        store.router.goTo(this, paramsObject, store, queryParamsObject);
    }
}
exports.Route = Route;
exports.default = Route;
