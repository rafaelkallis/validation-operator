/**
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import { UnaryOperator } from "./index";

declare type Schema = object | boolean;

/**
 * A higher order function that takes a function, called inner function, and returns a 
 * function which validates the parameters before the inner function is called.
 *
 * @param schemata {Schema[]}: A json schema for each argument.
 * @returns UnaryOperator<T>: The higher order function.
 */
export declare function validateParams<T extends Function>(...schemata: Schema[]): UnaryOperator<T>;

/**
 * A higher order function that takes a function, called inner function, and returns a 
 * function which validates the inner function's result after the inner function is called.
 *
 * @param schema {Schema}: A json schema for the result.
 * @returns UnaryOperator<T>: The higher order function.
 */
export declare function validateResult<T extends Function>(schema: Schema): UnaryOperator<T>;

export declare function setAjv(funcOrVal: object | Function): object;
