"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var mobx_react_1 = require("mobx-react");
exports.Link = function (_a) {
    var view = _a.view, className = _a.className, _b = _a.params, params = _b === void 0 ? {} : _b, _c = _a.queryParams, queryParams = _c === void 0 ? {} : _c, _d = _a.store, store = _d === void 0 ? {} : _d, _e = _a.refresh, refresh = _e === void 0 ? false : _e, _f = _a.style, style = _f === void 0 ? {} : _f, children = _a.children, _g = _a.title, title = _g === void 0 ? children : _g, _h = _a.router, router = _h === void 0 ? store.router : _h;
    if (!router) {
        return console.error('The router prop must be defined for a Link component to work!');
    }
    return (React.createElement("a", { style: style, className: className, onClick: function (e) {
            var middleClick = e.which == 2;
            var cmdOrCtrl = (e.metaKey || e.ctrlKey);
            var openinNewTab = middleClick || cmdOrCtrl;
            var shouldNavigateManually = refresh || openinNewTab || cmdOrCtrl;
            if (!shouldNavigateManually) {
                e.preventDefault();
                router.goTo(view, params, store, queryParams);
            }
        }, href: view.replaceUrlParams(params, queryParams) }, title));
};
exports.default = mobx_react_1.inject('store')(mobx_react_1.observer(exports.Link));
