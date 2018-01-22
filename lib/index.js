/**
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

const invariant = require("invariant");

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
        return validate(schema, result);
    };
}

const ValidationError = (message) => ({ message, isValidationError: true });

module.exports = {
    parameterValidationFactory,
    resultValidationFactory,
    ValidationError,
};

