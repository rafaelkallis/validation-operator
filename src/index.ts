/**
 * @file index.ts
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import invariant from 'invariant';
import isPromise from 'is-promise';
import Joi from 'joi';
import isFunction from 'lodash.isfunction';

type ValidationFunction<S> = <T>(schema: S, arg: T) => T;

export type Function0<R> = () => R;
export type Function1<T1, R> = (arg1: T1) => R;
export type Function2<T1, T2, R> = (arg1: T1, arg2: T2) => R;
export type Function3<T1, T2, T3, R> = (arg1: T1, arg2: T2, arg3: T3) => R;
export type Function4<T1, T2, T3, T4, R> = (
  arg1: T1,
  arg2: T2,
  arg3: T3,
  arg4: T4,
) => R;
export type Function5<T1, T2, T3, T4, T5, R> = (
  arg1: T1,
  arg2: T2,
  arg3: T3,
  arg4: T4,
  arg5: T5,
) => R;
export type Function6<T1, T2, T3, T4, T5, T6, R> = (
  arg1: T1,
  arg2: T2,
  arg3: T3,
  arg4: T4,
  arg5: T5,
  arg6: T6,
) => R;

export type UnaryOp<T> = (t: T) => T;

/**
 * Create a parameter validation function.
 * @param validate - The function which validates a value given a schema.
 */
function parameterValidationFactory<S>(validate: ValidationFunction<S>) {
  return function(...schemata: S[]) {
    return function<A, R>(f: (...args: A[]) => R) {
      invariant(isFunction(f), 'argument f is not a function');
      return function(...args: A[]): PromiseLike<R> | R {
        invariant(
          schemata.length >= args.length,
          'number of arguments is greater than number of schemata.',
        );
        const newArgs = [];
        for (let i = 0; i < schemata.length; i++) {
          newArgs[i] = validate(schemata[i], args[i]);
        }
        return f(...newArgs);
      };
    };
  };
}

/**
 * Create a result validation function.
 * @param validate - The function which validates a value given a schema.
 */
function resultValidationFactory<S>(validate: ValidationFunction<S>) {
  return function(s: S) {
    invariant(s, 'argument s is not a schema');
    return function<A, R>(f: (...args: A[]) => PromiseLike<R> | R) {
      invariant(isFunction(f), 'argument f is not a function');
      return function(...args: A[]): PromiseLike<R> | R {
        const result: PromiseLike<R> | R = f(...args);
        if (isPromise(result)) {
          return result.then(v => validate(s, v));
        }
        return validate(s, result);
      };
    };
  };
}

/**
 * Joi schema validator.
 * @param schema - Joi schema.
 * @param arg - Argument to validate.
 * @return The validated argument.
 */
function joiValidation<T>(schema: Joi.Schema, arg: T): T {
  const {value, error} = schema.validate<T>(arg);
  // tslint:disable-next-line: strict-type-predicates
  if (error !== null) {
    throw error;
  }

  return value;
}

// Parameter Validation

const joiParameterValidation = parameterValidationFactory<Joi.Schema>(
  joiValidation,
);

/**
 * Returns parameter validating higher order function.
 * @returns Parameter validating higher order function.
 */
export function validateParams<R>(): UnaryOp<Function0<R>>;

/**
 * Returns parameter validating higher order function.
 * @param s1 - Joi schema for 1st parameter.
 * @returns Parameter validating higher order function.
 */
export function validateParams<A1, R>(
  s1: Joi.Schema,
): UnaryOp<Function1<A1, R>>;

/**
 * Returns parameter validating higher order function.
 * @param s1 - Joi schema for 1st parameter.
 * @param s2 - Joi schema for 2nd parameter.
 * @returns Parameter validating higher order function.
 */
export function validateParams<A1, A2, R>(
  s1: Joi.Schema,
  s2: Joi.Schema,
): UnaryOp<Function2<A1, A2, R>>;

/**
 * Returns parameter validating higher order function.
 * @param s1 - Joi schema for 1st parameter.
 * @param s2 - Joi schema for 2nd parameter.
 * @param s3 - Joi schema for 3rd parameter.
 * @returns Parameter validating higher order function.
 */
export function validateParams<A1, A2, A3, R>(
  s1: Joi.Schema,
  s2: Joi.Schema,
  s3: Joi.Schema,
): UnaryOp<Function3<A1, A2, A3, R>>;

/**
 * Returns parameter validating higher order function.
 * @param s1 - Joi schema for 1st parameter.
 * @param s2 - Joi schema for 2nd parameter.
 * @param s3 - Joi schema for 3rd parameter.
 * @param s4 - Joi schema for 4th parameter.
 * @returns Parameter validating higher order function.
 */
