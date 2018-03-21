## validation-operator
[![Build Status](https://travis-ci.org/rafaelkallis/validation-operator.svg?branch=master)](https://travis-ci.org/rafaelkallis/validation-operator)
[![npm version](https://badge.fury.io/js/validation-operator.svg)](https://badge.fury.io/js/validation-operator)
[![GitHub version](https://badge.fury.io/gh/rafaelkallis%2Fvalidation-operator.svg)](https://badge.fury.io/gh/rafaelkallis%2Fvalidation-operator)

Higher-Order runtime validation for parameter and return values.

- Parameter validation enhancer
- Result validation enhancer
- Joi schema supported
- Use with `lodash.flow` for better readability
- Typescript definitions included

### Usage

#### Installation

```bash
npm install --save validation-operator
# or
yarn add validation-operator
```

#### Example 1 (parameter validation)

```js
const { validateParams } = require("validation-operator");
const Joi = require("joi");
const db = require("./db");

const userRepository = {
    create: validateParams(Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required(),
        }))(({ username, password }) => {
                /* username and password validated */
                return db.create({ username, password });
            }),
};

const user = userRepository.create({ username: "foo", password: "bar" });
```

#### Example 2 (multiple parameter validation)

```js
const { validateParams } = require("validation-operator/joi");
const Joi = require("joi");
const db = require("./db");

const userRepository = {
    create: validateParams(
            Joi.string().required(),
            Joi.string().required(),
        )((username, password) => {
            /* username and password validated */
            return db.create({ username, password });
        }),
};

const user = userRepository.create("foo", "bar");
```

#### Example 3 (result validation)

```js
const { validateResult } = require("validation-operator");
const Joi = require("joi");
const db = require("./db");

const userRepository = {
    findById: validateResult(Joi.object({
            id: Joi.string().uuid().required(),
            username: Joi.string().required(),
            password: Joi.string().required(),
        })(function (_id) {
            return db.find({ _id });
        }),
};

const user = userRepository.findById("xxxxxx");
/* user validated */
```

#### Example 5 (Typescript)

```ts
import { validateResult } from "validation-operator";
import * as Joi from "joi";
import db from "./db";

interface User {
    username: string,
    password: string,
}

interface UserRepository {
    findById(_id: string): User
}


class UserRepositoryImpl implements UserRepository {
    findById = validateResult(Joi.object({
            id: Joi.string().uuid().required(),
            username: Joi.string().required(),
            password: Joi.string().required(),
        })(function (this: UserRepositoryImpl, _id: string): User {
            return db.find({ _id });
        })
}

const userRepository = new UserRepositoryImpl();

const user: User = userRepository.findById("xxxxxx");
/* user validated */
```

#### Example 6 (usage with [lodash.flow](https://lodash.com/docs#flow))

```js
const { validateParams, ValidateResult } = require("validation-operator");
const Joi = require("joi");
const flow = require("lodash.flow");
const db = require("./db");

const userRepository = {
    create: flow([
                validateParams(
                    Joi.string().required(),
                    Joi.string().required(),
                ),
                validateResult(
                    Joi.object({
                        id: Joi.string().required(),
                        username: Joi.string().required(),
                        password: Joi.string().required(),
                    })
                ),
        ])(function(username, password) {
            /* username and password validated */
            return db.create({ username, password });
        }),
};

const user = userRepository.create("foo", "bar");
/* user validated */
```

