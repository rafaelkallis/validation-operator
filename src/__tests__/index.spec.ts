/**
 * @file index.spec.js
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import { validateParams, validateResult } from "../index";
import * as Joi from "joi";

describe("joi schema", () => {

    describe("validateParams", () => {
    
        it("no arguments, no schemata", () => {
            const f = jest.fn();
            const f_val = validateParams()(f);
            expect(f_val()).toBeUndefined();
            expect(f).toHaveBeenCalledWith(); 
        });

        it("argument, no schemata", () => {
            const f = jest.fn();
            const f_val = validateParams()(f);
            // @ts-ignore: Expected 0 arguments, but got 1.
            expect(() => { f_val("a"); }).toThrow();
            expect(f).not.toHaveBeenCalled();
        });

        it("arguments, no schemata", () => {
            const f = jest.fn();
            const f_val = validateParams()(f);
            // @ts-ignore: Expected 0 arguments, but got 3.
            expect(() => { f_val("a", "b", "c"); }).toThrow();
            expect(f).not.toHaveBeenCalled();
        });

        it("no arguments, schema", () => {
            const f = jest.fn();
            const f_val = validateParams(Joi.string().required().valid("a"))(f);
            // @ts-ignore: Expected 1 arguments, but got 0.
            expect(() => { f_val(); }).toThrow();
            expect(f).not.toHaveBeenCalled();
        });

        it("no arguments, schemata", () => {
            const f = jest.fn();
            const f_val = validateParams(
                Joi.string().required().valid("a"), 
                Joi.string().required().valid("b")
            )(f);
            // @ts-ignore: Expected 2 arguments, but got 0.
            expect(() => { f_val(); }).toThrow();
            expect(f).not.toHaveBeenCalled();
        });

        it("#arguments !== #schemata", () => {
            const f = jest.fn();
            const f_val = validateParams(Joi.string().required().valid("a"), Joi.string().required().valid("b"))(f);
            // @ts-ignore: Expected 2 arguments, but got 1.
            expect(() => { f_val("a"); }).toThrow();
            // @ts-ignore: Expected 2 arguments, but got 1.
            expect(() => { f_val("b"); }).toThrow();
            expect(f).not.toHaveBeenCalled();
        });

        it("valid arguments", () => {
            const f = jest.fn();
            const f_val = validateParams(Joi.string().required().valid("a"), Joi.string().required().valid("b"))(f);
            expect(f_val("a","b")).toBeUndefined();
        });

        it("valid arguments optional", () => {
            const f = jest.fn();
            const f_val = validateParams(Joi.string().optional())(f);
            // @ts-ignore: Expected 1 arguments, but got 0.
            expect(f_val()).toBeUndefined();
            expect(f).toHaveBeenCalledWith(undefined);
        });

        it("invalid arguments", () => {
            const f = jest.fn();
            const f_val = validateParams(Joi.string().required().valid("a"), Joi.string().required().valid("b"))(f);
            expect(() => { f_val("b","c"); }).toThrow();
        });

        it("passthrough arguments", () => {
            const f = jest.fn();
            const f_val = validateParams(
                Joi.string().required().valid("a"), 
                Joi.string().required().valid("b")
            )(f);
            f_val("a", "b");
            expect(f).toHaveBeenCalledWith("a","b");
        });

        it("return function result", () => {
            const f = jest.fn(() => "result");
            const f_val = validateParams()(f);
            expect(f_val()).toBe("result");
            expect(f).toHaveBeenCalledWith();
        });
    });

    describe("validateResult", () => {
        it("valid funtion result", () => {
            const f = jest.fn(() => "result");
            const f_val = validateResult(Joi.string().valid("result"))(f);
            expect(f_val()).toBe("result");
            expect(f).toHaveBeenCalledWith();
        });
        
        it("invalid funtion result", () => {
            const f = jest.fn(() => "result");
            const f_val = validateResult(Joi.string().valid("wrong"))(f);
            expect(() => { f_val(); }).toThrow();
            expect(f).toHaveBeenCalledWith();
        });
        
        it("pass arguments", () => {
            const f = jest.fn(() => "result");
            const f_val = validateResult(Joi.string())(f);
            // @ts-ignore: Expected 0 arguments, but got 2.
            expect(f_val("a","b")).toBe("result");
            expect(f).toHaveBeenCalledWith("a","b");
        });

        it("promise result", async () => {
            const f = jest.fn(async () => "result");
            const f_val = validateResult(Joi.string())(f);
            expect(await f_val()).toBe("result");
        });
        
        it("promise rejection", async () => {
            const f = jest.fn(async () => "wrong");
            const f_val = validateResult(Joi.string().valid("result"))(f);
            expect(f_val()).rejects.toBeDefined();
        });

    });
});

