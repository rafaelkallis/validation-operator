/**
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

export declare type UnaryOperator<T> = (arg: T) => T;

export declare function parameterValidationFactory<T extends Function, S>(
    adapter: Function,
): (...schemata: S[]) => UnaryOperator<T>;

export declare function resultValidationFactory<T extends Function, S>(
    adapter: Function,
): (schema: S) => UnaryOperator<T>;
