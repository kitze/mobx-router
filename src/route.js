import reduce from 'lodash/fp/reduce';
import each from 'lodash/fp/each';
import {mapAndFilter} from './utils';

class Route {

  //props
  component;
  path;
  rootPath;

  //lifecycle methods
  onEnter;
  onExit;
  beforeEnter;
  beforeExit;

  constructor(props) {
    each(props, (value, key) => this[key] = value);
    this.rootPath = this.getRootPath();
  }

  /*
   Sets the root path for the current path, so it's easier to determine if the route entered/exited or just some params changed
   Example: for '/' the root path is '/', for '/profile/:username/:tab' the root path is '/profile'
   */
  getRootPath = () => `/${this.path.split('/')[1]}`;

  /*
   replaces url params placeholders with params from an object
   Example: if url is /book/:id/page/:pageId and object is {id:100, pageId:200} it will return /book/100/page/200
   */
  replaceUrlParams = params => reduce(params, (path, value, key) => path.replace(`:${key}`, value), this.path);

  /*
   converts an array of params [123, 100] to an object
   Example: if the current this.path is /book/:id/page/:pageId it will return {id:123, pageId:100}
   */
  getParamsObject = paramsArray => {

    let params = mapAndFilter(this.path.split('/'), p => p.indexOf(':') !== -1, p => p.substr(1, p.length - 1));

    const result = reduce(paramsArray, (obj, paramValue, index) => {
      obj[params[index]] = paramValue;
      return obj;
    }, {});

    return result;
  }

  goTo = (store, paramsArr) => {
    const paramsObject = this.getParamsObject(paramsArr);
    store.router.goTo(this, paramsObject, store);
  }
}

export default Route;