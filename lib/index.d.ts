/**
 * @file index.ts
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */
import * as Joi from "joi";
export declare type UnaryOperator = <F extends Function>(func: F) => F;
export declare const validateParams: (...schemata: Joi.Schema[]) => UnaryOperator;
export declare const validateResult: (schema: Joi.Schema) => UnaryOperator;
