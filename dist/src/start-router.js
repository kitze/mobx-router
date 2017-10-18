"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var director_1 = require("director/build/director");
var mobx_1 = require("mobx");
var utils_1 = require("./utils");
var createDirectorRouter = function (views, store) {
    new director_1.Router(tslib_1.__assign({}, utils_1.viewsForDirector(views, store))).configure({
        html5history: true
    }).init();
};
var startRouter = function (views, store) {
    createDirectorRouter(views, store);
    mobx_1.autorun(function () {
        var currentPath = store.router.currentPath;
        if (currentPath !== window.location.pathname) {
            window.history.pushState(null, null, currentPath);
        }
    });
};
exports.default = startRouter;
