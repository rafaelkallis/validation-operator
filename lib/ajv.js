/**
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

const invariant = require("invariant");
const Ajv = require("ajv");
const {
    parameterValidationFactory,
    resultValidationFactory,
    ValidationError,
} = require("./index");

let ajv = new Ajv();

function jsonAdapter(validate, arg){
    if(!validate(arg)){
        throw ValidationError(validate.errors[0].message);
    }
    return arg;
}

module.exports = {
    validateParams(...schemata){
        compiled = schemata.map(s => ajv.compile(s));
        return parameterValidationFactory(jsonAdapter)(...compiled);
    },
    validateResult(schema){
        compiled = ajv.compile(schema);
        return resultValidationFactory(jsonAdapter)(compiled);
    },
    setAjv(arg, opts){
        invariant(
            arg !== undefined && arg !== null,
            "ajv instance/enhancer cannot be null or undefined",
        );
        const newAjv = typeof arg === "function" ? arg(new Ajv(opts)) : arg;
        invariant(
            newAjv !== undefined && newAjv !== null,
            "resulting instance cannot be null or undefined",
        );
        ajv = newAjv;
    }
}

