"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var mobx_react_1 = require("mobx-react");
var MobxRouter = function (_a) {
    var router = _a.store.router;
    return React.createElement("div", null, router.currentView && router.currentView.component);
};
exports.default = mobx_react_1.inject('store')(mobx_react_1.observer(MobxRouter));
