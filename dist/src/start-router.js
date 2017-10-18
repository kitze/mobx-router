"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const director_1 = require("director/build/director");
const mobx_1 = require("mobx");
const utils_1 = require("./utils");
const createDirectorRouter = (views, store) => {
    new director_1.Router(Object.assign({}, utils_1.viewsForDirector(views, store))).configure({
        html5history: true
    }).init();
};
const startRouter = (views, store) => {
    createDirectorRouter(views, store);
    mobx_1.autorun(() => {
        const { currentPath } = store.router;
        if (currentPath !== window.location.pathname) {
            window.history.pushState(null, null, currentPath);
        }
    });
};
exports.default = startRouter;
