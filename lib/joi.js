/**
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

const { 
    parameterValidationFactory, 
    resultValidationFactory,
    ValidationError,
} = require("./index");

function joiAdapter(schema, arg) {
    const { value, error } = schema.validate(arg);
    if (error !== null) {
        throw ValidationError(error.toString());
    }
    return value;

}

module.exports = {
    validateParams: parameterValidationFactory(joiAdapter),
    validateResult: resultValidationFactory(joiAdapter),
};

