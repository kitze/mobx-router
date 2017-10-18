"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const mobx_react_1 = require("mobx-react");
const MobxRouter = ({ store: { router } }) => React.createElement("div", null, router.currentView && router.currentView.component);
exports.default = mobx_react_1.inject('store')(mobx_react_1.observer(MobxRouter));
