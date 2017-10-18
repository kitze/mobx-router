import * as queryString from 'query-string';

import {toJS} from 'mobx';

import {getObjectKeys} from './utils';
import {paramRegex, optionalRegex} from './regex';
import {getRegexMatches} from './utils';


export type Callback = (route: any, params: any, store: any, queryParams: any) => void;
export type ConfirmCallback = (route: any, params: any, store: any, queryParams: any) => boolean;

export class Route {

  //props
  component: React.ComponentType;
  path: string;
  rootPath: string;
  originalPath = ''

  //lifecycle methods
  onEnter: Callback;
  onExit: Callback;
  beforeEnter: ConfirmCallback;
  beforeExit: ConfirmCallback;

  constructor(props: any) {
    getObjectKeys(props).forEach((propKey) => this[propKey] = props[propKey]);
    this.originalPath = this.path;

    //if there are optional parameters, replace the path with a regex expression
    this.path = this.path.indexOf('?') === -1 ? this.path : this.path.replace(optionalRegex, "/?([^/]*)?$");
    this.rootPath = this.getRootPath();

    //bind
    this.getRootPath = this.getRootPath.bind(this);
    this.replaceUrlParams = this.replaceUrlParams.bind(this);
    this.getParamsObject = this.getParamsObject.bind(this);
    this.goTo = this.goTo.bind(this);
  }

  /*
   Sets the root path for the current path, so it's easier to determine if the route entered/exited or just some params changed
   Example: for '/' the root path is '/', for '/profile/:username/:tab' the root path is '/profile'
   */
  getRootPath() {
    return `/${this.path.split('/')[1]}`
  };

  /*
   replaces url params placeholders with params from an object
   Example: if url is /book/:id/page/:pageId and object is {id:100, pageId:200} it will return /book/100/page/200
   */
  replaceUrlParams(params: any, queryParams: any = {}) {
    params = toJS(params);
    queryParams = toJS(queryParams);

    const queryParamsString = queryString.stringify(queryParams).toString();
    const hasQueryParams = queryParamsString !== '';
    let newPath = this.originalPath;

    getRegexMatches(this.originalPath, paramRegex, ([_fullMatch, paramKey, paramKeyWithoutColon]: any) => {
      const value = params[paramKeyWithoutColon];
      newPath = value ? newPath.replace(paramKey, value) : newPath.replace(`/${paramKey}`, '');
    });

    return `${newPath}${hasQueryParams ? `?${queryParamsString}` : ''}`.toString();
  }

  /*
   converts an array of params [123, 100] to an object
   Example: if the current this.path is /book/:id/page/:pageId it will return {id:123, pageId:100}
   */
  getParamsObject(paramsArray: string[]) {

    const params: any = [];
    getRegexMatches(this.originalPath, paramRegex, ([_fullMatch, _paramKey, paramKeyWithoutColon]: any[]) => {
      params.push(paramKeyWithoutColon);
    });

    const result = paramsArray.reduce((obj, paramValue, index) => {
      obj[params[index]] = paramValue;
      return obj;
    }, {});

    return result;
  }

  goTo(store: any, paramsArr: string[]) {
    const paramsObject = this.getParamsObject(paramsArr);
    const queryParamsObject = queryString.parse(window.location.search);
    store.router.goTo(this, paramsObject, store, queryParamsObject);
  }
}

export default Route;