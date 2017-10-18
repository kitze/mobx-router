"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var utils_1 = require("../src/utils");
var regex_1 = require("../src/regex");
var route_1 = require("../src/route");
test('viewsForDirector', function () {
    var views = {
        home: new route_1.default({
            path: '/',
            component: React.createElement("div", null)
        }),
        userProfile: new route_1.default({
            path: '/profile/:username/:tab',
            component: React.createElement("div", null),
        }),
        gallery: new route_1.default({
            path: '/gallery',
            component: React.createElement("div", null)
        }),
    };
    var result = utils_1.viewsForDirector(views, {});
    var keys = Object.keys(result);
    var values = keys.map(function (k) { return result[k]; });
    expect(keys).toEqual(['/', '/profile/:username/:tab', '/gallery']);
    values.forEach(function (value) {
        expect(typeof value).toEqual('function');
    });
});
test('isObject', function () {
    expect(utils_1.isObject({})).toBe(true);
    expect(utils_1.isObject([])).toBe(false);
    expect(utils_1.isObject(1)).toBe(false);
    expect(utils_1.isObject('string')).toBe(false);
});
test('getObjectKeys', function () {
    expect(utils_1.getObjectKeys({ a: 1, b: 2 })).toEqual(['a', 'b']);
    expect(utils_1.getObjectKeys(null)).toEqual([]);
    expect(utils_1.getObjectKeys(undefined)).toEqual([]);
    expect(utils_1.getObjectKeys([])).toEqual([]);
    expect(utils_1.getObjectKeys('str')).toEqual([]);
    expect(utils_1.getObjectKeys(123)).toEqual([]);
});
test('getRegexMatches', function () {
    var paramsArray = [];
    var path = '/profile/user/:username/:tab?';
    utils_1.getRegexMatches(path, regex_1.paramRegex, function (match) {
        paramsArray.push(match[2]);
    });
    var paramsArray2 = [];
    var path2 = '/profile';
    utils_1.getRegexMatches(path2, regex_1.paramRegex, function (match) {
        paramsArray2.push(match[2]);
    });
    var paramsArray3 = [];
    var path3 = '/profile/:username';
    utils_1.getRegexMatches(path3, regex_1.paramRegex, function (_a) {
        var third = _a[2];
        paramsArray3.push(third);
    });
    var paramsArray4 = [];
    utils_1.getRegexMatches(path, regex_1.paramRegex, function (_a) {
        var second = _a[1];
        paramsArray4.push(second);
    });
    expect(paramsArray).toEqual(['username', 'tab']);
    expect(paramsArray2).toEqual([]);
    expect(paramsArray3).toEqual(['username']);
    expect(paramsArray4).toEqual([':username', ':tab?']);
});
