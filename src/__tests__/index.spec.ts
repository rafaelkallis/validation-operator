/**
 * @file index.spec.js
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

// tslint:disable: variable-name

import * as Joi from 'joi';
import {validateParams, validateResult} from '../index';

describe('joi schema', () => {
  describe('validateParams', () => {
    it('no arguments, no schemata', () => {
      const f = jest.fn();
      const f_val = validateParams()(f);
      expect(f_val()).toBeUndefined();
      expect(f).toHaveBeenCalledWith();
    });

    it('argument, no schemata', () => {
      const f = jest.fn();
      const f_val = validateParams()(f);
      // @ts-ignore: Expected 0 arguments, but got 1.
      expect(() => {
        f_val('a');
      }).toThrow();
      expect(f).not.toHaveBeenCalled();
    });

    it('arguments, no schemata', () => {
      const f = jest.fn();
      const f_val = validateParams()(f);
      // @ts-ignore: Expected 0 arguments, but got 3.
      expect(() => {
        f_val('a', 'b', 'c');
      }).toThrow();
      expect(f).not.toHaveBeenCalled();
    });

    it('no arguments, schema', () => {
      const f = jest.fn();
      const f_val = validateParams(
        Joi.string()
          .required()
          .valid('a'),
      )(f);
      // @ts-ignore: Expected 1 arguments, but got 0.
      expect(() => {
        f_val();
      }).toThrow();
      expect(f).not.toHaveBeenCalled();
    });

    it('no arguments, schemata', () => {
      const f = jest.fn();
      const f_val = validateParams(
        Joi.string()
          .required()
          .valid('a'),
        Joi.string()
          .required()
          .valid('b'),
      )(f);
      // @ts-ignore: Expected 2 arguments, but got 0.
      expect(() => {
        f_val();
      }).toThrow();
      expect(f).not.toHaveBeenCalled();
    });

    it('#arguments !== #schemata', () => {
      const f = jest.fn();
      const f_val = validateParams(
        Joi.string()
          .required()
          .valid('a'),
        Joi.string()
          .required()
          .valid('b'),
      )(f);
      // @ts-ignore: Expected 2 arguments, but got 1.
      expect(() => {
        f_val('a');
      }).toThrow();
      // @ts-ignore: Expected 2 arguments, but got 1.
      expect(() => {
        f_val('b');
      }).toThrow();
      expect(f).not.toHaveBeenCalled();
    });

    it('valid arguments', () => {
      const f = jest.fn();
      const f_val = validateParams(
        Joi.string()
          .required()
          .valid('a'),
        Joi.string()
          .required()
          .valid('b'),
      )(f);
      expect(f_val('a', 'b')).toBeUndefined();
    });

    it('valid arguments optional', () => {
      const f = jest.fn();
      const f_val = validateParams(Joi.string().optional())(f);
      // @ts-ignore: Expected 1 arguments, but got 0.
      expect(f_val()).toBeUndefined();
      expect(f).toHaveBeenCalledWith(undefined);
    });

    it('invalid arguments', () => {
      const f = jest.fn();
      const f_val = validateParams(
        Joi.string()
          .required()
          .valid('a'),
        Joi.string()
          .required()
          .valid('b'),
      )(f);
      expect(() => {
        f_val('b', 'c');
      }).toThrow();
    });

    it('passthrough arguments', () => {
      const f = jest.fn();
      const f_val = validateParams(
        Joi.string()
          .required()
          .valid('a'),
        Joi.string()
          .required()
          .valid('b'),
      )(f);
      f_val('a', 'b');
      expect(f).toHaveBeenCalledWith('a', 'b');
    });

    it('return function result', () => {
      const f = jest.fn(() => 'result');
      const f_val = validateParams()(f);
      expect(f_val()).toBe('result');
      expect(f).toHaveBeenCalledWith();
    });

    it('should bind context', () => {
      let y;
      const x = {
        f: validateParams(
          Joi.string()
            .required()
            .valid('a'),
        )(
          jest.fn(function(this: any) {
            y = this;
          }),
        ),
      };
      expect(x.f('a')).toBeUndefined();
      expect(x).toEqual(y);
    });
  });

  describe('validateResult', () => {
    it('valid funtion result', () => {
      const f = jest.fn(() => 'result');
      const f_val = validateResult(Joi.string().valid('result'))(f);
      expect(f_val()).toBe('result');
      expect(f).toHaveBeenCalledWith();
    });

    it('invalid funtion result', () => {
      const f = jest.fn(() => 'result');
      const f_val = validateResult(Joi.string().valid('wrong'))(f);
      expect(() => {
        f_val();
      }).toThrow();
      expect(f).toHaveBeenCalledWith();
    });

    it('pass arguments', () => {
      const f = jest.fn(() => 'result');
      const f_val = validateResult(Joi.string())(f);
      // @ts-ignore: Expected 0 arguments, but got 2.
      expect(f_val('a', 'b')).toBe('result');
      expect(f).toHaveBeenCalledWith('a', 'b');
    });

    it('promise result', async () => {
      const f = jest.fn(async () => 'result');
      const f_val = validateResult(Joi.string())(f);
      expect(await f_val()).toBe('result');
    });

    it('promise rejection', async () => {
      const f = jest.fn(async () => 'wrong');
      const f_val = validateResult(Joi.string().valid('result'))(f);
      expect(f_val()).rejects.toBeDefined();
    });

    it('should bind context', () => {
      let y;
      const x = {
        f: validateResult(
          Joi.string()
            .required()
            .valid('result'),
        )(
          jest.fn(function(this: any) {
            y = this;
            return 'result';
          }),
        ),
      };
      expect(x.f()).toBe('result');
      expect(x).toEqual(y);
    });
  });
});