export function validateParams<A1, A2, A3, A4, R>(
  s1: Joi.Schema,
  s2: Joi.Schema,
  s3: Joi.Schema,
  s4: Joi.Schema,
): UnaryOp<Function4<A1, A2, A3, A4, R>>;

/**
 * Returns parameter validating higher order function.
 * @param s1 - Joi schema for 1st parameter.
 * @param s2 - Joi schema for 2nd parameter.
 * @param s3 - Joi schema for 3rd parameter.
 * @param s4 - Joi schema for 4th parameter.
 * @param s5 - Joi schema for 5th parameter.
 * @returns Parameter validating higher order function.
 */
export function validateParams<A1, A2, A3, A4, A5, R>(
  s1: Joi.Schema,
  s2: Joi.Schema,
  s3: Joi.Schema,
  s4: Joi.Schema,
  s5: Joi.Schema,
): UnaryOp<Function5<A1, A2, A3, A4, A5, R>>;

/**
 * Returns parameter validating higher order function.
 * @param s1 - Joi schema for 1st parameter.
 * @param s2 - Joi schema for 2nd parameter.
 * @param s3 - Joi schema for 3rd parameter.
 * @param s4 - Joi schema for 4th parameter.
 * @param s5 - Joi schema for 5th parameter.
 * @param s6 - Joi schema for 6th parameter.
 * @returns Parameter validating higher order function.
 */
export function validateParams<A1, A2, A3, A4, A5, A6, R>(
  s1: Joi.Schema,
  s2: Joi.Schema,
  s3: Joi.Schema,
  s4: Joi.Schema,
  s5: Joi.Schema,
  s6: Joi.Schema,
): UnaryOp<Function6<A1, A2, A3, A4, A5, A6, R>>;

/**
 * Returns parameter validating higher order function.
 * @param schemata - Joi schemata for parameters.
 * @returns Parameter validating higher order function.
 */
export function validateParams(...schemata: Joi.Schema[]) {
  for (const schema of schemata) {
    invariant(schema.isJoi, 'provided schema is not a Joi schema');
  }
  return joiParameterValidation(...schemata);
}

// Result Validation

const joiResultValidation = resultValidationFactory<Joi.Schema>(joiValidation);

/**
 * Returns result validating higher order function.
 * @param schema - Joi schema for result.
 * @returns Result validating higher order function.
 */
export function validateResult<R>(schema: Joi.Schema): UnaryOp<Function0<R>>;

/**
 * Returns result validating higher order function.
 * @param schema - Joi schema for result.
 * @returns Result validating higher order function.
 */
export function validateResult<A1, R>(
  schema: Joi.Schema,
): UnaryOp<Function1<A1, R>>;

/**
 * Returns result validating higher order function.
 * @param schema - Joi schema for result.
 * @returns Result validating higher order function.
 */
export function validateResult<A1, A2, R>(
  schema: Joi.Schema,
): UnaryOp<Function2<A1, A2, R>>;

/**
 * Returns result validating higher order function.
 * @param schema - Joi schema for result.
 * @returns Result validating higher order function.
 */
export function validateResult<A1, A2, A3, R>(
  schema: Joi.Schema,
): UnaryOp<Function3<A1, A2, A3, R>>;

/**
 * Returns result validating higher order function.
 * @param schema - Joi schema for result.
 * @returns Result validating higher order function.
 */
export function validateResult<A1, A2, A3, A4, R>(
  schema: Joi.Schema,
): UnaryOp<Function4<A1, A2, A3, A4, R>>;

/**
 * Returns result validating higher order function.
 * @param schema - Joi schema for result.
 * @returns Result validating higher order function.
 */
export function validateResult<A1, A2, A3, A4, A5, R>(
  schema: Joi.Schema,
): UnaryOp<Function5<A1, A2, A3, A4, A5, R>>;

/**
 * Returns result validating higher order function.
 * @param schema - Joi schema for result.
 * @returns Result validating higher order function.
 */
export function validateResult<A1, A2, A3, A4, A5, A6, R>(
  schema: Joi.Schema,
): UnaryOp<Function6<A1, A2, A3, A4, A5, A6, R>>;

/**
 * Returns result validating higher order function.
 * @param schema - Joi schema for result.
 * @returns Result validating higher order function.
 */
export function validateResult(schema: Joi.Schema) {
  invariant(schema.isJoi, 'provided schema is not a Joi schema');
  return joiResultValidation(schema);
}
