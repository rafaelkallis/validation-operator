"use strict";
/**
 * @file index.ts
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var invariant = require("invariant");
var isPromise = require("is-promise");
var parameterValidationFactory = function (validate) {
    return function () {
        var schemata = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            schemata[_i] = arguments[_i];
        }
        return function (func) {
            return function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                invariant(schemata.length >= args.length, "number of arguments is greater than number of schemata.");
                var newArgs = [];
                for (var i = 0; i < schemata.length; i++) {
                    newArgs[i] = validate(schemata[i], args[i]);
                }
                return func.apply(void 0, __spread(newArgs));
            };
        };
    };
};
var resultValidationFactory = function (validate) {
    return function (schema) {
        invariant(schema !== undefined && schema !== null, "schema is null or undefined");
        return function (func) {
            return function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var result = func.apply(void 0, __spread(args));
                if (isPromise(result)) {
                    return result.then(function (v) { return validate(schema, v); });
                }
                return validate(schema, result);
            };
        };
    };
};
var joiValidation = function (schema, arg) {
    var _a = schema.validate(arg), value = _a.value, error = _a.error;
    if (error !== null) {
        throw error;
    }
    return value;
};
exports.validateParams = parameterValidationFactory(joiValidation);
exports.validateResult = resultValidationFactory(joiValidation);
