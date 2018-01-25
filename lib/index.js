/**
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

const invariant = require("invariant");
const isPromise = require("is-promise");

const parameterValidationFactory = (validate) => (...schemata) => (func) => function(...args) {
    invariant(
        schemata.length >= args.length, 
        "number of arguments is greater than number of schemata."
    );
    const newArgs = [];
    for (let i = 0; i < schemata.length; i++) {
        newArgs[i] = validate(schemata[i], args[i]);
    }
    return func.apply(this, newArgs);
};

const resultValidationFactory = (validate) => (schema) => {
    invariant(schema !== undefined && schema !== null, "schema is null or undefined");
    return (func) => function(...args) {
        const result = func.apply(this, args);
        if (isPromise(result)) {
            return result.then(v => validate(schema, v));
        }
        return validate(schema, result);
    };
}

function joiAdapter(schema, arg) {
    const { value, error } = schema.validate(arg);
    if (error !== null) {
        throw error;
    }
    return value;

}

exports.validateParams = parameterValidationFactory(joiAdapter);

exports.validateResult = resultValidationFactory(joiAdapter);

