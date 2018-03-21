/**
 * @file index.ts
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import invariant from 'invariant';
import isPromise from 'is-promise';
import Joi from 'joi';
import isFunction from 'lodash.isfunction';

type ValidationFunction<S> = <T>(schema: S, arg: T) => T;

export type UnaryOp = <F extends Function>(t: F) => F;

/**
 * Create a parameter validation function.
 * @param validate - The function which validates a value given a schema.
 */
function parameterValidationFactory<S>(validate: ValidationFunction<S>) {
  return function(...schemata: S[]): UnaryOp {
    return function(f) {
      invariant(isFunction(f), 'argument f is not a function');
      return function<T>(this: T) {
        invariant(
          schemata.length >= arguments.length,
          'number of arguments is greater than number of schemata.',
        );
        const newArgs = [];
        for (let i = 0; i < schemata.length; i++) {
          newArgs[i] = validate(schemata[i], arguments[i]);
        }
        return f.apply(this, newArgs);
      } as any;
    };
  };
}

/**
 * Create a result validation function.
 * @param validate - The function which validates a value given a schema.
 */
function resultValidationFactory<S>(validate: ValidationFunction<S>) {
  return function(s: S): UnaryOp {
    invariant(s, 'argument s is not a schema');
    return function(f) {
      invariant(isFunction(f), 'argument f is not a function');
      return function<O>(this: O) {
        const result = f.apply(this, arguments);
        if (isPromise(result)) {
          return result.then(v => validate(s, v));
        }
        return validate(s, result);
      } as any;
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
 * @param schemata - Joi schemata for parameters.
 * @returns Parameter validating higher order function.
 */
export function validateParams(...schemata: Joi.Schema[]): UnaryOp {
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
export function validateResult(schema: Joi.Schema): UnaryOp {
  invariant(schema.isJoi, 'provided schema is not a Joi schema');
  return joiResultValidation(schema);
}
