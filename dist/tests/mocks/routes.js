"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var route_1 = require("../../src/route");
var mocks_1 = require("./mocks");
var routes = {
    home: new route_1.default({
        path: '/',
        component: React.createElement("div", null),
        onEnter: function () {
            mocks_1.default.enteringHome();
        },
        onExit: function () {
            mocks_1.default.exitingHome();
        },
        onParamsChange: function () {
            mocks_1.default.changingParamsHome();
        }
    }),
    profile: new route_1.default({
        path: '/profile/:username/:tab',
        component: React.createElement("div", null),
        onEnter: function (route, params) {
            mocks_1.default.enteringProfile(params);
        },
        onExit: function (route, params) {
            mocks_1.default.exitingProfile(params);
        },
        onParamsChange: function (route, params, store, queryParams) {
            mocks_1.default.changingParamsProfile(params, queryParams);
        }
    })
};
exports.default = routes;
