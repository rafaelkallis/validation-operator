/**
 * @file index.ts
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import * as Joi from "joi";
import * as invariant from "invariant";
import isPromise = require("is-promise");

type ValidationFunction<S> = <T>(schema: S, arg: T) => T;

export type UnaryOperator = <F extends Function>(func: F) => F;

const parameterValidationFactory = <S>(validate: ValidationFunction<S>) => 
    (...schemata: S[]): UnaryOperator => 
        (func: Function) => 
            function(...args: any[]): any {
                invariant(
                    schemata.length >= args.length, 
                    "number of arguments is greater than number of schemata."
                );
                const newArgs: any[] = [];
                for (let i = 0; i < schemata.length; i++) {
                    newArgs[i] = validate<any>(schemata[i], args[i]);
                }
                return func(...newArgs);
            } as any;

const resultValidationFactory = <S>(validate: ValidationFunction<S>) => 
    function(schema: S): UnaryOperator {
        invariant(schema !== undefined && schema !== null, "schema is null or undefined");
        return (func: Function) => 
            function(...args: any[]): any {
                const result: Promise<any> | any = func(...args);
                if (isPromise(result)) {
                    return result.then(v => validate(schema, v));
                }
                return validate(schema, result);
            } as any;
    }

const joiValidation: ValidationFunction<Joi.Schema> = 
    function<T>(schema: Joi.Schema, arg: T): T {
        const { value, error } = schema.validate<T>(arg);
        if (error !== null) {
            throw error;
        }
        return value;
    }

export const validateParams: (...schemata: Joi.Schema[]) => UnaryOperator = 
    parameterValidationFactory(joiValidation);

export const validateResult: (schema: Joi.Schema) => UnaryOperator = 
    resultValidationFactory(joiValidation);

