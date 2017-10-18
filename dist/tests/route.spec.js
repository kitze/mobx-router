"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var route_1 = require("../src/route");
test('Route', function () {
    var route = new route_1.default({
        path: '/profile/:username/:tab',
        component: React.createElement("div", null),
    });
    var replacedUrlParams = route.replaceUrlParams({ username: 'kitze', tab: 'profile' });
    var paramsObject = route.getParamsObject(['kitze', 'profile']);
    expect(route.path).toBe('/profile/:username/:tab');
    expect(paramsObject).toEqual({
        tab: 'profile',
        username: 'kitze'
    });
    expect(replacedUrlParams).toBe('/profile/kitze/profile');
    expect(route.rootPath).toBe('/profile');
});
