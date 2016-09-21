(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('lodash/fp/reduce'), require('mobx'), require('director'), require('react'), require('mobx-react')) :
  typeof define === 'function' && define.amd ? define(['exports', 'lodash/fp/reduce', 'mobx', 'director', 'react', 'mobx-react'], factory) :
  (factory((global.mobxRouter = global.mobxRouter || {}),global.reduce,global.mobx,global.director,global.React,global.mobxReact));
}(this, (function (exports,reduce,mobx,director,React,mobxReact) { 'use strict';

reduce = 'default' in reduce ? reduce['default'] : reduce;
React = 'default' in React ? React['default'] : React;

const mapAndFilter = (array, condition, modification) => reduce(array, (results, member) => {
  condition(member) && results.push(modification(member));
  return results;
}, []);

const viewsForDirector = (views, store) => reduce(views, (obj, view) => {
  obj[view.path] = (...paramsArr) => view.goTo(store, paramsArr);
  return obj;
}, {});

class Route {

  //lifecycle methods
  constructor(props) {
    this.getRootPath = () => `/${ this.path.split('/')[1] }`;

    this.replaceUrlParams = params => reduce(params, (path, value, key) => path.replace(`:${ key }`, value), this.path);

    this.getParamsObject = paramsArray => {

      let params = mapAndFilter(this.path.split('/'), p => p.indexOf(':') !== -1, p => p.substr(1, p.length - 1));

      const result = reduce(paramsArray, (obj, paramValue, index) => {
        obj[params[index]] = paramValue;
        return obj;
      }, {});

      return result;
    };

    this.goTo = (store, paramsArr) => {
      const paramsObject = this.getParamsObject(paramsArr);
      store.router.goTo(this, paramsObject, store);
    };

    props.forEach((value, key) => this[key] = value);
    this.rootPath = this.getRootPath();
  }

  /*
   Sets the root path for the current path, so it's easier to determine if the route entered/exited or just some params changed
   Example: for '/' the root path is '/', for '/profile/:username/:tab' the root path is '/profile'
   */


  //props


  /*
   replaces url params placeholders with params from an object
   Example: if url is /book/:id/page/:pageId and object is {id:100, pageId:200} it will return /book/100/page/200
   */


  /*
   converts an array of params [123, 100] to an object
   Example: if the current this.path is /book/:id/page/:pageId it will return {id:123, pageId:100}
   */
}

class Router$1 {

  constructor() {
    this.params = {};
    this.goTo = mobx.action((view, paramsObj, store) => {

      const rootViewChanged = !this.currentView || this.currentView.rootPath !== view.rootPath;

      const beforeExitResult = rootViewChanged && this.currentView && this.currentView.beforeExit ? this.currentView.beforeExit(this.currentView, this.params, store) : true;
      if (beforeExitResult === false) {
        return;
      }

      const beforeEnterResult = rootViewChanged && view.beforeEnter ? view.beforeEnter(view, this.params, store) : true;
      if (beforeEnterResult === false) {
        return;
      }

      rootViewChanged && this.currentView && this.currentView.onExit && this.currentView.onExit(this.currentView, this.params, store);

      this.currentView = view;
      this.params = mobx.toJS(paramsObj);

      rootViewChanged && view.onEnter && view.onEnter(view, this.params, store);
    });

    mobx.extendObservable(this, {
      currentView: undefined,
      params: undefined,
      currentPath: () => this.currentView ? this.currentView.replaceUrlParams(this.params) : ''
    });
  }

}

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const createDirectorRouter = (views, store) => {
  new director.Router(_extends({}, viewsForDirector(views, store))).configure({
    html5history: true
  }).init();
};

const startRouter = (views, store) => {
  //create director configuration
  createDirectorRouter(views, store);

  //autorun and watch for path changes
  mobx.autorun(() => {
    const { currentPath } = store.router;
    if (currentPath !== window.location.pathname) {
      window.history.pushState(null, null, currentPath);
    }
  });
};

const MobxRouter = ({ store: { router } }) => React.createElement(
  'div',
  null,
  router.currentView && router.currentView.component
);
var MobxRouter$1 = mobxReact.observer(['store'], MobxRouter);

var _extends$1 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const Link = ({ view, params = {}, store = {}, removeStyle = false, refresh = false, style = {}, children, title = children, router = store.router }) => {
  if (!router) {
    return console.error('The router prop must be defined for a Link component to work!');
  }
  return React.createElement(
    'a',
    {
      style: _extends$1({}, removeStyle && _extends$1({ textDecoration: 'none', color: 'black' }, style)),
      onClick: e => {
        const middleClick = e.which == 2;
        const cmdOrCtrl = e.metaKey || e.ctrlKey;
        const openinNewTab = middleClick || cmdOrCtrl;
        const shouldNavigateManually = refresh || openinNewTab || cmdOrCtrl;

        if (!shouldNavigateManually) {
          e.preventDefault();
          router.goTo(view, params, store);
        }
      },
      href: view.replaceUrlParams(params) },
    title
  );
};

var Link$1 = mobxReact.observer(Link);

//components

exports.Route = Route;
exports.MobxRouter = MobxRouter$1;
exports.Link = Link$1;
exports.RouterStore = Router$1;
exports.startRouter = startRouter;

Object.defineProperty(exports, '__esModule', { value: true });

})));