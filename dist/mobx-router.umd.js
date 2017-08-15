(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('mobx'), require('query-string'), require('director/build/director'), require('react'), require('mobx-react')) :
  typeof define === 'function' && define.amd ? define(['exports', 'mobx', 'query-string', 'director/build/director', 'react', 'mobx-react'], factory) :
  (factory((global.mobxRouter = global.mobxRouter || {}),global.mobx,global.queryString,global.director_build_director,global.React,global.mobxReact));
}(this, (function (exports,mobx,queryString,director_build_director,React,mobxReact) { 'use strict';

queryString = 'default' in queryString ? queryString['default'] : queryString;
React = 'default' in React ? React['default'] : React;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};









var asyncToGenerator = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var get$1 = function get$1(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get$1(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

var isObject = function isObject(obj) {
  return obj && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && !Array.isArray(obj);
};
var getObjectKeys = function getObjectKeys(obj) {
  return isObject(obj) ? Object.keys(obj) : [];
};

var viewsForDirector = function viewsForDirector(views, store) {
  return getObjectKeys(views).reduce(function (obj, viewKey) {
    var view = views[viewKey];
    obj[view.path] = function () {
      for (var _len = arguments.length, paramsArr = Array(_len), _key = 0; _key < _len; _key++) {
        paramsArr[_key] = arguments[_key];
      }

      return view.goTo(store, paramsArr);
    };
    return obj;
  }, {});
};

var getRegexMatches = function getRegexMatches(string, regexExpression, callback) {
  var match = void 0;
  while ((match = regexExpression.exec(string)) !== null) {
    callback(match);
  }
};

var paramRegex = /\/(:([^\/?]*)\??)/g;
var optionalRegex = /(\/:[^\/]*\?)$/g;

var Route = function () {

  //lifecycle methods
  function Route(props) {
    var _this = this;

    classCallCheck(this, Route);

    getObjectKeys(props).forEach(function (propKey) {
      return _this[propKey] = props[propKey];
    });
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


  //props


  createClass(Route, [{
    key: 'getRootPath',
    value: function getRootPath() {
      return '/' + this.path.split('/')[1];
    }
  }, {
    key: 'replaceUrlParams',


    /*
     replaces url params placeholders with params from an object
     Example: if url is /book/:id/page/:pageId and object is {id:100, pageId:200} it will return /book/100/page/200
     */
    value: function replaceUrlParams(params) {
      var queryParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      params = mobx.toJS(params);
      queryParams = mobx.toJS(queryParams);

      var queryParamsString = queryString.stringify(queryParams).toString();
      var hasQueryParams = queryParamsString !== '';
      var newPath = this.originalPath;

      getRegexMatches(this.originalPath, paramRegex, function (_ref) {
        var _ref2 = slicedToArray(_ref, 3),
            fullMatch = _ref2[0],
            paramKey = _ref2[1],
            paramKeyWithoutColon = _ref2[2];

        var value = params[paramKeyWithoutColon];
        newPath = value ? newPath.replace(paramKey, value) : newPath.replace('/' + paramKey, '');
      });

      return ('' + newPath + (hasQueryParams ? '?' + queryParamsString : '')).toString();
    }

    /*
     converts an array of params [123, 100] to an object
     Example: if the current this.path is /book/:id/page/:pageId it will return {id:123, pageId:100}
     */

  }, {
    key: 'getParamsObject',
    value: function getParamsObject(paramsArray) {

      var params = [];
      getRegexMatches(this.originalPath, paramRegex, function (_ref3) {
        var _ref4 = slicedToArray(_ref3, 3),
            fullMatch = _ref4[0],
            paramKey = _ref4[1],
            paramKeyWithoutColon = _ref4[2];

        params.push(paramKeyWithoutColon);
      });

      var result = paramsArray.reduce(function (obj, paramValue, index) {
        obj[params[index]] = paramValue;
        return obj;
      }, {});

      return result;
    }
  }, {
    key: 'goTo',
    value: function goTo(store, paramsArr) {
      var paramsObject = this.getParamsObject(paramsArr);
      var queryParamsObject = queryString.parse(window.location.search);
      store.router.goTo(this, paramsObject, store, queryParamsObject);
    }
  }]);
  return Route;
}();

var _class;
var _descriptor;
var _descriptor2;
var _descriptor3;

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var RouterStore = (_class = function () {
  createClass(RouterStore, [{
    key: 'currentPath',
    get: function get() {
      return this.currentView ? this.currentView.replaceUrlParams(this.params, this.queryParams) : '';
    }
  }]);

  function RouterStore() {
    classCallCheck(this, RouterStore);

    _initDefineProp(this, 'params', _descriptor, this);

    _initDefineProp(this, 'queryParams', _descriptor2, this);

    _initDefineProp(this, 'currentView', _descriptor3, this);

    this.goTo = this.goTo.bind(this);
  }

  createClass(RouterStore, [{
    key: 'goTo',
    value: function () {
      var _ref = asyncToGenerator(regeneratorRuntime.mark(function _callee(view, paramsObj, store, queryParamsObj) {
        var _this = this;

        var nextPath, pathChanged, rootViewChanged, currentParams, currentQueryParams, beforeExitResult, beforeEnterResult, nextParams, nextQueryParams;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                nextPath = view.replaceUrlParams(paramsObj, queryParamsObj);
                pathChanged = nextPath !== this.currentPath;

                if (pathChanged) {
                  _context.next = 4;
                  break;
                }

                return _context.abrupt('return');

              case 4:
                rootViewChanged = !this.currentView || this.currentView.rootPath !== view.rootPath;
                currentParams = mobx.toJS(this.params);
                currentQueryParams = mobx.toJS(this.queryParams);

                // Run `beforeExit` hook if it exists on the current view

                if (!(rootViewChanged && this.currentView && this.currentView.beforeExit)) {
                  _context.next = 13;
                  break;
                }

                _context.next = 10;
                return this.currentView.beforeExit(this.currentView, currentParams, store, currentQueryParams);

              case 10:
                beforeExitResult = _context.sent;

                if (!(beforeExitResult === false)) {
                  _context.next = 13;
                  break;
                }

                return _context.abrupt('return');

              case 13:
                if (!(rootViewChanged && view.beforeEnter)) {
                  _context.next = 19;
                  break;
                }

                _context.next = 16;
                return view.beforeEnter(view, currentParams, store, currentQueryParams);

              case 16:
                beforeEnterResult = _context.sent;

                if (!(beforeEnterResult === false)) {
                  _context.next = 19;
                  break;
                }

                return _context.abrupt('return');

              case 19:

                // Run `onExit` hook if it exists on the current route
                rootViewChanged && this.currentView && this.currentView.onExit && this.currentView.onExit(this.currentView, currentParams, store, currentQueryParams);

                // MobX requires us to update the state in `runAction` as this @action is now async (see https://mobx.js.org/refguide/action.html)
                mobx.runInAction('update router state after async beforeExit and beforeEnter', function () {
                  _this.currentView = view;
                  _this.params = mobx.toJS(paramsObj);
                  _this.queryParams = mobx.toJS(queryParamsObj);
                });

                nextParams = mobx.toJS(paramsObj);
                nextQueryParams = mobx.toJS(queryParamsObj);


                rootViewChanged && view.onEnter && view.onEnter(view, nextParams, store, nextQueryParams);
                !rootViewChanged && this.currentView && this.currentView.onParamsChange && this.currentView.onParamsChange(this.currentView, nextParams, store, nextQueryParams);

              case 25:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function goTo(_x, _x2, _x3, _x4) {
        return _ref.apply(this, arguments);
      }

      return goTo;
    }()
  }]);
  return RouterStore;
}(), (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'params', [mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, 'queryParams', [mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, 'currentView', [mobx.observable], {
  enumerable: true,
  initializer: null
}), _applyDecoratedDescriptor(_class.prototype, 'currentPath', [mobx.computed], Object.getOwnPropertyDescriptor(_class.prototype, 'currentPath'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'goTo', [mobx.action], Object.getOwnPropertyDescriptor(_class.prototype, 'goTo'), _class.prototype)), _class);

var createDirectorRouter = function createDirectorRouter(views, store) {
  new director_build_director.Router(_extends({}, viewsForDirector(views, store))).configure({
    html5history: true
  }).init();
};

var startRouter = function startRouter(views, store) {
  //create director configuration
  createDirectorRouter(views, store);

  //autorun and watch for path changes
  mobx.autorun(function () {
    var currentPath = store.router.currentPath;

    if (currentPath !== window.location.pathname) {
      window.history.pushState(null, null, currentPath);
    }
  });
};

var MobxRouter = function MobxRouter(_ref) {
  var router = _ref.store.router;
  return React.createElement(
    'div',
    null,
    router.currentView && router.currentView.component
  );
};
var MobxRouter$1 = mobxReact.observer(['store'], MobxRouter);

var Link = function Link(_ref) {
  var view = _ref.view,
      className = _ref.className,
      _ref$params = _ref.params,
      params = _ref$params === undefined ? {} : _ref$params,
      _ref$queryParams = _ref.queryParams,
      queryParams = _ref$queryParams === undefined ? {} : _ref$queryParams,
      _ref$store = _ref.store,
      store = _ref$store === undefined ? {} : _ref$store,
      _ref$refresh = _ref.refresh,
      refresh = _ref$refresh === undefined ? false : _ref$refresh,
      _ref$style = _ref.style,
      style = _ref$style === undefined ? {} : _ref$style,
      children = _ref.children,
      _ref$title = _ref.title,
      title = _ref$title === undefined ? children : _ref$title,
      _ref$router = _ref.router,
      router = _ref$router === undefined ? store.router : _ref$router;

  if (!router) {
    return console.error('The router prop must be defined for a Link component to work!');
  }
  return React.createElement(
    'a',
    {
      style: style,
      className: className,
      onClick: function onClick(e) {
        var middleClick = e.which == 2;
        var cmdOrCtrl = e.metaKey || e.ctrlKey;
        var openinNewTab = middleClick || cmdOrCtrl;
        var shouldNavigateManually = refresh || openinNewTab || cmdOrCtrl;

        if (!shouldNavigateManually) {
          e.preventDefault();
          router.goTo(view, params, store, queryParams);
        }
      },
      href: view.replaceUrlParams(params, queryParams) },
    title
  );
};

var Link$1 = mobxReact.observer(Link);

//components

exports.Route = Route;
exports.MobxRouter = MobxRouter$1;
exports.Link = Link$1;
exports.RouterStore = RouterStore;
exports.startRouter = startRouter;

Object.defineProperty(exports, '__esModule', { value: true });

})));
