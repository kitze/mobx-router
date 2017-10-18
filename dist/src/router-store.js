"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mobx_1 = require("mobx");
class RouterStore {
    constructor() {
        this.params = {};
        this.queryParams = {};
        this.goTo = this.goTo.bind(this);
    }
    goTo(view, paramsObj, store, queryParamsObj) {
        const nextPath = view.replaceUrlParams(paramsObj, queryParamsObj);
        const pathChanged = nextPath !== this.currentPath;
        if (!pathChanged) {
            return;
        }
        const rootViewChanged = !this.currentView || (this.currentView.rootPath !== view.rootPath);
        const currentParams = mobx_1.toJS(this.params);
        const currentQueryParams = mobx_1.toJS(this.queryParams);
        const beforeExitResult = (rootViewChanged && this.currentView && this.currentView.beforeExit) ? this.currentView.beforeExit(this.currentView, currentParams, store, currentQueryParams) : true;
        if (beforeExitResult === false) {
            return;
        }
        const beforeEnterResult = (rootViewChanged && view.beforeEnter) ? view.beforeEnter(view, currentParams, store, currentQueryParams) : true;
        if (beforeEnterResult === false) {
            return;
        }
        rootViewChanged && this.currentView && this.currentView.onExit && this.currentView.onExit(this.currentView, currentParams, store, currentQueryParams);
        this.currentView = view;
        this.params = mobx_1.toJS(paramsObj);
        this.queryParams = mobx_1.toJS(queryParamsObj);
        const nextParams = mobx_1.toJS(paramsObj);
        const nextQueryParams = mobx_1.toJS(queryParamsObj);
        rootViewChanged && view.onEnter && view.onEnter(view, nextParams, store, nextQueryParams);
        !rootViewChanged && this.currentView && this.currentView.onParamsChange && this.currentView.onParamsChange(this.currentView, nextParams, store, nextQueryParams);
    }
    get currentPath() {
        return this.currentView ? this.currentView.replaceUrlParams(this.params, this.queryParams) : '';
    }
}
tslib_1.__decorate([
    mobx_1.observable,
    tslib_1.__metadata("design:type", Object)
], RouterStore.prototype, "params", void 0);
tslib_1.__decorate([
    mobx_1.observable,
    tslib_1.__metadata("design:type", Object)
], RouterStore.prototype, "queryParams", void 0);
tslib_1.__decorate([
    mobx_1.observable,
    tslib_1.__metadata("design:type", Object)
], RouterStore.prototype, "currentView", void 0);
tslib_1.__decorate([
    mobx_1.action,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, Object, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], RouterStore.prototype, "goTo", null);
tslib_1.__decorate([
    mobx_1.computed,
    tslib_1.__metadata("design:type", Object),
    tslib_1.__metadata("design:paramtypes", [])
], RouterStore.prototype, "currentPath", null);
exports.default = RouterStore;
