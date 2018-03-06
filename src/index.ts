/**
 * @file index.ts
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import * as Joi from 'joi';
import * as invariant from 'invariant';
import isPromise = require('is-promise');

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

export type Fn = (...args: any[]) => any;
export type HigherOrderFunction<F extends Fn> = (f: F) => F;
export type HOF<F extends Fn> = HigherOrderFunction<F>;

function parameterValidationFactory<S, F extends Fn>(
  validate: ValidationFunction<S>,
) {
  return function(...schemata: S[]): HOF<F> {
    return function(f: F) {
      return function(...args: any[]): any {
        invariant(
          schemata.length >= args.length,
          'number of arguments is greater than number of schemata.',
        );
        const newArgs: any[] = [];
        for (let i = 0; i < schemata.length; i++) {
          newArgs[i] = validate<any>(schemata[i], args[i]);
        }
        return f(...newArgs);
      } as any;
    };
  };
}

const resultValidationFactory = <S, F extends Fn>(
  validate: ValidationFunction<S>,
) =>
  function(schema: S): HOF<F> {
    invariant(
      schema !== undefined && schema !== null,
      'schema is null or undefined',
    );
    return (func: Fn) =>
      function(...args: any[]): any {
        const result: Promise<any> | any = func(...args);
        if (isPromise(result)) {
          return result.then(v => validate(schema, v));
        }
        return validate(schema, result);
      } as any;
  };

const joiValidation: ValidationFunction<Joi.Schema> = function<T>(
  schema: Joi.Schema,
  arg: T,
): T {
  const {value, error} = schema.validate<T>(arg);
  if (error !== null) {
    throw error;
  }
  return value;
};

const joiParameterValidation: (
  ...schemata: Joi.Schema[]
) => HOF<Fn> = parameterValidationFactory<Joi.Schema, Fn>(joiValidation);

export function validateParams<R>(): HOF<Function0<R>>;
export function validateParams<A1, R>(s1: Joi.Schema): HOF<Function1<A1, R>>;
export function validateParams<A1, A2, R>(
  s1: Joi.Schema,
  s2: Joi.Schema,
): HOF<Function2<A1, A2, R>>;
export function validateParams<A1, A2, A3, R>(
  s1: Joi.Schema,
  s2: Joi.Schema,
  s3: Joi.Schema,
): HOF<Function3<A1, A2, A3, R>>;
export function validateParams<A1, A2, A3, A4, R>(
  s1: Joi.Schema,
  s2: Joi.Schema,
  s3: Joi.Schema,
  s4: Joi.Schema,
): HOF<Function4<A1, A2, A3, A4, R>>;
export function validateParams<A1, A2, A3, A4, A5, R>(
  s1: Joi.Schema,
  s2: Joi.Schema,
  s3: Joi.Schema,
  s4: Joi.Schema,
  s5: Joi.Schema,
): HOF<Function5<A1, A2, A3, A4, A5, R>>;
export function validateParams<A1, A2, A3, A4, A5, A6, R>(
  s1: Joi.Schema,
  s2: Joi.Schema,
  s3: Joi.Schema,
  s4: Joi.Schema,
  s5: Joi.Schema,
  s6: Joi.Schema,
): HOF<Function6<A1, A2, A3, A4, A5, A6, R>>;
export function validateParams(...schemata: Joi.Schema[]): HOF<Fn> {
  return joiParameterValidation(...schemata);
}

const joiResultValidation: Function1<
  Joi.Schema,
  HOF<Fn>
> = resultValidationFactory<Joi.Schema, Fn>(joiValidation);

export function validateResult<R>(schema: Joi.Schema): HOF<Function0<R>>;
export function validateResult<A1, R>(
  schema: Joi.Schema,
): HOF<Function1<A1, R>>;
export function validateResult<A1, A2, R>(
  schema: Joi.Schema,
): HOF<Function2<A1, A2, R>>;
export function validateResult<A1, A2, A3, R>(
  schema: Joi.Schema,
): HOF<Function3<A1, A2, A3, R>>;
export function validateResult<A1, A2, A3, A4, R>(
  schema: Joi.Schema,
): HOF<Function4<A1, A2, A3, A4, R>>;
export function validateResult<A1, A2, A3, A4, A5, R>(
  schema: Joi.Schema,
): HOF<Function5<A1, A2, A3, A4, A5, R>>;
export function validateResult<A1, A2, A3, A4, A5, A6, R>(
  schema: Joi.Schema,
): HOF<Function6<A1, A2, A3, A4, A5, A6, R>>;
export function validateResult(schema: Joi.Schema): HOF<Fn> {
  return joiResultValidation(schema);
}
