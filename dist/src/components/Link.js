"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const mobx_react_1 = require("mobx-react");
const Link = ({ view, className, params = {}, queryParams = {}, store = {}, refresh = false, style = {}, children, title = children, router = store.router }) => {
    if (!router) {
        return console.error('The router prop must be defined for a Link component to work!');
    }
    return (React.createElement("a", { style: style, className: className, onClick: (e) => {
            const middleClick = e.which == 2;
            const cmdOrCtrl = (e.metaKey || e.ctrlKey);
            const openinNewTab = middleClick || cmdOrCtrl;
            const shouldNavigateManually = refresh || openinNewTab || cmdOrCtrl;
            if (!shouldNavigateManually) {
                e.preventDefault();
                router.goTo(view, params, store, queryParams);
            }
        }, href: view.replaceUrlParams(params, queryParams) }, title));
};
exports.default = mobx_react_1.observer(Link);
