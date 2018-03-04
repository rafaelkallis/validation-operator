"use strict";
/**
 * @file index.spec.js
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../index");
var Joi = require("joi");
describe("joi schema", function () {
    describe("validateParams", function () {
        it("no arguments, no schemata", function () {
            var f = jest.fn();
            var f_val = index_1.validateParams()(f);
            expect(f_val()).toBeUndefined();
            expect(f).toHaveBeenCalledWith();
        });
        it("argument, no schemata", function () {
            var f = jest.fn();
            var f_val = index_1.validateParams()(f);
            expect(function () { f_val("a"); }).toThrow();
            expect(f).not.toHaveBeenCalled();
        });
        it("arguments, no schemata", function () {
            var f = jest.fn();
            var f_val = index_1.validateParams()(f);
            expect(function () { f_val("a", "b", "c"); }).toThrow();
            expect(f).not.toHaveBeenCalled();
        });
        it("no arguments, schema", function () {
            var f = jest.fn();
            var f_val = index_1.validateParams(Joi.string().required().valid("a"))(f);
            expect(function () { f_val(); }).toThrow();
            expect(f).not.toHaveBeenCalled();
        });
        it("no arguments, schemata", function () {
            var f = jest.fn();
            var f_val = index_1.validateParams(Joi.string().required().valid("a"), Joi.string().required().valid("b"))(f);
            expect(function () { f_val(); }).toThrow();
            expect(f).not.toHaveBeenCalled();
        });
        it("#arguments !== #schemata", function () {
            var f = jest.fn();
            var f_val = index_1.validateParams(Joi.string().required().valid("a"), Joi.string().required().valid("b"))(f);
            expect(function () { f_val("a"); }).toThrow();
            expect(function () { f_val("b"); }).toThrow();
            expect(f).not.toHaveBeenCalled();
        });
        it("valid arguments", function () {
            var f = jest.fn();
            var f_val = index_1.validateParams(Joi.string().required().valid("a"), Joi.string().required().valid("b"))(f);
            expect(f_val("a", "b")).toBeUndefined();
        });
        it("valid arguments optional", function () {
            var f = jest.fn();
            var f_val = index_1.validateParams(Joi.string().optional())(f);
            expect(f_val()).toBeUndefined();
            expect(f).toHaveBeenCalledWith(undefined);
        });
        it("invalid arguments", function () {
            var f = jest.fn();
            var f_val = index_1.validateParams(Joi.string().required().valid("a"), Joi.string().required().valid("b"))(f);
            expect(function () { f_val("b", "c"); }).toThrow();
        });
        it("passthrough arguments", function () {
            var f = jest.fn();
            var f_val = index_1.validateParams(Joi.string().required().valid("a"), Joi.string().required().valid("b"))(f);
            f_val("a", "b");
            expect(f).toHaveBeenCalledWith("a", "b");
        });
        it("return function result", function () {
            var f = jest.fn(function () { return "result"; });
            var f_val = index_1.validateParams()(f);
            expect(f_val()).toBe("result");
            expect(f).toHaveBeenCalledWith();
        });
    });
    describe("validateResult", function () {
        it("valid funtion result", function () {
            var f = jest.fn(function () { return "result"; });
            var f_val = index_1.validateResult(Joi.string().valid("result"))(f);
            expect(f_val()).toBe("result");
            expect(f).toHaveBeenCalledWith();
        });
        it("invalid funtion result", function () {
            var f = jest.fn(function () { return "result"; });
            var f_val = index_1.validateResult(Joi.string().valid("wrong"))(f);
            expect(function () { f_val(); }).toThrow();
            expect(f).toHaveBeenCalledWith();
        });
        it("pass arguments", function () {
            var f = jest.fn(function () { return "result"; });
            var f_val = index_1.validateResult(Joi.string())(f);
            expect(f_val("a", "b")).toBe("result");
            expect(f).toHaveBeenCalledWith("a", "b");
        });
        it("promise result", function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            var f, f_val, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        f = jest.fn(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, "result"];
                        }); }); });
                        f_val = index_1.validateResult(Joi.string())(f);
                        _a = expect;
                        return [4 /*yield*/, f_val()];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toBe("result");
                        return [2 /*return*/];
                }
            });
        }); });
        it("promise rejection", function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            var f, f_val;
            return __generator(this, function (_a) {
                f = jest.fn(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, "wrong"];
                }); }); });
                f_val = index_1.validateResult(Joi.string().valid("result"))(f);
                expect(f_val()).rejects.toBeDefined();
                return [2 /*return*/];
            });
        }); });
    });
});
